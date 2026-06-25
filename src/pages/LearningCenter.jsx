import { useState } from 'react';

const COURSES = [
  { id: 1, title: 'Getting Started with Bolt Studio', category: 'Beginner', lessons: 8, duration: '1h 20m', progress: 100, xp: 200, icon: '🚀', color: 'var(--teal)', instructor: 'Nova AI' },
  { id: 2, title: 'Prompt Engineering Mastery', category: 'Intermediate', lessons: 12, duration: '2h 45m', progress: 68, xp: 350, icon: '🧠', color: 'var(--purple)', instructor: 'Nova AI' },
  { id: 3, title: 'AI Workflow Automation', category: 'Intermediate', lessons: 10, duration: '2h 10m', progress: 30, xp: 300, icon: '⚙️', color: 'var(--gold)', instructor: 'Nova AI' },
  { id: 4, title: 'Multi-Account Broadcasting', category: 'Advanced', lessons: 6, duration: '1h 30m', progress: 0, xp: 250, icon: '📡', color: 'var(--blue)', instructor: 'Nova AI' },
  { id: 5, title: 'Analytics & Reporting Deep Dive', category: 'Intermediate', lessons: 9, duration: '2h 00m', progress: 0, xp: 280, icon: '📊', color: '#10b981', instructor: 'Nova AI' },
  { id: 6, title: 'Security Best Practices', category: 'Advanced', lessons: 7, duration: '1h 45m', progress: 15, xp: 320, icon: '🔐', color: 'var(--red)', instructor: 'Nova AI' },
  { id: 7, title: 'Team Collaboration Features', category: 'Beginner', lessons: 5, duration: '55m', progress: 100, xp: 150, icon: '👥', color: 'var(--gold)', instructor: 'Nova AI' },
  { id: 8, title: 'API Integration Patterns', category: 'Advanced', lessons: 11, duration: '3h 00m', progress: 0, xp: 400, icon: '🔗', color: 'var(--purple)', instructor: 'Nova AI' },
  { id: 9, title: 'Cost Optimization Strategies', category: 'Intermediate', lessons: 6, duration: '1h 20m', progress: 45, xp: 260, icon: '💰', color: 'var(--teal)', instructor: 'Nova AI' },
  { id: 10, title: 'Custom Dashboards & Widgets', category: 'Advanced', lessons: 8, duration: '2h 15m', progress: 0, xp: 380, icon: '🎨', color: 'var(--blue)', instructor: 'Nova AI' },
  { id: 11, title: 'Deployment & DevOps', category: 'Advanced', lessons: 10, duration: '2h 40m', progress: 0, xp: 420, icon: '🚢', color: '#10b981', instructor: 'Nova AI' },
  { id: 12, title: 'Model Benchmarking & Selection', category: 'Intermediate', lessons: 7, duration: '1h 50m', progress: 80, xp: 290, icon: '🏆', color: 'var(--gold)', instructor: 'Nova AI' },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the primary purpose of the Prompt Builder in Bolt Studio Pro?',
    options: [
      'To browse the internet',
      'To craft, test, and optimize AI prompts before deployment',
      'To manage user accounts',
      'To schedule meetings',
    ],
    correct: 1,
  },
  {
    id: 2,
    question: 'Which CSS variable represents the primary brand gold color?',
    options: ['--brand', '--gold', '--primary', '--accent'],
    correct: 1,
  },
  {
    id: 3,
    question: 'What does "A/B testing" refer to in the context of email campaigns?',
    options: [
      'Testing two different APIs',
      'Running two database versions',
      'Sending two subject line variants to measure performance',
      'Testing on Android and Browser',
    ],
    correct: 2,
  },
];

