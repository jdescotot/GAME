import React from 'react';
import { User, Users, DollarSign, TrendingUp, Shield, Flag, Mic, Briefcase, Activity, Vote, Map as MapIcon, Landmark } from 'lucide-react';
import './App.css';

// Importaciones
import { FACTIONS } from './data/constants';
import { StatBar } from './components/StatBar';
import { PowerHungerBar } from './components/PowerHungerBar';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const game = useGameLogic();

  // Cálculo rápido para mostrar proyecciones en la UI (Lógica Nueva)
  const projectedRevenue = (game.taxProposal / 100) * 100000; 
  const currentRevenue = (game.economy.taxRate / 100) * 100000;
  const projectedDeficit = game.economy.annualSpending - currentRevenue;

  if (game.phase === 'setup') {
    return (
        <div className="setup-screen">
          <div className="setup-card">
            <h1 className="setup-title">El Peso del Escaño</h1>
            <p className="setup-desc">Diseña tu partido. Ahora gestionas la crisis nacional.</p>
            <div className="form-group">
                <label>Nombre del Partido</label>
                <input type="text" value={game.partyName} onChange={(e) => game.setPartyName(e.target.value)} className="form-input" />
            </div>
             <div className="range-container">
                <div className="range-labels"><span>Izquierda</span><span>Derecha</span></div>
                <input type="range" min="0" max="100" value={game.ideologyX} onChange={(e) => game.setIdeologyX(parseInt(e.target.value))} className="range-input" />
            </div>
            <div className="range-container">
                <div className="range-labels"><span>Progresista</span><span>Conservador</span></div>
                <input type="range" min="0" max="100" value={game.ideologyY} onChange={(e) => game.setIdeologyY(parseInt(e.target.value))} className="range-input" />
            </div>
            <button onClick={game.handleFundarPartido} className="btn-primary">Iniciar Gobierno</button>
          </div>
        </div>
    );
  }

  return (
    <div className="game-container">
      {/* HEADER: Fusión de recursos del partido + Datos económicos */}
      <header className="game-header">
        <div className="party-info">
            <div className="party-logo">{game.partyName.charAt(0)}</div>
            <div>
            <h1 className="party-name">{game.partyName}</h1>
            <p className="turn-info">Turno {game.turn}</p>
            </div>
        </div>
        
        <div className="resources-bar">
             {/* Recursos del Partido (Viejo) */}
            <div className="resource-item" title="Dinero del Partido"><DollarSign className="text-green" size={16} /><span className="text-mono">${game.resources.money}</span></div>
            <div className="resource-item" title="Capital Político"><Shield className="text-blue" size={16} /><span className="text-mono">{game.resources.politicalCapital} CP</span></div>
            <div className="resource-item" title="Tus Escaños"><Users className="text-yellow" size={16} /><span className="text-mono font-bold">{game.resources.seats}</span></div>
            {/* Restauramos Popularidad que faltaba en el nuevo */}
            <div className="resource-item" title="Popularidad"><TrendingUp className="text-red" size={16} /><span className="text-mono">{game.resources.popularity.toFixed(1)}%</span></div>
            
            <div className="divider-v"></div>

            {/* Datos Nacionales (Nuevo) */}
            <div className="resource-item" title="Deuda Pública">
                <Landmark className={game.economy.debt > 80 ? "text-red animate-pulse" : "text-gray"} size={16} />
                <span className={game.economy.debt > 80 ? "text-red font-bold" : "text-mono"}>Deuda: {game.economy.debt.toFixed(1)}%</span>
            </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="col-left">
           {/* 1. Panel de ECONOMÍA NACIONAL (Nuevo) */}
           <div className="panel">
            <h3 className="panel-title"><Landmark size={12} /> Economía Nacional</h3>
            
            <div className="stat-row">
                <span>Gasto Anual:</span>
                <span className="text-red">-${game.economy.annualSpending.toLocaleString()} M</span>
            </div>
            <div className="stat-row">
                <span>Recaudación:</span>
                <span className="text-green">+${currentRevenue.toLocaleString()} M</span>
            </div>
            <div className="stat-row" style={{borderTop:'1px solid #333', paddingTop:'4px', marginTop:'4px'}}>
                <span>Déficit:</span>
                <span className={projectedDeficit > 0 ? "text-red" : "text-green"}>
                    {projectedDeficit > 0 ? `-${projectedDeficit.toLocaleString()}` : `+${Math.abs(projectedDeficit).toLocaleString()}`} M
                </span>
            </div>

            <div className="tax-control-area">
                <label className="text-xs text-gray-400">Impuestos (I.S.R.)</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="range" min="10" max="60" 
                        value={game.taxProposal} 
                        onChange={(e) => game.setTaxProposal(parseInt(e.target.value))} 
                        className="range-input"
                    />
                    <span className="text-mono font-bold">{game.taxProposal}%</span>
                </div>
                
                {game.taxProposal !== game.economy.taxRate && (
                    <button onClick={game.proposeTaxChange} className="btn-xs btn-primary mt-2 w-full">
                        Someter Reforma ({game.taxProposal > game.economy.taxRate ? 'Subir' : 'Bajar'})
                    </button>
                )}
                {game.taxProposal === game.economy.taxRate && (
                     <p className="text-xs text-center mt-2 text-gray-500">Mueve el slider para proponer cambios.</p>
                )}
            </div>
          </div>

          {/* 2. Gabinete Detallado (RESTAURADO DEL CÓDIGO VIEJO) */}
          <div className="panel mt-4">
            <h3 className="panel-title"><Briefcase size={12} /> Tu Gabinete</h3>
            {game.candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-header">
                  <span className="candidate-name">{candidate.name}</span>
                  <span className="candidate-lvl">Nvl 1</span>
                </div>
                {/* Restauradas las barras visuales */}
                <StatBar label="Carisma" value={candidate.oratory} color="bg-purple" />
                <StatBar label="Lealtad" value={candidate.loyalty} color="bg-green" />
                <PowerHungerBar value={candidate.powerHunger} oratory={candidate.oratory} />
              </div>
            ))}
          </div>
        </aside>

        <section className="col-center">
          <div className="panel political-map">
            <div className="panel-tabs">
              <button className={`tab-btn ${game.viewMode === 'seats' ? 'active' : ''}`} onClick={() => game.setViewMode('seats')}><Users size={12} /> Escaños</button>
              <button className={`tab-btn ${game.viewMode === 'map' ? 'active' : ''}`} onClick={() => game.setViewMode('map')}><MapIcon size={12} /> Mapa</button>
            </div>

            {game.viewMode === 'seats' ? (
               <div className="seats-view-content">
                 <div className="hemiciclo">
                   {[...Array(game.resources.seats)].map((_, i) => <div key={`p-${i}`} className="seat bg-yellow animate-pulse"></div>)}
                   {game.rivalParties.flatMap(p => [...Array(p.seats)].map((_, i) => (
                     <div key={`${p.name}-${i}`} className={`seat ${p.bg}`}></div>
                   )))}
                 </div>
                 <div className="seats-legend grid-cols-2">
                    <div className="legend-item"><div className="seat bg-yellow"></div> <span>TÚ: {game.resources.seats}</span></div>
                    {game.rivalParties.map(p => (
                        <div key={p.name} className="legend-item"><div className={`seat ${p.bg}`}></div> <span>{p.name}: {p.seats}</span></div>
                    ))}
                 </div>
               </div>
            ) : (
                <div className="map-view-content">
                    {/* Renderizado del mapa COMPLETO (Restaurado) */}
                    <div className="map-axis-h"><div /></div>
                    <div className="map-axis-v"><div /></div>
                    <span className="map-label" style={{left:'8px', top:'50%', transform:'translateY(-50%)'}}>IZQUIERDA</span>
                    <span className="map-label" style={{right:'8px', top:'50%', transform:'translateY(-50%)'}}>DERECHA</span>
                    
                    {FACTIONS.map(f => (
                        <div key={f.id} className="faction-node" style={{left:`${f.x}%`, top:`${f.y}%`}}>
                            <div className={`faction-dot ${f.color}`} title={f.desc}></div>
                            <span className="faction-name">{f.name}</span>
                        </div>
                    ))}
                    
                    <div className="player-token" style={{left:`${game.ideologyX}%`, top:`${game.ideologyY}%`}}>
                        <div className="player-diamond"></div>
                        <span className="player-label">TÚ</span>
                    </div>

                    {game.rivalParties.map((p, idx) => (
                        <div key={idx} className={`rival-token ${p.bg}`} title={p.name}
                        style={{ left: `${p.x}%`, top: `${p.y}%`, position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white', transform: 'translate(-50%, -50%)' }}
                        ></div>
                    ))}
                </div>
            )}
          </div>

          <div className="message-log">
            {game.messages.length === 0 && <p style={{textAlign:'center', fontStyle:'italic', color:'#475569', fontSize:'0.875rem'}}>Esperando acciones...</p>}
            {game.messages.map((msg) => <div key={msg.id} className={`msg-item ${msg.color}`}>• {msg.text}</div>)}
          </div>
        </section>

        <aside className="col-right">
          {game.phase === 'dashboard' ? (
            <div className="panel h-full flex flex-col">
              <h3 className="panel-title">Operaciones</h3>
              
              {/* BOTONES RESTAURADOS (Campaña, Lobby, Protesta) */}
              <button onClick={() => game.handleAction('campaign')} className="op-button">
                <div className="op-icon bg-green-900 text-green-400"><Mic size={18} /></div>
                <div><div className="op-info-title">Campaña TV</div><div className="op-info-cost">-$500 | +Pop</div></div>
              </button>

              <button onClick={() => game.handleAction('lobby')} className="op-button">
                 <div className="op-icon" style={{backgroundColor:'rgba(202, 138, 4, 0.2)', color:'#facc15'}}><Briefcase size={18} /></div>
                 <div>
                   <div className="op-info-title">Cabildeo (Lobby)</div>
                   <div className="op-info-cost">-5 CP | +$800, -Pop</div>
                 </div>
              </button>

              <button onClick={() => game.handleAction('protest')} className="op-button">
                 <div className="op-icon" style={{backgroundColor:'rgba(220, 38, 38, 0.2)', color:'#f87171'}}><Flag size={18} /></div>
                 <div>
                   <div className="op-info-title">Organizar Marcha</div>
                   <div className="op-info-cost">-10 CP | +Presión</div>
                 </div>
              </button>
              
              <div className="mt-auto pt-4 border-t border-gray-700">
                <button onClick={game.startLegislativeSession} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Activity size={18} /> Sesión Legislativa
                </button>
              </div>
            </div>
          ) : game.phase === 'legislation' && game.currentLaw ? (
            <div className="panel legislation-panel">
               <div className="panel-title text-center mb-4"><Vote size={20} className="inline mr-2"/> Votación en Curso</div>
               <div className="law-card">
                 <h2 className="text-lg font-bold mb-2">{game.currentLaw.title}</h2>
                 <div className="flex flex-wrap gap-2 mb-4">
                    <span className="law-tag bg-gray-700">{game.currentLaw.type}</span>
                    {/* NUEVO: Mostramos el Costo Fiscal */}
                    <span className={`law-tag ${game.currentLaw.fiscalCost > 0 ? 'text-red bg-red-900/30' : 'text-green bg-green-900/30'}`}>
                        {game.currentLaw.fiscalCost > 0 ? `Costo: $${game.currentLaw.fiscalCost}M` : `Ahorro: $${Math.abs(game.currentLaw.fiscalCost)}M`}
                    </span>
                    <span className="law-tag" style={{backgroundColor: game.currentLaw.favor === 'right' ? 'rgba(37,99,235,0.2)' : 'rgba(220,38,38,0.2)', color: game.currentLaw.favor === 'right' ? '#60a5fa' : '#f87171'}}>
                      Favorece: {game.currentLaw.favor === 'right' ? 'Derecha' : 'Izquierda'}
                    </span>
                 </div>
                 <p className="text-sm text-gray-400 mb-4">
                   Impacto: {game.currentLaw.impact.chaos > 0 ? "Genera desorden social" : "Estabiliza el orden"}.
                 </p>
               </div>
               <div className="mt-auto space-y-2">
                 <button onClick={() => game.voteOnLaw('yes')} className="btn-vote btn-vote-yes w-full">Votar A FAVOR</button>
                 <button onClick={() => game.voteOnLaw('no')} className="btn-vote btn-vote-no w-full">Votar EN CONTRA</button>
                 <button onClick={() => game.voteOnLaw('abstain')} className="btn-vote btn-vote-abs w-full">ABSTENCIÓN</button>
               </div>
            </div>
          ) : null}
        </aside>
      </main>
    </div>
  );
}