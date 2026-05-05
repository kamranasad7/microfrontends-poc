import Header from '../Header';

export default function StandalonePreview() {
  return (
    <Header
      appName="Header (standalone)"
      user={{ name: 'Kamran', avatarColor: '#7c3aed' }}
      accentColor="#0f172a"
      onLogout={() => alert('Logout clicked')}
    />
  );
}
