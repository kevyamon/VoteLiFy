import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useSocketEvent } from '../../services/socket.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { CustomSelect } from '../common/CustomSelect.jsx';
import { AdminVotersSkeleton } from '../common/Skeleton.jsx';
import { ConfirmModal } from '../common/ConfirmModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { AdminVoterImportSection } from './AdminVoterImportSection.jsx';
import { VoterRegeneratedPinModal } from './AdminVoterModals.jsx';
import {
  Users,
  Download,
  Search,
  RefreshCw,
  KeyRound,
  Trash2,
} from 'lucide-react';

export const AdminVotersTab = ({ electionId }) => {
  // Registre des électeurs
  const [voters, setVoters] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filterVoted, setFilterVoted] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Suppression et Régénération PIN
  const [voterToDelete, setVoterToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [regeneratedData, setRegeneratedData] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedRegenerated, setCopiedRegenerated] = useState(false);

  const toast = useToast();

  const loadVoters = async (page = 1) => {
    setIsLoadingList(true);
    try {
      const params = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();
      if (filterVoted !== '') params.hasVoted = filterVoted;
      if (electionId) params.electionId = electionId;

      const data = await api.getVoters(params);
      setVoters(data?.voters || []);
      setPagination(data?.pagination || { page: 1, limit: 20, totalPages: 1 });
    } catch (err) {
      toast.error('Impossible de charger le registre des électeurs.');
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    loadVoters(1);
  }, [filterVoted, electionId]);

  // Synchronisation temps réel du registre d'émargement
  useSocketEvent('VOTE_CAST', () => loadVoters(pagination.page));
  useSocketEvent('VOTERS_IMPORTED', () => loadVoters(1));
  useSocketEvent('ELECTION_RESET', () => loadVoters(1));

  const handleExport = async () => {
    try {
      const data = await api.exportVoters(electionId ? { electionId } : {});
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `votelify_electeurs_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Fichier d’export téléchargé.');
    } catch (err) {
      toast.error('Erreur lors de l’exportation des données.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!voterToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteVoter(voterToDelete._id);
      toast.success(`Électeur ${voterToDelete.phone} supprimé de la liste.`);
      setVoterToDelete(null);
      loadVoters(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Impossible de supprimer cet électeur.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRegeneratePin = async (voter) => {
    setIsRegenerating(true);
    try {
      const res = await api.regenerateVoterPin(voter._id);
      setRegeneratedData(res);
      setCopiedRegenerated(false);
      toast.success(`Nouveau code PIN généré pour ${voter.phone}.`);
    } catch (err) {
      toast.error(err.message || 'Impossible de régénérer le code PIN.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyRegenerated = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRegenerated(true);
    toast.success('Message WhatsApp copié dans le presse-papier !');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Zone d'import des numéros WhatsApp */}
      <AdminVoterImportSection onImportSuccess={() => loadVoters(1)} electionId={electionId} />

      {/* 2. Registre des Électeurs */}
      <div className="bg-surface-pure rounded-2xl border border-surface-border p-4 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-content-title flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-blue" />
              <span>Registre d’Émargement des Électeurs</span>
            </h3>
            <p className="text-xs text-content-muted">
              Suivi confidentiel de participation électorale ({pagination.total || 0} électeurs au total).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExport}
            >
              Exporter
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => loadVoters(pagination.page)}
              disabled={isLoadingList}
            >
              Actualiser
            </Button>
          </div>
        </div>

        {/* Filtres de recherche */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadVoters(1)}
              placeholder="Rechercher par numéro de téléphone..."
              className="w-full pl-9 pr-4 py-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <CustomSelect
            value={filterVoted}
            onChange={(val) => setFilterVoted(val)}
            placeholder="Tous les statuts de vote"
            title="Statut de participation"
            options={[
              { value: '', label: 'Tous les statuts de vote' },
              { value: 'true', label: 'A déjà voté' },
              { value: 'false', label: "N'a pas encore voté" },
            ]}
          />
        </div>

        {/* Tableau scrollable */}
        <div className="overflow-x-auto rounded-xl border border-surface-border">
          <table className="w-full min-w-[540px] text-left text-xs">
            <thead className="bg-surface-subtle border-b border-surface-border text-content-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-bold">Numéro WhatsApp</th>
                <th className="px-4 py-3 font-bold">Statut de Vote</th>
                <th className="px-4 py-3 font-bold">Date d'émargement</th>
                <th className="px-4 py-3 font-bold">Statut PIN</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border bg-surface-pure font-medium">
              {isLoadingList ? (
                <AdminVotersSkeleton />
              ) : voters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-content-muted">
                    Aucun électeur trouvé pour ces critères.
                  </td>
                </tr>
              ) : (
                voters.map((v) => (
                  <tr key={v._id} className="hover:bg-surface-subtle/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-content-title">{v.phone}</td>
                    <td className="px-4 py-3">
                      {v.hasVoted ? (
                        <Badge variant="success" dot={true} size="sm">
                          A voté
                        </Badge>
                      ) : (
                        <Badge variant="neutral" dot={false} size="sm">
                          En attente
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-content-muted">
                      {v.votedAt ? new Date(v.votedAt).toLocaleString('fr-FR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-slate-500 font-medium">Actif</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {v.hasVoted ? (
                        <span className="text-[11px] text-content-muted italic">Émargement scellé</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Générer un nouveau code PIN"
                            onClick={() => handleRegeneratePin(v)}
                            disabled={isRegenerating}
                            className="p-1.5 rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Supprimer cet électeur"
                            onClick={() => setVoterToDelete(v)}
                            className="p-1.5 rounded-lg bg-red-50 text-brand-red hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center pt-2 text-xs">
            <span className="text-content-muted">
              Page {pagination.page} sur {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => loadVoters(pagination.page - 1)}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadVoters(pagination.page + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modale de confirmation de suppression d'électeur */}
      <ConfirmModal
        isOpen={Boolean(voterToDelete)}
        title="Supprimer cet électeur ?"
        message={
          voterToDelete
            ? `Êtes-vous certain de vouloir retirer l'électeur ${voterToDelete.phone} de la liste électorale ? Son code PIN sera définitivement révoqué.`
            : ''
        }
        confirmText="Supprimer de la liste"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setVoterToDelete(null)}
      />

      {/* Modale de restitution du nouveau code PIN régénéré */}
      <VoterRegeneratedPinModal
        data={regeneratedData}
        onClose={() => setRegeneratedData(null)}
        copied={copiedRegenerated}
        onCopy={handleCopyRegenerated}
      />
    </div>
  );
};
