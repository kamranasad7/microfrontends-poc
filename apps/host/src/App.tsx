import { lazy, Suspense, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';

const MfeOnePage = lazy(() => import('mfe_one/Page'));
const MfeTwoPage = lazy(() => import('mfe_two/Page'));
const MfeThreeHeader = lazy(() => import('mfe_three/Header'));

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
        <MfeThreeHeader
          appName="MFE Host"
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
                  <h1 style={{ margin: 0 }}>MFE Host</h1>
                  <p style={{ color: '#475569' }}>
                    Pick a microfrontend from the sidebar. The header above is also a federated
                    component (mfe-three) — it stays mounted across navigation so its notification
                    state survives route changes.
                  </p>
                </div>
              }
            />
            <Route
              path="/one"
              element={
                <RemoteFrame>
                  <MfeOnePage greeting="Greetings from the host —" />
                </RemoteFrame>
              }
            />
            <Route
              path="/two"
              element={
                <RemoteFrame>
                  <MfeTwoPage initialCount={5} />
                </RemoteFrame>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
