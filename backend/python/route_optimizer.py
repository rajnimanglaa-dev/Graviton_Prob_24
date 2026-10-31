import json
import sys

try:
    from ortools.constraint_solver import pywrapcp, routing_enums_pb2
except ImportError:
    sys.stderr.write('Python package ortools is not installed. Run: pip install -r backend/requirements.txt')
    sys.exit(2)

def priority_penalty(priority):
    return {
        'critical': 100000000,
        'high': 30000000,
        'medium': 8000000,
        'low': 1000000
    }.get(priority, 1000000)

def main():
    payload = json.load(sys.stdin)
    distances = payload['distances']
    durations = payload['durations']
    demands = payload['demands']
    capacities = payload['capacities']
    priorities = payload['priorities']
    vehicle_ids = payload['vehicleIds']
    depot = 0
    landfill = len(distances) - 1
    manager = pywrapcp.RoutingIndexManager(len(distances), len(vehicle_ids), [depot] * len(vehicle_ids), [landfill] * len(vehicle_ids))
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        value = distances[from_node][to_node]
        return int(value if value is not None else 100000000)

    distance_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(distance_index)

    def demand_callback(index):
        node = manager.IndexToNode(index)
        return int(demands[node])

    demand_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(demand_index, 0, [int(value) for value in capacities], True, 'Capacity')

    for node in range(1, landfill):
        routing.AddDisjunction([manager.NodeToIndex(node)], priority_penalty(priorities[node]))

    parameters = pywrapcp.DefaultRoutingSearchParameters()
    parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    parameters.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    parameters.time_limit.FromSeconds(15)

    solution = routing.SolveWithParameters(parameters)
    if not solution:
        sys.stderr.write('No feasible solution found')
        sys.exit(3)

    routes = []
    assigned = set()
    for vehicle_index, vehicle_id in enumerate(vehicle_ids):
        index = routing.Start(vehicle_index)
        nodes = []
        route_distance = 0
        route_duration = 0
        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            nodes.append(node)
            next_index = solution.Value(routing.NextVar(index))
            next_node = manager.IndexToNode(next_index)
            route_distance += int(distances[node][next_node] or 0)
            route_duration += int(durations[node][next_node] or 0)
            index = next_index
        nodes.append(manager.IndexToNode(index))
        stops = [node for node in nodes if node not in (depot, landfill)]
        assigned.update(stops)
        routes.append({
            'vehicleId': vehicle_id,
            'nodes': nodes,
            'stopNodes': stops,
            'distanceMeters': route_distance,
            'durationSeconds': route_duration
        })

    unassigned = [node for node in range(1, landfill) if node not in assigned]
    print(json.dumps({ 'routes': routes, 'unassignedNodes': unassigned, 'objective': solution.ObjectiveValue() }))

if __name__ == '__main__':
    main()
