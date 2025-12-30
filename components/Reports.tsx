
import React from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  FileSpreadsheet,
  FileJson,
  Printer
} from 'lucide-react';
import { Contract } from '../types';

// Fix: Add ReportsProps interface to accept contracts prop
interface ReportsProps {
  contracts: Contract[];
}

export const Reports: React.FC<ReportsProps> = ({ contracts }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Informes & Ganancias</h2>
          <p className="text-slate-400">Analiza el rendimiento histórico y exporta datos contables.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl hover:bg-slate-800 transition-all text-sm font-bold">
            <Calendar size={18} /> Julio 2025
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-400">
              <BarChart3 size={24} />
            </div>
            <button className="text-slate-500 hover:text-slate-300">
              <Printer size={20} />
            </button>
          </div>
          <h3 className="font-bold text-lg mb-2">Informe de Caja</h3>
          <p className="text-slate-400 text-sm mb-8">Resumen diario de ingresos mañana/tarde registrados manualmente.</p>
          <div className="mt-auto flex gap-2">
            <button className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all">
              Generar PDF
            </button>
            <button className="px-4 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all">
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400">
              <FileSpreadsheet size={24} />
            </div>
            <button className="text-slate-500 hover:text-slate-300">
              <Printer size={20} />
            </button>
          </div>
          <h3 className="font-bold text-lg mb-2">Maestro Completo</h3>
          <p className="text-slate-400 text-sm mb-8">Exportación total de la base de datos de contratos con historial de pagos.</p>
          <div className="mt-auto flex gap-2">
            <button className="flex-1 py-2.5 bg-blue-500 text-white font-bold rounded-xl text-xs hover:bg-blue-400 transition-all">
              Exportar Excel
            </button>
            <button className="px-4 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all">
              <FileJson size={16} />
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-red-500/10 p-3 rounded-2xl text-red-400">
              <ShieldAlert size={24} />
            </div>
            <button className="text-slate-500 hover:text-slate-300">
              <Printer size={20} />
            </button>
          </div>
          <h3 className="font-bold text-lg mb-2">Ranking Morosidad</h3>
          <p className="text-slate-400 text-sm mb-8">Listado detallado de clientes con deudas pendientes ordenados por antigüedad.</p>
          <div className="mt-auto flex gap-2">
            <button className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-400 transition-all">
              Generar Lista
            </button>
            <button className="px-4 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldAlert = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
