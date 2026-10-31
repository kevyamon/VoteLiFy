import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { Modal } from '../common/Modal.jsx';
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
  Eye,
} from 'lucide-react';

export const AdminCandidatesTab = () => {
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

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (positionFilter) params.positionId = positionFilter;
      if (search.trim()) params.search = search.trim();

      const [cands, posList] = await Promise.all([
        api.getAllCandidatesAdmin(params),
        api.getAllPositionsAdmin(),
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
  }, [statusFilter, positionFilter]);

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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Confirmez-vous la suppression définitive du candidat « ${name} » ?`)) {
      return;
    }
    try {
      await api.deleteCandidateAdmin(id);
      toast.success(`Candidat « ${name} » supprimé.`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Impossible de supprimer cette candidature.');
    }
  };

  return (
    <div className="bg-surface-pure rounded-2xl border border-surface-border p-6 shadow-soft space-y-6 animate-fade-in">
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

      {/* Barre de filtres */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            placeholder="Rechercher par nom ou numéro..."
            className="w-full pl-9 pr-4 py-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none cursor-pointer"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente (Pending)</option>
          <option value="approved">Approuvées (Approved)</option>
          <option value="rejected">Rejetées (Rejected)</option>
        </select>

        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="w-full px-3 py-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none cursor-pointer"
        >
          <option value="">Tous les postes</option>
          {positions.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des candidatures */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-content-muted">Chargement des candidatures...</div>
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
                  onClick={() => handleDelete(cand._id, cand.fullName)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale de confirmation de rejet */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={`Rejeter la candidature de ${selectedCandidate?.fullName}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-content-body">
            Indiquez le motif de rejet administratif (non éligible, pièce manquante, etc.) :
          </p>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="ex : Non-respect des critères de participation à FORMATION NO-CODE 1."
            className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl focus:border-brand-red focus:outline-none text-xs"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isActionLoading}
              onClick={handleConfirmReject}
            >
              Confirmer le rejet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modale de modification rapide */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Modifier ${selectedCandidate?.fullName}`}
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-content-title mb-1">Nom complet</label>
            <input
              type="text"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-content-title mb-1">Programme / Pitch</label>
            <textarea
              rows={4}
              value={editPitch}
              onChange={(e) => setEditPitch(e.target.value)}
              className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-content-title mb-1">Lien Vidéo</label>
            <input
              type="url"
              value={editVideoUrl}
              onChange={(e) => setEditVideoUrl(e.target.value)}
              className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isActionLoading}
              onClick={handleConfirmEdit}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
