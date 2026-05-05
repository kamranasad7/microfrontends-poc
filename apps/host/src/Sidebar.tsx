import { NavLink } from 'react-router-dom';

const linkBase: React.CSSProperties = {
  display: 'block',
  padding: '10px 14px',
  borderRadius: 6,
  textDecoration: 'none',
  color: '#e2e8f0',
  marginBottom: 4,
};

const linkActive: React.CSSProperties = {
  ...linkBase,
  background: '#334155',
  color: 'white',
};

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        background: '#0f172a',
        color: '#e2e8f0',
        padding: 16,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>JuiceMind Quizzes</div>
      <nav>
        <NavLink to="/" end style={({ isActive }) => (isActive ? linkActive : linkBase)}>
          Home
        </NavLink>
        <NavLink to="/quizzes" style={({ isActive }) => (isActive ? linkActive : linkBase)}>
          Quizzes
        </NavLink>
        <NavLink to="/students" style={({ isActive }) => (isActive ? linkActive : linkBase)}>
          Students
        </NavLink>
        <NavLink to="/settings" style={({ isActive }) => (isActive ? linkActive : linkBase)}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
