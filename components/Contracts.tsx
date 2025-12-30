
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  FileEdit, 
  Trash2,
  Car,
  RefreshCw
} from 'lucide-react';
import { ContractStatus, PaymentStatus, Contract } from '../types';
import { api } from '../api';

interface ContractsProps {
  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
}

export const Contracts: React.FC<ContractsProps> = ({ contracts, setContracts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getContracts();
      setContracts(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVO: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ContractStatus.BLOQUEO: return 'bg-red-500/10 text-red-400 border-red-500/20';
      case ContractStatus.RENUNCIA: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case ContractStatus.INACTIVO: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredContracts = contracts.filter(c => 
    c.nombreMostrar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contrato?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Gestión de Contratos</h2>
          <p className="text-slate-400">Datos sincronizados en tiempo real con la hoja de cálculo.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className={`p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} className="text-slate-400" />
          </button>
          <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
            <Plus size={20} />
            Nuevo Contrato
          </button>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar en la base de datos..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              {filteredContracts.length} registros encontrados
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Contrato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Cliente / RUT</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Vehículos</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Precio</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredContracts.length > 0 ? filteredContracts.map((c) => (
                <tr key={c.rowNumber || c.indice} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{c.contrato}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-100">{c.nombreMostrar}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{c.rut}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(c.autos) && c.autos.map(plate => (
                        <span key={plate} className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300 border border-slate-700">
                          <Car size={10} /> {plate}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold">${Number(c.precio).toLocaleString('es-CL')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusColor(c.statusServicio as ContractStatus)}`}>
                      {c.statusServicio}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                        <FileEdit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No hay contratos registrados en la hoja de cálculo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
