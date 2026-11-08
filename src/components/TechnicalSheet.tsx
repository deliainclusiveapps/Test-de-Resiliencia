import React from 'react';
import { TEST_METADATA, TEST_ITEMS } from '../data/instrumentData';
import { BookOpen, Award, CheckCircle, Scale, Shield, Users, Layers } from 'lucide-react';

export const TechnicalSheet: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
          <Award className="w-4 h-4" />
          <span>Ficha Técnica y Validación de Instrumento</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Test de Resiliencia y Afrontamiento ante Violencia Criminal
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl">
          Documento psicométrico oficial adaptado para medir niveles de resiliencia y afrontamiento en personas mayores de 18 años expuestas a violencia criminal.
        </p>
      </div>

      {/* General Identification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Datos del Autor y Contexto Académico</span>
          </div>
          <dl className="space-y-3 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-400 font-medium">Autor del Instrumento:</dt>
              <dd className="font-semibold text-slate-800">{TEST_METADATA.author}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">Institución Académica:</dt>
              <dd className="font-semibold text-slate-800">{TEST_METADATA.institution}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">Ubicación y Fecha:</dt>
              <dd className="font-semibold text-slate-800">Guayaquil, Ecuador • 01 de octubre de 2026</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">Población Objetivo:</dt>
              <dd className="font-semibold text-slate-800">Personas mayores de 18 años expuestas a experiencias de violencia criminal</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base mb-4">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Datos del Juez Validador (Página 3)</span>
          </div>
          <dl className="space-y-3 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-400 font-medium">Nombre del Juez Experto:</dt>
              <dd className="font-semibold text-slate-800">{TEST_METADATA.expertJudge.name}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">Grado Profesional & Formación:</dt>
              <dd className="font-semibold text-slate-800">Maestría (X) • Formación Clínica (X)</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">Institución donde labora:</dt>
              <dd className="font-semibold text-slate-800">{TEST_METADATA.expertJudge.institution}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">Experiencia Profesional:</dt>
              <dd className="font-semibold text-slate-800">Más de 5 años en Violencia y Psicología Clínica</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Conceptual & Operational Definitions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Fundamentación Teórica y Conceptual (Página 1 del documento)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
            <h4 className="font-bold text-indigo-950 mb-2">Definición de Resiliencia</h4>
            <p className="text-slate-700 leading-relaxed">
              {TEST_METADATA.definitions.resilienceConceptual}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <h4 className="font-bold text-emerald-950 mb-2">Definición de Afrontamiento</h4>
            <p className="text-slate-700 leading-relaxed">
              {TEST_METADATA.definitions.copingConceptual}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
          <h4 className="font-bold text-slate-900 mb-1">Definición Operacional</h4>
          <p className="leading-relaxed">{TEST_METADATA.definitions.operational}</p>
        </div>
      </div>

      {/* Scoring Ranges Table (Página 5) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base mb-4">
          <Scale className="w-5 h-5 text-indigo-600" />
          <span>Baremos y Rangos de Calificación Psicométrica (Página 5)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Variable / Dimensión</th>
                <th className="py-2.5 px-3">Rango de Puntaje</th>
                <th className="py-2.5 px-3">Nivel Diagnóstico</th>
                <th className="py-2.5 px-3">Interpretación Psicológica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-white">
                <td rowSpan={3} className="py-2.5 px-3 font-bold text-indigo-900 border-r border-slate-100">
                  Resiliencia (R)<br />
                  <span className="text-[10px] text-slate-400 font-normal">Ítems 1 al 10</span>
                </td>
                <td className="py-2 px-3 font-semibold text-rose-700">10 – 23</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">Bajo</span></td>
                <td className="py-2 px-3 text-slate-600">Dificultad para mantener esperanza o sentido de superación.</td>
              </tr>
              <tr className="bg-white">
                <td className="py-2 px-3 font-semibold text-amber-700">24 – 36</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">Moderado</span></td>
                <td className="py-2 px-3 text-slate-600">Aceptación parcial del evento con signos de adaptación.</td>
              </tr>
              <tr className="bg-white">
                <td className="py-2 px-3 font-semibold text-emerald-700">37 – 50</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">Alto</span></td>
                <td className="py-2 px-3 text-slate-600">Alta capacidad de reconstrucción, aprendizaje y esperanza.</td>
              </tr>

              <tr className="bg-slate-50/50">
                <td rowSpan={3} className="py-2.5 px-3 font-bold text-emerald-900 border-r border-slate-100">
                  Afrontamiento (A)<br />
                  <span className="text-[10px] text-slate-400 font-normal">Ítems 11 al 20</span>
                </td>
                <td className="py-2 px-3 font-semibold text-rose-700">10 – 23</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">Bajo</span></td>
                <td className="py-2 px-3 text-slate-600">Estrategias evitativas o autocríticas (culpa, represión).</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-amber-700">24 – 36</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">Moderado</span></td>
                <td className="py-2 px-3 text-slate-600">Uso irregular de recursos de apoyo o distracción.</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-emerald-700">37 – 50</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">Alto</span></td>
                <td className="py-2 px-3 text-slate-600">Afrontamiento activo, búsqueda de apoyo, fe, perdón y aceptación.</td>
              </tr>

              <tr className="bg-indigo-50/30">
                <td rowSpan={3} className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-100">
                  Puntaje Global Total<br />
                  <span className="text-[10px] text-slate-400 font-normal">Suma de R + A (20 a 100)</span>
                </td>
                <td className="py-2 px-3 font-bold text-rose-700">20 – 46</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Bajo</span></td>
                <td className="py-2 px-3 text-slate-700">Nivel de resiliencia y afrontamiento bajo ante la violencia criminal vivida.</td>
              </tr>
              <tr className="bg-indigo-50/30">
                <td className="py-2 px-3 font-bold text-amber-700">47 – 73</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Moderado</span></td>
                <td className="py-2 px-3 text-slate-700">Nivel moderado de resiliencia y recursos de afrontamiento adaptativo.</td>
              </tr>
              <tr className="bg-indigo-50/30">
                <td className="py-2 px-3 font-bold text-emerald-700">74 – 100</td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Alto</span></td>
                <td className="py-2 px-3 text-slate-700">Alto nivel de recursos internos de superación y estrategias activas de afrontamiento.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation by Judge Carla Teresa Cervantes Santos Criteria (Página 6) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base mb-4">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Criterios de Juicio de Expertos (Páginas 6, 7 y 8)</span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Todos los 20 ítems del instrumento fueron sometidos a evaluación de contenido por la jueza Magister Carla Teresa Cervantes Santos, obteniendo la calificación máxima de <strong>4 / 4</strong> en las tres categorías fundamentales:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-slate-900 text-sm block mb-1">CLARIDAD (4/4)</span>
            <p className="text-slate-600 leading-relaxed">
              El ítem se comprende fácilmente, con sintáctica y semántica adecuadas (Alto Nivel).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-slate-900 text-sm block mb-1">COHERENCIA (4/4)</span>
            <p className="text-slate-600 leading-relaxed">
              El ítem se encuentra directamente relacionado con la dimensión que está midiendo (Alto Nivel).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-slate-900 text-sm block mb-1">RELEVANCIA (4/4)</span>
            <p className="text-slate-600 leading-relaxed">
              El ítem es muy relevante, esencial y debe ser incluido en el instrumento definitivo (Alto Nivel).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
