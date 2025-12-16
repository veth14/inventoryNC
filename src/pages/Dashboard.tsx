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
        <StatsGrid />
        <DashboardWidgets />
      </div>
    </Layout>
  );
}
