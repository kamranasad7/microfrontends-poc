import { useEffect, useRef, useState } from 'react';

export interface HeaderUser {
  name: string;
  avatarColor?: string;
}

export interface HeaderProps {
  appName: string;
  user: HeaderUser;
  accentColor?: string;
  onLogout?: () => void;
}

interface Notification {
  id: string;
  text: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', text: 'New comment on your PR', read: false },
  { id: '2', text: 'Build #482 succeeded', read: false },
  { id: '3', text: 'You were mentioned in #general', read: false },
  { id: '4', text: 'Weekly report is ready', read: true },
];

export default function Header({
  appName,
  user,
  accentColor = '#0f172a',
  onLogout,
}: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [openPanel, setOpenPanel] = useState<'none' | 'notifications' | 'user'>('none');
  const rootRef = useRef<HTMLElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (openPanel === 'none') return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenPanel('none');
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openPanel]);

  return (
    <header
      ref={rootRef}
      style={{
        background: accentColor,
        color: 'white',
        padding: '0 20px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          }}
        />
        <strong style={{ fontSize: 16, letterSpacing: 0.2 }}>{appName}</strong>
        <span style={{ opacity: 0.5, fontSize: 12, marginLeft: 8 }}>
          header rendered by mfe-three
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={() =>
            setOpenPanel((p) => (p === 'notifications' ? 'none' : 'notifications'))
          }
          aria-label="Notifications"
          style={{
            position: 'relative',
            background: 'transparent',
            border: 0,
            color: 'white',
            cursor: 'pointer',
            fontSize: 20,
            padding: 8,
            borderRadius: 6,
          }}
        >
          🔔
          {unread > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: '#ef4444',
                color: 'white',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 6px',
                lineHeight: 1,
              }}
            >
              {unread}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setOpenPanel((p) => (p === 'user' ? 'none' : 'user'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 0,
            color: 'white',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
          }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: user.avatarColor ?? '#6366f1',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span style={{ fontSize: 14 }}>{user.name}</span>
        </button>
      </div>

      {openPanel === 'notifications' && (
        <Panel right={88}>
          <PanelHeader>
            <span>Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() =>
                  setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))
                }
                style={panelLinkStyle}
              >
                Mark all read
              </button>
            )}
          </PanelHeader>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 280, overflowY: 'auto' }}>
            {notifications.map((n) => (
              <li
                key={n.id}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: n.read ? 'white' : '#f8fafc',
                  fontSize: 13,
                  color: '#0f172a',
                }}
              >
                {!n.read && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#3b82f6',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span>{n.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {openPanel === 'user' && (
        <Panel right={20}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Signed in</div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                setOpenPanel('none');
                onLogout();
              }}
              style={{
                ...panelLinkStyle,
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: 0,
                color: '#dc2626',
              }}
            >
              Sign out
            </button>
          )}
        </Panel>
      )}
    </header>
  );
}

function Panel({ right, children }: { right: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        right,
        width: 280,
        background: 'white',
        color: '#0f172a',
        borderRadius: 8,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: '1px solid #f1f5f9',
        fontSize: 13,
        fontWeight: 600,
        color: '#0f172a',
      }}
    >
      {children}
    </div>
  );
}

const panelLinkStyle: React.CSSProperties = {
  background: 'transparent',
  border: 0,
  color: '#3b82f6',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  padding: '4px 6px',
  borderRadius: 4,
};
