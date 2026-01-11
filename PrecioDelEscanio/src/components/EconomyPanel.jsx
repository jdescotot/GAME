import React from 'react';
import { Landmark } from 'lucide-react';

export function EconomyPanel({
  economy,
  taxProposal,
  setTaxProposal,
  proposeTaxChange,
}) {
  // Cálculos internos (antes estaban en App.jsx)
  const currentRevenue = (economy.taxRate / 100) * 100000;
  const projectedRevenue = (taxProposal / 100) * 100000;
  const projectedDeficit = economy.annualSpending - currentRevenue;

  return (
    <div className="panel">
      <h3 className="panel-title">
        <Landmark size={12} /> Economía Nacional
      </h3>

      <div className="stat-row">
        <span>Gasto Anual:</span>
        <span className="text-red">
          -${economy.annualSpending.toLocaleString()} M
        </span>
      </div>

      <div className="stat-row">
        <span>Recaudación:</span>
        <span className="text-green">
          +${currentRevenue.toLocaleString()} M
        </span>
      </div>

      <div
        className="stat-row"
        style={{
          borderTop: '1px solid #333',
          paddingTop: '4px',
          marginTop: '4px',
        }}
      >
        <span>Déficit:</span>
        <span className={projectedDeficit > 0 ? 'text-red' : 'text-green'}>
          {projectedDeficit > 0
            ? `-${projectedDeficit.toLocaleString()}`
            : `+${Math.abs(projectedDeficit).toLocaleString()}`}{' '}
          M
        </span>
      </div>

      <div className="tax-control-area">
        <label className="text-xs text-gray-400">
          Impuestos (I.S.R.)
        </label>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="10"
            max="60"
            value={taxProposal}
            onChange={(e) => setTaxProposal(parseInt(e.target.value))}
            className="range-input"
          />
          <span className="text-mono font-bold">
            {taxProposal}%
          </span>
        </div>

        {taxProposal !== economy.taxRate ? (
          <button
            onClick={proposeTaxChange}
            className="btn-xs btn-primary mt-2 w-full"
          >
            Someter Reforma (
            {taxProposal > economy.taxRate ? 'Subir' : 'Bajar'})
          </button>
        ) : (
          <p className="text-xs text-center mt-2 text-gray-500">
            Mueve el slider para proponer cambios.
          </p>
        )}
      </div>
    </div>
  );
}
