import React, { useRef } from 'react';

/**
 * Pied de page officiel avec déclencheur discret d'administration Commission Électorale.
 * Permet l'ouverture de la modale via 4 taps rapides ou un maintien de 3 secondes sur le copyright,
 * tout en bloquant strictement la sélection de texte et le menu "Copier" sur mobile.
 */
export const Footer = ({ onOpenAdminAuth }) => {
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);
  const holdTimerRef = useRef(null);

  // 1. Déclenchement par multi-tap discret (4 clics ou touches rapides consécutives)
  const handleTap = (e) => {
    e.stopPropagation();
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 4) {
      tapCountRef.current = 0;
      if (typeof window !== 'undefined' && window.navigator?.vibrate) {
        window.navigator.vibrate(60);
      }
      onOpenAdminAuth();
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1500);
  };

  // 2. Déclenchement par maintien prolongé discret (3 secondes)
  const startHold = (e) => {
    if (e.button && e.button !== 0) return;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }

    holdTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.navigator?.vibrate) {
        window.navigator.vibrate(60);
      }
      onOpenAdminAuth();
    }, 3000);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <footer className="mt-auto border-t border-surface-border bg-surface-pure py-8 text-center text-xs text-content-muted select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2 select-none">
        {/* Texte informatif protégé contre toute sélection parasite */}
        <p className="font-medium text-content-body select-none pointer-events-none">
          Plateforme numérique d'organisation électorale et de proclamation certifiée.
        </p>

        {/* Déclencheur discret sur le copyright avec zone de contact généreuse */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleTap}
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={(e) => {
              startHold(e);
            }}
            onTouchEnd={cancelHold}
            onTouchCancel={cancelHold}
            className="select-none inline-block py-2 px-5 cursor-default text-content-muted hover:text-content-body transition-colors focus:outline-none touch-manipulation"
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
            aria-label="Mentions légales"
          >
            © 2026 VoteLiFy — Tous droits réservés.
          </button>
        </div>
      </div>
    </footer>
  );
};
