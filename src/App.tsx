import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { TestForm } from './components/TestForm';
import { AnalysisResults } from './components/AnalysisResults';
import { TechnicalSheet } from './components/TechnicalSheet';
import { HistoryList } from './components/HistoryList';
import {
  LikertValue,
  ParticipantInfo,
  AssessmentRecord,
  TestScores,
  AIAnalysisResult,
} from './types/psychometrics';
import {
  TEST_ITEMS,
  DEMO_PRESETS,
  calculateItemScore,
  getScoreLevel,
  getInterpretation,
} from './data/instrumentData';

const STORAGE_KEY = 'psychometrics_evaluations_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('test');

  const [participant, setParticipant] = useState<ParticipantInfo>({
    fullName: '',
    age: '',
    gender: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [responses, setResponses] = useState<Record<number, LikertValue>>({});
  const [currentRecord, setCurrentRecord] = useState<AssessmentRecord | null>(null);
  const [savedRecords, setSavedRecords] = useState<AssessmentRecord[]>([]);

  // Load saved records from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedRecords(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load stored records:', e);
    }
  }, []);

  // Save to localStorage when savedRecords changes
  const saveRecordsToStorage = (records: AssessmentRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      setSavedRecords(records);
    } catch (e) {
      console.warn('Could not save records to storage:', e);
    }
  };

  const handleResponseChange = (itemId: number, value: LikertValue) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const calculateScores = (resp: Record<number, LikertValue>): TestScores => {
    let rScore = 0;
    let aScore = 0;

    TEST_ITEMS.forEach((item) => {
      const val = resp[item.id] || 3;
      const scored = calculateItemScore(item.id, val);
      if (item.dimension === 'R') {
        rScore += scored;
      } else {
        aScore += scored;
      }
    });

    const total = rScore + aScore;
    const rLevel = getScoreLevel(rScore, 'R');
    const aLevel = getScoreLevel(aScore, 'A');
    const totalLevel = getScoreLevel(total, 'total');

    return {
      totalScore: total,
      totalMax: 100,
      totalPercentage: Math.round((total / 100) * 100),
      totalLevel,
      resilienceScore: rScore,
      resilienceLevel: rLevel,
      copingScore: aScore,
      copingLevel: aLevel,
      resilience: {
        rawScore: rScore,
        maxScore: 50,
        percentage: Math.round((rScore / 50) * 100),
        level: rLevel,
        interpretation: getInterpretation('R', rLevel),
      },
      coping: {
        rawScore: aScore,
        maxScore: 50,
        percentage: Math.round((aScore / 50) * 100),
        level: aLevel,
        interpretation: getInterpretation('A', aLevel),
      },
    };
  };

  const handleFormSubmit = async () => {
    const computedScores = calculateScores(responses);

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

    // Create preliminary record
    const newRecordId = Date.now().toString();
    const newRecord: AssessmentRecord = {
      id: newRecordId,
      createdAt: new Date().toISOString(),
      participant,
      responses,
      scores: computedScores,
      reportType: 'participant',
    };

    setCurrentRecord(newRecord);
    setActiveTab('results');

    // Trigger AI analysis automatically in background
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant,
          scores: computedScores,
          itemResponses: detailedResponses,
          reportType: 'participant',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          const updatedWithAI: AssessmentRecord = {
            ...newRecord,
            analysis: data.analysis,
          };
          setCurrentRecord(updatedWithAI);

          // Update saved records list
          const existingIndex = savedRecords.findIndex((r) => r.id === newRecordId);
          let nextRecords: AssessmentRecord[];
          if (existingIndex >= 0) {
            nextRecords = [...savedRecords];
            nextRecords[existingIndex] = updatedWithAI;
          } else {
            nextRecords = [updatedWithAI, ...savedRecords];
          }
          saveRecordsToStorage(nextRecords);
        }
      }
    } catch (e) {
      console.warn('AI analysis call failed during submission:', e);
      // Fallback is also saved
      const nextRecords = [newRecord, ...savedRecords];
      saveRecordsToStorage(nextRecords);
    }
  };

  const handleUpdateAnalysis = (newAnalysis: AIAnalysisResult, reportType: 'participant' | 'clinical') => {
    if (!currentRecord) return;
    const updated: AssessmentRecord = {
      ...currentRecord,
      analysis: newAnalysis,
      reportType,
    };
    setCurrentRecord(updated);

    const nextRecords = savedRecords.map((r) => (r.id === updated.id ? updated : r));
    saveRecordsToStorage(nextRecords);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setParticipant(preset.participant);
    setResponses(preset.responses);
    setActiveTab('test');
  };

  const handleReset = () => {
    if (Object.keys(responses).length > 0) {
      const ok = window.confirm('¿Deseas reiniciar todas las respuestas del cuestionario?');
      if (!ok) return;
    }
    setResponses({});
    setParticipant({
      fullName: '',
      age: '',
      gender: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setCurrentRecord(null);
  };

  const handleSelectRecordFromHistory = (rec: AssessmentRecord) => {
    setCurrentRecord(rec);
    setParticipant(rec.participant);
    setResponses(rec.responses);
    setActiveTab('results');
  };

  const handleDeleteRecord = (id: string) => {
    const next = savedRecords.filter((r) => r.id !== id);
    saveRecordsToStorage(next);
    if (currentRecord?.id === id) {
      setCurrentRecord(null);
    }
  };

  const handleStartNew = () => {
    setResponses({});
    setParticipant({
      fullName: '',
      age: '',
      gender: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setCurrentRecord(null);
    setActiveTab('test');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        answeredCount={Object.keys(responses).length}
        totalCount={TEST_ITEMS.length}
        hasResults={Boolean(currentRecord)}
        onLoadPreset={handleLoadPreset}
        historyCount={savedRecords.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'test' && (
          <TestForm
            participant={participant}
            onParticipantChange={setParticipant}
            responses={responses}
            onResponseChange={handleResponseChange}
            onSubmit={handleFormSubmit}
            onLoadPreset={handleLoadPreset}
            onReset={handleReset}
          />
        )}

        {activeTab === 'results' && (
          currentRecord ? (
            <AnalysisResults
              record={currentRecord}
              onEditResponses={() => setActiveTab('test')}
              onUpdateAnalysis={handleUpdateAnalysis}
            />
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">?</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Aún no se ha realizado ninguna evaluación</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Por favor completa las respuestas del formulario para calcular las dimensiones de Resiliencia y Afrontamiento y generar el análisis de IA.
              </p>
              <button
                onClick={() => setActiveTab('test')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
              >
                Ir al Cuestionario
              </button>
            </div>
          )
        )}

        {activeTab === 'technical' && <TechnicalSheet />}

        {activeTab === 'history' && (
          <HistoryList
            records={savedRecords}
            onSelectRecord={handleSelectRecordFromHistory}
            onDeleteRecord={handleDeleteRecord}
            onStartNew={handleStartNew}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-700">
              Test de Resiliencia y Afrontamiento ante Violencia Criminal
            </span>{' '}
            • Basado en el instrumento validado por juicio de expertos (Guayaquil, 2026).
          </div>
          <div className="text-slate-400">
            Diseñado para profesionales de salud mental e investigación psicosocial.
          </div>
        </div>
      </footer>
    </div>
  );
}
