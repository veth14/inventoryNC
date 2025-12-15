import React, { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const r = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await r.json()
      if (!r.ok) setMessage(data.error || 'Sign in failed')
      else setMessage('Signed in successfully')
    } catch (err) {
      setMessage('Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const r = await fetch('/api/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await r.json()
      if (!r.ok) setMessage(data.error || 'Failed to send magic link')
      else setMessage('Magic link sent to your email')
    } catch (err) {
      setMessage('Unexpected error')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden">
        <div className="p-8 bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Welcome Back!</h2>
            <p className="text-sm text-gray-500">Sign in to access your dashboard and manage inventory.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-600">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </label>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                onClick={handleMagicLink}
                className="text-sm text-blue-600 hover:underline"
              >
                Send Magic Link
              </button>
            </div>
          </form>

          

          {message && <div className="mt-4 text-sm text-red-600">{message}</div>}
        </div>

        <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-b from-teal-800 to-teal-600 text-white">
          <h3 className="text-3xl font-semibold mb-4">Revolutionize Worship Inventory</h3>
          <p className="opacity-90">Manage equipment, schedules, and resources in one place — built for churches.</p>
          <div className="mt-6 text-sm opacity-90">Trusted by teams for reliable inventory tracking.</div>
        </div>
      </div>
    </div>
  )
}
