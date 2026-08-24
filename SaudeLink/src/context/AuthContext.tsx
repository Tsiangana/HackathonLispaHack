import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type UserProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  nif: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  is_verified: boolean;
};

type AuthContextType = {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrCreateProfile = useCallback(async (userId: string, email?: string, rawMetadata?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, nif, birth_date, avatar_url, is_verified')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data as UserProfile);
        return;
      }

      // If no profile row exists, create initial row from user session metadata
      const defaultName = rawMetadata?.full_name || email?.split('@')[0] || 'Utilizador';
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            full_name: defaultName,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select('id, full_name, phone, nif, birth_date, avatar_url, is_verified')
        .single();

      if (!insertError && created) {
        setProfile(created as UserProfile);
      }
    } catch (err) {
      console.error('[AuthContext] Error loading profile:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchOrCreateProfile(session.user.id, session.user.email, session.user.user_metadata);
    }
  }, [session?.user?.id, session?.user?.email, session?.user?.user_metadata, fetchOrCreateProfile]);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error loading session:', error);
      }

      if (mounted) {
        setSession(session);
        if (session?.user?.id) {
          await fetchOrCreateProfile(session.user.id, session.user.email, session.user.user_metadata);
        }
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        await fetchOrCreateProfile(session.user.id, session.user.email, session.user.user_metadata);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}