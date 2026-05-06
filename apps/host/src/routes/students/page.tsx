import { instance } from '../../mf-runtime';

const StudentsPage = instance!.createLazyComponent({
  loader: () => import('students/Page'),
  loading: <div style={{ padding: 24, color: '#64748b' }}>Loading remote…</div>,
  export: 'default',
  fallback: () => <div style={{ padding: 24, color: '#dc2626' }}>Failed to load students MFE</div>,
});

export default function StudentsRoute() {
  return <StudentsPage initialCount={5} />;
}
