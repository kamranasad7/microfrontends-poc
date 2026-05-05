export interface PageProps {
  greeting?: string;
}

interface Quiz {
  id: number;
  title: string;
  topic: string;
  questions: number;
  durationMin: number;
}

const quizzes: Quiz[] = [
  { id: 1, title: 'Quiz 1', topic: 'Algebra Basics', questions: 12, durationMin: 15 },
  { id: 2, title: 'Quiz 2', topic: 'World Geography', questions: 20, durationMin: 25 },
  { id: 3, title: 'Quiz 3', topic: 'JavaScript Fundamentals', questions: 15, durationMin: 20 },
  { id: 4, title: 'Quiz 4', topic: 'Biology 101', questions: 10, durationMin: 12 },
  { id: 5, title: 'Quiz 5', topic: 'Modern History', questions: 18, durationMin: 22 },
  { id: 6, title: 'Quiz 6', topic: 'Chemistry Essentials', questions: 14, durationMin: 18 },
];

export default function Page({ greeting = 'Hello from' }: PageProps) {
  return (
    <section style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ margin: 0, color: '#2563eb' }}>{greeting} MFE One</h1>
      <p style={{ marginTop: 8, color: '#475569' }}>
        This component is exposed by <code>mfe-one</code> and federated into the host at runtime.
      </p>

      <div
        style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {quizzes.map((quiz) => (
          <article
            key={quiz.id}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: 16,
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
              cursor: 'pointer',
              transition: 'transform 120ms, box-shadow 120ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.04)';
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              Q{quiz.id}
            </div>
            <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>{quiz.title}</h3>
            <div style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>{quiz.topic}</div>
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                gap: 12,
                fontSize: 12,
                color: '#475569',
              }}
            >
              <span>{quiz.questions} questions</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span>{quiz.durationMin} min</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
