import { lazy, Suspense } from 'react';

const StudentsPage = lazy(() => import('students/Page'));

export default function StudentsRoute() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: '#64748b' }}>Loading remote…</div>}>
      <StudentsPage initialCount={5} />
    </Suspense>
  );
}
