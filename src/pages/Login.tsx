import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'

// SVG Icons for the form
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ text: 'Signed in successfully! Redirecting...', type: 'success' });
        // TODO: redirect to dashboard or update app state
      }
    } catch (err: any) {
      setMessage({ text: err?.message || 'An unexpected error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Column: Branding */}
        <div className="hidden md:block text-left p-8">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-cyan-400">LIGHT</span>
            <span className="text-gray-300"> NORTH</span>
          </h1>
          <h1 className="text-5xl font-bold tracking-tight text-gray-300">CALOOCAN</h1>
          <p className="mt-6 text-lg text-gray-400">
            Seamlessly managing our assets to better serve His kingdom.
          </p>
        </div>

        {/* Right Column: Login Form */}
        <div className="w-full max-w-md p-8 space-y-6 bg-[#1f2937]/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-100">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-400">Sign in to access the inventory dashboard.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? 'Signing In...' : 'Sign In Now'}
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm text-center ${
                message.type === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <p className="text-center text-xs text-gray-500">
            Copyright © {new Date().getFullYear()} Light North Caloocan. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
