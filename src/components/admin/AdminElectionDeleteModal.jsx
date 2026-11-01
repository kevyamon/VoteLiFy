import React from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * Modale de confirmation de suppression d'une élection.
 * Rappelle la règle de sécurité interdisant la suppression si des votes existent.
 */
export const AdminElectionDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  election,
  isSubmitting,
}) => {
  if (!election) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Supprimer l’Élection"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-brand-red">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-red-900">Action irréversible</h5>
            <p className="text-red-800 leading-relaxed text-[11px]">
              Vous êtes sur le point de supprimer définitivement le scrutin{' '}
              <strong className="font-extrabold underline">{election.title}</strong>.
            </p>
          </div>
        </div>

        <div className="p-3 bg-surface-subtle border border-surface-border rounded-xl text-[11px] text-content-body space-y-1">
          <p className="font-semibold text-content-title">Règle de sécurité électorale :</p>
          <p>
            Si des électeurs ont déjà voté dans le cadre de ce scrutin, la suppression sera
            strictement bloquée par le système afin de préserver l'intégrité démocratique et la traçabilité.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => onConfirm(election._id)}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Confirmer la suppression
          </Button>
        </div>
      </div>
    </Modal>
  );
};
