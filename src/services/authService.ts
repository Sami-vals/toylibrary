import { supabase, isSupabaseConfigured } from '../supabase';

export const authService = {
  /**
   * Sign in with Google OAuth via Supabase Auth.
   * Redirects the user to Google's consent screen.
   */
  signInWithGoogle: async () => {
    if (!supabase || !isSupabaseConfigured) {
      alert('Supabase is not configured. Cannot sign in with Google.');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google sign-in error:', error);
      alert('Failed to sign in with Google: ' + error.message);
    }
  },

  /**
   * Listen for auth state changes (e.g. after OAuth redirect).
   * Returns an unsubscribe function.
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabase || !isSupabaseConfigured) {
      return () => {};
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  },

  /**
   * Get the current Supabase Auth session.
   */
  getSession: async () => {
    if (!supabase || !isSupabaseConfigured) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Sign out from Supabase Auth.
   */
  signOut: async () => {
    if (!supabase || !isSupabaseConfigured) return;
    await supabase.auth.signOut();
  },
};
