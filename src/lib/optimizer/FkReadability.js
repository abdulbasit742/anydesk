// FkReadability.js — Analyzes prompts for Flesch-Kincaid Ease readability indices
import { countSyllablesInText, countWords, countSentences } from './SyllableCounter.js';

export function computeFleschEase(text) {
  const words = countWords(text);
  const sentences = countSentences(text);
  const syllables = countSyllablesInText(text);

  if (!words || !sentences) return 0;

  const ease = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(ease * 10) / 10));
}

export function computeFleschGrade(text) {
  const words = countWords(text);
  const sentences = countSentences(text);
  const syllables = countSyllablesInText(text);

  if (!words || !sentences) return 0;

  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return Math.max(0, Math.round(grade * 10) / 10);
}

export function classifyReadability(ease) {
  if (ease >= 90) return { level: 'Very Easy', audience: '5th grade', label: 'Simple' };
  if (ease >= 80) return { level: 'Easy', audience: '6th grade', label: 'Simple' };
  if (ease >= 70) return { level: 'Fairly Easy', audience: '7th grade', label: 'Standard' };
  if (ease >= 60) return { level: 'Standard', audience: '8th-9th grade', label: 'Standard' };
  if (ease >= 50) return { level: 'Fairly Difficult', audience: '10th-12th grade', label: 'Technical' };
  if (ease >= 30) return { level: 'Difficult', audience: 'College', label: 'Technical' };
  return { level: 'Very Difficult', audience: 'Professional', label: 'Technical' };
}

export function analyzeReadability(text) {
  const ease = computeFleschEase(text);
  const grade = computeFleschGrade(text);
  const classification = classifyReadability(ease);

  return { ease, grade, ...classification, words: countWords(text), sentences: countSentences(text), syllables: countSyllablesInText(text) };
}
