import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Bell, ChevronRight, LogOut, Moon, Sun, UserCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initialTheme = useMemo(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  }, []);

  const [theme, setTheme] = useState(initialTheme);
  const [renewalReminders, setRenewalReminders] = useState(true);

  const setAndPersistTheme = (next) => {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarLetter = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Account & preferences</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-coral))', color: 'white' }}
          >
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'Your account'}
            </p>
            <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
            <UserCircle2 size={16} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Logged in</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Preferences</h2>

        <button
          type="button"
          onClick={() => setAndPersistTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-between p-4 rounded-xl cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon size={18} style={{ color: 'var(--accent-orange)' }} />
            ) : (
              <Sun size={18} style={{ color: 'var(--yellow)' }} />
            )}
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </p>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </button>

        <div
          className="w-full flex items-center justify-between p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <Bell size={18} style={{ color: 'var(--accent-blue)' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Renewal reminders</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>In-app toggle (push coming later)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRenewalReminders((v) => !v)}
            className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            style={{
              background: renewalReminders ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
              color: renewalReminders ? 'var(--green)' : 'var(--text-secondary)',
              border: `1px solid ${renewalReminders ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
            }}
          >
            {renewalReminders ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div className="glass-card p-6 space-y-3">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Quick links</h2>

        <Link
          to="/activity"
          className="w-full flex items-center justify-between p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Activity feed</span>
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </Link>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold cursor-pointer"
        style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.25)' }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default Profile;

