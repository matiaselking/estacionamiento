
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Landmark, 
  BarChart3, 
  BrainCircuit,
  Settings as SettingsIcon,
  LogOut,
  ParkingCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'bank', label: 'Conciliación BCI', icon: Landmark },
    { id: 'reports', label: 'Informes', icon: BarChart3 },
    { id: 'ai', label: 'Asistente IA', icon: BrainCircuit },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <ParkingCircle className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">SGE MASTER</h1>
          <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Estacionamientos</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <button 
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === 'settings' 
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <SettingsIcon size={20} />
          <span className="font-medium text-sm">Base de Datos</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Salir</span>
        </button>
      </div>
    </aside>
  );
};
