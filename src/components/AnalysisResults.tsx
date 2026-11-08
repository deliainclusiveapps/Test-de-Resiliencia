import React, { useState } from 'react';
import {
  AssessmentRecord,
  AIAnalysisResult,
  ScoreLevel,
  TestItem,
} from '../types/psychometrics';
import { TEST_ITEMS, calculateItemScore, LIKERT_OPTIONS, TEST_METADATA } from '../data/instrumentData';
import { exportAssessmentToPDF } from '../utils/pdfExport';
import {
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  Edit3,
  Shield,
  Heart,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  HelpCircle,
  FileText,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnalysisResultsProps {
  record: AssessmentRecord;
  onEditResponses: () => void;
  onUpdateAnalysis: (newAnalysis: AIAnalysisResult, reportType: 'participant' | 'clinical') => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  record,
  onEditResponses,
  onUpdateAnalysis,
}) => {
  const [reportType, setReportType] = useState<'participant' | 'clinical'>(record.reportType || 'participant');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { participant, scores, responses, analysis } = record;

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleGenerateAI = async (selectedType: 'participant' | 'clinical' = reportType) => {
    setIsLoadingAI(true);
    setErrorMessage(null);

    const detailedResponses = TEST_ITEMS.map((it) => {
      const raw = responses[it.id] || 3;
      return {
        id: it.id,
        dimension: it.dimension,
        prompt: it.prompt,
        responseValue: raw,
        scoredValue: calculateItemScore(it.id, raw),
        isInverse: it.isInverse,
      };
    });

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant,
          scores,
          itemResponses: detailedResponses,
          reportType: selectedType,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al conectar con el servicio de análisis.');
      }

      const data = await res.json();
      if (data.analysis) {
        onUpdateAnalysis(data.analysis, selectedType);
        triggerConfetti();
      }
    } catch (err: any) {
      console.error('Failed to generate AI analysis:', err);
      setErrorMessage(err.message || 'Ocurrió un error al generar el análisis.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!analysis) return;
    const textToCopy = `INFORME DEL TEST DE RESILIENCIA Y AFRONTAMIENTO ANTE VIOLENCIA CRIMINAL
Evaluado: ${participant.fullName || 'Anónimo'} (${participant.age ? participant.age + ' años' : 'Edad no esp.'})
Fecha: ${participant.date || record.createdAt.split('T')[0]}

PUNTUACIONES PSICOMÉTRICAS:
- Puntaje Global Total: ${scores.totalScore} / 100 (Nivel: ${scores.totalLevel})
- Resiliencia: ${scores.resilienceScore} / 50 (Nivel: ${scores.resilienceLevel})
- Afrontamiento: ${scores.copingScore} / 50 (Nivel: ${scores.copingLevel})

RESUMEN DIAGNÓSTICO:
${analysis.resumenEjecutivo}

ANÁLISIS DE RESILIENCIA:
${analysis.analisisResiliencia}

ANÁLISIS DE AFRONTAMIENTO:
${analysis.analisisAfrontamiento}

FORTALEZAS DETECTADAS:
${analysis.fortalezasIdentificadas.map((f) => `• ${f}`).join('\n')}

ÁREAS DE VULNERABILIDAD:
${analysis.areasDeRiesgoVulnerabilidad.map((r) => `• ${r}`).join('\n')}

ESTRATEGIAS Y RECOMENDACIONES:
${analysis.estrategiasRecomendadas.map((e) => `• ${e}`).join('\n')}

CONCLUSIÓN PRONÓSTICA:
${analysis.conclusionPronostica}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getLevelBadge = (level: ScoreLevel) => {
    switch (level) {
      case 'Alto':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          pill: 'bg-emerald-500',
          textColor: 'text-emerald-700',
        };
      case 'Moderado':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          pill: 'bg-amber-500',
          textColor: 'text-amber-800',
        };
      case 'Bajo':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-300',
          pill: 'bg-rose-500',
          textColor: 'text-rose-700',
        };
    }
  };

  const globalBadge = getLevelBadge(scores.totalLevel);
  const resilienceBadge = getLevelBadge(scores.resilienceLevel);
  const copingBadge = getLevelBadge(scores.copingLevel);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <Shield className="w-4 h-4" />
            <span>Perfil Psicométrico Cuantitativo & Cualitativo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Resultados de la Evaluación: {participant.fullName || 'Persona Evaluada'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Fecha de aplicación: {participant.date || record.createdAt.split('T')[0]} • 20 ítems evaluados
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportAssessmentToPDF(record)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition cursor-pointer"
            title="Descargar informe completo en formato PDF oficial"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition cursor-pointer"
            title="Imprimir informe clínico"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={onEditResponses}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition cursor-pointer"
            title="Regresar a editar respuestas"
          >
            <Edit3 className="w-4 h-4" />
            <span>Modificar Respuestas</span>
          </button>
        </div>
      </div>

      {/* 3 Main Score Cards (Page 5 Scoring Standards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Puntaje Global */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Puntaje Global Total
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${globalBadge.bg}`}
              >
                Nivel {scores.totalLevel}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                {scores.totalScore}
              </span>
              <span className="text-base font-semibold text-slate-400">/ 100 ptos</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Rango de puntaje: 20-46 Bajo | 47-73 Moderado | 74-100 Alto
            </p>
          </div>

          {/* Progress bar with threshold markings */}
          <div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
              <div
                className={`h-full transition-all duration-500 ${
                  scores.totalLevel === 'Alto'
                    ? 'bg-emerald-500'
                    : scores.totalLevel === 'Moderado'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (scores.totalScore / 100) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
              <span>20 (Mín)</span>
              <span>46 (Bajo)</span>
              <span>73 (Mod)</span>
              <span>100 (Máx)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Dimensión Resiliencia (R) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Resiliencia (R)
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${resilienceBadge.bg}`}
              >
                Nivel {scores.resilienceLevel}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-black text-indigo-950 tracking-tight">
                {scores.resilienceScore}
              </span>
              <span className="text-base font-semibold text-slate-400">/ 50 ptos</span>
            </div>
            <p className="text-xs font-medium text-indigo-900/80 mb-3 line-clamp-2">
              "{scores.resilience.interpretation}"
            </p>
          </div>

          <div>
            <div className="h-2.5 w-full bg-indigo-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${Math.min(100, (scores.resilienceScore / 50) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-indigo-600/70 mt-1.5 font-medium">
              <span>10 (Bajo ≤23)</span>
              <span>24-36 (Moderado)</span>
              <span>50 (Alto ≥37)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Dimensión Afrontamiento (A) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Afrontamiento (A)
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${copingBadge.bg}`}
              >
                Nivel {scores.copingLevel}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-black text-emerald-950 tracking-tight">
                {scores.copingScore}
              </span>
              <span className="text-base font-semibold text-slate-400">/ 50 ptos</span>
            </div>
            <p className="text-xs font-medium text-emerald-900/80 mb-3 line-clamp-2">
              "{scores.coping.interpretation}"
            </p>
          </div>

          <div>
            <div className="h-2.5 w-full bg-emerald-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${Math.min(100, (scores.copingScore / 50) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-emerald-600/70 mt-1.5 font-medium">
              <span>10 (Bajo ≤23)</span>
              <span>24-36 (Moderado)</span>
              <span>50 (Alto ≥37)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* AI Header with Model & Audience Controls */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Informe de Análisis Psicométrico con IA</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Interpretación clínica de las dimensiones de resiliencia y afrontamiento basada en el manual del instrumento.
                </p>
              </div>
            </div>

            {/* Audience Toggle & Regenerate Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700 text-xs font-medium">
                <button
                  onClick={() => {
                    setReportType('participant');
                    handleGenerateAI('participant');
                  }}
                  disabled={isLoadingAI}
                  className={`px-3 py-1.5 rounded-md transition ${
                    reportType === 'participant'
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Para el Participante
                </button>
                <button
                  onClick={() => {
                    setReportType('clinical');
                    handleGenerateAI('clinical');
                  }}
                  disabled={isLoadingAI}
                  className={`px-3 py-1.5 rounded-md transition ${
                    reportType === 'clinical'
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Informe Profesional
                </button>
              </div>

              <button
                onClick={() => handleGenerateAI(reportType)}
                disabled={isLoadingAI}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 cursor-pointer"
                title="Regenerar análisis con IA"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAI ? 'animate-spin' : ''}`} />
                <span>{isLoadingAI ? 'Generando...' : 'Regenerar'}</span>
              </button>

              {analysis && (
                <button
                  onClick={handleCopyAnalysis}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                  title="Copiar texto del análisis"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error notice if any */}
        {errorMessage && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {isLoadingAI ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto"></div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Analizando dimensiones de Resiliencia y Afrontamiento con IA...
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Evaluando fortalezas emocionales, recursos adaptativos, análisis de ítems inversos (culpa/expresión) y estructurando pautas de intervención psicosocial.
                </p>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Resumen Ejecutivo */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Resumen Diagnóstico Ejecutivo</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {analysis.resumenEjecutivo}
                </p>
              </div>

              {/* Grid: Resilience & Coping qualitative analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Resilience Analysis */}
                <div className="bg-indigo-50/40 rounded-xl p-5 border border-indigo-100">
                  <div className="flex items-center gap-2 font-bold text-indigo-950 text-sm mb-2.5">
                    <Heart className="w-4 h-4 text-indigo-600" />
                    <span>Análisis Cualitativo: Resiliencia (Ítems 1 al 10)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {analysis.analisisResiliencia}
                  </p>
                </div>

                {/* Coping Analysis */}
                <div className="bg-emerald-50/40 rounded-xl p-5 border border-emerald-100">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm mb-2.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Análisis Cualitativo: Afrontamiento (Ítems 11 al 20)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {analysis.analisisAfrontamiento}
                  </p>
                </div>
              </div>

              {/* Strengths & Vulnerabilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Fortalezas */}
                <div className="bg-white rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Fortalezas y Factores Protectores Detectados</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {analysis.fortalezasIdentificadas.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vulnerabilidades */}
                <div className="bg-white rounded-xl p-5 border border-amber-200">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Áreas de Vulnerabilidad o Atención Prioritaria</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {analysis.areasDeRiesgoVulnerabilidad.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recomendaciones Terapéuticas & Psicoeducativas */}
              <div className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Estrategias de Intervención y Recomendaciones Prácticas</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                  {analysis.estrategiasRecomendadas.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-start gap-2.5 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusión Pronóstica */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1">
                  Conclusión Pronóstica
                </div>
                <p className="text-sm leading-relaxed text-indigo-50">
                  {analysis.conclusionPronostica}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                El análisis detallado de la IA aún no ha sido generado.
              </p>
              <button
                onClick={() => handleGenerateAI(reportType)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
              >
                Generar Análisis con IA Ahora
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Complete Item Breakdown Table (Pages 7 and 8 with responses) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Desglose Completo de los 20 Ítems Respondidos (Páginas 7 y 8)
            </h3>
            <p className="text-xs text-slate-500">
              Visualización con puntaje directo seleccionado y puntaje transformado (inversión ítems 18 y 19).
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Escala Likert: 1 (Totalmente en desacuerdo) a 5 (Totalmente de acuerdo)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">Nº</th>
                <th className="py-3 px-3 w-28">Dimensión</th>
                <th className="py-3 px-4 min-w-[280px]">Ítem del Instrumento</th>
                <th className="py-3 px-3 text-center w-28">Marcado</th>
                <th className="py-3 px-3 text-center w-24">Puntos Asignados</th>
                <th className="py-3 px-3 text-center w-28">Tipo de Ítem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TEST_ITEMS.map((item) => {
                const raw = responses[item.id] || 3;
                const scored = calculateItemScore(item.id, raw);
                const optObj = LIKERT_OPTIONS.find((o) => o.value === raw);

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-600">
                      {item.id}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.dimension === 'R'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.dimension === 'R' ? 'Resiliencia' : 'Afrontamiento'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.prompt}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-slate-900">{raw}</span>{' '}
                      <span className="text-[10px] text-slate-500">({optObj?.shortLabel})</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-black text-sm ${
                          scored >= 4
                            ? 'text-emerald-700'
                            : scored === 3
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {scored} pts
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.isInverse ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Inverso (6 - {raw} = {scored})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Directo</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scientific Validation Footer Badge */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Instrumento adaptado y validado en Guayaquil, Ecuador (MSc. Roger Giovanny Alvarado Palma). Juicio de expertos por Magister Psicología Clínica Carla Teresa Cervantes Santos (Consejo de la Judicatura).
          </span>
        </div>
        <button
          onClick={() => exportAssessmentToPDF(record)}
          className="text-indigo-600 font-semibold hover:underline shrink-0"
        >
          Exportar reporte imprimible
        </button>
      </div>
    </div>
  );
};
