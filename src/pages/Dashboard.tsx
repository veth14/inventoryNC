import React from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../Components/Layout';
import StatsGrid from '../Components/StatsGrid';
import { DashboardWidgets } from '../Components/DashboardWidgets';

export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Layout onLogout={handleLogout}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Church Title Header */}
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Light of the World</h1>
          <p className="text-lg text-cyan-400 font-medium tracking-wide">North Caloocan</p>
        </div>

        <StatsGrid />
        <DashboardWidgets />
      </div>
    </Layout>
  );
}
