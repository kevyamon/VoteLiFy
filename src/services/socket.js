import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';

// Extraction propre de l'URL racine du backend (sans suffixe /api)
const rawBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const SOCKET_URL = rawBase
  ? rawBase.replace(/\/api$/, '')
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

let socketInstance = null;

/**
 * Obtient ou initialise l'instance singleton du socket client.
 */
export const getSocket = () => {
  if (!socketInstance && typeof window !== 'undefined') {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Connecté au réseau temps réel VoteLiFy.');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Déconnecté du réseau temps réel VoteLiFy :', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('⚠️ Erreur de connexion temps réel :', error.message);
    });
  }

  return socketInstance;
};

/**
 * Hook React personnalisé pour écouter des événements Socket.io avec désabonnement automatique.
 * 
 * @param {string} eventName - Nom de l'événement temps réel
 * @param {Function} handler - Fonction de rappel exécutée à la réception
 */
export const useSocketEvent = (eventName, handler) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!eventName || typeof window === 'undefined') return;

    const socket = getSocket();
    if (!socket) return;

    const eventListener = (...args) => {
      if (handlerRef.current) {
        handlerRef.current(...args);
      }
    };

    socket.on(eventName, eventListener);

    return () => {
      socket.off(eventName, eventListener);
    };
  }, [eventName]);
};

export default getSocket;