const BADGES = [
  { id: 1, icon: '🚀', name: 'First Launch', desc: 'Complete your first course', earned: true },
  { id: 2, icon: '🔥', name: 'On Fire', desc: '7-day learning streak', earned: true },
  { id: 3, icon: '🧠', name: 'Prompt Master', desc: 'Complete Prompt Engineering course', earned: false },
  { id: 4, icon: '⚡', name: 'Speed Learner', desc: 'Finish a course in one session', earned: true },
  { id: 5, icon: '🏆', name: 'Top Student', desc: 'Score 100% on any quiz', earned: false },
  { id: 6, icon: '🎯', name: 'Focused', desc: 'Complete 5 lessons without breaks', earned: true },
  { id: 7, icon: '🌟', name: 'All-Rounder', desc: 'Start courses in 3 categories', earned: false },
  { id: 8, icon: '💡', name: 'Innovator', desc: 'Use the Code Playground 10 times', earned: false },
];

const RECENT_LESSONS = [
  { title: 'Introduction to Prompt Variables', course: 'Prompt Engineering Mastery', duration: '12m', thumbnail: '📝' },
  { title: 'Chain-of-Thought Prompting', course: 'Prompt Engineering Mastery', duration: '18m', thumbnail: '🔗' },
  { title: 'Building Your First Workflow', course: 'AI Workflow Automation', duration: '24m', thumbnail: '⚙️' },
  { title: 'Cost Monitoring Basics', course: 'Cost Optimization Strategies', duration: '15m', thumbnail: '💰' },
];

const CODE_EXAMPLES = [
  { label: 'Basic Prompt', code: `const prompt = \`You are an expert ${'{role}'}.\nAnswer the following: ${'{question}'}\`;` },
  { label: 'Chain Prompts', code: `const chain = [\n  { role: 'analyst', task: 'Extract key themes' },\n  { role: 'writer', task: 'Summarize findings' },\n];` },
];

