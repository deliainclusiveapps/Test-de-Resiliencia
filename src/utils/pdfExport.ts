import { jsPDF } from 'jspdf';
import { AssessmentRecord } from '../types/psychometrics';
import { TEST_ITEMS, calculateItemScore, TEST_METADATA } from '../data/instrumentData';

export function exportAssessmentToPDF(record: AssessmentRecord) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('INFORME PSICOMÉTRICO Y RESULTADO DE ANÁLISIS', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Test de Resiliencia y Afrontamiento ante Violencia Criminal', pageWidth / 2, 18, { align: 'center' });
  doc.text('MSc. Roger Giovanny Alvarado Palma - Validación por Juicio de Expertos', pageWidth / 2, 23, { align: 'center' });

  y = 36;
  doc.setTextColor(15, 23, 42);

  // Participant details card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DATOS DE LA PERSONA EVALUADA', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Nombre: ${record.participant.fullName || 'No especificado'}`, 18, y + 13);
  doc.text(`Edad: ${record.participant.age ? record.participant.age + ' años' : 'N/E'}`, 110, y + 13);
  doc.text(`Género: ${record.participant.gender || 'N/E'}`, 150, y + 13);
  doc.text(`Fecha: ${record.participant.date || record.createdAt.split('T')[0]}`, 18, y + 20);
  if (record.participant.notes) {
    doc.text(`Observaciones: ${record.participant.notes.substring(0, 75)}...`, 110, y + 20);
  }

  y += 32;

  // Scores Summary Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PUNTUACIONES PSICOMÉTRICAS Y NIVELES ALCANZADOS', 14, y);
  y += 5;

  const boxWidth = (pageWidth - 28 - 8) / 3;

  // Box 1: Global
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, boxWidth, 24, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PUNTAJE GLOBAL (20-100)', 14 + boxWidth / 2, y + 6, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${record.scores.totalScore} / 100`, 14 + boxWidth / 2, y + 14, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(record.scores.totalLevel === 'Alto' ? 16 : record.scores.totalLevel === 'Moderado' ? 180 : 220, 100, 40);
  doc.text(`Nivel: ${record.scores.totalLevel}`, 14 + boxWidth / 2, y + 20, { align: 'center' });

  // Box 2: Resilience
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(14 + boxWidth + 4, y, boxWidth, 24, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('RESILIENCIA (10-50)', 14 + boxWidth + 4 + boxWidth / 2, y + 6, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${record.scores.resilienceScore} / 50`, 14 + boxWidth + 4 + boxWidth / 2, y + 14, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(49, 46, 129);
  doc.text(`Nivel: ${record.scores.resilienceLevel}`, 14 + boxWidth + 4 + boxWidth / 2, y + 20, { align: 'center' });

  // Box 3: Coping
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(14 + (boxWidth + 4) * 2, y, boxWidth, 24, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text('AFRONTAMIENTO (10-50)', 14 + (boxWidth + 4) * 2 + boxWidth / 2, y + 6, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${record.scores.copingScore} / 50`, 14 + (boxWidth + 4) * 2 + boxWidth / 2, y + 14, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70);
  doc.text(`Nivel: ${record.scores.copingLevel}`, 14 + (boxWidth + 4) * 2 + boxWidth / 2, y + 20, { align: 'center' });

  y += 30;

  // AI Analysis Section
  if (record.analysis) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('ANÁLISIS CLÍNICO Y PSICOMÉTRICO (INTELIGENCIA ARTIFICIAL)', 14, y);
    y += 5;

    // Resumen Ejecutivo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('Resumen Diagnóstico:', 14, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const splitResumen = doc.splitTextToSize(record.analysis.resumenEjecutivo, pageWidth - 28);
    doc.text(splitResumen, 14, y);
    y += splitResumen.length * 4 + 3;

    // Dimensión Resiliencia
    doc.setFont('helvetica', 'bold');
    doc.text('Evaluación de la Dimensión Resiliencia:', 14, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    const splitR = doc.splitTextToSize(record.analysis.analisisResiliencia, pageWidth - 28);
    doc.text(splitR, 14, y);
    y += splitR.length * 4 + 3;

    // Dimensión Afrontamiento
    doc.setFont('helvetica', 'bold');
    doc.text('Evaluación de la Dimensión Afrontamiento:', 14, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    const splitA = doc.splitTextToSize(record.analysis.analisisAfrontamiento, pageWidth - 28);
    doc.text(splitA, 14, y);
    y += splitA.length * 4 + 3;

    // Fortalezas
    if (record.analysis.fortalezasIdentificadas && record.analysis.fortalezasIdentificadas.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Fortalezas y Factores Protectores:', 14, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      record.analysis.fortalezasIdentificadas.slice(0, 3).forEach((f) => {
        const splitF = doc.splitTextToSize(`• ${f}`, pageWidth - 32);
        doc.text(splitF, 18, y);
        y += splitF.length * 3.8;
      });
      y += 2;
    }

    // Recomendaciones
    if (record.analysis.estrategiasRecomendadas && record.analysis.estrategiasRecomendadas.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendaciones de Acompañamiento y Fortalecimiento:', 14, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      record.analysis.estrategiasRecomendadas.slice(0, 3).forEach((r) => {
        const splitRec = doc.splitTextToSize(`• ${r}`, pageWidth - 32);
        doc.text(splitRec, 18, y);
        y += splitRec.length * 3.8;
      });
      y += 2;
    }
  }

  // Page 2: Detailed Items Response Table (Pages 7 and 8 of the original instrument)
  doc.addPage();
  y = 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('DESGLOSE DE RESPUESTAS A LAS TABLAS DEL INSTRUMENTO (PÁG. 7 Y 8)', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Escala Likert: 1=Totalmente en desacuerdo, 2=En desacuerdo, 3=Neutral, 4=De acuerdo, 5=Totalmente de acuerdo', 14, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Nº', 16, y + 5);
  doc.text('Ítem', 24, y + 5);
  doc.text('Dim.', 140, y + 5);
  doc.text('Resp.', 155, y + 5);
  doc.text('Ptos.', 175, y + 5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  TEST_ITEMS.forEach((item, index) => {
    const rawVal = record.responses[item.id] || 3;
    const scoredVal = calculateItemScore(item.id, rawVal);

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 3, pageWidth - 28, 6.5, 'F');
    }

    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.id.toString(), 16, y + 1.5);

    const itemText = item.isInverse ? `${item.prompt} (inversa)` : item.prompt;
    const splitPrompt = doc.splitTextToSize(itemText, 112);
    doc.text(splitPrompt[0], 24, y + 1.5);

    doc.text(item.dimension, 142, y + 1.5);
    doc.text(`${rawVal}/5`, 157, y + 1.5);
    doc.text(`${scoredVal} pts`, 175, y + 1.5);

    y += 6.5;
  });

  // Footer validation stamp
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 28, y);
  y += 6;

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Instrumento validado por: ${TEST_METADATA.expertJudge.name}`, 14, y);
  doc.text(`Institución: ${TEST_METADATA.expertJudge.institution}`, 14, y + 4);
  doc.text(`Criterio de Validación de Contenido: Claridad (4/4), Coherencia (4/4), Relevancia (4/4)`, 14, y + 8);

  const fileName = `Informe_Resiliencia_Afrontamiento_${(record.participant.fullName || 'Evaluado').replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
