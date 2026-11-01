import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Image, Upload, Plus, Check, AlertCircle } from 'lucide-react';

/**
 * Modale unifiée pour la création et l'édition d'une élection.
 * Intègre la prévisualisation et l'encodage base64 pour upload Cloudinary.
 */
export const AdminElectionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData = null,
}) => {
  const isEdit = Boolean(initialData?._id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingStartAt, setVotingStartAt] = useState('');
  const [votingEndAt, setVotingEndAt] = useState('');
  const [candidateStartAt, setCandidateStartAt] = useState('');
  const [candidateEndAt, setCandidateEndAt] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  const toLocalISO = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setVotingStartAt(toLocalISO(initialData.voting?.startAt));
        setVotingEndAt(toLocalISO(initialData.voting?.endAt));
        setCandidateStartAt(toLocalISO(initialData.candidacies?.startAt));
        setCandidateEndAt(toLocalISO(initialData.candidacies?.endAt));
        setImagePreview(initialData.imageUrl || '');
        setImageBase64('');
      } else {
        setTitle('');
        setDescription('');
        const now = new Date();
        const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        setVotingStartAt(toLocalISO(now));
        setVotingEndAt(toLocalISO(in48h));
        setCandidateStartAt('');
        setCandidateEndAt('');
        setImagePreview('');
        setImageBase64('');
      }
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      votingStartAt: votingStartAt ? new Date(votingStartAt).toISOString() : null,
      votingEndAt: votingEndAt ? new Date(votingEndAt).toISOString() : null,
      candidateStartAt: candidateStartAt ? new Date(candidateStartAt).toISOString() : null,
      candidateEndAt: candidateEndAt ? new Date(candidateEndAt).toISOString() : null,
    };

    if (imageBase64) {
      payload.imageUrl = imageBase64;
    }

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={isEdit ? 'Modifier l’Élection' : 'Créer une Nouvelle Élection'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Titre */}
        <div>
          <label className="block font-bold text-content-title mb-1">
            Nom / Titre officiel du scrutin <span className="text-brand-red">*</span>
          </label>
          <input
            type="text"
            required={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ex : Élection du Bureau Exécutif 2026"
            className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-content-title mb-1">
            Description et directives
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ex : Scrutin officiel certifié pour la communauté."
            className="w-full p-2.5 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
          />
        </div>

        {/* Image d'illustration Cloudinary */}
        <div>
          <label className="block font-bold text-content-title mb-1">
            Image d'illustration (Hébergée sur Cloudinary)
          </label>
          <div className="flex items-center gap-3">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-14 h-14 rounded-xl object-cover border border-surface-border shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-surface-subtle border border-surface-border border-dashed flex items-center justify-center text-content-muted flex-shrink-0">
                <Image className="w-6 h-6" />
              </div>
            )}
            <label className="cursor-pointer px-3 py-2 bg-surface-base hover:bg-surface-subtle border border-surface-border rounded-xl text-[11px] font-semibold text-content-title transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-brand-red" />
              <span>{imagePreview ? "Changer l'image" : "Choisir une illustration"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Période de vote */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-surface-border">
          <div>
            <label className="block font-bold text-content-title mb-1">
              Début du scrutin
            </label>
            <input
              type="datetime-local"
              value={votingStartAt}
              onChange={(e) => setVotingStartAt(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-content-title mb-1">
              Clôture du scrutin
            </label>
            <input
              type="datetime-local"
              value={votingEndAt}
              onChange={(e) => setVotingEndAt(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
          </div>
        </div>

        {/* Période de candidatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-content-muted mb-1">
              Début dépôts (optionnel)
            </label>
            <input
              type="datetime-local"
              value={candidateStartAt}
              onChange={(e) => setCandidateStartAt(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-content-muted mb-1">
              Fin dépôts (optionnel)
            </label>
            <input
              type="datetime-local"
              value={candidateEndAt}
              onChange={(e) => setCandidateEndAt(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            icon={isEdit ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {isEdit ? 'Enregistrer les modifications' : 'Créer le scrutin'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
