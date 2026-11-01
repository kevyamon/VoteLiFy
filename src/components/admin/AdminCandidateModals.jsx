import React from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';

/**
 * Modale de confirmation de rejet de candidature avec motif obligatoire.
 */
export const CandidateRejectModal = ({
  isOpen,
  onClose,
  candidate,
  rejectReason,
  onReasonChange,
  onConfirmReject,
  isLoading,
}) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rejeter la candidature de ${candidate.fullName}`}
    >
      <div className="space-y-4 text-xs">
        <p className="text-content-body">
          Indiquez le motif de rejet administratif (non éligible, pièce manquante, etc.) :
        </p>
        <textarea
          rows={3}
          value={rejectReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="ex : Non-respect des critères de participation à FORMATION NO-CODE."
          className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl focus:border-brand-red focus:outline-none text-xs leading-relaxed"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isLoading}
            onClick={onConfirmReject}
          >
            Confirmer le rejet
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Modale d'édition rapide des informations publiques d'un candidat.
 */
export const CandidateEditModal = ({
  isOpen,
  onClose,
  candidate,
  fullName,
  onFullNameChange,
  pitch,
  onPitchChange,
  videoUrl,
  onVideoUrlChange,
  onConfirmEdit,
  isLoading,
}) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Modifier le dossier de ${candidate.fullName}`}
    >
      <div className="space-y-3.5 text-xs">
        <div>
          <label className="block font-bold text-content-title mb-1">Nom complet</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-bold text-content-title mb-1">Programme / Pitch</label>
          <textarea
            rows={4}
            value={pitch}
            onChange={(e) => onPitchChange(e.target.value)}
            className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none leading-relaxed"
          />
        </div>
        <div>
          <label className="block font-bold text-content-title mb-1">Lien Vidéo</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="https://..."
            className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isLoading}
            onClick={onConfirmEdit}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
