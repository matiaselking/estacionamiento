
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Contract, PaymentStatus } from '../types';

const data = [
  { name: 'Ene', ingresos: 4500000, morosidad: 200000 },
  { name: 'Feb', ingresos: 4800000, morosidad: 150000 },
  { name: 'Mar', ingresos: 5200000, morosidad: 400000 },
  { name: 'Abr', ingresos: 5100000, morosidad: 300000 },
  { name: 'May', ingresos: 5800000, morosidad: 250000 },
  { name: 'Jun', ingresos: 6200000, morosidad: 180000 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="glass-panel rounded-3xl p-6 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all duration-300 group border-white/5">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20 text-white shadow-lg`}>
        <Icon size={22} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-black mt-1 text-white">{value}</p>
  </div>
);

interface DashboardProps {
  contracts: Contract[];
}

export const Dashboard: React.FC<DashboardProps> = ({ contracts = [] }) => {
  const activeContracts = contracts.length;
  const delinquentCount = contracts.filter(c => c.estadoPago === PaymentStatus.MOROSO).length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Dashboard Ejecutivo</h2>
          <p className="text-slate-500 mt-1 font-medium">Análisis de rendimiento y estados críticos.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-inner">
          <CalendarDays size={18} className="text-emerald-400" />
          <span className="text-slate-200">Julio 2025</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ingresos del Mes" 
          value="$6.2M" 
          icon={TrendingUp} 
          color="bg-emerald-500" 
          trend={12} 
        />
        <StatCard 
          title="Contratos Activos" 
          value={activeContracts.toString()} 
          icon={Users} 
          color="bg-blue-500" 
          trend={5} 
        />
        <StatCard 
          title="Monto en Mora" 
          value={`$${(delinquentCount * 65000).toLocaleString()}`} 
          icon={AlertTriangle} 
          color="bg-amber-500" 
          trend={-2} 
        />
        <StatCard 
          title="Tasa de Cobro" 
          value="94%" 
          icon={CheckCircle2} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-3xl p-8 border-white/5">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            Tendencia de Ingresos
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={15} fontSize={12} fontWeight={600} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000000}M`} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-amber-100">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
            Clientes Morosos
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={15} fontSize={12} fontWeight={600} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}K`} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
                />
                <Bar dataKey="morosidad" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
