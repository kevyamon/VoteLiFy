import React, { useState } from 'react';
import { api } from '../../services/api.js';
import { Button } from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { VoterPreviewModal, VoterGeneratedPinsModal } from './AdminVoterModals.jsx';
import { Upload } from 'lucide-react';

export const AdminVoterImportSection = ({ onImportSuccess }) => {
  const [rawText, setRawText] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(null);

  const toast = useToast();

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
      if (onImportSuccess) onImportSuccess();
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

  return (
    <>
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

      <VoterPreviewModal
        previewData={previewData}
        onClose={() => setPreviewData(null)}
        onConfirmImport={handleConfirmImport}
        isImporting={isImporting}
      />

      <VoterGeneratedPinsModal
        generatedBatch={generatedBatch}
        onClose={() => setGeneratedBatch(null)}
        copiedPhone={copiedPhone}
        onCopyWhatsAppMessage={copyWhatsAppMessage}
      />
    </>
  );
};
