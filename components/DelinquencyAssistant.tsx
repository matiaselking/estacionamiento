
import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  BrainCircuit, 
  Clock, 
  History,
  MessageSquareQuote,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Contract } from '../types';

// Fix: Add DelinquencyAssistantProps interface to accept contracts prop
interface DelinquencyAssistantProps {
  contracts: Contract[];
}

export const DelinquencyAssistant: React.FC<DelinquencyAssistantProps> = ({ contracts }) => {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hola, soy el asistente inteligente de SGE Master. Puedo analizar los datos de morosidad, sugerir planes de pago o redactar correos de cobranza personalizados. ¿En qué puedo ayudarte hoy?' }
  ]);

  // Fix: Implement actual Gemini API call for intelligent analysis
  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userText = prompt;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    setIsTyping(true);
    
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: `CONTEXTO DE CONTRATOS ACTUALES (JSON):\n${JSON.stringify(contracts)}` }]
          },
          ...messages.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })),
          {
            role: 'user',
            parts: [{ text: userText }]
          }
        ],
        config: {
          systemInstruction: "Eres un asistente experto en gestión de morosidad para el sistema SGE Master de estacionamientos. Tienes acceso a la lista completa de contratos. Ayuda al usuario a analizar deudas, encontrar patrones de morosidad, redactar correos de cobranza profesionales en español de Chile y sugerir planes de pago. Sé conciso y profesional.",
          temperature: 0.7,
        }
      });

      const aiText = response.text || 'Lo siento, no pude procesar tu solicitud.';
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Hubo un error al conectar con el asistente de IA. Inténtalo de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Sparkles className="text-amber-400" fill="currentColor" />
            Asistente IA
          </h2>
          <p className="text-slate-400">Análisis avanzado y gestión inteligente de cobranza.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-all text-sm font-medium border border-slate-700">
            <History size={18} /> Historial
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
                  msg.role === 'ai' 
                    ? 'bg-slate-800 border border-slate-700 rounded-bl-none text-slate-200' 
                    : 'bg-emerald-500 text-emerald-950 font-medium rounded-br-none'
                }`}>
                  {msg.role === 'ai' && <BrainCircuit className="shrink-0 text-emerald-400" size={20} />}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-bl-none flex gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Pregunta sobre un contrato, morosidad o redactar avisos..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm shadow-inner"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="absolute right-3 p-2.5 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest">
              Powered by Google Gemini 3 Pro
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-400" />
              Sugerencias Rápidas
            </h3>
            <div className="space-y-3">
              {[
                "Analizar morosos del mes",
                "Redactar recordatorio pago",
                "Comparar ingresos vs 2024",
                "Ver contratos por vencer"
              ].map(suggest => (
                <button 
                  key={suggest}
                  onClick={() => { setPrompt(suggest); }}
                  className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all text-xs text-slate-400 group flex items-center justify-between"
                >
                  {suggest}
                  <MessageSquareQuote size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 flex flex-col items-center text-center gap-4">
            <div className="bg-emerald-500/20 p-4 rounded-full">
              <Clock size={32} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-100 mb-1">Cobranza Automática</h4>
              <p className="text-xs text-emerald-400/70 leading-relaxed">
                El sistema programa avisos cada día 1, 5, 6 y 15 según el estado del cliente.
              </p>
            </div>
            <button className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all">
              Configurar Reglas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
