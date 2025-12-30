
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Contracts } from './components/Contracts';
import { BankRecon } from './components/BankRecon';
import { Reports } from './components/Reports';
import { DelinquencyAssistant } from './components/DelinquencyAssistant';
import { Settings } from './components/Settings';
import { api } from './api';
import { Contract } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contracts' | 'bank' | 'reports' | 'ai' | 'settings'>('dashboard');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getContracts();
        // Aseguramos que data sea siempre un array
        setContracts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando contratos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-emerald-500/30">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)]">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
                <div className="absolute top-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-emerald-400 font-bold text-lg animate-pulse">Sincronizando Sistema</p>
                <p className="text-slate-500 text-sm">Conectando con Google Sheets API...</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-8 max-w-7xl mx-auto min-h-full">
          {activeTab === 'dashboard' && <Dashboard contracts={contracts} />}
          {activeTab === 'contracts' && <Contracts contracts={contracts} setContracts={setContracts} />}
          {activeTab === 'bank' && <BankRecon contracts={contracts} />}
          {activeTab === 'reports' && <Reports contracts={contracts} />}
          {activeTab === 'ai' && <DelinquencyAssistant contracts={contracts} />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
};

export default App;
