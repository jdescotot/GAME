import { useState, useEffect } from 'react';
import { generateRivals } from '../functions/generateRivals';
import { LAWS } from '../data/constants';

const GDP_BASE = 100000; // PIB del país para calcular recaudación
const TURNS_PER_LEGISLATURE = 20; // 20 turnos por legislatura

export const useGameLogic = () => {
  // --- ESTADOS BÁSICOS ---
  const [phase, setPhase] = useState('setup');
  const [turn, setTurn] = useState(1);
  const [legislature, setLegislature] = useState(1); // 🔸 NUEVO: legislatura actual
  const [messages, setMessages] = useState([]);
  
  // --- DATOS DEL JUGADOR ---
  const [partyName, setPartyName] = useState('Nuevo Movimiento');
  const [ideologyX, setIdeologyX] = useState(50);
  const [ideologyY, setIdeologyY] = useState(50);
  const [playerColor, setPlayerColor] = useState('text-yellow-500');
  const [resources, setResources] = useState({
    money: 1000,       // Dinero del PARTIDO (Caja chica)
    politicalCapital: 20,
    seats: 5,          // Escaños iniciales (cambiado a 5 para dar espacio a otros)
    popularity: 10,
  });

  // --- ECONOMÍA NACIONAL (NUEVO) ---
  const [economy, setEconomy] = useState({
    debt: 40,           // % del PIB
    taxRate: 20,        // % de Impuestos actual
    annualSpending: 18000 // Gasto público base
  });
  
  const [taxProposal, setTaxProposal] = useState(20); // Valor del slider antes de votar

  // --- RIVALES Y LEYES ---
  const [rivalParties, setRivalParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentLaw, setCurrentLaw] = useState(null);
  const [viewMode, setViewMode] = useState('seats'); // Empezamos en escaños para ver la distribución

  // --- INICIALIZACIÓN ---
  const generateCandidate = (id) => ({
      id, name: `Político ${id}`, oratory: Math.floor(Math.random()*100), 
      loyalty: 50 + Math.floor(Math.random()*50), powerHunger: Math.floor(Math.random()*100)
  });

  useEffect(() => {
    setCandidates([generateCandidate(1), generateCandidate(2), generateCandidate(3)]);
  }, []);

  const addMessage = (text, type = 'neutral') => {
    const colorMap = { error: 'text-red', success: 'text-green', warning: 'text-yellow' };
    setMessages(prev => [{text, color: colorMap[type] || '', id: Date.now()}, ...prev.slice(0, 4)]);
  };

  const handleFundarPartido = () => {
    const generated = generateRivals(resources.seats);
    setRivalParties(generated);
    setPhase('dashboard');
    addMessage(`¡${partyName} fundado! La economía está al ${economy.taxRate}% de impuestos.`, "success");
  };

  // --- NUEVA FUNCIÓN: ELECCIONES ---
  const holdElections = () => {
    // Fórmula: popularidad (0-100) → escaños (1-35)
    const newSeats = Math.max(1, Math.min(35, Math.floor((resources.popularity / 100) * 35)));
    
    // Mensaje según cambio
    const change = newSeats - resources.seats;
    if (change > 0) {
      addMessage(`¡Victoria electoral! Ganas ${change} escaños (${newSeats} total).`, "success");
    } else if (change < 0) {
      addMessage(`Derrota electoral. Pierdes ${Math.abs(change)} escaños (${newSeats} total).`, "error");
    } else {
      addMessage(`Empate electoral. Conservas ${newSeats} escaños.`, "warning");
    }

    // Actualizar estado
    setResources(prev => ({ ...prev, seats: newSeats }));
    const newRivals = generateRivals(newSeats);
    setRivalParties(newRivals);

    // Reiniciar turno, avanzar legislatura
    setTurn(1);
    setLegislature(prev => prev + 1);
  };

  // --- NUEVA FUNCIÓN: FINALIZAR TURNO ---
  const endTurn = () => {
    const nextTurn = turn + 1;
    if (nextTurn > TURNS_PER_LEGISLATURE) {
      holdElections();
    } else {
      setTurn(nextTurn);
    }
  };

  // --- LÓGICA DE VOTACIÓN DE IMPUESTOS ---
  const getPartySupportForTaxChange = (partyIdeology, isTaxHike) => {
    if (partyIdeology === 'FAR_LEFT') return isTaxHike;
    if (partyIdeology === 'LEFT') return isTaxHike;
    if (partyIdeology === 'GREEN') return isTaxHike;
    if (partyIdeology === 'CENTER') return !isTaxHike;
    if (partyIdeology === 'RIGHT') return !isTaxHike;
    if (partyIdeology === 'FAR_RIGHT') return !isTaxHike;
    if (partyIdeology === 'MINOR' || partyIdeology === 'POPULIST') {
      return Math.random() > 0.4;
    }
    return Math.random() > 0.5;
  };

  const proposeTaxChange = () => {
    if (taxProposal === economy.taxRate) return;

    const isTaxHike = taxProposal > economy.taxRate;
    let yesVotes = 0;

    rivalParties.forEach(party => {
      const vote = getPartySupportForTaxChange(party.ideology, isTaxHike);
      if (vote) yesVotes += party.seats;
    });

    yesVotes += resources.seats;

    if (yesVotes > 50) {
      setEconomy(prev => ({ ...prev, taxRate: taxProposal }));
      addMessage(`Reforma Fiscal APROBADA (${yesVotes} votos). Impuestos: ${taxProposal}%`, "success");
      
      if (isTaxHike) {
        setResources(prev => ({...prev, popularity: prev.popularity - 5}));
        addMessage("La gente protesta por la subida de impuestos.", "warning");
      } else {
        setResources(prev => ({...prev, popularity: prev.popularity + 3}));
        addMessage("La bajada de impuestos alegra al mercado.", "success");
      }
    } else {
      addMessage(`Reforma Fiscal RECHAZADA (${yesVotes} votos).`, "error");
      setTaxProposal(economy.taxRate);
    }

    endTurn(); // 🔸 Aquí se llama al sistema de legislaturas
  };

  // --- ACCIONES DE TURNO ---
  const handleAction = (actionType) => {
    if (actionType === 'campaign') {
        if(resources.money >= 500) {
            setResources(p => ({...p, money: p.money - 500, popularity: p.popularity + 2}));
            addMessage("Campaña realizada.", "success");
        }
    }
  };

  const startLegislativeSession = () => {
    setCurrentLaw(LAWS[Math.floor(Math.random() * LAWS.length)]);
    setPhase('legislation');
  };

  // --- LÓGICA DE AFINIDAD IDEOLÓGICA PARA LEYES ---
  const getPartySupportForLaw = (partyIdeology, lawFavor) => {
    if (partyIdeology === 'FAR_LEFT') {
      return ['far-left', 'center-left'].includes(lawFavor);
    }
    if (partyIdeology === 'LEFT') {
      return ['center-left', 'green'].includes(lawFavor);
    }
    if (partyIdeology === 'CENTER') {
      return ['center-left', 'center-right', 'neutral', 'green'].includes(lawFavor);
    }
    if (partyIdeology === 'RIGHT') {
      return ['center-right', 'neutral'].includes(lawFavor);
    }
    if (partyIdeology === 'FAR_RIGHT') {
      return ['far-right', 'center-right'].includes(lawFavor);
    }
    if (partyIdeology === 'GREEN') {
      return ['green', 'center-left'].includes(lawFavor);
    }
    if (partyIdeology === 'MINOR' || partyIdeology === 'POPULIST') {
      if (lawFavor === 'far-left' || lawFavor === 'far-right') return Math.random() > 0.3;
      return ['center-left', 'center-right', 'neutral', 'green'].includes(lawFavor) && Math.random() > 0.5;
    }
    return lawFavor === 'neutral' || Math.random() > 0.6;
  };

  // --- VOTACIÓN DE LEYES ---
const voteOnLaw = (vote) => {
  let yesVotes = 0;
  
  rivalParties.forEach(party => {
    const supports = getPartySupportForLaw(party.ideology, currentLaw.favor);
    if (supports) {
      yesVotes += party.seats;
    }
  });

  if (vote === 'yes') yesVotes += resources.seats;

  if (yesVotes > 50) {
    addMessage(`Ley "${currentLaw.title}" APROBADA.`, "success");
    
    setEconomy(prev => ({
      ...prev,
      annualSpending: prev.annualSpending + (currentLaw.fiscalCost || 0)
    }));

    if (currentLaw.fiscalCost > 0) addMessage(`El gasto público aumenta en $${currentLaw.fiscalCost}M`, "warning");
    else if (currentLaw.fiscalCost < 0) addMessage(`El estado ahorra $${Math.abs(currentLaw.fiscalCost)}M`, "success");

  } else {
    addMessage(`Ley RECHAZADA.`, "error");
  }

  // --- FIN DE TURNO Y CÁLCULO DE DEUDA ---
  const revenue = (economy.taxRate / 100) * GDP_BASE;
  const deficit = economy.annualSpending - revenue;
  const debtChange = deficit / 1000;
  
  setEconomy(prev => ({
    ...prev,
    debt: Math.max(0, prev.debt + debtChange)
  }));

  if (economy.debt > 90) addMessage("¡PELIGRO! La deuda está crítica.", "error");

  setPhase('dashboard');
  setCurrentLaw(null);

  // Ahora sí, avanzar al siguiente turno (con legislaturas)
  endTurn();
};

  return {
    phase, rivalParties, viewMode, setViewMode, turn, legislature, messages, // 🔸 legislature exportado
    partyName, setPartyName, ideologyX, setIdeologyX, ideologyY, setIdeologyY,
    resources, candidates, currentLaw, economy, setEconomy,
    taxProposal, setTaxProposal, proposeTaxChange,
    handleFundarPartido, handleAction, startLegislativeSession, voteOnLaw
  };
};