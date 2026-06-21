const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
let supabase = null
if(supabaseUrl && supabaseKey) {
  import('@supabase/supabase-js').then(({createClient}) => { supabase=createClient(supabaseUrl,supabaseKey) })
}
export const auth = {
  signUp: async (email,pass,plan='free') => {
    if(supabase) {
      const {data,error} = await supabase.auth.signUp({email,password:pass,options:{data:{plan}}})
      if(error) throw error
    }
    localStorage.setItem('agp_user',JSON.stringify({email,plan,id:'user_'+Date.now()}))
    localStorage.setItem('agp_plan',plan)
    localStorage.setItem('agp_authed','true')
    return {email,plan}
  },
  signIn: async (email,pass) => {
    if(supabase) {
      const {data,error} = await supabase.auth.signInWithPassword({email,password:pass})
      if(error) throw error
      const plan = data.user?.user_metadata?.plan || 'free'
      localStorage.setItem('agp_plan',plan)
    }
    localStorage.setItem('agp_user',JSON.stringify({email,plan:localStorage.getItem('agp_plan')||'free'}))
    localStorage.setItem('agp_authed','true')
    return {email}
  },
  signOut: () => {
    supabase?.auth.signOut()
    localStorage.removeItem('agp_authed')
    localStorage.removeItem('agp_user')
    window.location.href='/'
  },
  isAuthed: () => localStorage.getItem('agp_authed')==='true',
  getUser: () => JSON.parse(localStorage.getItem('agp_user')||'null'),
  getPlan: () => localStorage.getItem('agp_plan')||'free',
}
