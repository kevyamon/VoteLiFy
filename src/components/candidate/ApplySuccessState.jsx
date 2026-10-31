import React from 'react';
import { Button } from '../common/Button.jsx';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

/**
 * Écran de confirmation de dépôt de candidature réussi (CDC Section 3.4).
 */
export const ApplySuccessState = ({ onNavigateHome }) => {
  return (
    <div className="bg-surface-pure rounded-2xl border border-surface-border p-8 text-center space-y-6 shadow-soft animate-scale-up">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-content-title">
          Candidature enregistrée avec succès !
        </h2>
        <p className="text-sm text-content-body max-w-lg mx-auto leading-relaxed">
          Votre dossier a été transmis à la Commission Électorale. Il sera examiné puis rendu public sur la plateforme dès son approbation officielle.
        </p>
      </div>

      <div className="pt-4 flex justify-center">
        <Button
          variant="primary"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onNavigateHome}
        >
          Retourner à l’accueil du scrutin
        </Button>
      </div>
    </div>
  );
};
