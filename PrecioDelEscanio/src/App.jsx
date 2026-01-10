import React, { useState, useEffect } from 'react';
import { User, Users, DollarSign, TrendingUp, AlertTriangle, Shield, Flag, Mic, Briefcase, Activity, Vote, Map as MapIcon } from 'lucide-react';
import './App.css';
import { generateRivals } from './functions/generateRivals';

// --- CONSTANTES Y DATOS ---
const FACTIONS = [
  { id: 'conserv', name: 'Conservadores', x: 70, y: 70, color: 'bg-blue', desc: 'Tradición, Orden, Religión' },
  { id: 'lib', name: 'Liberales', x: 30, y: 30, color: 'bg-indigo', desc: 'Derechos Civiles, Educación' },
  { id: 'com', name: 'Sindicatos/Comunistas', x: 10, y: 50, color: 'bg-red', desc: 'Estado fuerte, Anti-capital' },
  { id: 'cap', name: 'Oligarquía/Libertarios', x: 90, y: 50, color: 'bg-yellow', desc: 'Mercado libre, Cero impuestos' },
  { id: 'pop', name: 'Desencantados', x: 50, y: 50, color: 'bg-gray', desc: 'Votan por carisma o populismo' },
];

// --- COMPONENTES AUXILIARES ---

const StatBar = ({ label, value, max = 100, color = "bg-blue", showValue = true }) => (
  <div className="stat-bar-container">
    <div className="stat-bar-header">
      <span>{label}</span>
      {showValue && <span>{Math.round(value)}/{max}</span>}
    </div>
    <div className="stat-bar-bg">
      <div className={`stat-bar-fill ${color}`} style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}></div>
    </div>
  </div>
);

