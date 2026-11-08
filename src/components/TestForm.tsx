import React, { useState } from 'react';
import {
  TestItem,
  LikertValue,
  ParticipantInfo,
} from '../types/psychometrics';
import {
  TEST_ITEMS,
  LIKERT_OPTIONS,
  DEMO_PRESETS,
  calculateItemScore,
} from '../data/instrumentData';
import {
  Sparkles,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Table,
  Layers,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';

interface TestFormProps {
  participant: ParticipantInfo;
  onParticipantChange: (updated: ParticipantInfo) => void;
  responses: Record<number, LikertValue>;
  onResponseChange: (itemId: number, value: LikertValue) => void;
  onSubmit: () => void;
  onLoadPreset: (presetId: string) => void;
  onReset: () => void;
}

export const TestForm: React.FC<TestFormProps> = ({
  participant,
  onParticipantChange,
  responses,
  onResponseChange,
  onSubmit,
  onLoadPreset,
  onReset,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [activeDimensionFilter, setActiveDimensionFilter] = useState<'ALL' | 'R' | 'A'>('ALL');
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  const answeredIds = Object.keys(responses).map(Number);
  const totalItems = TEST_ITEMS.length;
  const answeredCount = answeredIds.length;
  const completionRate = Math.round((answeredCount / totalItems) * 100);

  const resilienceItems = TEST_ITEMS.filter((item) => item.dimension === 'R');
  const copingItems = TEST_ITEMS.filter((item) => item.dimension === 'A');

  const filteredItems = TEST_ITEMS.filter((item) => {
    if (activeDimensionFilter === 'ALL') return true;
    return item.dimension === activeDimensionFilter;
  });

  const handleFieldChange = (field: keyof ParticipantInfo, value: string) => {
    onParticipantChange({
      ...participant,
      [field]: value,
    });
  };

  const handleCalculateClick = () => {
    if (answeredCount < totalItems) {
      setShowValidationWarning(true);
      // Find the first unanswered item and scroll to it
      const firstUnanswered = TEST_ITEMS.find((it) => !responses[it.id]);
      if (firstUnanswered) {
        const el = document.getElementById(`item-${firstUnanswered.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    setShowValidationWarning(false);
    onSubmit();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero / Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-400/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Instrumento de Evaluación Psicométrica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Test de Resiliencia y Afrontamiento ante Violencia Criminal
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Este instrumento evalúa las fortalezas internas de adaptación, esperanza y aprendizaje (
            <span className="text-indigo-300 font-semibold">Resiliencia</span>, ítems 1 al 10) y las estrategias cognitivas, emocionales y conductuales de manejo (
            <span className="text-emerald-300 font-semibold">Afrontamiento</span>, ítems 11 al 20).
          </p>

          {/* Quick presets & Demo Buttons */}
          <div className="pt-2 border-t border-slate-700/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Cargar caso de prueba:</span>
              <div className="flex flex-wrap gap-2">
                {DEMO_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onLoadPreset(p.id)}
                    className="px-2.5 py-1 rounded-md text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
                    title={p.description}
                  >
                    {p.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-slate-400 hover:text-rose-300 transition-colors"
              title="Borrar todas las respuestas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar formulario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Participant Data Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Datos Generales de la Persona Evaluada</h2>
              <p className="text-xs text-slate-500">
                Información para la identificación del participante y generación del informe
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre Completo / Seudónimo <span className="text-indigo-600">*</span>
            </label>
            <input
              type="text"
              value={participant.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              placeholder="Ej. Elena Morales o Código PAC-01"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Edad
            </label>
            <input
              type="number"
              min="18"
              max="100"
              value={participant.age}
              onChange={(e) => handleFieldChange('age', e.target.value)}
              placeholder="Ej. 34"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Género
            </label>
            <select
              value={participant.gender}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            >
              <option value="">Seleccione género...</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="No binario / Otro">No binario / Otro</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fecha de Aplicación
            </label>
            <div className="relative">
              <input
                type="date"
                value={participant.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Contexto del hecho / Observaciones previas (opcional)
          </label>
          <input
            type="text"
            value={participant.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Ej. Tiempo transcurrido desde el suceso traumático, intervención recibida, etc."
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>
      </section>

      {/* Progress & View Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-md bg-white/95">
        {/* Progress status */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 text-sm">
            {completionRate}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                Progreso: {answeredCount} de {totalItems} ítems respondidos
              </span>
              {answeredCount === totalItems && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Listo para análisis
                </span>
              )}
            </div>
            {/* Progress Bar */}
            <div className="w-48 sm:w-64 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  answeredCount === totalItems
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                }`}
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* View mode toggle & filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Dimension filter */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveDimensionFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-md transition ${
                activeDimensionFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos (20)
            </button>
            <button
              onClick={() => setActiveDimensionFilter('R')}
              className={`px-2.5 py-1.5 rounded-md transition ${
                activeDimensionFilter === 'R'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-indigo-700'
              }`}
            >
              Resiliencia (1-10)
            </button>
            <button
              onClick={() => setActiveDimensionFilter('A')}
              className={`px-2.5 py-1.5 rounded-md transition ${
                activeDimensionFilter === 'A'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Afrontamiento (11-20)
            </button>
          </div>

          {/* Table vs Cards */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabla Oficial</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tarjetas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Likert Scale Legend Guide */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Formato de respuesta (Escala Likert de 5 puntos)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {LIKERT_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className="bg-white border border-slate-200 rounded-lg p-2 text-center"
            >
              <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold leading-6 mb-1">
                {opt.value}
              </span>
              <div className="font-semibold text-slate-900">{opt.label}</div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-2.5 text-[11px] text-slate-600 flex items-center gap-1.5">
          <span className="font-semibold text-amber-700">Nota psicométrica:</span>
          <span>
            Los ítems 18 y 19 son de <strong>calificación inversa</strong> según la especificación del autor (Pág. 5 y 8). Marcar "5" equivale a 1 punto, y marcar "1" equivale a 5 puntos.
          </span>
        </div>
      </div>

      {/* Warning message if uncomplete */}
      {showValidationWarning && answeredCount < totalItems && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex items-start gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              Faltan {totalItems - answeredCount} ítems por responder.
            </p>
            <p className="text-xs text-amber-800 mt-1">
              Para obtener un cálculo psicométrico riguroso e informe diagnóstico de IA confiable, se requiere responder los 20 ítems del instrumento.
            </p>
          </div>
        </div>
      )}

      {/* MODE 1: Table View (Exact representation of pages 7 and 8) */}
      {viewMode === 'table' ? (
        <div className="space-y-8">
          {/* Section 1: Resilience (items 1-10) */}
          {(activeDimensionFilter === 'ALL' || activeDimensionFilter === 'R') && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-6 py-4 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">
                      Página 7 del documento original
                    </span>
                    <h3 className="text-lg font-bold">PRIMERA DIMENSIÓN: RESILIENCIA (R)</h3>
                    <p className="text-xs text-indigo-100 mt-0.5">
                      <strong>Objetivo:</strong> Evaluar la fortaleza emocional y la adaptación ante el daño vivido. (Ítems 1 al 10)
                    </p>
                  </div>
                  <div className="text-xs font-semibold bg-indigo-700/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 self-start sm:self-auto">
                    Ítems: {resilienceItems.filter((i) => responses[i.id]).length} / 10 completados
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-300 text-slate-900 font-bold border-b border-amber-400">
                      <th className="py-3 px-3 w-12 text-center">Nº</th>
                      <th className="py-3 px-4 min-w-[280px]">ÍTEM</th>
                      <th className="py-3 px-2 text-center w-20 hidden md:table-cell">CLARIDAD</th>
                      <th className="py-3 px-2 text-center w-24 hidden md:table-cell">COHERENCIA</th>
                      <th className="py-3 px-2 text-center w-24 hidden md:table-cell">RELEVANCIA</th>
                      <th className="py-3 px-4 text-center min-w-[280px]">
                        CALIFICACIÓN LIKERT (1 a 5)
                      </th>
                      <th className="py-3 px-3 text-center w-16">PTOS.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resilienceItems.map((item) => {
                      const selectedVal = responses[item.id];
                      const scoredVal = selectedVal ? calculateItemScore(item.id, selectedVal) : '-';

                      return (
                        <tr
                          key={item.id}
                          id={`item-${item.id}`}
                          className={`hover:bg-slate-50 transition ${
                            !selectedVal && showValidationWarning ? 'bg-amber-50/70' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center font-bold text-slate-700 bg-slate-50/50">
                            {item.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <span>{item.prompt}</span>
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 hidden md:table-cell">
                            {item.expertScore.claridad}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 hidden md:table-cell">
                            {item.expertScore.coherencia}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 hidden md:table-cell">
                            {item.expertScore.relevancia}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              {LIKERT_OPTIONS.map((opt) => {
                                const isSelected = selectedVal === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => onResponseChange(item.id, opt.value)}
                                    title={`${opt.value}: ${opt.label}`}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center transition cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1'
                                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-900 border border-slate-200'
                                    }`}
                                  >
                                    {opt.value}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-indigo-700">
                            {scoredVal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 2: Coping (items 11-20) */}
          {(activeDimensionFilter === 'ALL' || activeDimensionFilter === 'A') && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-800 px-6 py-4 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                      Página 8 del documento original
                    </span>
                    <h3 className="text-lg font-bold">SEGUNDA DIMENSIÓN: AFRONTAMIENTO (A)</h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      <strong>Objetivo:</strong> Identificar conductas orientadas al manejo y superación del trauma. (Ítems 11 al 20)
                    </p>
                  </div>
                  <div className="text-xs font-semibold bg-emerald-700/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 self-start sm:self-auto">
                    Ítems: {copingItems.filter((i) => responses[i.id]).length} / 10 completados
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-300 text-slate-900 font-bold border-b border-amber-400">
                      <th className="py-3 px-3 w-12 text-center">Nº</th>
                      <th className="py-3 px-4 min-w-[280px]">ÍTEM</th>
                      <th className="py-3 px-2 text-center w-20 hidden md:table-cell">CLARIDAD</th>
                      <th className="py-3 px-2 text-center w-24 hidden md:table-cell">COHERENCIA</th>
                      <th className="py-3 px-2 text-center w-24 hidden md:table-cell">RELEVANCIA</th>
                      <th className="py-3 px-4 text-center min-w-[280px]">
                        CALIFICACIÓN LIKERT (1 a 5)
                      </th>
                      <th className="py-3 px-3 text-center w-16">PTOS.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {copingItems.map((item) => {
                      const selectedVal = responses[item.id];
                      const scoredVal = selectedVal ? calculateItemScore(item.id, selectedVal) : '-';

                      return (
                        <tr
                          key={item.id}
                          id={`item-${item.id}`}
                          className={`hover:bg-slate-50 transition ${
                            !selectedVal && showValidationWarning ? 'bg-amber-50/70' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center font-bold text-slate-700 bg-slate-50/50">
                            {item.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{item.prompt}</span>
                              {item.isInverse && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  inversa
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 hidden md:table-cell">
                            {item.expertScore.claridad}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 hidden md:table-cell">
                            {item.expertScore.coherencia}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 hidden md:table-cell">
                            {item.expertScore.relevancia}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              {LIKERT_OPTIONS.map((opt) => {
                                const isSelected = selectedVal === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => onResponseChange(item.id, opt.value)}
                                    title={`${opt.value}: ${opt.label}`}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center transition cursor-pointer ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1'
                                        : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200'
                                    }`}
                                  >
                                    {opt.value}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-700">
                            {scoredVal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MODE 2: Guided Card View */
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const selectedVal = responses[item.id];
            const isAnswered = selectedVal !== undefined;
            const scoredVal = isAnswered ? calculateItemScore(item.id, selectedVal) : null;

            return (
              <div
                key={item.id}
                id={`item-${item.id}`}
                className={`bg-white rounded-xl p-5 border transition-all ${
                  isAnswered
                    ? 'border-slate-200 shadow-xs'
                    : showValidationWarning
                    ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        item.dimension === 'R'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {item.dimension === 'R' ? 'Dimensión Resiliencia' : 'Dimensión Afrontamiento'}
                        </span>
                        {item.isInverse && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            Ítem Inverso
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                  </div>

                  {scoredVal !== null && (
                    <div className="self-end sm:self-start text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      Puntaje: <span className="text-indigo-600 font-extrabold">{scoredVal}</span> pts
                    </div>
                  )}
                </div>

                {/* Likert Selection Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-5 gap-1.5 sm:gap-2">
                  {LIKERT_OPTIONS.map((opt) => {
                    const isSelected = selectedVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onResponseChange(item.id, opt.value)}
                        className={`p-2 rounded-lg text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? item.dimension === 'R'
                              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                              : 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-bold">{opt.value}</span>
                        <span className="text-[10px] hidden sm:block truncate max-w-full">
                          {opt.shortLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Action Bar */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">
              {answeredCount === totalItems
                ? '¡Formulario completo! Puedes calcular los resultados.'
                : `Has completado ${answeredCount} de ${totalItems} preguntas`}
            </div>
            <div className="text-xs text-slate-500">
              Se calculará la puntuación psicométrica y el informe analítico asistido por IA.
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculateClick}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
            answeredCount === totalItems
              ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white shadow-indigo-500/25 ring-2 ring-indigo-500/30 scale-[1.02]'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <span>Calcular Puntuación y Generar Análisis IA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
