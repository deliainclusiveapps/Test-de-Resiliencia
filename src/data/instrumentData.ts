import { LikertValue, ScoreLevel, TestItem } from '../types/psychometrics';

export const LIKERT_OPTIONS: Array<{ value: LikertValue; label: string; shortLabel: string; description: string }> = [
  { value: 1, label: 'Totalmente en desacuerdo', shortLabel: 'TD', description: 'No refleja en absoluto mi vivencia o conducta' },
  { value: 2, label: 'En desacuerdo', shortLabel: 'D', description: 'En desacuerdo con la afirmación' },
  { value: 3, label: 'Neutral', shortLabel: 'N', description: 'Ni de acuerdo ni en desacuerdo' },
  { value: 4, label: 'De acuerdo', shortLabel: 'A', description: 'De acuerdo con la afirmación' },
  { value: 5, label: 'Totalmente de acuerdo', shortLabel: 'TA', description: 'Refleja con total claridad mi vivencia o conducta' },
];

export const TEST_METADATA = {
  title: 'TEST DE RESILIENCIA Y AFRONTAMIENTO ANTE VIOLENCIA CRIMINAL',
  author: 'MSc. Roger Giovanny Alvarado Palma',
  institution: 'Universidad César Vallejo',
  location: 'Guayaquil, Ecuador',
  validationDate: '01 de octubre de 2026',
  expertJudge: {
    name: 'Magister Psicología Clínica Carla Teresa Cervantes Santos',
    degree: 'Maestría',
    academicArea: 'Clínica',
    professionalExperience: 'Violencia, Psicología Clínica',
    institution: 'Unidad de violencia del Consejo de la Judicatura del Ecuador',
    timeOfExperience: 'Más de 5 años',
    psychometricResearchExperience: '0 años',
  },
  definitions: {
    variable: 'Resiliencia y afrontamiento ante violencia criminal.',
    resilienceConceptual:
      'La resiliencia se define como la capacidad del ser humano para resistir, adaptarse y superar situaciones adversas o traumáticas, transformando la experiencia negativa en una oportunidad de crecimiento personal y fortaleza emocional (Masten, 2001; Cyrulnik, 2003).',
    copingConceptual:
      'El afrontamiento hace referencia al conjunto de estrategias cognitivas y conductuales que una persona emplea para manejar las demandas internas o externas generadas por situaciones estresantes o violentas, buscando mantener su equilibrio psicológico y funcional (Lazarus & Folkman, 1986; Carver, Scheier, & Weintraub, 1989).',
    operational:
      'El Test de Resiliencia y Afrontamiento ante Violencia Criminal evalúa el grado en que las personas expuestas a experiencias de violencia criminal han desarrollado fortalezas internas para adaptarse y seguir adelante (resiliencia) y estrategias efectivas de manejo emocional y cognitivo (afrontamiento).',
    objective:
      'Identificar los niveles de resiliencia y estrategias de afrontamiento ante experiencias de violencia criminal, determinando el grado de adaptación emocional, cognitiva y conductual frente a situaciones de riesgo o trauma.',
  },
  dimensions: {
    R: {
      name: 'Resiliencia (R)',
      itemsRange: 'Ítems 1 al 10',
      objective: 'Evaluar la fortaleza emocional y la adaptación ante el daño vivido.',
      operationalDefinition:
        'Capacidad para adaptarse, mantener esperanza y aprender de la experiencia traumática.',
      minScore: 10,
      maxScore: 50,
      ranges: {
        low: { min: 10, max: 23, label: 'Bajo', description: 'Dificultad para mantener esperanza o sentido de superación.' },
        moderate: { min: 24, max: 36, label: 'Moderado', description: 'Aceptación parcial del evento con signos de adaptación.' },
        high: { min: 37, max: 50, label: 'Alto', description: 'Alta capacidad de reconstrucción, aprendizaje y esperanza.' },
      },
    },
    A: {
      name: 'Afrontamiento (A)',
      itemsRange: 'Ítems 11 al 20',
      objective: 'Identificar conductas orientadas al manejo y superación del trauma.',
      operationalDefinition:
        'Estrategias cognitivas y emocionales utilizadas para manejar el impacto de la violencia.',
      minScore: 10,
      maxScore: 50,
      ranges: {
        low: { min: 10, max: 23, label: 'Bajo', description: 'Estrategias evitativas o autocríticas (culpa, represión).' },
        moderate: { min: 24, max: 36, label: 'Moderado', description: 'Uso irregular de recursos de apoyo o distracción.' },
        high: { min: 37, max: 50, label: 'Alto', description: 'Afrontamiento activo, búsqueda de apoyo, fe, perdón y aceptación.' },
      },
    },
  },
  globalRanges: {
    minScore: 20,
    maxScore: 100,
    ranges: {
      low: { min: 20, max: 46, label: 'Bajo' },
      moderate: { min: 47, max: 73, label: 'Moderado' },
      high: { min: 74, max: 100, label: 'Alto' },
    },
  },
};

