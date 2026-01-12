import { useState, useEffect, useCallback } from 'react';
import { generateRivals } from '../functions/generateRivals';
import { generateFactions } from '../functions/generateFactions';
import { LAWS } from '../data/constants';

const GDP_BASE = 100000; // PIB del país para calcular recaudación
const TURNS_PER_LEGISLATURE = 20; // 20 turnos por legislatura

export const useGameLogic = () => {
  // --- ESTADOS BÁSICOS ---
  const [phase, setPhase] = useState('setup');
  const [turn, setTurn] = useState(1);
  const [legislature, setLegislature] = useState(1);
  const [messages, setMessages] = useState([]);

  // --- ESTADO DE FACCIONES (CORREGIDO: Lazy Initialization) ---
  // Usamos una función flecha para que solo se ejecute UNA vez al cargar la página
  const [activeFactions, setActiveFactions] = useState(() => generateFactions());
  
  // --- DATOS DEL JUGADOR ---
  const [partyName, setPartyName] = useState('Nuevo Movimiento');
  const [ideologyX, setIdeologyX] = useState(50);
  const [ideologyY, setIdeologyY] = useState(50);
  // const [playerColor, setPlayerColor] = useState('text-yellow-500'); // (Opcional, no usado activamente)
  const [resources, setResources] = useState({
    money: 1000,       // Dinero del PARTIDO
    politicalCapital: 20,
    seats: 5,          // Escaños iniciales
    popularity: 10,
  });

  // --- ECONOMÍA NACIONAL ---
  const [economy, setEconomy] = useState({
    debt: 40,          // % del PIB
    taxRate: 20,       // % de Impuestos actual
    annualSpending: 18000 // Gasto público base
  });
  
  const [taxProposal, setTaxProposal] = useState(20); // Valor del slider antes de votar

  // --- RIVALES Y LEYES ---
  const [rivalParties, setRivalParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentLaw, setCurrentLaw] = useState(null);
  const [viewMode, setViewMode] = useState('seats');

  // --- INICIALIZACIÓN DE CANDIDATOS (OPTIMIZADO) ---
  // Usamos useCallback para evitar advertencias de dependencias en el useEffect
  const generateCandidate = useCallback((id) => ({
      id, 
      name: `Político ${id}`, 
      oratory: Math.floor(Math.random() * 100), 
      loyalty: 50 + Math.floor(Math.random() * 50), 
      powerHunger: Math.floor(Math.random() * 100)
  }), []);

  useEffect(() => {
    setCandidates([generateCandidate(1), generateCandidate(2), generateCandidate(3)]);
  }, [generateCandidate]);

  // --- SISTEMA DE MENSAJES (CORREGIDO: Keys únicas) ---
  const addMessage = (text, type = 'neutral') => {
    const colorMap = { error: 'text-red-500', success: 'text-green-500', warning: 'text-yellow-500' };
    
    // Generamos un ID realmente único combinando tiempo y random
    const uniqueId = Date.now() + Math.random(); 

    setMessages(prev => [{
      text, 
      color: colorMap[type] || '', 
      id: uniqueId 
    }, ...prev.slice(0, 4)]);
  };

  const handleFundarPartido = () => {
    // Usamos los escaños actuales (o 5 por defecto) para generar rivales
    const generated = generateRivals(resources.seats || 5);
    setRivalParties(generated);
    setPhase('dashboard');
    addMessage(`¡${partyName} fundado! La economía está al ${economy.taxRate}% de impuestos.`, "success");
  };

  // --- FUNCIÓN: ELECCIONES ---
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
    
    // Generamos nuevos rivales basados en los NUEVOS escaños del jugador
    const newRivals = generateRivals(newSeats);
    setRivalParties(newRivals);

    // Reiniciar turno, avanzar legislatura
    setTurn(1);
    setLegislature(prev => prev + 1);
  };

  // --- FUNCIÓN: FINALIZAR TURNO ---
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
    if (!partyIdeology) return false; // Protección

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
        // Evitamos que la popularidad baje de 0
        setResources(prev => ({...prev, popularity: Math.max(0, prev.popularity - 5)}));
        addMessage("La gente protesta por la subida de impuestos.", "warning");
      } else {
        // Evitamos que la popularidad suba de 100
        setResources(prev => ({...prev, popularity: Math.min(100, prev.popularity + 3)}));
        addMessage("La bajada de impuestos alegra al mercado.", "success");
      }
    } else {
      addMessage(`Reforma Fiscal RECHAZADA (${yesVotes} votos).`, "error");
      setTaxProposal(economy.taxRate);
    }

    endTurn(); // Avanzar turno tras votar
  };

  // --- ACCIONES DE TURNO ---
  const handleAction = (actionType) => {
    if (actionType === 'campaign') {
        if(resources.money >= 500) {
            setResources(p => ({...p, money: p.money - 500, popularity: Math.min(100, p.popularity + 2)}));
            addMessage("Campaña realizada. Popularidad +2.", "success");
        } else {
            addMessage("No tienes suficiente dinero ($500) para campaña.", "error");
        }
    }
  };

  const startLegislativeSession = () => {
    const randomLaw = LAWS[Math.floor(Math.random() * LAWS.length)];
    setCurrentLaw(randomLaw);
    setPhase('legislation');
  };

  // --- LÓGICA DE AFINIDAD IDEOLÓGICA PARA LEYES ---
  const getPartySupportForLaw = (partyIdeology, lawFavor) => {
    if (!partyIdeology) return false;

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

  // --- VOTACIÓN DE LEYES (CORREGIDO: Protección contra null) ---
  const voteOnLaw = (vote) => {
    if (!currentLaw) {
        addMessage("Error: No hay ley en curso.", "error");
        setPhase('dashboard');
        return;
    }

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

      // Aquí podrías añadir impacto en popularidad si quisieras, basado en currentLaw.impact
      // Por ejemplo:
      // setResources(prev => ({...prev, popularity: prev.popularity + (currentLaw.impact.approvalLeft + currentLaw.impact.approvalRight) / 10 }));

    } else {
      addMessage(`Ley RECHAZADA.`, "error");
    }

    // --- FIN DE TURNO Y CÁLCULO DE DEUDA ---
    const revenue = (economy.taxRate / 100) * GDP_BASE;
    const deficit = economy.annualSpending - revenue;
    const debtChange = deficit / 1000;
    
    setEconomy(prev => {
        const newDebt = Math.max(0, prev.debt + debtChange);
        if (newDebt > 90 && prev.debt <= 90) addMessage("¡PELIGRO! La deuda está crítica.", "error");
        return { ...prev, debt: newDebt };
    });

    setPhase('dashboard');
    setCurrentLaw(null);

    // Ahora sí, avanzar al siguiente turno (con legislaturas)
    endTurn();
  };

  return {
    phase, rivalParties, viewMode, setViewMode, turn, legislature, messages, 
    partyName, setPartyName, ideologyX, setIdeologyX, ideologyY, setIdeologyY,
    resources, candidates, currentLaw, economy, setEconomy,
    taxProposal, setTaxProposal, proposeTaxChange,
    handleFundarPartido, handleAction, startLegislativeSession, voteOnLaw, activeFactions,
  };
};