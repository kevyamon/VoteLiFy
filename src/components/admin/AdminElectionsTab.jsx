import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { Modal } from '../common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useSocketEvent } from '../../services/socket.js';
import {
  Vote,
  Plus,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';

/**
 * Onglet d'administration dédié à la création et gestion de l'ensemble des élections (CDC / Nouveauté).
 */
export const AdminElectionsTab = () => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire de création
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingStartAt, setVotingStartAt] = useState('');
  const [votingEndAt, setVotingEndAt] = useState('');
  const [candidateStartAt, setCandidateStartAt] = useState('');
  const [candidateEndAt, setCandidateEndAt] = useState('');

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
  useSocketEvent('ELECTION_RESET', loadElections);

  const handleOpenCreateModal = () => {
    setTitle('');
    setDescription('');
    // Initialise avec des dates cohérentes par défaut
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    
    // Format YYYY-MM-DDTHH:mm pour input datetime-local
    const toLocalISO = (d) => {
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    setVotingStartAt(toLocalISO(now));
    setVotingEndAt(toLocalISO(in48h));
    setCandidateStartAt('');
    setCandidateEndAt('');
    setCreateModalOpen(true);
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le nom de l'élection est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        votingStartAt: votingStartAt ? new Date(votingStartAt).toISOString() : null,
        votingEndAt: votingEndAt ? new Date(votingEndAt).toISOString() : null,
        candidateStartAt: candidateStartAt ? new Date(candidateStartAt).toISOString() : null,
        candidateEndAt: candidateEndAt ? new Date(candidateEndAt).toISOString() : null,
      };

      await api.createElectionAdmin(payload);
      toast.success(`Scrutin « ${title.trim()} » créé avec succès.`);
      setCreateModalOpen(false);
      loadElections();
    } catch (err) {
      toast.error(err.message || "Impossible d'enregistrer l'élection.");
    } finally {
      setIsSubmitting(false);
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
            Créez de nouvelles élections, définissez leurs périodes officielles et suivez leur statut.
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

      {/* 2. Liste des élections existantes */}
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
            {elections.map((election) => {
              const hasDates = election.voting?.startAt || election.voting?.endAt;
              const isClosed = hasDates && new Date() > new Date(election.voting?.endAt);

              return (
                <div
                  key={election._id}
                  className="bg-surface-pure rounded-2xl border border-surface-border p-5 shadow-soft flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red to-brand-blue text-white flex items-center justify-center font-black text-lg shadow-sm">
                          <span>{election.initials || 'EL'}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-content-title">
                            {election.title}
                          </h4>
                          <span className="text-[11px] text-content-muted block">
                            Créée le {new Date(election.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      <div>
                        {election.voting?.isOpen ? (
                          <Badge variant="success" dot={true} size="sm">Vote Ouvert</Badge>
                        ) : election.candidacies?.isOpen ? (
                          <Badge variant="info" dot={true} size="sm">Candidatures</Badge>
                        ) : election.results?.isPublished ? (
                          <Badge variant="info" size="sm">Résultats Publiés</Badge>
                        ) : isClosed ? (
                          <Badge variant="danger" size="sm">Scrutin Clos</Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">En Préparation</Badge>
                        )}
                      </div>
                    </div>

                    {election.description && (
                      <p className="text-xs text-content-body line-clamp-2">
                        {election.description}
                      </p>
                    )}

                    {/* Détail des dates */}
                    <div className="bg-surface-subtle p-3 rounded-xl border border-surface-border text-xs text-content-muted space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                        <span>
                          Vote :{' '}
                          {election.voting?.endAt ? (
                            <strong className="text-content-title font-medium">
                              Jusqu'au {new Date(election.voting.endAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </strong>
                          ) : (
                            <span className="italic">Non programmée</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Modale de Création d'une élection */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Créer une Nouvelle Élection"
      >
        <form onSubmit={handleCreateElection} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-content-title mb-1">
              Nom / Titre officiel du scrutin <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              required={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Élection des Responsables de Communauté"
              className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
            <span className="text-[10px] text-content-muted block mt-1">
              Les 2 premières lettres serviront d'illustration monogramme sur la page publique.
            </span>
          </div>

          <div>
            <label className="block font-bold text-content-title mb-1">
              Description et directives du vote
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex : Scrutin officiel pour l'élection du bureau exécutif 2026."
              className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-surface-border">
            <div>
              <label className="block font-bold text-content-title mb-1">
                Début de la période de vote
              </label>
              <input
                type="datetime-local"
                value={votingStartAt}
                onChange={(e) => setVotingStartAt(e.target.value)}
                className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-content-title mb-1">
                Clôture de la période de vote
              </label>
              <input
                type="datetime-local"
                value={votingEndAt}
                onChange={(e) => setVotingEndAt(e.target.value)}
                className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-content-muted mb-1">
                Début dépôt candidatures (optionnel)
              </label>
              <input
                type="datetime-local"
                value={candidateStartAt}
                onChange={(e) => setCandidateStartAt(e.target.value)}
                className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-content-muted mb-1">
                Fin dépôt candidatures (optionnel)
              </label>
              <input
                type="datetime-local"
                value={candidateEndAt}
                onChange={(e) => setCandidateEndAt(e.target.value)}
                className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              icon={<Plus className="w-4 h-4" />}
            >
              Créer l'élection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
