import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { AdminDangerZone } from './AdminDangerZone.jsx';
import {
  Settings,
  Calendar,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';

export const AdminSettingsTab = () => {
  const [settings, setSettings] = useState(null);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Formulaire paramètres généraux
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Nouveau poste
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionDesc, setNewPositionDesc] = useState('');
  const [isCreatingPosition, setIsCreatingPosition] = useState(false);



  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sett, posList] = await Promise.all([
        api.getElectionInfo(),
        api.getAllPositionsAdmin(),
      ]);
      setSettings(sett);
      setTitle(sett?.title || '');
      setDescription(sett?.description || '');
      setPositions(posList || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des paramètres.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Gestion des périodes
  const handleToggleCandidacies = async (open) => {
    try {
      if (open) {
        await api.openCandidacies();
        toast.success('Période de candidatures ouverte.');
      } else {
        await api.closeCandidacies();
        toast.info('Période de candidatures fermée.');
      }
      loadData();
    } catch (err) {
      toast.error(err.message || 'Impossible de modifier la période.');
    }
  };

  const handleToggleVoting = async (open) => {
    try {
      if (open) {
        await api.openVoting();
        toast.success('Scrutin de vote officiellement ouvert pour 48h.');
      } else {
        await api.closeVoting();
        toast.info('Scrutin de vote clôturé.');
      }
      loadData();
    } catch (err) {
      toast.error(err.message || 'Impossible de modifier le scrutin.');
    }
  };

  const handleToggleResults = async (publish) => {
    try {
      if (publish) {
        await api.publishResults();
        toast.success('Résultats officiels proclamés et publiés.');
      } else {
        await api.unpublishResults();
        toast.info('Publication des résultats suspendue.');
      }
      loadData();
    } catch (err) {
      toast.error(err.message || 'Action refusée.');
    }
  };

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings({ title, description });
      toast.success('Paramètres du scrutin enregistrés.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Échec de l’enregistrement.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCreatePosition = async (e) => {
    e.preventDefault();
    if (!newPositionName.trim()) return;

    setIsCreatingPosition(true);
    try {
      await api.createPosition({
        name: newPositionName.trim(),
        description: newPositionDesc.trim(),
        order: positions.length + 1,
      });
      setNewPositionName('');
      setNewPositionDesc('');
      toast.success('Nouveau poste créé.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Impossible de créer le poste.');
    } finally {
      setIsCreatingPosition(false);
    }
  };

  const handleDeletePosition = async (id, name) => {
    if (!window.confirm(`Voulez-vous supprimer le poste « ${name} » ?`)) return;
    try {
      await api.deletePosition(id);
      toast.success(`Poste « ${name} » supprimé.`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Action impossible.');
    }
  };


  if (isLoading) {
    return <div className="py-12 text-center text-xs text-content-muted">Chargement des paramètres...</div>;
  }

  const isVotingOpen = settings?.voting?.isOpen;
  const isCandidacyOpen = settings?.candidacies?.isOpen;
  const isResultsPublished = settings?.results?.isPublished;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Pilotage des périodes électorales (CDC Section 6) */}
      <div className="bg-surface-pure rounded-2xl border border-surface-border p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
          <Calendar className="w-5 h-5 text-brand-red" />
          <h3 className="text-lg font-bold text-content-title">Contrôle des Périodes du Scrutin</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Carte Candidatures */}
          <div className="p-4 rounded-xl border border-surface-border bg-surface-subtle flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-content-title">Dépôt Candidatures</span>
                {isCandidacyOpen ? (
                  <Badge variant="success" size="sm" dot={true}>Ouvert</Badge>
                ) : (
                  <Badge variant="neutral" size="sm">Clos</Badge>
                )}
              </div>
              <p className="text-[11px] text-content-muted">Autorise le formulaire public /candidater.</p>
            </div>
            <Button
              variant={isCandidacyOpen ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleCandidacies(!isCandidacyOpen)}
            >
              {isCandidacyOpen ? 'Fermer candidatures' : 'Ouvrir candidatures'}
            </Button>
          </div>

          {/* Carte Phase de Vote */}
          <div className="p-4 rounded-xl border border-surface-border bg-surface-subtle flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-content-title">Phase de Vote (48h)</span>
                {isVotingOpen ? (
                  <Badge variant="success" size="sm" dot={true}>En cours</Badge>
                ) : (
                  <Badge variant="danger" size="sm">Clôturé</Badge>
                )}
              </div>
              <p className="text-[11px] text-content-muted">Autorise la soumission des votes par PIN.</p>
            </div>
            <Button
              variant={isVotingOpen ? 'danger' : 'primary'}
              size="sm"
              onClick={() => handleToggleVoting(!isVotingOpen)}
            >
              {isVotingOpen ? 'Clôturer le vote' : 'Ouvrir le vote (48h)'}
            </Button>
          </div>

          {/* Carte Proclamation Résultats */}
          <div className="p-4 rounded-xl border border-surface-border bg-surface-subtle flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-content-title">Proclamation Résultats</span>
                {isResultsPublished ? (
                  <Badge variant="info" size="sm">Publiés</Badge>
                ) : (
                  <Badge variant="neutral" size="sm">Masqués</Badge>
                )}
              </div>
              <p className="text-[11px] text-content-muted">Rend public le dépouillement officiel.</p>
            </div>
            <Button
              variant={isResultsPublished ? 'outline' : 'secondary'}
              size="sm"
              disabled={isVotingOpen}
              onClick={() => handleToggleResults(!isResultsPublished)}
            >
              {isResultsPublished ? 'Masquer résultats' : 'Publier résultats'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Paramètres généraux de l'élection */}
      <form onSubmit={handleSaveGeneralSettings} className="bg-surface-pure rounded-2xl border border-surface-border p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
          <Settings className="w-5 h-5 text-brand-blue" />
          <h3 className="text-lg font-bold text-content-title">Informations Générales</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-content-title mb-1">Titre officiel de l'élection</label>
            <input
              type="text"
              required={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-content-title mb-1">Description et consignes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSavingSettings}
            icon={<Save className="w-3.5 h-3.5" />}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </form>

      {/* 3. Configuration des Postes Électoraux */}
      <div className="bg-surface-pure rounded-2xl border border-surface-border p-6 shadow-soft space-y-4">
        <h3 className="text-lg font-bold text-content-title pb-3 border-b border-surface-border">
          Postes Électoraux à Pourvoir
        </h3>

        <div className="space-y-2">
          {positions.map((pos) => (
            <div
              key={pos._id}
              className="flex items-center justify-between p-3 rounded-xl border border-surface-border bg-surface-subtle text-xs"
            >
              <div>
                <span className="font-bold text-content-title">{pos.name}</span>
                {pos.description && <span className="text-content-muted block text-[11px]">{pos.description}</span>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-brand-red" />}
                onClick={() => handleDeletePosition(pos._id, pos.name)}
              />
            </div>
          ))}
        </div>

        {/* Formulaire d'ajout de poste */}
        <form onSubmit={handleCreatePosition} className="flex flex-col sm:flex-row gap-2 pt-2">
          <input
            type="text"
            required={true}
            value={newPositionName}
            onChange={(e) => setNewPositionName(e.target.value)}
            placeholder="Nom du nouveau poste (ex : Secrétaire Général)"
            className="flex-1 p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            isLoading={isCreatingPosition}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Ajouter le poste
          </Button>
        </form>
      </div>

      {/* 4. Zone Dangereuse — Réinitialisation (CDC Section 9.5) */}
      <AdminDangerZone onResetSuccess={loadData} />
    </div>
  );
};
