import React from 'react';
import { Vote } from 'lucide-react';

// Esta función auxiliar ahora vive aquí, manteniendo App.jsx limpio
const getFavorLabelAndColor = (favor) => {
  const map = {
    'far-left': { label: 'Extrema Izquierda', color: '#f87171', bg: 'rgba(220, 38, 38, 0.2)' },
    'center-left': { label: 'Centro-Izquierda', color: '#fca5a5', bg: 'rgba(251, 146, 60, 0.2)' },
    'center-right': { label: 'Centro-Derecha', color: '#60a5fa', bg: 'rgba(37, 99, 235, 0.2)' },
    'far-right': { label: 'Extrema Derecha', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' },
    'green': { label: 'Verdes', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.2)' },
    'populist': { label: 'Populista', color: '#facc15', bg: 'rgba(202, 138, 4, 0.2)' },
    'neutral': { label: 'Neutral', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.2)' }
  };
  return map[favor] || { label: favor, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.2)' };
};

export function LawCard({ law, onVote }) {
  if (!law) return null;

  const { label, color, bg } = getFavorLabelAndColor(law.favor);

  return (
    <div className="panel legislation-panel h-full flex flex-col">
      <div className="panel-title text-center mb-4">
        <Vote size={20} className="inline mr-2"/> Votación en Curso
      </div>
      
      <div className="law-card flex-1">
        <h2 className="text-lg font-bold mb-2">{law.title}</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="law-tag bg-gray-700">{law.type}</span>
          
          {/* Indicador de Costo Fiscal */}
          <span className={`law-tag ${law.fiscalCost > 0 ? 'text-red bg-red-900/30' : 'text-green bg-green-900/30'}`}>
            {law.fiscalCost > 0 ? `Costo: $${law.fiscalCost}M` : `Ahorro: $${Math.abs(law.fiscalCost)}M`}
          </span>

          {/* Etiqueta de Alineación Política Corregida */}
          <span className="law-tag" style={{ backgroundColor: bg, color: color }}>
            Favorece: {label}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Impacto Social: {law.impact.chaos > 0 ? "Genera desorden social" : "Estabiliza el orden"}.
        </p>
        
        {/* Descripción extra si existiera en los datos */}
        {law.description && <p className="text-xs text-gray-500 mt-2 italic">"{law.description}"</p>}
      </div>

      <div className="mt-4 space-y-2">
        <button onClick={() => onVote('yes')} className="btn-vote btn-vote-yes w-full">Votar A FAVOR</button>
        <button onClick={() => onVote('no')} className="btn-vote btn-vote-no w-full">Votar EN CONTRA</button>
        <button onClick={() => onVote('abstain')} className="btn-vote btn-vote-abs w-full">ABSTENCIÓN</button>
      </div>
    </div>
  );
}