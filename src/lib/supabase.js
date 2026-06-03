import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if keys are standard dummy templates or empty
const isRealSupabase = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  !supabaseUrl.includes('mock-supabase-url');

// Create the real Supabase client (only if parameters are valid)
let realSupabase = null;
if (isRealSupabase) {
  try {
    realSupabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Real Supabase initialization failed, falling back to Sandbox Simulator:', err);
  }
}

// ── Local Database Simulation Engine ───────────────────────────────
const DB_STORAGE_KEY = 'agentflow_supabase_mock_db';
const SESSION_STORAGE_KEY = 'agentflow_supabase_mock_session';

function getMockDb() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { users: [] };
  } catch {
    return { users: [] };
  }
}

function saveMockDb(db) {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
}

// Ensure at least one developer profile user is pre-registered for testing
const db = getMockDb();
if (db.users.length === 0) {
  db.users.push({
    id: 'user_dev_001',
    email: 'frontend@acmecorp.io',
    password: 'password123',
    plan: 'pro',
    trial_end: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    stripe_customer_id: 'cus_mock_123',
    referral_code: 'ref_acme_frontend',
    created_at: new Date().toISOString()
  });
  db.users.push({
    id: 'user_dev_002',
    email: 'lmk701870@gmail.com',
    password: 'password123',
    plan: 'agency',
    trial_end: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    stripe_customer_id: 'cus_mock_456',
    referral_code: 'ref_lmk_dev',
    created_at: new Date().toISOString()
  });
  saveMockDb(db);
}

// Stateful Auth Callbacks Registrar
const authCallbacks = [];

// Fallback Mock Supabase Implementation
const mockSupabase = {
  auth: {
    signUp: async ({ email, password, options = {} }) => {
      await new Promise(r => setTimeout(r, 600));
      const db = getMockDb();
      
      if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { data: { user: null }, error: new Error('User already registered') };
      }

      const referralCode = 'ref_' + Math.random().toString(36).slice(2, 9);
      const newUser = {
        id: 'usr_' + Math.random().toString(36).slice(2, 10),
        email: email.trim(),
        password: password, // simulate plaintext check for mock auth
        plan: options.data?.plan || 'trial',
        trial_end: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        stripe_customer_id: 'cus_sim_' + Math.random().toString(36).slice(2, 10),
        referral_code: referralCode,
        created_at: new Date().toISOString()
      };

      db.users.push(newUser);
      saveMockDb(db);

      const session = {
        access_token: 'mock-jwt-' + Math.random().toString(36).slice(2),
        user: newUser
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      authCallbacks.forEach(cb => cb('SIGNED_IN', session));

      return { data: { user: newUser, session }, error: null };
    },

    signInWithPassword: async ({ email, password }) => {
      await new Promise(r => setTimeout(r, 600));
      const db = getMockDb();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (!user) {
        return { data: { user: null, session: null }, error: new Error('Invalid email or password') };
      }

      const session = {
        access_token: 'mock-jwt-' + Math.random().toString(36).slice(2),
        user
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      authCallbacks.forEach(cb => cb('SIGNED_IN', session));

      return { data: { user, session }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      authCallbacks.forEach(cb => cb('SIGNED_OUT', null));
      return { error: null };
    },

    getSession: async () => {
      try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        return { data: { session: raw ? JSON.parse(raw) : null }, error: null };
      } catch {
        return { data: { session: null }, error: null };
      }
    },

    onAuthStateChange: (callback) => {
      authCallbacks.push(callback);
      // Trigger initial call
      try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        const session = raw ? JSON.parse(raw) : null;
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      } catch (err) {
        console.error(err);
      }
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const idx = authCallbacks.indexOf(callback);
              if (idx !== -1) authCallbacks.splice(idx, 1);
            }
          }
        }
      };
    }
  },

  from: (table) => {
    return {
      select: () => {
        return {
          eq: (col, val) => {
            return {
              single: async () => {
                const db = getMockDb();
                if (table === 'users') {
                  const user = db.users.find(u => u[col] === val);
                  return { data: user || null, error: user ? null : new Error('Not found') };
                }
                return { data: null, error: new Error('Table not found') };
              },
              maybeSingle: async () => {
                const db = getMockDb();
                if (table === 'users') {
                  const user = db.users.find(u => u[col] === val);
                  return { data: user || null, error: null };
                }
                return { data: null, error: null };
              },
              execute: async () => {
                const db = getMockDb();
                if (table === 'users') {
                  const list = db.users.filter(u => u[col] === val);
                  return { data: list, error: null };
                }
                return { data: [], error: null };
              }
            };
          },
          single: async () => {
            const db = getMockDb();
            if (table === 'users' && db.users.length > 0) {
              return { data: db.users[0], error: null };
            }
            return { data: null, error: new Error('Empty database') };
          }
        };
      },
      update: (updates) => {
        return {
          eq: (col, val) => {
            return {
              execute: async () => {
                const db = getMockDb();
                let updated = false;
                if (table === 'users') {
                  db.users = db.users.map(u => {
                    if (u[col] === val) {
                      updated = true;
                      const next = { ...u, ...updates };
                      // If updating active session user, update session as well
                      try {
                        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
                        if (raw) {
                          const sess = JSON.parse(raw);
                          if (sess.user.id === u.id) {
                            sess.user = next;
                            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sess));
                          }
                        }
                      } catch (err) {
                        console.error(err);
                      }
                      return next;
                    }
                    return u;
                  });
                  if (updated) {
                    saveMockDb(db);
                    return { data: updates, error: null };
                  }
                }
                return { data: null, error: new Error('Record not found to update') };
              }
            };
          }
        };
      }
    };
  }
};

// Export the active client
export const supabase = realSupabase || mockSupabase;
export const isMocked = !realSupabase;
