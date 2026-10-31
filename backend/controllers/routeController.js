import { z } from 'zod';
import { withTransaction } from '../config/db.js';
import { createRouteAssignment, findRouteAssignment, findVehicleByPublicId, listReports, listRouteAssignments, updateReport } from '../models/repositories.js';
import { ApiError } from '../utils/ApiError.js';
import { id, publicId } from '../utils/ids.js';
import { MUNICIPAL_DEPOT, PROCESSING_FACILITY, optimizeWithOrtools, osrmRoute, osrmTable } from '../services/routingService.js';
import { notify } from '../services/notificationService.js';
import { emitReportChanged } from '../services/socketService.js';

const optimizationSchema = z.object({
  vehicleIds: z.array(z.string().trim().min(3).max(32)).min(1).max(20),
  reportIds: z.array(z.string().trim().min(3).max(32)).min(1).max(100)
});

function point(location) {
  return { latitude: location.lat, longitude: location.lng };
}

export async function optimize(request, response) {
  const body = optimizationSchema.parse(request.body);
  const vehicles = await Promise.all(body.vehicleIds.map((vehicleId) => findVehicleByPublicId(vehicleId)));
  if (vehicles.some((vehicle) => !vehicle)) throw new ApiError(404, 'One or more selected vehicles do not exist.', 'VEHICLE_NOT_FOUND');
  const unavailable = vehicles.filter((vehicle) => !['available', 'assigned', 'on_route'].includes(vehicle.status));
  if (unavailable.length) throw new ApiError(422, 'Selected vehicles must be available, assigned, or on route.', 'VEHICLE_UNAVAILABLE');

  const allReports = await listReports({ limit: 200 });
  const selected = body.reportIds.map((reportId) => allReports.find((report) => report.id === reportId));
  if (selected.some((report) => !report)) throw new ApiError(404, 'One or more selected reports do not exist.', 'REPORT_NOT_FOUND');
  const ineligible = selected.filter((report) => !['verified', 'assigned'].includes(report.workflowStatus) || report.location.lat === null || report.location.lng === null || report.planningWeightKg === null);
  if (ineligible.length) {
    throw new ApiError(422, 'Every route stop must be verified and have coordinates plus an administrator-supplied planning weight.', 'REPORT_NOT_ROUTE_READY', {
      reportIds: ineligible.map((report) => report.id)
    });
  }

  const points = [
    { latitude: MUNICIPAL_DEPOT.latitude, longitude: MUNICIPAL_DEPOT.longitude },
    ...selected.map((report) => point(report.location)),
    { latitude: PROCESSING_FACILITY.latitude, longitude: PROCESSING_FACILITY.longitude }
  ];
  const matrix = await osrmTable(points);
  const optimization = await optimizeWithOrtools({
    distances: matrix.distances,
    durations: matrix.durations,
    demands: [0, ...selected.map((report) => Math.ceil(report.planningWeightKg)), 0],
    capacities: vehicles.map((vehicle) => Math.floor(vehicle.capacityKg - vehicle.currentLoadKg)),
    priorities: ['low', ...selected.map((report) => report.priority), 'low'],
    vehicleIds: vehicles.map((vehicle) => vehicle.id)
  });

  const createdRoutes = [];
  await withTransaction(async (connection) => {
    for (const solved of optimization.routes) {
      if (!solved.stopNodes.length) continue;
      const vehicle = vehicles.find((item) => item.id === solved.vehicleId);
      const routeStops = solved.stopNodes.map((node) => selected[node - 1]).filter(Boolean);
      const geometryPoints = [
        { latitude: MUNICIPAL_DEPOT.latitude, longitude: MUNICIPAL_DEPOT.longitude },
        ...routeStops.map((report) => point(report.location)),
        { latitude: PROCESSING_FACILITY.latitude, longitude: PROCESSING_FACILITY.longitude }
      ];
      const roadRoute = await osrmRoute(geometryPoints);
      const assignmentId = id();
      const capacityUsed = routeStops.reduce((sum, report) => sum + report.planningWeightKg, 0);
      const stops = [];
      let previousNode = 0;
      for (let index = 0; index < solved.stopNodes.length; index += 1) {
        const node = solved.stopNodes[index];
        const report = selected[node - 1];
        stops.push({
          id: id(), reportId: report.databaseId, sequence: index + 1, plannedWeightKg: report.planningWeightKg,
          legDistanceMeters: matrix.distances[previousNode][node], legDurationSeconds: matrix.durations[previousNode][node]
        });
        previousNode = node;
        const rawReport = await import('../models/repositories.js').then((module) => module.findReportRowByPublicId(report.id, connection));
        const updated = await updateReport({
          id: rawReport.id, publicId: rawReport.public_id, changes: { assigned_vehicle_id: vehicle.databaseId, status: 'assigned' },
          history: { id: id(), previousStatus: rawReport.status, newStatus: 'assigned', note: 'Added to optimized road-network route for ' + vehicle.name + '.', userId: request.user.id }
        }, connection);
        if (vehicle.driverUserId) await notify({ userId: vehicle.driverUserId, type: 'route_optimized', title: 'Optimized route assigned', message: updated.id + ' was added to your optimized route.', entityType: 'report', entityId: updated.databaseId }, connection);
        createdRoutes.push({ report: updated });
      }
      await createRouteAssignment({
        id: assignmentId, publicId: publicId('ROUTE'), vehicleId: vehicle.databaseId, provider: 'google-ortools+osrm',
        distanceMeters: roadRoute.distanceMeters, durationSeconds: roadRoute.durationSeconds,
        capacityUsedKg: capacityUsed, capacityAvailableKg: vehicle.capacityKg - vehicle.currentLoadKg,
        geometry: roadRoute.geometry,
        summary: { optimisationObjective: 'minimize road-network travel cost with capacity constraints and priority-weighted unassigned penalties', ortoolsObjective: optimization.objective, unassignedReportIds: optimization.unassignedNodes.map((node) => selected[node - 1]?.id).filter(Boolean) },
        createdByUserId: request.user.id, stops
      }, connection);
    }
  });
  for (const item of createdRoutes) emitReportChanged(item.report);
  const routes = await listRouteAssignments();
  response.status(201).json({
    success: true, routes: routes.slice(0, createdRoutes.length), unassignedReportIds: optimization.unassignedNodes.map((node) => selected[node - 1]?.id).filter(Boolean),
    provider: 'Google OR-Tools with OSRM road-network costs'
  });
}

export async function list(request, response) {
  response.json({ success: true, routes: await listRouteAssignments() });
}

export async function getOne(request, response) {
  const route = await findRouteAssignment(request.params.id);
  if (!route) throw new ApiError(404, 'Route assignment not found.', 'ROUTE_NOT_FOUND');
  response.json({ success: true, route });
}
