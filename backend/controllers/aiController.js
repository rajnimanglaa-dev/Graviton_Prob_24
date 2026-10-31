import { findReportRowByPublicId, findReportByPublicId } from '../models/repositories.js';
import { ApiError } from '../utils/ApiError.js';
import { analyzeReport } from '../services/grokService.js';
import { emitReportChanged } from '../services/socketService.js';

export async function analyze(request, response) {
  const row = await findReportRowByPublicId(request.params.reportId);
  if (!row) throw new ApiError(404, 'Report not found.', 'REPORT_NOT_FOUND');
  if (request.user.role === 'citizen' && row.reporter_user_id !== request.user.id) throw new ApiError(403, 'You cannot analyze another citizen’s report.', 'FORBIDDEN');
  const analysis = await analyzeReport(request.params.reportId);
  const report = await findReportByPublicId(request.params.reportId);
  emitReportChanged(report);
  response.json({ success: true, analysis, report });
}

export async function getAnalysis(request, response) {
  const row = await findReportRowByPublicId(request.params.reportId);
  if (!row) throw new ApiError(404, 'Report not found.', 'REPORT_NOT_FOUND');
  if (request.user.role === 'citizen' && row.reporter_user_id !== request.user.id) throw new ApiError(403, 'You cannot view this assessment.', 'FORBIDDEN');
  const report = await findReportByPublicId(request.params.reportId);
  response.json({ success: true, analysis: report.aiAnalysis });
}
