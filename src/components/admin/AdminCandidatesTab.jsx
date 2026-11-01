import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useSocketEvent } from '../../services/socket.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { CustomSelect } from '../common/CustomSelect.jsx';
import { ConfirmModal } from '../common/ConfirmModal.jsx';
import { AdminCandidatesSkeleton } from '../common/Skeleton.jsx';
import { CandidateRejectModal, CandidateEditModal } from './AdminCandidateModals.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  Users,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export const AdminCandidatesTab = ({ electionId }) => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modale de rejet avec motif
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Modale de modification
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPitch, setEditPitch] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  // Modale de suppression
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (positionFilter) params.positionId = positionFilter;
      if (search.trim()) params.search = search.trim();
      if (electionId) params.electionId = electionId;

      const [cands, posList] = await Promise.all([
        api.getAllCandidatesAdmin(params),
        api.getAllPositionsAdmin(electionId ? { electionId } : {}),
      ]);

      setCandidates(cands || []);
      setPositions(posList || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des candidatures.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, positionFilter, electionId]);

  // Synchronisation temps réel des candidatures pour la Commission Électorale
  useSocketEvent('CANDIDATE_CREATED', loadData);
  useSocketEvent('CANDIDATE_UPDATED', loadData);
  useSocketEvent('POSITIONS_UPDATED', loadData);

  const handleApprove = async (id, name) => {
    try {
      await api.approveCandidate(id);
      toast.success(`Candidature de ${name} approuvée.`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Impossible d’approuver la candidature.');
    }
  };

  const handleOpenReject = (cand) => {
    setSelectedCandidate(cand);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedCandidate) return;
    setIsActionLoading(true);
    try {
      await api.rejectCandidate(selectedCandidate._id, { reviewNotes: rejectReason });
      toast.success(`Candidature de ${selectedCandidate.fullName} rejetée.`);
      setRejectModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Échec du rejet.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenEdit = (cand) => {
    setSelectedCandidate(cand);
    setEditFullName(cand.fullName);
    setEditPitch(cand.pitch);
    setEditVideoUrl(cand.videoUrl || '');
    setEditModalOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (!selectedCandidate) return;
    setIsActionLoading(true);
    try {
      await api.updateCandidateAdmin(selectedCandidate._id, {
        fullName: editFullName.trim(),
        pitch: editPitch.trim(),
        videoUrl: editVideoUrl.trim(),
      });
      toast.success('Informations de la candidature mises à jour.');
      setEditModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Échec de la modification.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;
    try {
      await api.deleteCandidateAdmin(candidateToDelete._id);
      toast.success(`Candidat « ${candidateToDelete.fullName} » supprimé.`);
      setCandidateToDelete(null);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Impossible de supprimer cette candidature.');
    }
  };

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente (Pending)' },
    { value: 'approved', label: 'Approuvées (Approved)' },
    { value: 'rejected', label: 'Rejetées (Rejected)' },
  ];

  const positionOptions = [
    { value: '', label: 'Tous les postes' },
    ...positions.map((p) => ({ value: p._id, label: p.name })),
  ];

  return (
    <div className="bg-surface-pure rounded-2xl border border-surface-border p-4 sm:p-6 shadow-soft space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div>
          <h3 className="text-lg font-bold text-content-title flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-red" />
            <span>Modération des Candidatures</span>
          </h3>
          <p className="text-xs text-content-muted">
            Examinez, validez ou rejetez les dossiers des postulants ({candidates.length} dossier(s)).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={loadData}
          disabled={isLoading}
        >
          Actualiser
        </Button>
      </div>

      {/* Barre de filtres sur-mesure */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            placeholder="Rechercher par nom ou numéro..."
            className="w-full pl-9 pr-4 py-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <CustomSelect
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          placeholder="Tous les statuts"
          title="Statut de candidature"
          options={statusOptions}
        />

        <CustomSelect
          value={positionFilter}
          onChange={(val) => setPositionFilter(val)}
          placeholder="Tous les postes"
          title="Poste convoité"
          options={positionOptions}
        />
      </div>

      {/* Liste des candidatures */}
      {isLoading ? (
        <AdminCandidatesSkeleton />
      ) : candidates.length === 0 ? (
        <div className="py-12 text-center text-xs text-content-muted">Aucune candidature correspondante.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((cand) => (
            <div
              key={cand._id}
              className="p-4 rounded-xl border border-surface-border bg-surface-base/60 hover:bg-surface-base transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={cand.photoUrl}
                  alt={cand.fullName}
                  className="w-16 h-16 rounded-xl object-cover border border-surface-border flex-shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-content-title truncate">{cand.fullName}</h4>
                    {cand.status === 'approved' && <Badge variant="success" size="sm">Approuvée</Badge>}
                    {cand.status === 'pending' && <Badge variant="warning" size="sm" dot={true}>En attente</Badge>}
                    {cand.status === 'rejected' && <Badge variant="danger" size="sm">Rejetée</Badge>}
                  </div>

                  <p className="text-xs font-semibold text-brand-blue truncate mt-0.5">
                    {cand.positionId?.name || 'Poste non assigné'}
                  </p>
                  <p className="text-[11px] text-content-muted font-mono">{cand.phone}</p>
                </div>
              </div>

              <div className="text-xs text-content-body line-clamp-3 bg-surface-subtle p-2.5 rounded-lg border border-surface-border/50">
                {cand.pitch}
              </div>

              {cand.videoUrl && (
                <a
                  href={cand.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-brand-blue hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Consulter la vidéo</span>
                </a>
              )}

              {/* Boutons d'action modération */}
              <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-surface-border/60">
                {cand.status !== 'approved' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckCircle className="w-3.5 h-3.5" />}
                    onClick={() => handleApprove(cand._id, cand.fullName)}
                  >
                    Valider
                  </Button>
                )}

                {cand.status !== 'rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<XCircle className="w-3.5 h-3.5 text-brand-red" />}
                    onClick={() => handleOpenReject(cand)}
                  >
                    Rejeter
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenEdit(cand)}
                >
                  Modifier
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-brand-red" />}
                  onClick={() => setCandidateToDelete(cand)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale personnalisée de confirmation de rejet */}
      <CandidateRejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        candidate={selectedCandidate}
        rejectReason={rejectReason}
        onReasonChange={setRejectReason}
        onConfirmReject={handleConfirmReject}
        isLoading={isActionLoading}
      />

      {/* Modale personnalisée de modification rapide */}
      <CandidateEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        candidate={selectedCandidate}
        fullName={editFullName}
        onFullNameChange={setEditFullName}
        pitch={editPitch}
        onPitchChange={setEditPitch}
        videoUrl={editVideoUrl}
        onVideoUrlChange={setEditVideoUrl}
        onConfirmEdit={handleConfirmEdit}
        isLoading={isActionLoading}
      />

      {/* Modale personnalisée de suppression définitive */}
      <ConfirmModal
        isOpen={Boolean(candidateToDelete)}
        onClose={() => setCandidateToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la candidature"
        message={`Confirmez-vous la suppression définitive du dossier de « ${candidateToDelete?.fullName} » ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        variant="danger"
      />
    </div>
  );
};
