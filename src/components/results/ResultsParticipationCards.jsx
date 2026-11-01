import React from 'react';

/**
 * Cartes officielles des statistiques de participation pour la proclamation des résultats.
 */
export const ResultsParticipationCards = ({ participation }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft text-center">
      <span className="text-xs font-bold text-content-muted uppercase tracking-wider block mb-1">
        Électeurs Inscrits
      </span>
      <span className="text-3xl font-extrabold text-content-title font-mono">
        {participation?.totalVoters ?? '—'}
      </span>
    </div>

    <div className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft text-center">
      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
        Suffrages Exprimés
      </span>
      <span className="text-3xl font-extrabold text-emerald-600 font-mono">
        {participation?.totalVotesCast ?? '—'}
      </span>
    </div>

    <div className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft text-center">
      <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-1">
        Taux de Participation
      </span>
      <span className="text-3xl font-extrabold text-brand-red font-mono">
        {participation?.participationRate ?? 0} %
      </span>
    </div>
  </div>
);
