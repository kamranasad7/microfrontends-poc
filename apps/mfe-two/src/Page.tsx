import { useState } from 'react';

export interface PageProps {
  initialCount?: number;
}

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
    </section>
  );
}
