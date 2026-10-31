import { z } from 'zod';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { createAnalysis, findReportByPublicId, saveAnalysisResult, updateReport } from '../models/repositories.js';
import { id } from '../utils/ids.js';
import { imageAsDataUrl } from './storageService.js';
import { notify } from './notificationService.js';

const analysisSchema = z.object({
  wasteCategory: z.string().min(1).max(80),
  severity: z.enum(['Small', 'Medium', 'Large']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  visibleMaterials: z.array(z.string().max(120)).max(12),
  visibleQuantityIndicators: z.array(z.string().max(180)).max(8),
  environmentalConcerns: z.array(z.string().max(220)).max(8),
  explanation: z.string().min(1).max(1000),
  recommendedAction: z.string().min(1).max(500),
  confidence: z.number().min(0).max(1).nullable()
});

const responseSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'waste_photo_assessment',
    strict: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['wasteCategory', 'severity', 'priority', 'visibleMaterials', 'visibleQuantityIndicators', 'environmentalConcerns', 'explanation', 'recommendedAction', 'confidence'],
      properties: {
        wasteCategory: { type: 'string' },
        severity: { type: 'string', enum: ['Small', 'Medium', 'Large'] },
        priority: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] },
        visibleMaterials: { type: 'array', items: { type: 'string' } },
        visibleQuantityIndicators: { type: 'array', items: { type: 'string' } },
        environmentalConcerns: { type: 'array', items: { type: 'string' } },
        explanation: { type: 'string' },
        recommendedAction: { type: 'string' },
        confidence: { anyOf: [{ type: 'number' }, { type: 'null' }] }
      }
    }
  }
};

function responseText(payload) {
  if (payload.output_text) return payload.output_text;
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) return content.text;
      if (content.text) return content.text;
    }
  }
  return null;
}

export async function analyzeReport(reportId, connection) {
  const report = await findReportByPublicId(reportId, connection);
  if (!report) throw new ApiError(404, 'Report not found.', 'REPORT_NOT_FOUND');
  if (!report.imageUrl) throw new ApiError(422, 'SMS reports without a photograph cannot undergo photo analysis.', 'IMAGE_REQUIRED');
  if (!env.xaiApiKey) {
    await createAnalysis({ id: id(), reportId: report.databaseId, model: env.grokModel, status: 'not_available' }, connection);
    throw new ApiError(503, 'Grok analysis is unavailable until XAI_API_KEY is configured.', 'GROK_NOT_CONFIGURED');
  }

  await createAnalysis({ id: id(), reportId: report.databaseId, model: env.grokModel, status: 'pending' }, connection);
  const imageUrl = await imageAsDataUrl(report);
  const requestBody = {
    model: env.grokModel,
    store: false,
    response_format: responseSchema,
    input: [{
      role: 'user',
      content: [
        { type: 'input_image', image_url: imageUrl, detail: 'high' },
        { type: 'input_text', text: 'Assess this waste-dumping photograph using only visually supported evidence. Do not estimate exact physical volume, identify a geographic location, infer invisible contamination, or claim hazards not visible. Severity means visible scale only: Small, Medium, or Large. Environmental concerns must be limited to visible evidence. Return only the requested JSON assessment.' }
      ]
    }]
  };

  let payload;
  try {
    const response = await fetch('https://api.x.ai/v1/responses', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + env.xaiApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(120000)
    });
    payload = await response.json();
    if (!response.ok || payload.error) throw new Error(payload.error?.message || 'Grok request failed with HTTP ' + response.status);
    const text = responseText(payload);
    if (!text) throw new Error('Grok did not return structured assessment text.');
    const assessment = analysisSchema.parse(JSON.parse(text));
    const normalized = {
      wasteCategory: assessment.wasteCategory,
      severity: assessment.severity.toLowerCase(),
      priority: assessment.priority.toLowerCase(),
      visibleMaterials: assessment.visibleMaterials,
      visibleQuantityIndicators: assessment.visibleQuantityIndicators,
      environmentalConcerns: assessment.environmentalConcerns,
      explanation: assessment.explanation,
      recommendedAction: assessment.recommendedAction,
      confidence: assessment.confidence,
      rawResponse: payload,
      status: 'completed'
    };
    await saveAnalysisResult({ reportId: report.databaseId, ...normalized }, connection);
    const updated = await updateReport({
      id: report.databaseId, publicId: report.id,
      changes: { category: normalized.wasteCategory, severity: normalized.severity, priority: normalized.priority, confidence: normalized.confidence },
      history: { id: id(), previousStatus: report.workflowStatus, newStatus: report.workflowStatus, note: 'AI image assessment completed. This is an unverified assessment.', userId: null }
    }, connection);
    await notify({ targetRole: 'administrator', type: 'ai_analysis_completed', title: 'AI assessment completed', message: 'Grok assessment is ready for report ' + report.id + ' and requires administrative verification.', entityType: 'report', entityId: report.databaseId }, connection);
    if (report.citizenId) await notify({ userId: report.citizenId, type: 'ai_analysis_completed', title: 'Photo assessment ready', message: 'An AI-generated photo assessment is available for ' + report.id + '.', entityType: 'report', entityId: report.databaseId }, connection);
    return updated.aiAnalysis;
  } catch (error) {
    await saveAnalysisResult({ reportId: report.databaseId, status: 'failed', errorMessage: error.message.slice(0, 1000), rawResponse: payload || null }, connection);
    if (error instanceof ApiError || error.name === 'ZodError') throw error;
    throw new ApiError(502, 'Grok could not analyze this image. You can retry later.', 'GROK_ANALYSIS_FAILED');
  }
}
