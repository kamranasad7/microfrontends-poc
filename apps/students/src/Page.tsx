import { useState } from 'react';

export interface PageProps {
  initialCount?: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
}

const students: Student[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@school.edu', grade: '10A' },
  { id: 2, name: 'Bob Smith', email: 'bob@school.edu', grade: '10B' },
  { id: 3, name: 'Carol Williams', email: 'carol@school.edu', grade: '11A' },
  { id: 4, name: 'David Brown', email: 'david@school.edu', grade: '9C' },
  { id: 5, name: 'Eve Davis', email: 'eve@school.edu', grade: '12A' },
  { id: 6, name: 'Frank Miller', email: 'frank@school.edu', grade: '10A' },
  { id: 7, name: 'Grace Wilson', email: 'grace@school.edu', grade: '11B' },
];

const avatarColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7'];

export default function Page({ initialCount = 0 }: PageProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <section style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ margin: 0, color: '#16a34a' }}>Hello from MFE Two</h1>
      <p style={{ marginTop: 8, color: '#475569' }}>
        This one has its own state to prove the federated component is fully interactive, not a snapshot.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        style={{
          marginTop: 12,
          padding: '8px 16px',
          background: '#16a34a',
          color: 'white',
          border: 0,
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Clicked {count} times
      </button>

      <ul
        style={{
          marginTop: 24,
          listStyle: 'none',
          padding: 0,
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          overflow: 'hidden',
          maxWidth: 640,
        }}
      >
        {students.map((s, i) => (
          <li
            key={s.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 16px',
              borderBottom: i === students.length - 1 ? 'none' : '1px solid #f1f5f9',
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: avatarColors[i % avatarColors.length],
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {s.name
                .split(' ')
                .map((n) => n.charAt(0))
                .join('')}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.email}</div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                background: '#f1f5f9',
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              {s.grade}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