// Exact items from pages 7 and 8 of the PDF
export const TEST_ITEMS: TestItem[] = [
  // --- PRIMERA DIMENSIÓN: RESILIENCIA (R) (Página 7) ---
  {
    id: 1,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'He aprendido algo valioso de las experiencias difíciles que he vivido.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 2,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'A pesar del miedo, puedo seguir con mis actividades cotidianas.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 3,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Creo que tengo la fuerza para superar lo que me ha pasado.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 4,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Mantengo esperanza en el futuro, incluso tras lo ocurrido.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 5,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Me considero una persona capaz de adaptarse a los cambios bruscos.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 6,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Siento que los problemas me hacen más fuerte.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 7,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Busco el lado positivo de las situaciones dolorosas.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 8,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Cuando pienso en lo que me pasó, ya no siento tanta angustia.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 9,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Confío en que puedo reconstruir mi vida.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 10,
    dimension: 'R',
    dimensionName: 'Resiliencia',
    prompt: 'Me siento orgulloso de haber resistido momentos tan difíciles.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },

  // --- SEGUNDA DIMENSIÓN: AFRONTAMIENTO (A) (Página 8) ---
  {
    id: 11,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Busco hablar con alguien sobre lo que me pasó.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 12,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Trato de distraerme para no pensar constantemente en el suceso.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 13,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Evito lugares o personas que me recuerdan el hecho.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 14,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Me enfoco en lo que sí puedo controlar.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 15,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Intento perdonar para poder seguir adelante.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 16,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Me apoyo en mi fe o espiritualidad para sobrellevar el dolor.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 17,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Recurro a la ayuda profesional si lo necesito.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 18,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Me cuesta expresar lo que siento ante los demás.',
    isInverse: true,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 19,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'Me culpo por lo que me pasó.',
    isInverse: true,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
  {
    id: 20,
    dimension: 'A',
    dimensionName: 'Afrontamiento',
    prompt: 'He cambiado mi forma de ver la vida después del evento.',
    isInverse: false,
    expertScore: { claridad: 4, coherencia: 4, relevancia: 4 },
  },
];

// Calculation utility: converts Likert value (1-5) taking into account inverse items (18 and 19)
export function calculateItemScore(itemId: number, responseValue: LikertValue): number {
  if (itemId === 18 || itemId === 19) {
    // Inverse scoring: 1->5, 2->4, 3->3, 4->2, 5->1
    return 6 - responseValue;
  }
  return responseValue;
}

// Level determination based on exact thresholds from page 5
export function getScoreLevel(score: number, dimension: 'total' | 'R' | 'A'): ScoreLevel {
  if (dimension === 'total') {
    if (score <= 46) return 'Bajo';
    if (score <= 73) return 'Moderado';
    return 'Alto';
  } else {
    // For R or A (each 10 to 50):
    // 10-23 Bajo, 24-36 Moderado, 37-50 Alto
    if (score <= 23) return 'Bajo';
    if (score <= 36) return 'Moderado';
    return 'Alto';
  }
}

export function getInterpretation(dimension: 'R' | 'A', level: ScoreLevel): string {
  if (dimension === 'R') {
    switch (level) {
      case 'Bajo':
        return 'Dificultad para mantener esperanza o sentido de superación.';
      case 'Moderado':
        return 'Aceptación parcial del evento con signos de adaptación.';
      case 'Alto':
        return 'Alta capacidad de reconstrucción, aprendizaje y esperanza.';
    }
  } else {
    switch (level) {
      case 'Bajo':
        return 'Estrategias evitativas o autocríticas (culpa, represión).';
      case 'Moderado':
        return 'Uso irregular de recursos de apoyo o distracción.';
      case 'Alto':
        return 'Afrontamiento activo, búsqueda de apoyo, fe, perdón y aceptación.';
    }
  }
}

// Preset test scenarios for instant demonstration and testing
export const DEMO_PRESETS = [
  {
    id: 'alto-resiliente',
    name: 'Perfil Resiliente y Afrontamiento Activo (Alto)',
    description: 'Persona que ha logrado resignificar el evento traumático con apoyo social y propósito.',
    participant: {
      fullName: 'Elena Patricia Morales Solís',
      age: '34',
      gender: 'Femenino',
      date: new Date().toISOString().split('T')[0],
      notes: 'Superviviente de asalto a mano armada hace 8 meses. Completó acompañamiento comunitario.',
    },
    responses: {
      1: 5, 2: 4, 3: 5, 4: 5, 5: 4, 6: 4, 7: 4, 8: 4, 9: 5, 10: 5, // Resiliencia alta (~45)
      11: 5, 12: 4, 13: 2, 14: 5, 15: 4, 16: 5, 17: 4, 18: 2, 19: 1, 20: 5, // Afrontamiento activo (18=2->4, 19=1->5)
    } as Record<number, LikertValue>,
  },
  {
    id: 'moderado-transicion',
    name: 'Perfil en Proceso de Adaptación (Moderado)',
    description: 'Aceptación parcial con signos de avance pero episodios de retraimiento o dudas.',
    participant: {
      fullName: 'Carlos Andrés Mendoza Veintimilla',
      age: '29',
      gender: 'Masculino',
      date: new Date().toISOString().split('T')[0],
      notes: 'Víctima de extorsión y robo vehicular hace 3 meses en zona urbana.',
    },
    responses: {
      1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2, 8: 2, 9: 3, 10: 4, // R ~ 30 (Moderado)
      11: 3, 12: 4, 13: 4, 14: 3, 15: 3, 16: 3, 17: 2, 18: 3, 19: 3, 20: 3, // A ~ 30 (Moderado)
    } as Record<number, LikertValue>,
  },
  {
    id: 'vulnerabilidad-apoyo',
    name: 'Perfil con Necesidad de Apoyo Prioritario (Bajo)',
    description: 'Dificultad en recuperar la rutina cotidiana, autoculpación e inhibición expresiva.',
    participant: {
      fullName: 'Maritza Jacqueline Ramos Cedeño',
      age: '42',
      gender: 'Femenino',
      date: new Date().toISOString().split('T')[0],
      notes: 'Víctima de secuestro extorsivo express reciente. Manifiesta angustia elevada.',
    },
    responses: {
      1: 2, 2: 1, 3: 2, 4: 1, 5: 2, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, // R ~ 15 (Bajo)
      11: 2, 12: 2, 13: 5, 14: 2, 15: 1, 16: 2, 17: 2, 18: 5, 19: 5, 20: 2, // A ~ 16 (Bajo, con 18 y 19 altos directos -> 1 invertido)
    } as Record<number, LikertValue>,
  },
];
