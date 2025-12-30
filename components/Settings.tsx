
import React, { useState, useEffect } from 'react';
import { Database, Link2, CheckCircle, AlertCircle, Table, ExternalLink, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { api, SheetMetadata } from '../api';

export const Settings: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [metadata, setMetadata] = useState<SheetMetadata | null>(null);

  useEffect(() => {
    const loadMeta = async () => {
      const meta = await api.getMetadata();
      setMetadata(meta);
    };
    loadMeta();
  }, []);

  const extractId = (urlOrId: string) => {
    // Regex para extraer el ID de una URL de Google Sheets
    const match = urlOrId.match(/[-\w]{25,}/);
    return match ? match[0] : urlOrId;
  };

  const handleConnect = async () => {
    const id = extractId(inputValue);
    if (!id) {
      setStatus('error');
      setMessage('Por favor, ingresa un ID o URL válida.');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.connectSheet(id);
      setStatus('success');
      setMessage(`Vinculado a: ${res.name}. Se encontraron ${res.rowCount} contratos.`);
      const newMeta = await api.getMetadata();
      setMetadata(newMeta);
    } catch (e: any) {
      setStatus('error');
      setMessage(e.message || 'Error de conexión');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white">Configuración de la Base de Datos</h2>
        <p className="text-slate-400">Gestiona la conexión con tu Google Sheet.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <Link2 size={24} />
              <h3 className="text-xl font-bold text-white">Vincular Nueva Hoja</h3>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400">URL o ID de Google Sheets</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Pega aquí el enlace de tu hoja de cálculo..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button 
                  onClick={handleConnect}
                  disabled={status === 'loading'}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-8 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {status === 'loading' ? <RefreshCw className="animate-spin" size={20} /> : 'Conectar'}
                </button>
              </div>
              <p className="text-xs text-slate-500 italic">
                Sugerencia: Puedes pegar directamente el enlace que compartiste: https://docs.google.com/spreadsheets/d/...
              </p>
            </div>

            {status !== 'idle' && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 text-sm animate-in zoom-in-95 duration-300 ${
                status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {status === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
                <div>
                  <p className="font-bold">{status === 'success' ? '¡Conexión Exitosa!' : 'Error de Vinculación'}</p>
                  <p className="opacity-80">{message}</p>
                </div>
              </div>
            )}
          </div>

          {metadata && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hoja Conectada</span>
                <div className="flex items-center gap-2 text-white font-bold truncate">
                  <FileSpreadsheet className="text-emerald-400" size={18} />
                  {metadata.name}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contratos Totales</span>
                <div className="text-white font-bold">{metadata.rowCount} registros</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acciones Rápidas</span>
                <a 
                  href={`https://docs.google.com/spreadsheets/d/${metadata.id}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-sm font-bold transition-colors"
                >
                  Abrir en Google Sheets <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-blue-400">
            <Table size={24} />
            <h3 className="text-xl font-bold text-white">Guía de Estructura</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Para que la importación funcione, tu hoja debe tener una pestaña llamada <span className="text-emerald-400 font-mono">Contratos</span>.
          </p>
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Columnas Obligatorias</span>
            <div className="flex flex-wrap gap-2">
              {['indice', 'contrato', 'nombreMostrar', 'rut', 'precio', 'estadoPago', 'statusServicio', 'autos'].map(h => (
                <div key={h} className="bg-slate-950 px-2 py-1 border border-slate-800 rounded text-[10px] font-mono text-slate-300">
                  {h}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800">
            <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl">
              <h4 className="text-blue-300 font-bold text-xs mb-2 flex items-center gap-2">
                <RefreshCw size={14} /> Auto-Creación
              </h4>
              <p className="text-[10px] text-blue-300/70 leading-relaxed">
                Si vinculas una hoja vacía, el sistema creará automáticamente la pestaña y los encabezados necesarios por ti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
