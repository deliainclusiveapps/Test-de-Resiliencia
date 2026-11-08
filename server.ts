import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Server-side Gemini AI setup
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Psychometric Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { participant, scores, itemResponses, reportType } = req.body;

    if (!scores || !itemResponses) {
      return res.status(400).json({ error: 'Faltan datos de puntuación o respuestas del instrumento.' });
    }

    const { totalScore, totalLevel, resilienceScore, resilienceLevel, copingScore, copingLevel } = scores;

    // Detailed prompt contextualized in the criminal violence resilience & coping psychometric instrument
    const targetAudience = reportType === 'participant' 
      ? 'la persona evaluada (lenguaje empático, comprensible, validante y constructivo, sin tecnicismos excesivos)'
      : 'profesionales de psicología clínica, comunitaria o forense (lenguaje técnico, psicométrico, con rigor metodológico y recomendaciones terapéuticas)';

    const systemInstruction = `Eres un experto especialista en psicometría clínica, psicología del trauma y evaluación de resiliencia y afrontamiento ante situaciones de violencia criminal. 
Tu tarea es analizar los resultados del "Test de Resiliencia y Afrontamiento ante Violencia Criminal" (elaborado por MSc. Roger Giovanny Alvarado Palma y validado por juicio de expertos).
El instrumento evalúa 2 dimensiones con escala Likert de 1 a 5 (ítems 18 y 19 invertidos):
- Dimensión Resiliencia (R, ítems 1-10): Fortaleza emocional, adaptación al daño vivido, aprendizaje y sentido de superación.
  * Baremos: 10-23 (Bajo), 24-36 (Moderado), 37-50 (Alto).
- Dimensión Afrontamiento (A, ítems 11-20): Conductas y estrategias cognitivas/emocionales para manejar el trauma.
  * Baremos: 10-23 (Bajo: evitación/culpa/represión), 24-36 (Moderado: uso irregular de recursos), 37-50 (Alto: búsqueda activa de apoyo, fe, perdón y aceptación).
- Puntaje Global (20-100):
  * 20-46 (Bajo), 47-73 (Moderado), 74-100 (Alto).

Debes redactar el informe dirigido a: ${targetAudience}.
Estructura tu respuesta en formato JSON exacto con las siguientes claves:
{
  "resumenEjecutivo": "Síntesis diagnóstica clara del estado general de la persona",
  "analisisResiliencia": "Análisis detallado de la dimensión de resiliencia, identificando capacidades de adaptación, esperanza y aprendizaje",
  "analisisAfrontamiento": "Análisis detallado de la dimensión de afrontamiento, evaluando búsqueda de apoyo social, espiritualidad, foco de control y atención especial al manejo de culpa o aislamiento (ítems 18 y 19)",
  "fortalezasIdentificadas": ["lista de 3 a 5 fortalezas detectadas a partir de los ítems con mayor puntuación"],
  "areasDeRiesgoVulnerabilidad": ["lista de 2 a 4 indicadores o ítems que denotan vulnerabilidad o necesidad de atención prioritaria"],
  "estrategiasRecomendadas": ["lista de 4 a 6 recomendaciones prácticas, psicoeducativas o terapéuticas adaptadas al perfil"],
  "conclusionPronostica": "Breve conclusión pronóstica y pauta de seguimiento o acompañamiento sugerida"
}`;

    const prompt = `Analiza los siguientes resultados del Test de Resiliencia y Afrontamiento ante Violencia Criminal:

DATOS DEL EVALUADO:
- Nombre / Identificador: ${participant?.fullName || 'Anónimo'}
- Edad: ${participant?.age ? participant.age + ' años' : 'No especificada'}
- Género: ${participant?.gender || 'No especificado'}
- Fecha de Aplicación: ${participant?.date || new Date().toISOString().split('T')[0]}
- Observaciones previas / contexto: ${participant?.notes || 'No se registraron notas previas.'}

PUNTUACIONES PSICOMÉTRICAS:
- Puntaje Global Total: ${totalScore} / 100 -> Nivel: ${totalLevel}
- Dimensión Resiliencia (R): ${resilienceScore} / 50 -> Nivel: ${resilienceLevel}
- Dimensión Afrontamiento (A): ${copingScore} / 50 -> Nivel: ${copingLevel}

RESPUESTAS DETALLADAS A LOS 20 ÍTEMS:
${itemResponses
  .map(
    (item: any) =>
      `Ítem ${item.id} [${item.dimension === 'R' ? 'Resiliencia' : 'Afrontamiento'}]: "${item.prompt}" -> Respuesta directa marcada: ${item.responseValue}/5${item.isInverse ? ` (Puntaje Invertido: ${item.scoredValue}/5)` : ''}`
  )
  .join('\n')}

Genera el análisis psicométrico y clínico riguroso según las instrucciones del sistema en el formato JSON indicado.`;

    const ai = getGeminiClient();

    if (!ai) {
      // Deterministic psychological fallback report based strictly on the manual specifications
      const fallbackReport = generateManualPsychometricReport({
        participant,
        scores,
        itemResponses,
        reportType,
      });
      return res.json({ analysis: fallbackReport, isFallback: true });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('No se recibió texto del modelo Gemini.');
    }

    try {
      const parsedAnalysis = JSON.parse(outputText);
      return res.json({ analysis: parsedAnalysis, isFallback: false });
    } catch (parseError) {
      // In case of parsing mismatch, return sanitized structure
      return res.json({
        analysis: {
          resumenEjecutivo: outputText,
          analisisResiliencia: `Puntaje obtenido: ${resilienceScore}/50 (${resilienceLevel}).`,
          analisisAfrontamiento: `Puntaje obtenido: ${copingScore}/50 (${copingLevel}).`,
          fortalezasIdentificadas: ['Capacidad de autoreflexión y disposición a la evaluación'],
          areasDeRiesgoVulnerabilidad: ['Procesamiento continuo de las secuelas del suceso'],
          estrategiasRecomendadas: ['Acompañamiento psicosocial', 'Refuerzo de redes de apoyo'],
          conclusionPronostica: 'Evolución favorable condicionada al fortalecimiento de recursos de afrontamiento.',
        },
        isFallback: false,
      });
    }
  } catch (error: any) {
    console.error('Error generating AI analysis:', error);
    // If Gemini API fails, fallback cleanly to manual psychometric rules
    const fallbackReport = generateManualPsychometricReport(req.body);
    return res.json({
      analysis: fallbackReport,
      isFallback: true,
      errorNotice: error.message || 'El análisis se generó mediante el motor de reglas psicométricas estándar.',
    });
  }
});

