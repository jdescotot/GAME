import React from 'react';
import { Mic, Briefcase, Flag, Activity } from 'lucide-react';
import { LawCard } from './LawCard';

export function OperationsPanel({
  phase,
  currentLaw,
  handleAction,
  startLegislativeSession,
  voteOnLaw,
}) {
  if (phase === 'dashboard') {
    return (
      <div className="panel h-full flex flex-col">
        <h3 className="panel-title">Operaciones</h3>

        <button
          onClick={() => handleAction('campaign')}
          className="op-button"
        >
          <div className="op-icon bg-green-900 text-green-400">
            <Mic size={18} />
          </div>
          <div>
            <div className="op-info-title">Campaña TV</div>
            <div className="op-info-cost">-$500 | +Pop</div>
          </div>
        </button>

        <button
          onClick={() => handleAction('lobby')}
          className="op-button"
        >
          <div
            className="op-icon"
            style={{
              backgroundColor: 'rgba(202, 138, 4, 0.2)',
              color: '#facc15',
            }}
          >
            <Briefcase size={18} />
          </div>
          <div>
            <div className="op-info-title">Cabildeo (Lobby)</div>
            <div className="op-info-cost">-5 CP | +$800, -Pop</div>
          </div>
        </button>

        <button
          onClick={() => handleAction('protest')}
          className="op-button"
        >
          <div
            className="op-icon"
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              color: '#f87171',
            }}
          >
            <Flag size={18} />
          </div>
          <div>
            <div className="op-info-title">Organizar Marcha</div>
            <div className="op-info-cost">-10 CP | +Presión</div>
          </div>
        </button>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={startLegislativeSession}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Activity size={18} /> Sesión Legislativa
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'legislation' && currentLaw) {
    return <LawCard law={currentLaw} onVote={voteOnLaw} />;
  }

  return null;
}
