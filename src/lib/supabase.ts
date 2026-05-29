import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv: any = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};
const SUPABASE_URL = metaEnv?.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

export function initSupabase() {
  if (supabase) return supabase;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Return a no-op client placeholder to avoid runtime crashes in dev without keys
    supabase = createClient('', '');
    return supabase;
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabase;
}

export async function signUpWithEmail(email: string, password: string) {
  const sb = initSupabase();
  try {
    // @ts-ignore
    const res = await sb.auth.signUp({ email, password });
    return res;
  } catch (err) {
    return { error: err };
  }
}

export async function signInWithEmail(email: string, password: string) {
  const sb = initSupabase();
  try {
    // @ts-ignore
    const res = await sb.auth.signInWithPassword({ email, password });
    return res;
  } catch (err) {
    return { error: err };
  }
}

export async function signOut() {
  const sb = initSupabase();
  try {
    // @ts-ignore
    return await sb.auth.signOut();
  } catch (err) {
    return { error: err };
  }
}

export async function getUser() {
  const sb = initSupabase();
  try {
    // @ts-ignore
    const { data } = await sb.auth.getUser();
    return data?.user ?? null;
  } catch (err) {
    return null;
  }
}

export async function saveProjectToCloud(name: string, payload: any) {
  const sb = initSupabase();
  try {
    const project = { name, data: payload, updated_at: new Date().toISOString() };
    const { data, error } = await sb.from('projects').insert(project).select();
    return { data, error };
  } catch (err) {
    return { error: err };
  }
}

export async function listProjectsForUser() {
  const sb = initSupabase();
  try {
    const { data, error } = await sb.from('projects').select('*').order('updated_at', { ascending: false }).limit(50);
    return { data, error };
  } catch (err) {
    return { error: err };
  }
}
