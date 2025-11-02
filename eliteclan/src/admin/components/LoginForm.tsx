import type { FormEvent } from 'react';
import { useState } from 'react';

import { useAuth } from '../auth/AuthContext';

export function LoginForm() {
  const { login, status, factorRequired } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '1.25rem', padding: '2rem' }}>
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Acceso administrativo</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Inicia sesión con tu correo corporativo y contraseña. Se solicitará un segundo factor de autenticación.
        </p>
      </header>
      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span>Email</span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: 'inherit',
          }}
        />
      </label>
      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span>Contraseña</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: 'inherit',
          }}
        />
      </label>
      {error && (
        <div style={{ background: 'rgba(255, 87, 87, 0.18)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ff8a80' }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.85rem 1rem',
          borderRadius: '0.75rem',
          border: 'none',
          background: 'linear-gradient(135deg, #a855f7, #6366f1)',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Validando…' : status === 'challenge' || factorRequired ? 'Continuar con MFA' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
