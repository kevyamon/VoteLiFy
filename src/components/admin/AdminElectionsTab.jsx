import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Button } from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useSocketEvent } from '../../services/socket.js';
import { AdminElectionCard } from './AdminElectionCard.jsx';
import { AdminElectionFormModal } from './AdminElectionFormModal.jsx';
import { AdminElectionDeleteModal } from './AdminElectionDeleteModal.jsx';
import { Vote, Plus, RefreshCw } from 'lucide-react';

/**
 * Onglet d'administration dédié au pilotage unitaire et global des scrutins.
 */
export const AdminElectionsTab = () => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modale création / édition
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Modale suppression
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingElection, setDeletingElection] = useState(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  // Verrous d'actions unitaires
  const [actionLoadingMap, setActionLoadingMap] = useState({});

  const toast = useToast();

  const loadElections = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAllElectionsAdmin();
      setElections(data || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des élections.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  useSocketEvent('ELECTION_CREATED', loadElections);
  useSocketEvent('ELECTION_UPDATED', loadElections);
  useSocketEvent('ELECTION_DELETED', loadElections);

  const setActionLoading = (id, loading) => {
    setActionLoadingMap((prev) => ({ ...prev, [id]: loading }));
  };

  // Actions de pilotage unitaire
  const handleToggleVoting = async (election) => {
    setActionLoading(election._id, true);
    try {
      if (election.voting?.isOpen) {
        await api.closeElectionVotingAdmin(election._id);
        toast.info(`Scrutin « ${election.title} » clôturé.`);
      } else {
        await api.openElectionVotingAdmin(election._id);
        toast.success(`Scrutin « ${election.title} » ouvert pour 48h !`);
      }
      loadElections();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la modification du scrutin.");
    } finally {
      setActionLoading(election._id, false);
    }
  };

  const handleToggleCandidacies = async (election) => {
    setActionLoading(election._id, true);
    try {
      if (election.candidacies?.isOpen) {
        await api.closeElectionCandidaciesAdmin(election._id);
        toast.info(`Dépôts de candidatures clôturés pour « ${election.title} ».`);
      } else {
        await api.openElectionCandidaciesAdmin(election._id);
        toast.success(`Dépôts de candidatures ouverts pour « ${election.title} ».`);
      }
      loadElections();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la modification des dépôts.");
    } finally {
      setActionLoading(election._id, false);
    }
  };

  const handleToggleResults = async (election) => {
    setActionLoading(election._id, true);
    try {
      if (election.results?.isPublished) {
        await api.unpublishElectionResultsAdmin(election._id);
        toast.info(`Publication des résultats suspendue pour « ${election.title} ».`);
      } else {
        await api.publishElectionResultsAdmin(election._id);
        toast.success(`Résultats officiellement proclamés et publiés pour « ${election.title} » !`);
      }
      loadElections();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la publication des résultats.");
    } finally {
      setActionLoading(election._id, false);
    }
  };

  // Création / Édition
  const handleOpenCreateModal = () => {
    setEditingElection(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (election) => {
    setEditingElection(election);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setIsFormSubmitting(true);
    try {
      if (editingElection) {
        await api.updateElectionAdmin(editingElection._id, payload);
        toast.success(`Scrutin « ${payload.title} » mis à jour avec succès.`);
      } else {
        await api.createElectionAdmin(payload);
        toast.success(`Scrutin « ${payload.title} » créé avec succès.`);
      }
      setFormModalOpen(false);
      loadElections();
    } catch (err) {
      toast.error(err.message || "Impossible d'enregistrer l'élection.");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Suppression sécurisée
  const handleOpenDeleteModal = (election) => {
    setDeletingElection(election);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (electionId) => {
    setIsDeleteSubmitting(true);
    try {
      await api.deleteElectionAdmin(electionId);
      toast.success("Élection supprimée avec succès.");
      setDeleteModalOpen(false);
      loadElections();
    } catch (err) {
      toast.error(err.message || "Impossible de supprimer cette élection.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Barre d'action supérieure */}
      <div className="bg-surface-pure rounded-2xl border border-surface-border p-4 sm:p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-content-title flex items-center gap-2">
            <Vote className="w-5 h-5 text-brand-red" />
            <span>Gestion des Élections & Scrutins</span>
          </h3>
          <p className="text-xs text-content-muted mt-1">
            Gérez chaque élection de manière autonome : ouverture des candidatures, lancement du vote, proclamation des résultats et édition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={loadElections}
            disabled={isLoading}
          >
            Actualiser
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreateModal}
          >
            Créer une élection
          </Button>
        </div>
      </div>

      {/* 2. Liste des cartes d'élections */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-content-muted">Chargement des scrutins...</div>
        ) : elections.length === 0 ? (
          <div className="p-8 bg-surface-pure rounded-2xl border border-surface-border text-center space-y-3">
            <Vote className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-content-muted">Aucune élection enregistrée pour le moment.</p>
            <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
              Créer le premier scrutin
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {elections.map((election) => (
              <AdminElectionCard
                key={election._id}
                election={election}
                isActionLoading={Boolean(actionLoadingMap[election._id])}
                onToggleVoting={handleToggleVoting}
                onToggleCandidacies={handleToggleCandidacies}
                onToggleResults={handleToggleResults}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Modales d'édition et suppression */}
      <AdminElectionFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isFormSubmitting}
        initialData={editingElection}
      />

      <AdminElectionDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        election={deletingElection}
        isSubmitting={isDeleteSubmitting}
      />
    </div>
  );
};
