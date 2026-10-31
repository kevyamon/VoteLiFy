import React, { useRef, useState } from 'react';

/**
 * Pied de page officiel avec déclencheur discret d'administration (CDC Section 4.1).
 * Un maintien ininterrompu de 10 secondes sur le copyright ouvre la modale d'authentification.
 */
export const Footer = ({ onOpenAdminAuth }) => {
  const timerRef = useRef(null);
  const [isPressing, setIsPressing] = useState(false);

  const startPressTimer = (e) => {
    // Si c'est un clic droit ou non principal, ignorer
    if (e.button && e.button !== 0) return;

    setIsPressing(true);

    timerRef.current = setTimeout(() => {
      setIsPressing(false);
      // Vibration haptique discrète sur mobile si supportée
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(80);
      }
      onOpenAdminAuth();
    }, 10000); // 10 secondes strictes
  };

  const cancelPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
  };

  return (
    <footer className="mt-auto border-t border-surface-border bg-surface-pure py-8 text-center text-xs text-content-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
        <p className="font-medium text-content-body">
          Plateforme numérique d'organisation électorale et de proclamation certifiée.
        </p>

        {/* Déclencheur discret sans indice visuel */}
        <p
          onMouseDown={startPressTimer}
          onMouseUp={cancelPressTimer}
          onMouseLeave={cancelPressTimer}
          onTouchStart={startPressTimer}
          onTouchEnd={cancelPressTimer}
          onTouchCancel={cancelPressTimer}
          className="select-none inline-block py-1 cursor-default text-content-muted"
        >
          © 2026 VoteLiFy — Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};
