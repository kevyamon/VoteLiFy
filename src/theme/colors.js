/**
 * Tokens de couleur officiels de VoteLiFy (VLF).
 * Source unique de vérité du Design System mappée dans Tailwind CSS.
 * 
 * RÈGLE D'OR : Zéro couleur hexadécimale en dur dans les composants d'interface.
 */

export const colors = {
  brand: {
    red: '#f20411', // Couleur primaire officielle : identité, boutons d'action, barres actives
    'red-hover': '#d9030e',
    'red-light': '#fef2f2',
    blue: '#0055d2', // Couleur secondaire officielle : confiance, badges d'état, contrastes
    'blue-hover': '#0047b3',
    'blue-light': '#eff6ff',
  },
  surface: {
    base: '#ffffff',
    pure: '#fefefe',
    subtle: '#f8fafc',
    border: '#e2e8f0',
    'border-subtle': '#f1f5f9',
  },
  status: {
    danger: '#dc2626',
    'danger-light': '#fee2e2',
    success: '#16a34a',
    'success-light': '#dcfce7',
    warning: '#ca8a04',
    'warning-light': '#fef9c3',
    info: '#0055d2',
    'info-light': '#dbeafe',
  },
  text: {
    title: '#0f172a', // Slate 900
    body: '#334155',  // Slate 700
    muted: '#64748b', // Slate 500
    light: '#94a3b8', // Slate 400
  },
};
