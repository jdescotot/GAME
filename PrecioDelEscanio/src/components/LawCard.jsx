import React from 'react';
import { Vote } from 'lucide-react';

// Mapeo de claves UPPERCASE a etiquetas y colores
const FAVOR_MAP = {
  'FAR_LEFT': { label: 'Extrema Izquierda', color: '#f87171', bg: 'rgba(220, 38, 38, 0.2)' },
  'LEFT': { label: 'Izquierda', color: '#fca5a5', bg: 'rgba(251, 146, 60, 0.2)' },
  'CENTER': { label: 'Centro', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.2)' },
  'RIGHT': { label: 'Derecha', color: '#60a5fa', bg: 'rgba(37, 99, 235, 0.2)' },
  'FAR_RIGHT': { label: 'Extrema Derecha', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' },
  'GREEN': { label: 'Verdes', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.2)' },
  'POPULIST': { label: 'Populista', color: '#facc15', bg: 'rgba(202, 138, 4, 0.2)' },
  'MINOR': { label: 'Minorías', color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.2)' },
  'ANARCHIST': { label: 'Progresistas', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.2)' }
};

// Esta función ahora soporta string o array
const getFavorLabelsAndColors = (favor) => {
  const favorArr = Array.isArray(favor) ? favor : [favor];
  return favorArr.map(f => FAVOR_MAP[f] || { label: f, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.2)' });
};

export function LawCard({ law, onVote }) {
  if (!law) return null;

  const favorTags = getFavorLabelsAndColors(law.favor);

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

          {/* Etiquetas de Alineación Política (soporta múltiples) */}
          {favorTags.map((tag, idx) => (
            <span key={idx} className="law-tag" style={{ backgroundColor: tag.bg, color: tag.color }}>
              {tag.label}
            </span>
          ))}
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