import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Shield, KeyRound, User, Lock, ArrowRight } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, register } = useAuth();
  const toast = useToast();

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setAdminSecret('');
    setErrorMessage('');
    setIsRegisterMode(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await register({
          username: username.trim(),
          password,
          adminSecret: adminSecret.trim(),
        });
        toast.success('Compte administrateur initial configuré avec succès.');
      } else {
        await login({
          username: username.trim(),
          password,
        });
        toast.success('Connexion à l’espace Commission Électorale réussie.');
      }

      handleClose();
      onSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Échec de l’authentification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isRegisterMode ? 'Initialisation Administrateur' : 'Commission Électorale'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-content-body">
          <Shield className="w-5 h-5 text-brand-red flex-shrink-0" />
          <p>
            {isRegisterMode
              ? 'Créez le compte administrateur unique sous protection de la clé AD_PW.'
              : 'Accès sécurisé réservé aux membres de la Commission Électorale.'}
          </p>
        </div>

        {/* Identifiant */}
        <div className="space-y-1">
          <label htmlFor="admin-username" className="block text-xs font-bold uppercase tracking-wider text-content-title">
            Identifiant <span className="text-brand-red">*</span>
          </label>
          <div className="relative">
            <input
              id="admin-username"
              type="text"
              required={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex : admin_vlf"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-surface-border rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Mot de passe */}
        <div className="space-y-1">
          <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-content-title">
            Mot de passe <span className="text-brand-red">*</span>
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type="password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-surface-border rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Clé secrète AD_PW (uniquement en mode inscription initiale) */}
        {isRegisterMode && (
          <div className="space-y-1 animate-fade-in">
            <label htmlFor="admin-secret" className="block text-xs font-bold uppercase tracking-wider text-brand-red">
              Clé secrète AD_PW <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="admin-secret"
                type="password"
                required={true}
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Entrez le secret d'environnement serveur"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-brand-red/30 rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none font-mono"
              />
              <KeyRound className="w-4 h-4 text-brand-red absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[10px] text-content-muted">
              Définie sur le serveur pour autoriser la création du tout premier compte.
            </p>
          </div>
        )}

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-brand-red/20 rounded-xl">
            <p className="text-xs font-semibold text-brand-red leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth={true}
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isRegisterMode ? 'Initialiser l’administrateur' : 'Valider l’accès'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMessage('');
            }}
            className="text-xs text-brand-blue hover:text-brand-blue-hover text-center font-semibold py-1 focus:outline-none"
          >
            {isRegisterMode
              ? 'Déjà configuré ? Se connecter'
              : 'Premier démarrage ? Initialiser le compte avec AD_PW'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
