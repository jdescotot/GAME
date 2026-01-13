import React from 'react';
import { Users, DollarSign, TrendingUp, Shield, Landmark, Map as MapIcon } from 'lucide-react';
import './App.css';

// Componentes
import { StatBar } from './components/StatBar';
import { PowerHungerBar } from './components/PowerHungerBar';
import { LawCard } from './components/LawCard';
import { EconomyPanel } from './components/EconomyPanel';
import { CabinetPanel } from './components/CabinetPanel';
import { OperationsPanel } from './components/OperationsPanel';
import { SeatsView } from './components/SeatsView';
import { PoliticalMap } from './components/PoliticalMap';
import { MessageLog } from './components/MessageLog';
import { FACTIONS } from './data/constants';
// Lógica
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const game = useGameLogic();

  // Cálculo de economía (solo lo que se usa)
  const currentRevenue = (game.economy.taxRate / 100) * 100000;
  const projectedDeficit = game.economy.annualSpending - currentRevenue;

if (game.phase === 'setup') {
    return (
      <div className="setup-screen">
        <div className="setup-card w-full max-w-2xl p-6"> {/* Hice la carta un poco más ancha */}
          <h1 className="setup-title">El Peso del Escaño</h1>
          <p className="setup-desc">Diseña tu partido. Ahora gestionas la crisis nacional.</p>
          
          <div className="form-group mb-6">
            <label className="block text-sm font-bold mb-2">Nombre del Partido</label>
            <input
              type="text"
              value={game.partyName}
              onChange={(e) => game.setPartyName(e.target.value)}
              className="form-input w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="form-label">Plantillas Ideológicas (Opcional)</label>
            <div className="grid grid-cols-3 gap-2">
              {FACTIONS.map((faction) => (
                <button
                  key={faction.id}
                  onClick={() => game.setIdeologyPreset(faction)}
                  className={`btn-faction ${faction.color}`}
                >
                  {faction.name}
                </button>
              ))}
            </div>
          </div>

          {/* SLIDERS EXISTENTES (Se mueven solos si tocas los botones de arriba) */}
          <div className="range-container mb-4">
            <div className="range-labels flex justify-between text-xs"><span>Izquierda Económica</span><span>Derecha Económica</span></div>
            <input
              type="range"
              min="0"
              max="100"
              value={game.ideologyX}
              onChange={(e) => game.setIdeologyX(parseInt(e.target.value))}
              className="range-input w-full"
            />
          </div>
          
          <div className="range-container mb-6">
            <div className="range-labels flex justify-between text-xs"><span>Libertario / Progresista</span><span>Autoritario / Conservador</span></div>
            <input
              type="range"
              min="0"
              max="100"
              value={game.ideologyY}
              onChange={(e) => game.setIdeologyY(parseInt(e.target.value))}
              className="range-input w-full"
            />
          </div>

          {/* --- NUEVO: RESULTADO DINÁMICO --- */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center border border-gray-200">
            <p className="text-xs text-gray-700 uppercase tracking-wide">Tu ideología se define como:</p>
            <h3 className={`text-xl font-bold mt-1 ${
              game.currentIdeology?.color?.startsWith('text-')
                ? game.currentIdeology.color
                : game.currentIdeology?.color?.replace(/^bg-/, 'text-') || 'text-gray-900'
            }`}>
              {game.currentIdeology?.name || "Indefinido"}
            </h3>
            <p className="text-sm text-gray-800 italic mt-1">
              "{game.currentIdeology?.desc || "Aún no has definido una ideología."}"
            </p>
          </div>

          <button onClick={game.handleFundarPartido} className="btn-primary w-full py-3 text-lg font-bold">
            Iniciar Gobierno
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* HEADER */}
      <header className="game-header">
        <div className="party-info">
          <div className="party-logo">{game.partyName.charAt(0)}</div>
          <div>
            <h1 className="party-name">{game.partyName}</h1>
            <p className="turn-info">Turno {game.turn} | Legislatura {game.legislature}</p>
          </div>
        </div>

        <div className="resources-bar">
          <div className="resource-item" title="Dinero del Partido">
            <DollarSign className="text-green" size={16} />
            <span className="text-mono">${game.resources.money}</span>
          </div>
          <div className="resource-item" title="Capital Político">
            <Shield className="text-blue" size={16} />
            <span className="text-mono">{game.resources.politicalCapital} CP</span>
          </div>
          <div className="resource-item" title="Tus Escaños">
            <Users className="text-yellow" size={16} />
            <span className="text-mono font-bold">{game.resources.seats}</span>
          </div>
          <div className="resource-item" title="Popularidad">
            <TrendingUp className="text-red" size={16} />
            <span className="text-mono">{game.resources.popularity.toFixed(1)}%</span>
          </div>

          <div className="divider-v"></div>

          <div className="resource-item" title="Deuda Pública">
            <Landmark
              className={game.economy.debt > 80 ? "text-red animate-pulse" : "text-gray"}
              size={16}
            />
            <span className={game.economy.debt > 80 ? "text-red font-bold" : "text-mono"}>
              Deuda: {game.economy.debt.toFixed(1)}%
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <aside className="col-left">
          <EconomyPanel
            economy={game.economy}
            taxProposal={game.taxProposal}
            setTaxProposal={game.setTaxProposal}
            proposeTaxChange={game.proposeTaxChange}
          />
          <CabinetPanel candidates={game.candidates} />
        </aside>

        <section className="col-center">
          <div className="panel political-map">
            <div className="panel-tabs">
              <button
                className={`tab-btn ${game.viewMode === 'seats' ? 'active' : ''}`}
                onClick={() => game.setViewMode('seats')}
              >
                <Users size={12} /> Escaños
              </button>
              <button
                className={`tab-btn ${game.viewMode === 'map' ? 'active' : ''}`}
                onClick={() => game.setViewMode('map')}
              >
                <MapIcon size={12} /> Mapa
              </button>
            </div>

            {game.viewMode === 'seats' ? (
              <SeatsView
                resources={game.resources}
                rivalParties={game.rivalParties}
                playerIdeologyX={game.ideologyX}
                playerColorClass={game.playerColor}
              />
            ) : (
              <PoliticalMap
                ideologyX={game.ideologyX}
                ideologyY={game.ideologyY}
                rivalParties={game.rivalParties}
              />
            )}
          </div>

          <MessageLog messages={game.messages} />
        </section>

        <aside className="col-right">
          <OperationsPanel
            phase={game.phase}
            currentLaw={game.currentLaw}
            handleAction={game.handleAction}
            startLegislativeSession={game.startLegislativeSession}
            voteOnLaw={game.voteOnLaw}
          />
        </aside>
      </main>
    </div>
  );
}