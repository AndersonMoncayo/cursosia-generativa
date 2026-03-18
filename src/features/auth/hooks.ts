'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/database.types'

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  })

  const supabase = createClient()

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return data as Profile | null
    },
    [supabase],
  )

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null
        const profile = user ? await fetchProfile(user.id) : null
        setState({ user, profile, session, loading: false })
      },
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  return {
    ...state,
    isAuthenticated: !!state.user,
    role: state.profile?.role ?? null,
    isAdmin: state.profile?.role === 'admin' || state.profile?.role === 'superadmin',
    isInstructor: state.profile?.role === 'instructor',
  }
}
