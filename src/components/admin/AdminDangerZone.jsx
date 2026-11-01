import React, { useState } from 'react';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../services/api.js';

/**
 * Composant Zone Dangereuse pour la réinitialisation des votes de test.
 * CDC Section 9.5.
 */
export const AdminDangerZone = ({ onResetSuccess }) => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const toast = useToast();

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!adminPasswordConfirm) return;

    setIsResetting(true);
    try {
      await api.resetTestData({ password: adminPasswordConfirm });
      toast.success('Votes réinitialisés, émargements et dates remis à zéro.');
      setResetModalOpen(false);
      setAdminPasswordConfirm('');
      if (onResetSuccess) onResetSuccess();
    } catch (err) {
      toast.error(err.message || 'Échec de la réinitialisation.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="p-6 rounded-2xl border border-status-danger/30 bg-red-50/50 space-y-3">
        <div className="flex items-center gap-2 text-status-danger">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <h4 className="text-sm font-bold">Zone Dangereuse — Réinitialisation intégrale</h4>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Cette opération supprime tous les suffrages enregistrés, réinitialise les statuts d'émargement des électeurs et efface l'intégralité des dates et périodes configurées pour repartir d'une base totalement vierge.
        </p>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setResetModalOpen(true)}
        >
          Réinitialiser les votes de test
        </Button>
      </div>

      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Confirmation de Réinitialisation"
      >
        <form onSubmit={handleConfirmReset} className="space-y-4 text-xs">
          <p className="text-content-body font-semibold">
            Confirmez votre mot de passe administrateur pour réinitialiser les données de scrutin :
          </p>
          <input
            type="password"
            required={true}
            value={adminPasswordConfirm}
            onChange={(e) => setAdminPasswordConfirm(e.target.value)}
            placeholder="Entrez votre mot de passe administrateur"
            className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setResetModalOpen(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isResetting}
            >
              Confirmer la réinitialisation
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
