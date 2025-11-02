import type { FormEvent } from 'react';
import { useState } from 'react';

import { useAuth } from '../auth/AuthContext';

export function TwoFactorForm() {
  const { verifyTotp, factorRequired, requestSmsCode } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyTotp(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '1.25rem', padding: '2rem' }}>
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Verifica tu identidad</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Introduce el código generado por tu app TOTP {factorRequired === 'sms' ? 'o el SMS enviado a tu dispositivo.' : '.'}
        </p>
      </header>
      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span>Código de 6 dígitos</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, ''))}
          style={{
            letterSpacing: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: 'inherit',
            fontSize: '1.5rem',
            textAlign: 'center',
          }}
        />
      </label>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Verificando…' : 'Confirmar acceso'}
        </button>
        <button
          type="button"
          onClick={() => requestSmsCode()}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.24)',
            background: 'transparent',
            color: 'inherit',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Enviar código por SMS
        </button>
      </div>
      {error && (
        <div style={{ background: 'rgba(255, 87, 87, 0.18)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ff8a80' }}>
          {error}
        </div>
      )}
    </form>
  );
}
