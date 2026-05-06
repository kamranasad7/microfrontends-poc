import { lazy, Suspense } from 'react';

// A/B test: plain React.lazy (compare to /students using MF createLazyComponent)
const QuizzesPage = lazy(() => import('quizzes/Page'));

export default function QuizzesRoute() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: '#64748b' }}>Loading remote…</div>}>
      <QuizzesPage greeting="Greetings from the host —" />
    </Suspense>
  );
}
