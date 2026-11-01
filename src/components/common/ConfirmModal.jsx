import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react';

/**
 * Modale de confirmation personnalisée VoteLiFy :
 * Remplace window.confirm() du navigateur pour une expérience moderne et cohérente.
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation requise',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const Icon = variant === 'danger' ? Trash2 : variant === 'warning' ? AlertTriangle : HelpCircle;
  const iconBg =
    variant === 'danger'
      ? 'bg-red-50 text-brand-red border-red-200'
      : variant === 'warning'
      ? 'bg-amber-50 text-amber-600 border-amber-200'
      : 'bg-blue-50 text-brand-blue border-blue-200';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
          <div className={`p-3 rounded-2xl border ${iconBg} flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-content-title">
              {title}
            </h4>
            <p className="text-xs text-content-body leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-surface-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            isLoading={isLoading}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
