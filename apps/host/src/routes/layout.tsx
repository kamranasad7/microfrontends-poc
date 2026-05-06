import { Outlet } from '@modern-js/runtime/router';
import { instance } from '../mf-runtime';
import Sidebar from '../Sidebar';

const HeaderMfe = instance!.createLazyComponent({
  loader: () => import('header/Header'),
  loading: <div style={{ height: 56, background: '#0f172a', flexShrink: 0 }} />,
  export: 'default',
  fallback: () => <div style={{ height: 56, background: '#0f172a', flexShrink: 0 }} />,
});

export default function Layout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <HeaderMfe
        appName="JuiceMind Quizzes"
        user={{ name: 'Kamran', avatarColor: '#7c3aed' }}
        accentColor="#0f172a"
        onLogout={() => alert('Host received logout from header MFE')}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar />
        <main style={{ flex: 1, background: '#f8fafc', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
