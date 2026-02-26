import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Moon, Sun, LogOut, Shield, Bell, ChevronRight,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* ── Profile Card ── */}
      <div className="detail-hero anim-scale" style={{ textAlign: 'center', marginBottom: 28 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--accent-gradient-vivid)',
              color: '#fff', fontSize: 32, fontWeight: 700,
              fontFamily: 'var(--font-display)',
              boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.2), 0 8px 32px rgba(124, 58, 237, 0.2)',
            }}
          >
            {initial}
          </div>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 2 }}>
          {user?.name}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Mail size={14} /> {user?.email}
        </p>
      </div>

      {/* ── Settings ── */}
      <div className="anim-fade-up" style={{ animationDelay: '100ms' }}>
        <h3 className="section-title" style={{ marginBottom: 14, fontSize: 16 }}>Preferences</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {/* Theme toggle */}
          <div className="settings-row" onClick={toggleTheme}>
            <div className="icon-box-sm" style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}>
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Appearance</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
            </div>
            <div
              style={{
                width: 42, height: 24, borderRadius: 12,
                background: theme === 'dark' ? 'var(--accent)' : 'var(--border)',
                padding: 3, cursor: 'pointer', transition: 'background 0.25s',
                display: 'flex', alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#fff',
                  transform: theme === 'dark' ? 'translateX(18px)' : 'translateX(0)',
                  transition: 'transform 0.25s var(--ease-bounce)',
                  boxShadow: '0 1px 3px rgba(0,0,0,.3)',
                }}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-row">
            <div className="icon-box-sm" style={{ background: 'rgba(59,130,246,.1)', color: 'var(--blue)' }}>
              <Bell size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Notifications</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Manage notification preferences</p>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Security */}
          <div className="settings-row">
            <div className="icon-box-sm" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--success)' }}>
              <Shield size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Security</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Password & account security</p>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="anim-fade-up" style={{ animationDelay: '200ms' }}>
        <h3 className="section-title" style={{ marginBottom: 14, fontSize: 16, color: 'var(--danger)' }}>Danger Zone</h3>
        <div
          className="settings-row"
          onClick={handleLogout}
          style={{ borderColor: 'rgba(239,68,68,.15)' }}
        >
          <div className="icon-box-sm" style={{ background: 'var(--danger-glow)', color: 'var(--danger)' }}>
            <LogOut size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--danger)' }}>Sign Out</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Log out of your account</p>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
