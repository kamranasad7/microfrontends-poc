import { lazy, Suspense, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';

const MfeOnePage = lazy(() => import('mfe_one/Page'));
const MfeTwoPage = lazy(() => import('mfe_two/Page'));

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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, background: '#f8fafc' }}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ padding: 24 }}>
                <h1 style={{ margin: 0 }}>MFE Host</h1>
                <p style={{ color: '#475569' }}>
                  Pick a microfrontend from the sidebar. Each one is a separately deployed Vite app
                  loaded at runtime via Module Federation 2.0.
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
  );
}
