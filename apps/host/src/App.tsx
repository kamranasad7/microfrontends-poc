import { lazy, Suspense, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import SvelteIsland from './SvelteIsland';

const QuizzesPage = lazy(() => import('quizzes/Page'));
const StudentsPage = lazy(() => import('students/Page'));
const HeaderMfe = lazy(() => import('header/Header'));

const loadSettings = () => import('settings/App');

function RemoteFrame({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={<div style={{ padding: 24, color: '#64748b' }}>Loading remote…</div>}
    >
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Suspense fallback={<div style={{ height: 56, background: '#0f172a' }} />}>
        <HeaderMfe
          appName="JuiceMind Quizzes"
          user={{ name: 'Kamran', avatarColor: '#7c3aed' }}
          accentColor="#0f172a"
          onLogout={() => alert('Host received logout from header MFE')}
        />
      </Suspense>

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, background: '#f8fafc' }}>
          <Routes>
            <Route
              path="/"
              element={
                <div style={{ padding: 24 }}>
                  <h1 style={{ margin: 0 }}>JuiceMind Quizzes</h1>
                  <p style={{ color: '#475569' }}>
                    Pick a microfrontend from the sidebar. The header above is also a federated
                    component (header MFE) — it stays mounted across navigation so its notification
                    state survives route changes. Settings is a Svelte MFE federated into this React
                    host via a small adapter.
                  </p>
                </div>
              }
            />
            <Route
              path="/quizzes"
              element={
                <RemoteFrame>
                  <QuizzesPage greeting="Greetings from the host —" />
                </RemoteFrame>
              }
            />
            <Route
              path="/students"
              element={
                <RemoteFrame>
                  <StudentsPage initialCount={5} />
                </RemoteFrame>
              }
            />
            <Route
              path="/settings"
              element={
                <SvelteIsland
                  load={loadSettings}
                  props={{
                    userName: 'Kamran',
                    userEmail: 'kamran@juicemind.app',
                    onSave: (data) => {
                      alert(`Host received settings save:\n${JSON.stringify(data, null, 2)}`);
                    },
                  }}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
