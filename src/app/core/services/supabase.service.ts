import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private _supabase!: SupabaseClient;

  constructor() {
    this._supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this._supabase.auth.onAuthStateChange(callback);
  }

  signInWithEmail(email: string, password: string) {
    return this._supabase.auth.signInWithPassword({ email, password });
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      const { data, error } = await this._supabase.auth.signUp({ email, password });
      
      if (error) throw error;

      if (data.user) {
        const { error: insertError } = await this._supabase
          .from('users')
          .insert({ id: data.user.id, email: data.user.email });

        if (insertError) throw insertError;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  getCurrentSession() {
    return this._supabase.auth.getSession();
  }

  signOut() {
    return this._supabase.auth.signOut();
  }
}
