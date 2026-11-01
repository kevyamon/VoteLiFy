import React from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { AlertTriangle, Copy, Check } from 'lucide-react';

/**
 * Modale de prévisualisation des numéros avant import.
 */
export const VoterPreviewModal = ({
  previewData,
  onClose,
  onConfirmImport,
  isImporting,
}) => {
  if (!previewData) return null;

  return (
    <Modal
      isOpen={Boolean(previewData)}
      onClose={onClose}
      title="Rapport de prévisualisation de l'import"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="block text-xl font-bold text-brand-blue">{previewData.totalDetected}</span>
            <span className="text-slate-600">Numéros détectés</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="block text-xl font-bold text-emerald-700">{previewData.newToImportCount}</span>
            <span className="text-slate-600">Prêts à être insérés</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="block text-xl font-bold text-amber-700">{previewData.duplicateInBatchCount}</span>
            <span className="text-slate-600">Doublons dans le lot</span>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
            <span className="block text-xl font-bold text-slate-700">{previewData.alreadyInDatabaseCount}</span>
            <span className="text-slate-600">Déjà en base</span>
          </div>
        </div>

        {previewData.invalidCount > 0 && (
          <div className="p-3 bg-red-50 border border-brand-red/20 rounded-xl text-brand-red">
            <p className="font-bold mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{previewData.invalidCount} numéro(s) rejeté(s) car mal formaté(s) :</span>
            </p>
            <p className="font-mono text-[11px] truncate">{previewData.invalidTokens.join(', ')}</p>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isImporting}
            disabled={previewData.newToImportCount === 0}
            onClick={onConfirmImport}
          >
            Confirmer l'insertion ({previewData.newToImportCount})
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Modale d'affichage unique des codes PIN générés pour transmission WhatsApp.
 */
export const VoterGeneratedPinsModal = ({
  generatedBatch,
  onClose,
  copiedPhone,
  onCopyWhatsAppMessage,
}) => {
  if (!generatedBatch) return null;

  return (
    <Modal
      isOpen={Boolean(generatedBatch)}
      onClose={onClose}
      title={`Codes PIN générés (${generatedBatch.length}) — Confidentiel`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p>
            <strong>ATTENTION :</strong> C’est l’unique fois où les codes PIN sont affichés en clair. Copiez les messages individuels pour les envoyer par WhatsApp aux membres. En base, seuls les hashs sont conservés.
          </p>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-surface-border border border-surface-border rounded-xl">
          {generatedBatch.map((item) => (
            <div key={item.phone} className="p-3 flex items-center justify-between gap-4 text-xs hover:bg-surface-subtle">
              <div>
                <span className="font-bold text-content-title block">{item.phone}</span>
                <span className="font-mono text-brand-red font-semibold text-sm">{item.pin}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={copiedPhone === item.phone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => onCopyWhatsAppMessage(item.message, item.phone)}
              >
                {copiedPhone === item.phone ? 'Copié !' : 'Copier message'}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Terminer et fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Modale d'affichage du nouveau code PIN régénéré pour un électeur individuel.
 */
export const VoterRegeneratedPinModal = ({
  data,
  onClose,
  copied,
  onCopy,
}) => {
  if (!data) return null;

  return (
    <Modal
      isOpen={Boolean(data)}
      onClose={onClose}
      title="Nouveau code PIN généré avec succès"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
            Électeur : {data.phone}
          </span>
          <div className="inline-block px-4 py-2 bg-white rounded-xl border border-emerald-300 shadow-sm">
            <span className="font-mono text-xl sm:text-2xl font-black text-content-title tracking-wider">
              {data.newPin}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700">
            Ce code est actif et remplace tout code précédent.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-content-title block">
            Message WhatsApp officiel prêt à l'envoi :
          </span>
          <pre className="p-3 bg-surface-subtle border border-surface-border rounded-xl text-[11px] font-mono whitespace-pre-wrap text-content-body max-h-36 overflow-y-auto">
            {data.message}
          </pre>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            onClick={() => onCopy(data.message)}
          >
            {copied ? 'Copié !' : 'Copier le message'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