export default function LearningCenter() {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(new Set([1, 7]));
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedCode, setSelectedCode] = useState(0);
  const [codeContent, setCodeContent] = useState(CODE_EXAMPLES[0].code);
  const [expandedCourse, setExpandedCourse] = useState(null);

  const totalXP = COURSES.filter(c => c.progress === 100).reduce((sum, c) => sum + c.xp, 0);
  const completedCount = COURSES.filter(c => c.progress === 100).length;
  const earnedBadges = BADGES.filter(b => b.earned).length;

  const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = COURSES.filter(c => {
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleQuizAnswer = (qId, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const submitQuiz = () => setQuizSubmitted(true);

  const quizScore = quizSubmitted
    ? QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.correct).length
    : 0;

  const tabs = [
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'lessons', label: 'Recent Lessons', icon: '▶️' },
    { id: 'quiz', label: 'Quiz', icon: '🎯' },
    { id: 'progress', label: 'Progress', icon: '📈' },
    { id: 'playground', label: 'Code Playground', icon: '💻' },
    { id: 'badges', label: 'Achievements', icon: '🏅' },
  ];

  return (
    <div style={{ padding: '28px 32px', minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 28 }}>🎓</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>Learning Center</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>Tutorials · Quizzes · Certifications · Code Playground</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(245,183,49,0.1)', border: '1px solid rgba(245,183,49,0.2)', fontSize: 13, color: 'var(--gold)', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
            ⚡ {totalXP} XP
          </div>
          <div style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', fontSize: 12, color: 'var(--teal)' }}>
            🔥 7-day streak
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Courses Enrolled', value: COURSES.length, color: 'var(--blue)' },
          { label: 'Completed', value: completedCount, color: 'var(--teal)' },
          { label: 'Total XP', value: `${totalXP}`, color: 'var(--gold)' },
          { label: 'Badges Earned', value: `${earnedBadges}/${BADGES.length}`, color: 'var(--purple)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 20px', borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)', flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'DM Mono, monospace' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Continue where left off */}
      <div style={{ marginBottom: 24, padding: '16px 20px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(167,139,250,0.04))', border: '1px solid rgba(167,139,250,0.2)' }}>
        <div style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>▶ Continue Where You Left Off</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24 }}>🧠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Prompt Engineering Mastery</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Lesson 5: Few-Shot Prompting Techniques · 68% complete</div>
            <div style={{ marginTop: 8, height: 4, background: 'var(--surface3)', borderRadius: 2 }}>
              <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, var(--purple), #7c3aed)', borderRadius: 2 }} />
            </div>
          </div>
          <button style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: 'var(--purple)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
            Resume →
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 12,
            fontWeight: activeTab === tab.id ? 700 : 400,
            background: activeTab === tab.id ? 'var(--surface2)' : 'transparent',
            color: activeTab === tab.id ? 'var(--teal)' : 'var(--muted)',
            borderBottom: activeTab === tab.id ? '2px solid var(--teal)' : '2px solid transparent',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div>
          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Search courses..."
              style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: '#dde0f0', padding: '8px 14px', fontSize: 12, outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                  padding: '7px 14px', borderRadius: 8, border: `1px solid ${selectedCategory === cat ? 'var(--teal)' : 'var(--border)'}`,
                  background: selectedCategory === cat ? 'rgba(34,211,238,0.1)' : 'var(--surface2)',
                  color: selectedCategory === cat ? 'var(--teal)' : 'var(--muted)', cursor: 'pointer', fontSize: 11,
                }}>{cat}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {filteredCourses.map(course => (
              <div key={course.id} style={{
                borderRadius: 12, border: `1px solid ${expandedCourse === course.id ? course.color : 'var(--border)'}`,
                background: 'var(--surface2)', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer',
              }}
                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
              >
                {/* Header gradient */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${course.color}, transparent)` }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>{course.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{course.title}</div>
                        <div style={{ fontSize: 10, color: course.color, marginTop: 2, fontWeight: 600 }}>{course.category}</div>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); toggleBookmark(course.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: bookmarks.has(course.id) ? 'var(--gold)' : 'var(--muted)' }}
                    >
                      {bookmarks.has(course.id) ? '🔖' : '📑'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--muted)', marginBottom: 10 }}>
                    <span>📺 {course.lessons} lessons</span>
                    <span>⏱ {course.duration}</span>
                    <span>⚡ {course.xp} XP</span>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>Progress</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: course.color }}>{course.progress}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2 }}>
                      <div style={{ width: `${course.progress}%`, height: '100%', background: course.color, borderRadius: 2, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                  {course.progress === 100 && (
                    <div style={{ marginTop: 8, fontSize: 10, color: 'var(--teal)', fontWeight: 700 }}>✓ Completed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT LESSONS TAB */}
      {activeTab === 'lessons' && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Recent Video Lessons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RECENT_LESSONS.map((lesson, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ width: 48, height: 36, background: 'var(--surface3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {lesson.thumbnail}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{lesson.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{lesson.course}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{lesson.duration}</span>
                  <button style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'var(--teal)', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>▶</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Knowledge Check Quiz</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>{QUIZ_QUESTIONS.length} questions · Bolt Studio Pro Fundamentals</div>

          {!quizSubmitted ? (
            <div>
              {QUIZ_QUESTIONS.map((q, qIdx) => (
                <div key={q.id} style={{ marginBottom: 24, padding: '20px', borderRadius: 12, background: 'var(--surface2)', border: `1px solid ${quizStep === qIdx ? 'var(--gold)' : 'var(--border)'}` }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, fontFamily: 'DM Mono, monospace' }}>Q{qIdx + 1} of {QUIZ_QUESTIONS.length}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 14 }}>{q.question}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} onClick={() => { handleQuizAnswer(q.id, oIdx); setQuizStep(qIdx); }}
                        style={{
                          padding: '10px 16px', borderRadius: 8, border: `1px solid ${quizAnswers[q.id] === oIdx ? 'var(--gold)' : 'var(--border)'}`,
                          background: quizAnswers[q.id] === oIdx ? 'rgba(245,183,49,0.1)' : 'var(--surface3)',
                          cursor: 'pointer', fontSize: 12, color: quizAnswers[q.id] === oIdx ? 'var(--gold)' : '#dde0f0',
                          transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                        <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'var(--muted)', minWidth: 16 }}>{String.fromCharCode(65 + oIdx)}</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                style={{
                  padding: '12px 28px', borderRadius: 8, border: 'none',
                  background: Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length ? 'var(--surface3)' : 'var(--gold)',
                  color: Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length ? 'var(--muted)' : '#000',
                  cursor: Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 700,
                }}>
                Submit Quiz ({Object.keys(quizAnswers).length}/{QUIZ_QUESTIONS.length} answered)
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{quizScore === QUIZ_QUESTIONS.length ? '🏆' : quizScore >= 2 ? '🎯' : '📚'}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold)', marginBottom: 8, fontFamily: 'DM Mono, monospace' }}>{quizScore}/{QUIZ_QUESTIONS.length}</div>
              <div style={{ fontSize: 14, color: '#dde0f0', marginBottom: 6 }}>
                {quizScore === QUIZ_QUESTIONS.length ? 'Perfect Score! 🎉' : quizScore >= 2 ? 'Great job! Keep learning.' : 'Keep practicing!'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>+{quizScore * 50} XP earned</div>
              <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setQuizStep(0); }} style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: 'var(--teal)', color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* PROGRESS TAB */}
      {activeTab === 'progress' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ padding: '20px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Course Progress</div>
              {COURSES.slice(0, 6).map(course => (
                <div key={course.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#dde0f0' }}>{course.icon} {course.title.slice(0, 28)}...</span>
                    <span style={{ fontSize: 11, color: course.color, fontWeight: 700 }}>{course.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 3 }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', background: course.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '20px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>XP History (last 7 days)</div>
              <svg width="100%" height="140" viewBox="0 0 300 140">
                {[40, 80, 60, 120, 90, 150, 110].map((v, i) => (
                  <g key={i}>
                    <rect x={i * 40 + 8} y={140 - v} width={28} height={v} rx={4}
                      fill={i === 6 ? 'var(--gold)' : 'rgba(245,183,49,0.3)'} />
                    <text x={i * 40 + 22} y={135} textAnchor="middle" fill="var(--muted)" fontSize="8">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </text>
                    <text x={i * 40 + 22} y={140 - v - 4} textAnchor="middle" fill="var(--gold)" fontSize="8" fontWeight="700">
                      {v}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* CODE PLAYGROUND TAB */}
      {activeTab === 'playground' && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Examples</div>
            {CODE_EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setSelectedCode(i); setCodeContent(ex.code); }} style={{
                display: 'block', width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${selectedCode === i ? 'var(--teal)' : 'var(--border)'}`,
                background: selectedCode === i ? 'rgba(34,211,238,0.08)' : 'var(--surface2)', color: selectedCode === i ? 'var(--teal)' : '#dde0f0',
                cursor: 'pointer', fontSize: 11, textAlign: 'left', marginBottom: 6,
              }}>{ex.label}</button>
            ))}
          </div>
          <div>
            <div style={{ background: '#0d1117', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', background: 'var(--surface3)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal)' }} />
                <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--muted)' }}>playground.js</span>
              </div>
              <textarea
                value={codeContent}
                onChange={e => setCodeContent(e.target.value)}
                style={{
                  width: '100%', minHeight: 220, background: 'transparent', border: 'none', outline: 'none',
                  color: '#7dd3fc', fontFamily: 'DM Mono, monospace', fontSize: 12, padding: '14px 16px',
                  resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--teal)', color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>▶ Run</button>
              <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}>🔄 Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* BADGES TAB */}
      {activeTab === 'badges' && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Achievement Badges</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>{earnedBadges} of {BADGES.length} unlocked</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {BADGES.map(badge => (
              <div key={badge.id} style={{
                padding: '20px', borderRadius: 12, border: `1px solid ${badge.earned ? 'var(--gold)' : 'var(--border)'}`,
                background: badge.earned ? 'rgba(245,183,49,0.06)' : 'var(--surface2)',
                textAlign: 'center', opacity: badge.earned ? 1 : 0.5, transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8, filter: badge.earned ? 'none' : 'grayscale(1)' }}>{badge.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: badge.earned ? 'var(--gold)' : '#dde0f0', marginBottom: 4 }}>{badge.name}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{badge.desc}</div>
                {badge.earned && <div style={{ marginTop: 6, fontSize: 9, color: 'var(--teal)', fontWeight: 700 }}>✓ EARNED</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
