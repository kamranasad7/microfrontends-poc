import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header
      appName="MFE Three (standalone)"
      user={{ name: 'Kamran', avatarColor: '#7c3aed' }}
      accentColor="#0f172a"
      onLogout={() => alert('Logout clicked')}
    />
  </StrictMode>,
);
