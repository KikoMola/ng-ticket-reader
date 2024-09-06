import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
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

  signUpWithEmail(email: string, password: string) {
    return this._supabase.auth.signUp({ email, password });
  }

  getCurrentSession() {
    return this._supabase.auth.getSession();
  }

  signOut() {
    return this._supabase.auth.signOut();
  }

}
