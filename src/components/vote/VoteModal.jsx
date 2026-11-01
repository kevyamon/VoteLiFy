import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Eye, EyeOff, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VoteModal = ({
  isOpen,
  onClose,
  candidate,
  positionName,
  onVoteSuccess,
  electionId,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toast = useToast();

  const handleClose = () => {
    if (voteSuccess) {
      onVoteSuccess();
    }
    setPin('');
    setShowPin(false);
    setVoteSuccess(false);
    setErrorMessage('');
    onClose();
  };

  const handleSubmitVote = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMessage('Veuillez saisir votre code PIN secret.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const cleanPin = pin.trim().toUpperCase().replace(/\s+/g, '');
      const response = await api.submitVote({
        candidateId: candidate._id,
        pin: cleanPin,
        electionId: candidate.electionId || electionId,
      });

      setVoteSuccess(true);
      // Célébration par confettis festifs
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f20411', '#0055d2', '#ffffff'],
      });

      toast.success(response?.message || 'Votre vote a été validé !');
    } catch (error) {
      setErrorMessage(error.message || 'Une erreur est survenue lors de l’enregistrement de votre vote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={voteSuccess ? 'Suffrage Confirmé' : 'Confirmer votre vote'}
      maxWidth="max-w-md"
    >
      {voteSuccess ? (
        <div className="text-center py-4 space-y-4 animate-scale-up">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-content-title">
              Vote enregistré avec succès !
            </h4>
            <p className="text-sm text-content-body max-w-xs mx-auto">
              Merci pour votre participation à ce scrutin démocratique. Votre suffrage a été scellé dans l’urne anonyme.
            </p>
          </div>

          <div className="pt-2">
            <Button variant="primary" fullWidth={true} onClick={handleClose}>
              Terminer et fermer
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitVote} className="space-y-5">
          {/* Récapitulatif du choix de vote */}
          <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border text-center space-y-1">
            <span className="text-xs font-semibold uppercase text-brand-blue tracking-wider block">
              {positionName}
            </span>
            <p className="text-base font-bold text-content-title">
              Vous vous apprêtez à voter pour{' '}
              <span className="text-brand-red">{candidate.fullName}</span>.
            </p>
          </div>

          {/* Champ Code PIN */}
          <div className="space-y-1.5">
            <label
              htmlFor="voter-pin-input"
              className="block text-xs font-bold uppercase tracking-wider text-content-body"
            >
              Entrez votre code PIN secret
            </label>

            <div className="relative">
              <input
                id="voter-pin-input"
                type={showPin ? 'text' : 'password'}
                autoComplete="off"
                spellCheck="false"
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase())}
                placeholder="ex : VT-48291-K"
                className="w-full pl-11 pr-11 py-3 bg-surface-base border border-surface-border rounded-xl text-center text-lg font-mono font-bold tracking-widest text-content-title placeholder:text-slate-300 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-all uppercase"
                disabled={isSubmitting}
                autoFocus={true}
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPin ? 'Masquer le PIN' : 'Afficher le PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-content-muted text-center">
              Code confidentiel à usage unique transmis par message WhatsApp privé.
            </p>
          </div>

          {/* Affichage d'erreur éventuelle */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-brand-red/20 rounded-xl text-center animate-fade-in">
              <p className="text-xs font-semibold text-brand-red leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth={true}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              variant="primary"
              fullWidth={true}
              isLoading={isSubmitting}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Valider mon vote
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
