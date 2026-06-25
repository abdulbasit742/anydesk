// MetricsAggregator.js — Computes Flesch-Kincaid averages and project completion rates
export function computeFleschKincaid(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);

  if (!sentences.length || !words.length) return { ease: 0, grade: 0 };

  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  const ease = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  const grade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;

  return {
    ease: Math.max(0, Math.min(100, Math.round(ease * 10) / 10)),
    grade: Math.max(0, Math.round(grade * 10) / 10),
    words: words.length,
    sentences: sentences.length,
    syllables,
  };
}

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word.length) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function computeCompletionRate(tasks) {
  if (!tasks?.length) return 0;
  const done = tasks.filter(t => t.status === 'done' || t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

export function aggregateProjectMetrics(projects) {
  return projects.map(p => ({
    id: p.id,
    name: p.name,
    completionRate: computeCompletionRate(p.tasks || []),
    fkScore: p.description ? computeFleschKincaid(p.description) : null,
    taskCount: (p.tasks || []).length,
    lastUpdated: p.updatedAt || null,
  }));
}

export function getTopPerformers(projects, limit = 5) {
  return aggregateProjectMetrics(projects)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, limit);
}
