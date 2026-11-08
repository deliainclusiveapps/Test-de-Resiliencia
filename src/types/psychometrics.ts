export type DimensionId = 'R' | 'A';

export interface TestItem {
  id: number;
  dimension: DimensionId;
  dimensionName: string;
  prompt: string;
  isInverse: boolean;
  // Criteria evaluated by the expert judge (pages 6, 7, 8)
  expertScore: {
    claridad: number;
    coherencia: number;
    relevancia: number;
    observaciones?: string;
  };
}

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface ParticipantInfo {
  fullName: string;
  age: string;
  gender: string;
  date: string;
  identifier?: string;
  notes?: string;
}

export type ScoreLevel = 'Bajo' | 'Moderado' | 'Alto';

export interface DimensionScore {
  rawScore: number;
  maxScore: number;
  percentage: number;
  level: ScoreLevel;
  interpretation: string;
}

export interface TestScores {
  totalScore: number;
  totalMax: number;
  totalPercentage: number;
  totalLevel: ScoreLevel;
  resilienceScore: number;
  resilienceLevel: ScoreLevel;
  copingScore: number;
  copingLevel: ScoreLevel;
  resilience: DimensionScore;
  coping: DimensionScore;
}

export interface ItemResponseDetail {
  id: number;
  dimension: DimensionId;
  prompt: string;
  responseValue: LikertValue; // 1 to 5 as selected
  scoredValue: number; // 1 to 5 after applying inverse for 18 & 19
  isInverse: boolean;
}

export interface AIAnalysisResult {
  resumenEjecutivo: string;
  analisisResiliencia: string;
  analisisAfrontamiento: string;
  fortalezasIdentificadas: string[];
  areasDeRiesgoVulnerabilidad: string[];
  estrategiasRecomendadas: string[];
  conclusionPronostica: string;
}

export interface AssessmentRecord {
  id: string;
  createdAt: string;
  participant: ParticipantInfo;
  responses: Record<number, LikertValue>;
  scores: TestScores;
  analysis?: AIAnalysisResult;
  reportType: 'participant' | 'clinical';
}
