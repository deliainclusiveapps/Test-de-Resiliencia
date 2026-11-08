import React from 'react';
import { AssessmentRecord } from '../types/psychometrics';
import { exportAssessmentToPDF } from '../utils/pdfExport';
import { Download, Eye, Trash2, Calendar, User, Shield, AlertCircle } from 'lucide-react';

interface HistoryListProps {
  records: AssessmentRecord[];
  onSelectRecord: (record: AssessmentRecord) => void;
  onDeleteRecord: (id: string) => void;
  onStartNew: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onStartNew,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Historial de Evaluaciones Realizadas</h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro de cuestionarios completados y almacenados localmente en esta sesión ({records.length} guardadas).
          </p>
        </div>
        <button
          onClick={onStartNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
        >
          <span>Nueva Evaluación</span>
        </button>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Shield className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No hay evaluaciones guardadas</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Completa el cuestionario de las páginas 7 y 8 para registrar la primera evaluación psicométrica con su análisis de IA.
          </p>
          <button
            onClick={onStartNew}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Comenzar Evaluación
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {rec.participant.fullName || 'Evaluado sin nombre'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.scores.totalLevel === 'Alto'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : rec.scores.totalLevel === 'Moderado'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    Nivel {rec.scores.totalLevel} ({rec.scores.totalScore}/100)
                  </span>
                  {rec.analysis && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Análisis IA listo
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {rec.participant.age ? `${rec.participant.age} años` : 'Edad N/E'} • {rec.participant.gender || 'Género N/E'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {rec.participant.date || rec.createdAt.split('T')[0]}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span>
                    Resiliencia: <strong className="text-indigo-600">{rec.scores.resilienceScore}/50</strong> ({rec.scores.resilienceLevel})
                  </span>
                  <span>
                    Afrontamiento: <strong className="text-emerald-600">{rec.scores.copingScore}/50</strong> ({rec.scores.copingLevel})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onSelectRecord(rec)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Informe</span>
                </button>

                <button
                  onClick={() => exportAssessmentToPDF(rec)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  title="Descargar PDF"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteRecord(rec.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
