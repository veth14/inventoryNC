import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={session ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/inventory" 
          element={session ? <Inventory /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/maintenance" 
          element={session ? <Maintenance /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/reports" 
          element={session ? <Reports /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}
