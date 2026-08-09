'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/Navbar'

export default function SignupPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      router.push('/')
      return
    }

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Sign Up" />

      <main className="pt-24 pb-16 px-6 max-w-md mx-auto flex flex-col flex-grow w-full justify-center">
        <div className="bg-white border border-[#c5c6ca]/30 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[#010204]">Create Account</h2>
            <p className="text-xs text-[#45474a]/60">
              Start your persistent Polish vocabulary journey
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#45474a]">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex"
                className="w-full p-3 rounded-xl border border-[#c5c6ca] text-sm outline-none focus:border-[#010204]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#45474a]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border border-[#c5c6ca] text-sm outline-none focus:border-[#010204]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#45474a]">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-[#c5c6ca] text-sm outline-none focus:border-[#010204]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#010204] text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase hover:bg-[#010204]/90 active:scale-[0.98] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-[#45474a]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#39665d] font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
