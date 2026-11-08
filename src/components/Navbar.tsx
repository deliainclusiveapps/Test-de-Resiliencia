import React from 'react';
import { ClipboardCheck, Sparkles, FileText, History, Shield, Brain } from 'lucide-react';

export type ActiveTab = 'test' | 'results' | 'technical' | 'history';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  answeredCount: number;
  totalCount: number;
  hasResults: boolean;
  onLoadPreset: (presetId: string) => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  answeredCount,
  totalCount,
  hasResults,
  historyCount,
}) => {
  const isComplete = answeredCount === totalCount;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-100">
                  Test de Resiliencia y Afrontamiento
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Violencia Criminal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                MSc. Roger Giovanny Alvarado Palma • Validación Juicio de Expertos
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('test')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'test'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Cuestionario</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isComplete ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {answeredCount}/{totalCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('results')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Resultados & IA</span>
              {hasResults && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => onTabChange('technical')}
              className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'technical'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ficha Técnica</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Historial de evaluaciones"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
              {historyCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