const PowerHungerBar = ({ value, oratory }) => {
  const uncertainty = Math.floor((oratory / 100) * 40); 
  const min = Math.max(0, value - uncertainty);
  const max = Math.min(100, value + uncertainty);
  const isTransparent = oratory < 20;

  return (
    <div className="stat-bar-container">
      <div className="stat-bar-header" style={{ color: '#fca5a5' }}>
        <span>Hambre de Poder</span>
        <span>{isTransparent ? `${value}%` : `~${min}% - ${max}%`}</span>
      </div>
      <div className="stat-bar-bg">
        {!isTransparent && (
          <div className="stat-bar-uncertainty" style={{ left: `${min}%`, width: `${max - min}%` }} />
        )}
        <div 
          className="stat-bar-fill" 
          style={{ width: `${value}%`, backgroundColor: isTransparent ? '#ef4444' : 'transparent' }}
        ></div>
      </div>
      <p className="stat-bar-desc">
        {isTransparent ? "Es transparente." : "Su oratoria oculta sus intenciones."}
      </p>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [phase, setPhase] = useState('setup');
  const [rivalParties, setRivalParties] = useState([]); // Ahora es un estado vacío al inicio
  const [viewMode, setViewMode] = useState('map'); // 'map' o 'seats'
  const [turn, setTurn] = useState(1);
  const [messages, setMessages] = useState([]);
  
  const [partyName, setPartyName] = useState('Nuevo Movimiento');
  const [ideologyX, setIdeologyX] = useState(50);
  const [ideologyY, setIdeologyY] = useState(50);
  
  const [resources, setResources] = useState({
    money: 1000,
    politicalCapital: 20,
    seats: 3,
    popularity: 5,
  });

  const [candidates, setCandidates] = useState([]);
  const [currentLaw, setCurrentLaw] = useState(null);

  const LAWS = [
    { title: "Privatización del Agua", type: "economic", favor: "right", impact: { money: 200, chaos: 10, approvalLeft: -15, approvalRight: 10 } },
    { title: "Salud Universal Gratuita", type: "social", favor: "left", impact: { money: -200, chaos: -5, approvalLeft: 15, approvalRight: -10 } },
    { title: "Ley de Mano Dura", type: "security", favor: "right", impact: { money: -50, chaos: -20, approvalLeft: -20, approvalRight: 20 } },
    { title: "Impuesto a la Riqueza", type: "economic", favor: "left", impact: { money: 150, chaos: 5, approvalLeft: 20, approvalRight: -25 } },
  ];

  useEffect(() => {
    setCandidates([generateCandidate(1), generateCandidate(2), generateCandidate(3)]);
  }, []);

  const generateCandidate = (id) => {
    const oratory = Math.floor(Math.random() * 100);
    return {
      id,
      name: `Político ${id}`,
      oratory: oratory,
      management: Math.floor(Math.random() * 100),
      loyalty: 50 + Math.floor(Math.random() * 50),
      powerHunger: Math.floor(Math.random() * 100),
      status: 'active'
    };
  };

  const addMessage = (text, type = 'neutral') => {
    const colorMap = { error: 'text-red', success: 'text-green', warning: 'text-yellow' };
    setMessages(prev => [{text, color: colorMap[type] || '', id: Date.now()}, ...prev.slice(0, 4)]);
  };

  const handleFundarPartido = () => {
    // Generamos los rivales usando la función importada antes de entrar al dashboard
    const generated = generateRivals(resources.seats);
    setRivalParties(generated);
    setPhase('dashboard');
    addMessage(`¡${partyName} ha sido fundado!`, "success");
  };

  const handleAction = (actionType) => {
    if (actionType === 'campaign') {
      const cost = 500;
      if (resources.money < cost) return addMessage("No tienes fondos suficientes.", "error");
      setResources(prev => ({...prev, money: prev.money - cost, popularity: prev.popularity + (Math.random() * 2 + 1)}));
      addMessage("Campaña de TV realizada. Suben las encuestas.", "success");
    } 
    else if (actionType === 'lobby') {
      const cost = 5;
      if (resources.politicalCapital < cost) return addMessage("No tienes capital político.", "error");
      const gain = 800;
      setResources(prev => ({...prev, politicalCapital: prev.politicalCapital - cost, money: prev.money + gain, popularity: prev.popularity - 1}));
      addMessage(`Reunión con la Oligarquía. Recibes $${gain}, pero te critican.`, "warning");
    }
    else if (actionType === 'protest') {
      const cost = 10;
      if (resources.politicalCapital < cost) return addMessage("Necesitas más influencia.", "error");
      const success = Math.random() > 0.4;
      setResources(prev => ({...prev, politicalCapital: prev.politicalCapital - cost, popularity: success ? prev.popularity + 3 : prev.popularity - 2}));
      if (success) addMessage("¡La marcha fue un éxito!", "success");
      else addMessage("La protesta se volvió violenta.", "error");
    }
  };

  const startLegislativeSession = () => {
    setCurrentLaw(LAWS[Math.floor(Math.random() * LAWS.length)]);
    setPhase('legislation');
  };

  const voteOnLaw = (vote) => {
    let yesVotes = 0;

    // Lógica de votación basada en ideología de los rivales dinámicos
    rivalParties.forEach(party => {
      if (currentLaw.favor === 'right' && party.ideology === 'RIGHT') yesVotes += party.seats;
      else if (currentLaw.favor === 'left' && party.ideology === 'LEFT') yesVotes += party.seats;
      else if (['CENTER', 'GREEN', 'MINOR'].includes(party.ideology)) {
        if (Math.random() > 0.5) yesVotes += party.seats;
      }
    });

    if (vote === 'yes') yesVotes += resources.seats;

    const passed = yesVotes > 50;
    if (passed) {
      addMessage(`Ley "${currentLaw.title}" APROBADA (${yesVotes} votos).`, "success");
      setResources(prev => ({...prev, politicalCapital: prev.politicalCapital + (vote === 'yes' ? 10 : -5), money: prev.money + (currentLaw.impact.money || 0)}));
    } else {
      addMessage(`Ley "${currentLaw.title}" RECHAZADA (${yesVotes} votos).`, "error");
    }
    
    setCandidates(prev => prev.map(c => ({...c, powerHunger: Math.min(100, c.powerHunger + (passed && vote === 'yes' ? 5 : 1))})));
    setPhase('dashboard');
    setTurn(t => t + 1);
  };

  if (phase === 'setup') {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <h1 className="setup-title">El Peso del Escaño</h1>
          <p className="setup-desc">Diseña tu partido político. En Latinoamérica, el centro no existe, es un campo de batalla.</p>
          <div className="form-group">
            <label className="form-label">Nombre del Partido</label>
            <input type="text" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="form-input" />
          </div>
          <div className="range-container">
            <div className="range-labels"><span>Izquierda (Estado)</span><span>Derecha (Mercado)</span></div>
            <input type="range" min="0" max="100" value={ideologyX} onChange={(e) => setIdeologyX(parseInt(e.target.value))} className="range-input" />
          </div>
          <div className="range-container">
            <div className="range-labels"><span>Progresista (Cambio)</span><span>Conservador (Orden)</span></div>
            <input type="range" min="0" max="100" value={ideologyY} onChange={(e) => setIdeologyY(parseInt(e.target.value))} className="range-input" />
          </div>
          <button onClick={handleFundarPartido} className="btn-primary">Fundar Partido</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="party-info">
          <div className="party-logo">{partyName.charAt(0)}</div>
          <div>
            <h1 className="party-name">{partyName}</h1>
            <p className="turn-info">Turno {turn} | Legislatura 1</p>
          </div>
        </div>
        <div className="resources-bar">
          <div className="resource-item"><DollarSign className="text-green" size={16} /><span className="text-mono">{resources.money.toLocaleString()}</span></div>
          <div className="resource-item"><Shield className="text-blue" size={16} /><span className="text-mono">{resources.politicalCapital} CP</span></div>
          <div className="resource-item"><Users className="text-yellow" size={16} /><span className="text-mono" style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{resources.seats}</span><span style={{fontSize:'10px', color:'#64748b'}}>/ 100</span></div>
          <div className="resource-item"><TrendingUp className="text-red" size={16} /><span className="text-mono">{resources.popularity.toFixed(1)}%</span></div>
        </div>
      </header>

      <main className="main-content">
        <aside className="col-left">
          <div className="panel">
            <h3 className="panel-title"><Briefcase size={12} /> Tu Gabinete</h3>
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-header">
                  <span className="candidate-name">{candidate.name}</span>
                  <span className="candidate-lvl">Nvl 1</span>
                </div>
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
              <button 
                className={`tab-btn ${viewMode === 'map' ? 'active' : ''}`} 
                onClick={() => setViewMode('map')}
              >
                <MapIcon size={12} /> Mapa
              </button>
              <button 
                className={`tab-btn ${viewMode === 'seats' ? 'active' : ''}`} 
                onClick={() => setViewMode('seats')}
              >
                <Users size={12} /> Escaños
              </button>
            </div>

            {viewMode === 'map' ? (
              <div className="map-view-content">
                <div className="map-axis-h"><div /></div>
                <div className="map-axis-v"><div /></div>
                <span className="map-label" style={{left:'8px', top:'50%', transform:'translateY(-50%)'}}>IZQUIERDA</span>
                <span className="map-label" style={{right:'8px', top:'50%', transform:'translateY(-50%)'}}>DERECHA</span>
                <span className="map-label" style={{top:'8px', left:'50%', transform:'translateX(-50%)'}}>LIBERAL</span>
                <span className="map-label" style={{bottom:'8px', left:'50%', transform:'translateX(-50%)'}}>CONSERVADOR</span>

                {FACTIONS.map(f => (
                  <div key={f.id} className="faction-node" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
                    <div className={`faction-dot ${f.color}`} title={f.desc}></div>
                    <span className="faction-name">{f.name}</span>
                  </div>
                ))}

                <div className="player-token" style={{ left: `${ideologyX}%`, top: `${ideologyY}%` }}>
                  <div className="player-diamond"></div>
                  <span className="player-label">TÚ</span>
                </div>

                {rivalParties.map((p, idx) => (
                   <div 
                    key={idx} 
                    className={`rival-token ${p.bg}`} 
                    title={p.name}
                    style={{ left: `${p.x}%`, top: `${p.y}%`, position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white', transform: 'translate(-50%, -50%)' }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="seats-view-content">
                <div className="hemiciclo">
                  {[...Array(resources.seats)].map((_, i) => <div key={`p-${i}`} className="seat bg-yellow animate-pulse" title={partyName}></div>)}
                  {rivalParties.flatMap(p => [...Array(p.seats)].map((_, i) => (
                    <div key={`${p.name}-${i}`} className={`seat ${p.bg}`} title={p.name}></div>
                  )))}
                </div>
                <div className="seats-legend">
                  <div className="legend-item"><div className="seat bg-yellow"></div> <span>{partyName}: {resources.seats}</span></div>
                  {rivalParties.map(p => (
                    <div key={p.name} className="legend-item"><div className={`seat ${p.bg}`}></div> <span>{p.name}: {p.seats}</span></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="message-log">
            {messages.length === 0 && <p style={{textAlign:'center', fontStyle:'italic', color:'#475569', fontSize:'0.875rem'}}>Esperando acciones...</p>}
            {messages.map((msg) => (
              <div key={msg.id} className={`msg-item ${msg.color}`}>• {msg.text}</div>
            ))}
          </div>
        </section>

        <aside className="col-right">
          {phase === 'dashboard' ? (
            <div className="panel" style={{height:'100%', display:'flex', flexDirection:'column'}}>
              <h3 className="panel-title">Operaciones</h3>
              <button onClick={() => handleAction('campaign')} className="op-button">
                <div className="op-icon" style={{backgroundColor:'rgba(22, 163, 74, 0.2)', color:'#4ade80'}}><Mic size={18} /></div>
                <div>
                  <div className="op-info-title">Campaña TV</div>
                  <div className="op-info-cost">-$500 | +Popularidad</div>
                </div>
              </button>
              <button onClick={() => handleAction('lobby')} className="op-button">
                <div className="op-icon" style={{backgroundColor:'rgba(202, 138, 4, 0.2)', color:'#facc15'}}><Briefcase size={18} /></div>
                <div>
                  <div className="op-info-title">Cabildeo (Lobby)</div>
                  <div className="op-info-cost">-5 CP | +$800, -Pop</div>
                </div>
              </button>
              <button onClick={() => handleAction('protest')} className="op-button">
                <div className="op-icon" style={{backgroundColor:'rgba(220, 38, 38, 0.2)', color:'#f87171'}}><Flag size={18} /></div>
                <div>
                  <div className="op-info-title">Organizar Marcha</div>
                  <div className="op-info-cost">-10 CP | +Presión</div>
                </div>
              </button>
              <div style={{marginTop:'auto', paddingTop:'1rem', borderTop:'1px solid #334155'}}>
                <button onClick={startLegislativeSession} className="btn-primary animate-pulse" style={{backgroundColor:'#2563eb', color:'white'}}>
                  <Activity size={18} /> Ir al Parlamento
                </button>
              </div>
            </div>
          ) : phase === 'legislation' && currentLaw ? (
            <div className="panel legislation-panel">
               <div className="leg-header-line"></div>
               <div className="panel-title"><Vote size={20} /> Sesión en curso</div>
               <div className="law-card">
                 <h2 style={{fontSize:'1.125rem', fontWeight:'bold', marginBottom:'0.5rem'}}>{currentLaw.title}</h2>
                 <div style={{marginBottom:'0.5rem'}}>
                    <span className="law-tag" style={{backgroundColor:'#334155', color:'#94a3b8'}}>{currentLaw.type}</span>
                    <span className="law-tag" style={{backgroundColor: currentLaw.favor === 'right' ? 'rgba(37,99,235,0.2)' : 'rgba(220,38,38,0.2)', color: currentLaw.favor === 'right' ? '#60a5fa' : '#f87171'}}>
                      Favorece: {currentLaw.favor === 'right' ? 'Derecha' : 'Izquierda'}
                    </span>
                 </div>
                 <p style={{fontSize:'0.75rem', color:'#94a3b8'}}>
                   {currentLaw.favor === 'right' ? 'La oposición critica esta medida.' : 'Los empresarios advierten riesgos.'}
                 </p>
               </div>
               <div style={{marginTop:'auto'}}>
                 <button onClick={() => voteOnLaw('yes')} className="btn-vote btn-vote-yes">Votar A FAVOR</button>
                 <button onClick={() => voteOnLaw('no')} className="btn-vote btn-vote-no">Votar EN CONTRA</button>
                 <button onClick={() => voteOnLaw('abstain')} className="btn-vote btn-vote-abs">ABSTENCIÓN</button>
               </div>
            </div>
          ) : null}
        </aside>
      </main>
    </div>
  );
}