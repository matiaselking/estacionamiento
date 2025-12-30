
import React, { useState } from 'react';
import { 
  Upload, 
  ArrowRightLeft, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { Contract } from '../types';

const mockPendingTransactions = [
  { id: '1', fecha: '2025-07-05', monto: 75000, ordenante: 'JUAN ALBERTO PEREZ', glosa: 'CONTRATO 1029', matchScore: 100, matchedWith: '1029 - Juan Pérez' },
  { id: '2', fecha: '2025-07-06', monto: 59500, ordenante: 'MARIA ELENA LÓPEZ', glosa: 'PAGO MES JULIO', matchScore: 85, matchedWith: '1030 - María López' },
  { id: '3', fecha: '2025-07-07', monto: 120000, ordenante: 'CONSTRUCCIONES S.A.', glosa: 'TRANSFERENCIA BCI', matchScore: 0, matchedWith: null },
];

// Fix: Add BankReconProps interface to accept contracts prop
interface BankReconProps {
  contracts: Contract[];
}

export const BankRecon: React.FC<BankReconProps> = ({ contracts }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white">Conciliación Bancaria</h2>
        <p className="text-slate-400">Automatiza la asignación de pagos desde tu cartola BCI (.xlsx).</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <div 
            className={`bg-slate-900 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
              isDragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          >
            <div className="bg-slate-800 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-emerald-400" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Cargar Cartola BCI</h3>
            <p className="text-slate-500 text-sm mb-6">Arrastra tu archivo .xlsx aquí o haz clic para buscar.</p>
            <input type="file" className="hidden" id="file-upload" accept=".xlsx" />
            <label 
              htmlFor="file-upload"
              className="bg-slate-100 text-slate-900 font-bold px-6 py-2.5 rounded-xl cursor-pointer hover:bg-white transition-colors"
            >
              Seleccionar Archivo
            </label>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex gap-4">
              <Info className="text-blue-400 shrink-0" size={24} />
              <div className="space-y-2">
                <h4 className="text-blue-200 font-bold text-sm">¿Cómo funciona?</h4>
                <p className="text-blue-200/70 text-xs leading-relaxed">
                  El sistema analiza el monto, el nombre del ordenante y el comentario (glosa) para sugerir el contrato correspondiente.
                </p>
                <a href="#" className="inline-flex items-center gap-1 text-blue-400 text-xs font-bold hover:underline">
                  Ver tutorial <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <ArrowRightLeft className="text-emerald-400" size={20} />
              Movimientos Pendientes
            </h3>
            <button className="bg-emerald-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm hover:bg-emerald-600 transition-all">
              Aplicar Todo (OK)
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {mockPendingTransactions.map((tx) => (
              <div key={tx.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">{tx.fecha}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-400">ID: {tx.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-100">{tx.ordenante}</h4>
                  <p className="text-xs text-slate-400 italic">"{tx.glosa}"</p>
                  <div className="text-lg font-black text-emerald-400 mt-2">
                    ${tx.monto.toLocaleString('es-CL')}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <ArrowRight className="text-slate-600 hidden md:block" />
                  <div className={`p-4 rounded-2xl border min-w-[240px] flex flex-col gap-2 ${
                    tx.matchScore >= 80 ? 'bg-emerald-500/5 border-emerald-500/20' : 
                    tx.matchScore > 0 ? 'bg-amber-500/5 border-amber-500/20' : 
                    'bg-red-500/5 border-red-500/20 border-dashed'
                  }`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Sugerencia Inteligente</span>
                      {tx.matchScore > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          tx.matchScore >= 90 ? 'bg-emerald-500 text-emerald-950' : 'bg-amber-500 text-amber-950'
                        }`}>
                          {tx.matchScore}%
                        </span>
                      )}
                    </div>
                    {tx.matchedWith ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500" />
                        <span className="text-sm font-bold">{tx.matchedWith}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500">
                        <AlertCircle size={16} />
                        <span className="text-sm italic">Sin coincidencia clara</span>
                      </div>
                    )}
                    <button className="mt-2 text-xs font-bold text-slate-300 hover:text-white transition-colors text-left flex items-center gap-1">
                      {tx.matchedWith ? 'Cambiar cliente' : 'Asignar manualmente'} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
