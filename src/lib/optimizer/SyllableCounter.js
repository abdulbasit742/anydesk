// SyllableCounter.js — Vowel-counting algorithm for Flesch-Kincaid syllable parsing
const VOWELS = /[aeiouy]/gi;
const SILENT_E = /(?:[^laeiouy]es|ed|[^laeiouy]e)$/i;
const LEADING_Y = /^y/i;
const DIPHTHONGS = /[aeiouy]{2,}/g;

export function countSyllables(word) {
  if (!word) return 0;
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word.length) return 0;
  if (word.length <= 3) return 1;

  let modified = word.replace(SILENT_E, '');
  modified = modified.replace(LEADING_Y, '');

  const matches = modified.match(VOWELS);
  const count = matches ? matches.length : 1;

  // Adjust for diphthongs (counted as 1 syllable)
  const diphthongMatches = modified.match(DIPHTHONGS);
  const diphthongAdjust = diphthongMatches ? diphthongMatches.reduce((acc, m) => acc + m.length - 1, 0) : 0;

  return Math.max(1, count - diphthongAdjust);
}

export function countSyllablesInText(text) {
  const words = text.match(/[a-zA-Z]+/g) || [];
  return words.reduce((acc, w) => acc + countSyllables(w), 0);
}

export function countWords(text) {
  return (text.match(/\S+/g) || []).length;
}

export function countSentences(text) {
  return (text.split(/[.!?]+/).filter(s => s.trim().length > 0)).length;
}

export function getTextStats(text) {
  return {
    words: countWords(text),
    sentences: countSentences(text),
    syllables: countSyllablesInText(text),
    characters: text.length,
    paragraphs: text.split(/\n\n+/).filter(p => p.trim()).length,
  };
}
