import { authenticator } from 'otplib';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getSupabaseClient, isSupabaseConfigured, type Role } from '../../services/api';
import type { AuthTokens } from '../../services/api';
import type { Session, User } from '@supabase/supabase-js';
import { clearTokens, restorePersistedSession, saveTokens } from './tokenStorage';

type AuthStatus = 'loading' | 'unauthenticated' | 'challenge' | 'authenticated';

type Factor = 'totp' | 'sms';

type PendingChallenge = {
  factor: Factor;
  user: User | null;
  session: Session | null;
  totpSecret?: string;
};

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  role: Role;
  session: Session | null;
  factorRequired?: Factor;
  login: (email: string, password: string) => Promise<void>;
  verifyTotp: (code: string) => Promise<void>;
  requestSmsCode: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const fallbackCredentials = {
  email: import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@eliteclan.io',
  password: import.meta.env.VITE_ADMIN_PASSWORD ?? 'EliteClan#2024',
  role: (import.meta.env.VITE_ADMIN_ROLE ?? 'Admin') as Role,
  totpSecret: import.meta.env.VITE_ADMIN_TOTP_SECRET ?? authenticator.generateSecret(),
};

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>('Editor');
  const [pending, setPending] = useState<PendingChallenge | null>(null);

  const persistSession = useCallback(async (sessionToPersist: Session | null) => {
    if (!sessionToPersist) return;
    if (!sessionToPersist.refresh_token) return;
    const tokens: AuthTokens = {
      accessToken: sessionToPersist.access_token,
      refreshToken: sessionToPersist.refresh_token,
      session: sessionToPersist,
    };
    await saveTokens(tokens);
  }, []);

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured) {
        setStatus('unauthenticated');
        return;
      }

      const restored = await restorePersistedSession();
      if (restored?.user) {
        setSession(restored);
        setUser(restored.user);
        setRole(((restored.user.app_metadata?.role as Role | undefined) ?? 'Editor') as Role);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    })();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error || !data?.user) {
          throw error ?? new Error('Credenciales inválidas');
        }

        const authRole = ((data.user.app_metadata?.role as Role | undefined) ?? 'Editor') as Role;

        if (data.user.user_metadata?.mfa_enabled) {
          setPending({
            factor: 'totp',
            user: data.user,
            session: data.session,
            totpSecret: data.user.user_metadata?.totp_secret,
          });
          setStatus('challenge');
          return;
        }

        setUser(data.user);
        setSession(data.session);
        setRole(authRole);
        await persistSession(data.session);
        setStatus('authenticated');
        return;
      }

      if (email !== fallbackCredentials.email || password !== fallbackCredentials.password) {
        throw new Error('Credenciales inválidas');
      }

      setPending({
        factor: 'totp',
        user: null,
        session: null,
        totpSecret: fallbackCredentials.totpSecret,
      });
      setRole(fallbackCredentials.role);
      setStatus('challenge');
    },
    [persistSession],
  );

  const verifyTotp = useCallback(
    async (code: string) => {
      if (!pending) throw new Error('No hay desafío activo');
      const secret = pending.totpSecret ?? fallbackCredentials.totpSecret;
      if (!secret) throw new Error('No hay secreto de TOTP configurado');

      const isValid = authenticator.verify({ token: code, secret });
      if (!isValid) throw new Error('Código incorrecto');

      if (pending.user) {
        setUser(pending.user);
        setRole(((pending.user.app_metadata?.role as Role | undefined) ?? 'Editor') as Role);
        if (pending.session) {
          setSession(pending.session);
          await persistSession(pending.session);
        }
      } else {
        const pseudoSession = {
          ...pending.session,
          access_token: `dev-${code}-${Date.now()}`,
          refresh_token: `dev-${Date.now()}`,
          user: {
            id: 'dev-admin',
            email: fallbackCredentials.email,
          },
        } as unknown as Session;

        setUser({
          id: 'dev-admin',
          email: fallbackCredentials.email,
          app_metadata: { role: fallbackCredentials.role },
        } as unknown as User);
        setSession(pseudoSession);
        await persistSession(pseudoSession);
      }

      setPending(null);
      setStatus('authenticated');
    },
    [pending, persistSession],
  );

  const requestSmsCode = useCallback(async () => {
    const client = getSupabaseClient();
    if (client && pending?.user?.phone) {
      await client.auth.signInWithOtp({ phone: pending.user.phone });
      setPending((current) => (current ? { ...current, factor: 'sms' } : current));
      return;
    }
    console.info('[auth] SMS MFA no configurado, se mantiene flujo TOTP');
  }, [pending]);

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    setUser(null);
    setSession(null);
    setRole('Editor');
    setStatus('unauthenticated');
    setPending(null);
    await clearTokens();
  }, []);

  const refreshSession = useCallback(async () => {
    if (!session) return;
    const client = getSupabaseClient();
    if (!client) return;
    const { data, error } = await client.auth.refreshSession();
    if (error || !data.session) {
      await signOut();
      return;
    }
    setSession(data.session);
    await persistSession(data.session);
  }, [persistSession, session, signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      role,
      session,
      factorRequired: pending?.factor,
      login,
      verifyTotp,
      requestSmsCode,
      signOut,
      refreshSession,
    }),
    [login, pending?.factor, refreshSession, requestSmsCode, role, session, signOut, status, user, verifyTotp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
