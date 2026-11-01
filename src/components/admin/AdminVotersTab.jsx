import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { CustomSelect } from '../common/CustomSelect.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { VoterPreviewModal, VoterGeneratedPinsModal } from './AdminVoterModals.jsx';
import {
  Users,
  Upload,
  Download,
  Search,
  RefreshCw,
} from 'lucide-react';

export const AdminVotersTab = () => {
  const [rawText, setRawText] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState(null);

  // Registre des électeurs
  const [voters, setVoters] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filterVoted, setFilterVoted] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(null);

  const toast = useToast();

  const loadVoters = async (page = 1) => {
    setIsLoadingList(true);
    try {
      const params = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();
      if (filterVoted !== '') params.hasVoted = filterVoted;

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
  }, [filterVoted]);

  const handlePreview = async () => {
    if (!rawText.trim()) {
      toast.error('Veuillez coller au moins un numéro de téléphone.');
      return;
    }
    setIsPreviewing(true);
    try {
      const data = await api.previewVoters({ rawText });
      setPreviewData(data);
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l’analyse des numéros.');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    try {
      const result = await api.importVoters({ rawText });
      setGeneratedBatch(result.votersWithPin || []);
      setPreviewData(null);
      setRawText('');
      toast.success(`${result.importedCount} électeur(s) importé(s) avec succès.`);
      loadVoters(1);
    } catch (err) {
      toast.error(err.message || 'Échec lors de l’importation.');
    } finally {
      setIsImporting(false);
    }
  };

  const copyWhatsAppMessage = (text, phone) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(phone);
    toast.success(`Message copié pour le ${phone}`);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  const handleExport = async () => {
    try {
      const data = await api.exportVoters();
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Zone d'import des numéros WhatsApp (CDC Section 7.2) */}
      <div className="bg-surface-pure rounded-2xl border border-surface-border p-4 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
          <div className="p-2 bg-brand-red-light text-brand-red rounded-xl">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-content-title">Importer des électeurs & Générer les PINs</h3>
            <p className="text-xs text-content-muted">
              Collez la liste brute des numéros des membres WhatsApp (un par ligne ou séparés par des virgules).
            </p>
          </div>
        </div>

        <textarea
          rows={4}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`+2250700000000\n+225 05 11 22 33 44\n0102030405`}
          className="w-full p-3.5 bg-surface-base border border-surface-border rounded-xl text-xs font-mono focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-xs text-content-muted">
            Format supporté : international (+225...) ou local 10 chiffres (détection automatique).
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              isLoading={isPreviewing}
              onClick={handlePreview}
            >
              Prévisualiser l'analyse
            </Button>

            <Button
              variant="primary"
              size="sm"
              isLoading={isImporting}
              disabled={!rawText.trim()}
              onClick={handleConfirmImport}
            >
              Importer & Générer les PINs
            </Button>
          </div>
        </div>
      </div>

      {/* Modale de rapport de prévisualisation (CDC Section 7.3) */}
      <VoterPreviewModal
        previewData={previewData}
        onClose={() => setPreviewData(null)}
        onConfirmImport={handleConfirmImport}
        isImporting={isImporting}
      />

      {/* Modale d'affichage des PINs fraîchement générés (CDC Section 7.5 & 7.7) */}
      <VoterGeneratedPinsModal
        generatedBatch={generatedBatch}
        onClose={() => setGeneratedBatch(null)}
        copiedPhone={copiedPhone}
        onCopyWhatsAppMessage={copyWhatsAppMessage}
      />

      {/* 2. Registre des Électeurs (CDC Section 7.6) */}
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

        {/* Tableau scrollable horizontalement sur mobile sans casser la mise en page */}
        <div className="overflow-x-auto rounded-xl border border-surface-border">
          <table className="w-full min-w-[540px] text-left text-xs">
            <thead className="bg-surface-subtle border-b border-surface-border text-content-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-bold">Numéro WhatsApp</th>
                <th className="px-4 py-3 font-bold">Statut de Vote</th>
                <th className="px-4 py-3 font-bold">Date d'émargement</th>
                <th className="px-4 py-3 font-bold">Statut PIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border bg-surface-pure font-medium">
              {isLoadingList ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-content-muted">
                    Chargement du registre...
                  </td>
                </tr>
              ) : voters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-content-muted">
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
    </div>
  );
};
