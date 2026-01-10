import { useState, useEffect } from 'react';
import { generateRivals } from '../functions/generateRivals';
import { LAWS } from '../data/constants';

const GDP_BASE = 100000; // PIB del país para calcular recaudación

export const useGameLogic = () => {
  // --- ESTADOS BÁSICOS ---
  const [phase, setPhase] = useState('setup');
  const [turn, setTurn] = useState(1);
  const [messages, setMessages] = useState([]);
  
  // --- DATOS DEL JUGADOR ---
  const [partyName, setPartyName] = useState('Nuevo Movimiento');
  const [ideologyX, setIdeologyX] = useState(50);
  const [ideologyY, setIdeologyY] = useState(50);
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

  // --- LÓGICA DE VOTACIÓN DE IMPUESTOS (NUEVO) ---
  const proposeTaxChange = () => {
    if (taxProposal === economy.taxRate) return;

    const isTaxHike = taxProposal > economy.taxRate;
    let yesVotes = 0;

    // Lógica de votación de los rivales
    rivalParties.forEach(party => {
      let vote = false;
      
      // DERECHA (Conservadores/Oligarquía): Odian subir impuestos, aman bajarlos
      if (party.ideology === 'RIGHT') {
        vote = !isTaxHike; 
      }
      // IZQUIERDA (Sindicatos): Aman subir impuestos (para gastar), odian bajarlos
      else if (party.ideology === 'LEFT') {
        vote = isTaxHike;
      }
      // CENTRO/POPULISTAS: Depende de la popularidad o aleatorio
      else {
        vote = Math.random() > 0.5;
      }

      if (vote) yesVotes += party.seats;
    });

    // Tu voto (asumimos que votas a favor de tu propia propuesta)
    yesVotes += resources.seats;

    if (yesVotes > 50) {
      setEconomy(prev => ({ ...prev, taxRate: taxProposal }));
      addMessage(`Reforma Fiscal APROBADA (${yesVotes} votos). Impuestos: ${taxProposal}%`, "success");
      
      // Consecuencia en popularidad inmediata
      if (isTaxHike) {
        setResources(prev => ({...prev, popularity: prev.popularity - 5}));
        addMessage("La gente protesta por la subida de impuestos.", "warning");
      } else {
        setResources(prev => ({...prev, popularity: prev.popularity + 3}));
        addMessage("La bajada de impuestos alegra al mercado.", "success");
      }
    } else {
      addMessage(`Reforma Fiscal RECHAZADA (${yesVotes} votos).`, "error");
      setTaxProposal(economy.taxRate); // Reset slider
    }
  };

  // --- ACCIONES DE TURNO ---
  const handleAction = (actionType) => {
    // (Igual que antes, omitido por brevedad, pero mantenemos la lógica de dinero del partido)
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

  // --- VOTACIÓN DE LEYES ---
  const voteOnLaw = (vote) => {
    let yesVotes = 0;
    
    // Lógica simple de rivales (se puede mejorar luego)
    rivalParties.forEach(party => {
      if (currentLaw.favor === 'right' && party.ideology === 'RIGHT') yesVotes += party.seats;
      else if (currentLaw.favor === 'left' && party.ideology === 'LEFT') yesVotes += party.seats;
      else if (Math.random() > 0.5) yesVotes += party.seats;
    });

    if (vote === 'yes') yesVotes += resources.seats;

    if (yesVotes > 50) {
      addMessage(`Ley "${currentLaw.title}" APROBADA.`, "success");
      
      // IMPACTO EN ECONOMÍA NACIONAL
      setEconomy(prev => ({
        ...prev,
        annualSpending: prev.annualSpending + (currentLaw.fiscalCost || 0)
      }));

      // Mensaje de impacto fiscal
      if (currentLaw.fiscalCost > 0) addMessage(`El gasto público aumenta en $${currentLaw.fiscalCost}M`, "warning");
      else if (currentLaw.fiscalCost < 0) addMessage(`El estado ahorra $${Math.abs(currentLaw.fiscalCost)}M`, "success");

    } else {
      addMessage(`Ley RECHAZADA.`, "error");
    }

    // --- FIN DE TURNO Y CÁLCULO DE DEUDA ---
    // Calculamos el déficit/superávit del turno
    const revenue = (economy.taxRate / 100) * GDP_BASE;
    const deficit = economy.annualSpending - revenue; // Positivo es malo (falta dinero)
    
    // Actualizamos deuda (simplificado: 1000M de déficit = +1% deuda)
    const debtChange = deficit / 1000;
    
    setEconomy(prev => ({
      ...prev,
      debt: Math.max(0, prev.debt + debtChange)
    }));

    if (economy.debt > 90) addMessage("¡PELIGRO! La deuda está crítica.", "error");

    setPhase('dashboard');
    setTurn(t => t + 1);
  };

  return {
    phase, rivalParties, viewMode, setViewMode, turn, messages,
    partyName, setPartyName, ideologyX, setIdeologyX, ideologyY, setIdeologyY,
    resources, candidates, currentLaw, economy, setEconomy,
    taxProposal, setTaxProposal, proposeTaxChange, // Exportamos lo nuevo
    handleFundarPartido, handleAction, startLegislativeSession, voteOnLaw
  };
};