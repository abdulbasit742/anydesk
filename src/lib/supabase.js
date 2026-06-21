// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = url && key ? createClient(url, key) : null

function mockAuth(email, plan) {
  const user = { email, plan, id: 'mock-' + Date.now() };
  localStorage.setItem('agp_user', JSON.stringify(user))
  localStorage.setItem('agp_plan', plan)
  localStorage.setItem('agp_authed', 'true')
  return { user }
}

function mockLogin(email) {
  const plan = localStorage.getItem('agp_plan') || 'free'
  const user = { email, plan, id: 'mock-' + Date.now() };
  localStorage.setItem('agp_user', JSON.stringify(user))
  localStorage.setItem('agp_authed', 'true')
  return { user }
}

export const auth = {
  signUp: async (email, password, plan = 'free') => {
    if (!supabase) return mockAuth(email, plan)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { plan, createdAt: Date.now() } }
    })
    if (error) throw error
    localStorage.setItem('agp_user', JSON.stringify({ email, plan, id: data.user?.id }))
    localStorage.setItem('agp_plan', plan)
    localStorage.setItem('agp_authed', 'true')
    return data
  },
  signIn: async (email, password) => {
    if (!supabase) return mockLogin(email)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const user = data.user
    const plan = user.user_metadata?.plan || 'free'
    localStorage.setItem('agp_user', JSON.stringify({ email, plan, id: user.id }))
    localStorage.setItem('agp_plan', plan)
    localStorage.setItem('agp_authed', 'true')
    return data
  },
  signOut: async () => {
    if (supabase) await supabase.auth.signOut()
    localStorage.removeItem('agp_authed')
    localStorage.removeItem('agp_user')
    localStorage.removeItem('agp_plan')
    window.location.href = '/login'
  },
  getUser: () => JSON.parse(localStorage.getItem('agp_user') || 'null'),
  isAuthed: () => localStorage.getItem('agp_authed') === 'true',
  getPlan: () => localStorage.getItem('agp_plan') || 'free'
}