// Helper for normative interpretation when offline/no-key
function generateManualPsychometricReport(data: any) {
  const { participant, scores, itemResponses, reportType } = data;
  const { totalScore, totalLevel, resilienceScore, resilienceLevel, copingScore, copingLevel } = scores || {
    totalScore: 50,
    totalLevel: 'Moderado',
    resilienceScore: 25,
    resilienceLevel: 'Moderado',
    copingScore: 25,
    copingLevel: 'Moderado',
  };

  const name = participant?.fullName || 'el/la participante';

  const fortalezas: string[] = [];
  const riesgos: string[] = [];

  if (Array.isArray(itemResponses)) {
    itemResponses.forEach((it: any) => {
      if (it.scoredValue >= 4) {
        fortalezas.push(`Ítem ${it.id}: ${it.prompt}`);
      } else if (it.scoredValue <= 2) {
        riesgos.push(`Ítem ${it.id}: ${it.prompt} (indicador bajo o riesgo autocrítico)`);
      }
    });
  }

  const defaultFortalezas = fortalezas.slice(0, 4);
  if (defaultFortalezas.length === 0) {
    defaultFortalezas.push('Disposición voluntaria para completar la evaluación reflexiva');
    defaultFortalezas.push('Presencia de habilidades adaptativas en proceso de reactivación');
  }

  const defaultRiesgos = riesgos.slice(0, 3);
  if (defaultRiesgos.length === 0) {
    defaultRiesgos.push('Exposición a estresores residuales propios de experiencias de violencia');
  }

  return {
    resumenEjecutivo: `La evaluación psicométrica de ${name} arroja un puntaje global de ${totalScore}/100, ubicándose en un nivel ${totalLevel}. En la dimensión de Resiliencia se registra un nivel ${resilienceLevel} (${resilienceScore}/50), mientras que en Afrontamiento se evidencia un nivel ${copingLevel} (${copingScore}/50).`,
    analisisResiliencia:
      resilienceLevel === 'Alto'
        ? 'Presenta una destacada capacidad de adaptación, fortaleza emocional, resignificación del dolor y esperanza en la reconstrucción del proyecto de vida personal.'
        : resilienceLevel === 'Moderado'
        ? 'Evidencia una aceptación parcial de los hechos traumáticos vividos, con signos evidentes de adaptación aunque con fluctuaciones ante situaciones de alto estrés.'
        : 'Manifiesta dificultades para sostener la esperanza y el sentido de superación, reflejando un impacto emocional activo que amerita soporte especializado.',
    analisisAfrontamiento:
      copingLevel === 'Alto'
        ? 'Aplica estrategias predominantemente activas, búsqueda de apoyo en redes sociales o profesionales, apoyo espiritual y asunción de control sobre las variables modificables.'
        : copingLevel === 'Moderado'
        ? 'Utiliza de forma irregular recursos de apoyo o distracción. Podrían existir episodios de evitación o contención emocional no procesada.'
        : 'Predominio de estrategias evitativas, rumiación o sentimientos de culpa/represión emocional que interfieren con la recuperación funcional.',
    fortalezasIdentificadas: defaultFortalezas,
    areasDeRiesgoVulnerabilidad: defaultRiesgos,
    estrategiasRecomendadas: [
      'Fortalecimiento de la red de apoyo social y familiar mediante espacios seguros de diálogo.',
      'Entrenamiento en técnicas de regulación emocional y atención al momento presente (mindfulness).',
      'Desarrollo de reestructuración cognitiva para mitigar la autoinculpación y la hipervigilancia.',
      'Participación en actividades significativas comunitarias y proyectos con propósito.',
      'Seguimiento profesional psicológico para consolidar el proceso de resiliencia.',
    ],
    conclusionPronostica: `Perfil con pronóstico ${
      totalLevel === 'Alto' ? 'favorable' : totalLevel === 'Moderado' ? 'favorable con acompañamiento puntual' : 'reservado requiriendo intervención psicosocial'
    }, con oportunidades claras para afianzar mecanismos de resiliencia y afrontamiento adaptativo.`,
  };
}

// Dev server or Production static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
