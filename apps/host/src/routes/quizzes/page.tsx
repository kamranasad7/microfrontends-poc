import { instance } from '../../mf-runtime';

const QuizzesPage = instance!.createLazyComponent({
  loader: () => import('quizzes/Page'),
  loading: <div style={{ padding: 24, color: '#64748b' }}>Loading remote…</div>,
  export: 'default',
  fallback: () => <div style={{ padding: 24, color: '#dc2626' }}>Failed to load quizzes MFE</div>,
});

export default function QuizzesRoute() {
  return <QuizzesPage greeting="Greetings from the host —" />;
}
