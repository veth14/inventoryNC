import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import Layout from '../Components/Layout';
import StatsGrid from '../Components/StatsGrid';
import { DashboardWidgets } from '../Components/DashboardWidgets';

interface DashboardProps {
  session: Session | null;
}

export default function Dashboard({ session }: DashboardProps) {
  const [stats, setStats] = useState({
    totalItems: 0,
    needsMaintenance: 0,
    needsReplacement: 0
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('condition, status');
    
    if (data) {
      const totalItems = data.length;
      const needsMaintenance = data.filter((i: any) => i.status === 'Under Repair' || i.condition === 'Needs Repair').length;
      const needsReplacement = data.filter((i: any) => i.condition === 'Broken').length;
      
      setStats({ totalItems, needsMaintenance, needsReplacement });
    }
  };

  return (
    <Layout onLogout={handleLogout} user={session?.user || null}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Church Title Header */}
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Light of the World</h1>
          <p className="text-lg text-cyan-400 font-medium tracking-wide">North Caloocan</p>
        </div>

        <StatsGrid 
          totalItems={stats.totalItems} 
          needsMaintenance={stats.needsMaintenance} 
          needsReplacement={stats.needsReplacement} 
        />
        <DashboardWidgets />
      </div>
    </Layout>
  );
}
