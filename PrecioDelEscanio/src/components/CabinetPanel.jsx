import React from 'react';
import { Briefcase } from 'lucide-react';
import { StatBar } from './StatBar';
import { PowerHungerBar } from './PowerHungerBar';

export function CabinetPanel({ candidates }) {
  return (
    <div className="panel mt-4">
      <h3 className="panel-title">
        <Briefcase size={12} /> Tu Gabinete
      </h3>

      {candidates.map(candidate => (
        <div key={candidate.id} className="candidate-card">
          <div className="candidate-header">
            <span className="candidate-name">{candidate.name}</span>
            <span className="candidate-lvl">Nvl 1</span>
          </div>

          <StatBar
            label="Carisma"
            value={candidate.oratory}
            color="bg-purple"
          />

          <StatBar
            label="Lealtad"
            value={candidate.loyalty}
            color="bg-green"
          />

          <PowerHungerBar
            value={candidate.powerHunger}
            oratory={candidate.oratory}
          />
        </div>
      ))}
    </div>
  );
}
