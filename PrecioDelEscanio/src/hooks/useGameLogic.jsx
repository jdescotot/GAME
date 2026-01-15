import { useState, useEffect, useCallback } from 'react';
import { generateRivals } from '../functions/generateRivals';
import { generateFactions } from '../functions/generateFactions';
import { LAWS } from '../data/constants';
import { calculateTaxVoteOutcome } from './taxVotingLogic';
import { calculateLawVoteOutcome } from './lawVotingLogic';
import { determineClosestFaction } from '../functions/ideologyAnalysis';

const GDP_BASE = 100000;
const TURNS_PER_LEGISLATURE = 20;

export const useGameLogic = () => {
  // --- Estados ---
  const [phase, setPhase] = useState('setup');
  const [turn, setTurn] = useState(1);
  const [legislature, setLegislature] = useState(1);
  const [messages, setMessages] = useState([]);
  const [activeFactions, setActiveFactions] = useState(() => generateFactions());
  const [partyName, setPartyName] = useState('Nuevo Movimiento');
  const [ideologyX, setIdeologyX] = useState(50);
  const [ideologyY, setIdeologyY] = useState(50);
  const [resources, setResources] = useState({
    money: 1000,
    politicalCapital: 20,
    seats: 5,
    popularity: 10,
  });
  const [economy, setEconomy] = useState({
    debt: 40,
    taxRate: 20,
    annualSpending: 18000
  });
  const [taxProposal, setTaxProposal] = useState(20);
  const [rivalParties, setRivalParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentLaw, setCurrentLaw] = useState(null);
  const [viewMode, setViewMode] = useState('seats');

  // --- Generación de candidatos ---
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

  // --- Sistema de mensajes ---
  const addMessage = (text, type = 'neutral') => {
    const colorMap = { error: 'text-red-500', success: 'text-green-500', warning: 'text-yellow-500' };
    const uniqueId = Date.now() + Math.random();
    setMessages(prev => [{ text, color: colorMap[type] || '', id: uniqueId }, ...prev.slice(0, 4)]);
  };

  const handleFundarPartido = () => {
    const generated = generateRivals(resources.seats || 5);
    setRivalParties(generated);
    setPhase('dashboard');
    addMessage(`¡${partyName} fundado! La economía está al ${economy.taxRate}% de impuestos.`, "success");
  };

  // --- Elecciones con Capital Político ---
  const holdElections = () => {
    const newSeats = Math.max(1, Math.min(35, Math.floor((resources.popularity / 100) * 35)));
    const change = newSeats - resources.seats;
    
    // Ganancia de Capital Político: base 10 + 2 por escaño
    const cpGain = 10 + (newSeats * 2);

    if (change > 0) {
      addMessage(`¡Victoria! ${newSeats} escaños. Capital Político renovado (+${cpGain}).`, "success");
    } else if (change < 0) {
      addMessage(`Derrota. ${newSeats} escaños. Capital Político ajustado (+${cpGain}).`, "error");
    } else {
      addMessage(`Estabilidad. ${newSeats} escaños. (+${cpGain} CP).`, "warning");
    }

    setResources(prev => ({ 
      ...prev, 
      seats: newSeats,
      politicalCapital: prev.politicalCapital + cpGain
    }));
    
    setRivalParties(generateRivals(newSeats));
    setTurn(1);
    setLegislature(prev => prev + 1);
  };

  const endTurn = () => {
    const nextTurn = turn + 1;
    if (nextTurn > TURNS_PER_LEGISLATURE) {
      holdElections();
    } else {
      setTurn(nextTurn);
    }
  };

  // --- Propuesta de cambio de impuestos ---
  const proposeTaxChange = () => {
    const result = calculateTaxVoteOutcome({
      taxProposal,
      currentTaxRate: economy.taxRate,
      rivalParties,
      playerSeats: resources.seats
    });

    if (result.error === "No change") return;

    result.messages.forEach(msg => {
      const type = msg.includes("APROBADA") || msg.includes("alegra") ? "success" :
                   msg.includes("RECHAZADA") ? "error" : "warning";
      addMessage(msg, type);
    });

    if (result.approved) {
      setEconomy(prev => ({ ...prev, taxRate: result.newTaxRate }));
      setResources(prev => ({
        ...prev,
        popularity: Math.min(100, Math.max(0, prev.popularity + result.popularityDelta))
      }));
    } else {
      setTaxProposal(economy.taxRate);
    }

    endTurn();
  };

  // --- Acciones de turno ---
  const handleAction = (actionType) => {
    switch (actionType) {
      case 'campaign':
        if (resources.money >= 500) {
          setResources(prev => ({
            ...prev,
            money: prev.money - 500,
            popularity: Math.min(100, prev.popularity + 2)
          }));
          addMessage("Campaña ejecutada. Popularidad +2%.", "success");
        } else {
          addMessage("No tienes $500 para la campaña.", "error");
          return;
        }
        break;
      
      case 'lobby':
        if (resources.politicalCapital >= 5) {
          setResources(prev => ({
            ...prev,
            politicalCapital: prev.politicalCapital - 5,
            money: prev.money + 800,
            popularity: Math.max(0, prev.popularity - 1)
          }));
          addMessage("Cabildeo realizado. +$800, -1% popularidad.", "success");
        } else {
          addMessage("No tienes 5 CP para cabildear.", "error");
          return;
        }
        break;
      
      case 'protest':
        if (resources.politicalCapital >= 10) {
          const success = Math.random() < 0.6;
          const popChange = success ? 3 : -2;
          const message = success 
            ? "Marcha exitosa. Popularidad +3%." 
            : "Marcha reprimida. Popularidad -2%.";
          
          setResources(prev => ({
            ...prev,
            politicalCapital: prev.politicalCapital - 10,
            popularity: Math.min(100, Math.max(0, prev.popularity + popChange))
          }));
          addMessage(message, success ? "success" : "error");
        } else {
          addMessage("No tienes 10 CP para organizar marcha.", "error");
          return;
        }
        break;
      
      default:
        addMessage(`Acción ejecutada: ${actionType}`, "neutral");
    }
    
    endTurn();
  };

  const startLegislativeSession = () => {
    const randomLaw = LAWS[Math.floor(Math.random() * LAWS.length)];
    setCurrentLaw(randomLaw);
    setPhase('legislation');
  };

  // --- Votación de leyes con Capital Político ---
  const voteOnLaw = (playerVote) => {
    const currentFaction = determineClosestFaction(ideologyX, ideologyY);

    const result = calculateLawVoteOutcome({
      currentLaw,
      rivalParties,
      playerSeats: resources.seats,
      playerVote,
      economy,
      gdpBase: GDP_BASE,
      playerFaction: currentFaction
    });

    if (result.error) {
      addMessage(result.messages[0], "error");
      setPhase('dashboard');
      setCurrentLaw(null);
      return;
    }

    // Clasificar mensajes por tipo (incluyendo CP)
    result.messages.forEach(msg => {
      let type = "neutral";
      if (msg.includes("APROBADA") || msg.includes("Victoria") || msg.includes("Bloqueo") || msg.includes("Gobernabilidad")) {
        type = "success";
      } else if (msg.includes("RECHAZADA") || msg.includes("Traición") || msg.includes("Colaboracionismo") || msg.includes("Promesa incumplida")) {
        type = "error";
      } else if (msg.includes("CP") || msg.includes("Capital")) {
        type = "warning";
      }
      addMessage(msg, type);
    });

    // Aplicar cambio de Capital Político
    if (result.cpDelta !== 0) {
      setResources(prev => ({
        ...prev,
        politicalCapital: Math.max(0, prev.politicalCapital + result.cpDelta)
      }));
    }

    if (result.debtExceeds90) {
      addMessage("¡PELIGRO! La deuda está crítica.", "error");
    }

    setEconomy(prev => ({
      ...prev,
      annualSpending: result.newAnnualSpending,
      debt: result.newDebt
    }));

    setPhase('dashboard');
    setCurrentLaw(null);
    endTurn();
  };

  // --- Lógica de Ideología ---
  const currentIdeology = determineClosestFaction(ideologyX, ideologyY);

  const setIdeologyPreset = (faction) => {
    setIdeologyX(faction.x);
    setIdeologyY(faction.y);
  };

  return {
    phase, rivalParties, viewMode, setViewMode, turn, legislature, messages, 
    partyName, setPartyName, ideologyX, setIdeologyX, ideologyY, setIdeologyY,
    resources, candidates, currentLaw, economy, setEconomy,
    taxProposal, setTaxProposal, proposeTaxChange,
    handleFundarPartido, handleAction, startLegislativeSession, voteOnLaw, activeFactions,
    currentIdeology, setIdeologyPreset,
  };
};