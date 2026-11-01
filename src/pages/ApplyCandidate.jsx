import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { CustomSelect } from '../components/common/CustomSelect.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ApplySuccessState } from '../components/candidate/ApplySuccessState.jsx';
import { ApplySkeleton } from '../components/common/Skeleton.jsx';
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  Video,
  FileText,
  User,
  Phone,
  Briefcase,
} from 'lucide-react';

export const ApplyCandidate = ({ onNavigate }) => {
  const [positions, setPositions] = useState([]);
  const [electionInfo, setElectionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Champs de formulaire
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [positionId, setPositionId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [pitch, setPitch] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toast = useToast();

  useEffect(() => {
    const fetchPrerequisites = async () => {
      try {
        const [info, posList] = await Promise.all([
          api.getElectionInfo(),
          api.getPositions(),
        ]);
        setElectionInfo(info);
        setPositions(posList || []);
        if (posList && posList.length > 0) {
          setPositionId(posList[0]._id);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des postes :', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrerequisites();
  }, []);

  // Conversion de la photo locale en Data URL pour téléversement autonome
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image valide (JPEG, PNG ou WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error('La taille de l’image ne doit pas excéder 3 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result);
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !positionId || !photoUrl || !pitch.trim()) {
      setErrorMessage('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitCandidacy({
        fullName: fullName.trim(),
        phone: phone.trim(),
        positionId,
        photoUrl,
        pitch: pitch.trim(),
        videoUrl: videoUrl.trim(),
      });

      setSubmittedSuccess(true);
      toast.success('Votre candidature a été soumise avec succès.');
    } catch (err) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de la soumission de votre dossier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCandidacyOpen = electionInfo?.candidacies?.isOpen;

  if (isLoading) {
    return <ApplySkeleton />;
  }

  // Écran d'information si la période est fermée (CDC Section 3.1)
  if (!isCandidacyOpen && !submittedSuccess) {
    return (
      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <Badge variant="danger" dot={false} size="md">
            Période Clôturée
          </Badge>
          <h1 className="text-3xl font-extrabold text-content-title tracking-tight">
            Dépôt des candidatures clos
          </h1>
          <p className="text-sm text-content-body max-w-md mx-auto leading-relaxed">
            La période officielle de dépôt des candidatures pour l'élection de la FORMATION NO-CODE est terminée. Aucun nouveau dossier ne peut être soumis.
          </p>
        </div>
        <div className="pt-4">
          <Button
            variant="outline"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => onNavigate('home')}
          >
            Retourner à l’accueil
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* En-tête et retour */}
      <div className="mb-8 space-y-4">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l’espace de scrutin</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-content-title tracking-tight">
              Déposer ma candidature
            </h1>
            <p className="text-sm text-content-muted mt-1">
              Remplissez le formulaire officiel pour postuler à un poste électoral.
            </p>
          </div>
          <Badge variant="success" dot={true} size="md">
            Candidatures ouvertes
          </Badge>
        </div>

        {/* Rappel des conditions d'éligibilité (CDC Section 2.2) */}
        <div className="p-4 bg-blue-50/70 border border-brand-blue/20 rounded-2xl text-xs text-content-body space-y-1">
          <p className="font-bold text-brand-blue">Conditions d’éligibilité requises :</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-700">
            <li>Avoir participé à la FORMATION NO-CODE 1.</li>
            <li>Être membre du groupe WhatsApp officiel FORMATION NO-CODE.</li>
            <li>Une seule candidature autorisée par membre parmi l'ensemble des postes.</li>
          </ul>
        </div>
      </div>

      {submittedSuccess ? (
        <ApplySuccessState onNavigateHome={() => onNavigate('home')} />
      ) : (
        /* Formulaire de candidature */
        <form onSubmit={handleSubmit} className="bg-surface-pure rounded-2xl border border-surface-border p-6 sm:p-8 shadow-soft space-y-6">
          {/* Champ 1 — Nom et prénom */}
          <div className="space-y-1.5">
            <label htmlFor="candidate-name" className="block text-xs font-bold uppercase tracking-wider text-content-title">
              Nom et prénom complets <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="candidate-name"
                type="text"
                required={true}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex : Kevin Kouamé"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-surface-border rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Champ 2 — Numéro WhatsApp */}
          <div className="space-y-1.5">
            <label htmlFor="candidate-phone" className="block text-xs font-bold uppercase tracking-wider text-content-title">
              Numéro WhatsApp <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="candidate-phone"
                type="tel"
                required={true}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ex : +225 07 00 00 00 00"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-surface-border rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-content-muted">
              Utilisé pour vérifier votre appartenance à la communauté FORMATION NO-CODE.
            </p>
          </div>

          {/* Champ 3 — Poste convoité */}
          <div className="space-y-1.5">
            <label htmlFor="candidate-position" className="block text-xs font-bold uppercase tracking-wider text-content-title">
              Poste convoité <span className="text-brand-red">*</span>
            </label>
            <CustomSelect
              id="candidate-position"
              value={positionId}
              onChange={(val) => setPositionId(val)}
              placeholder="Sélectionnez le poste convoité..."
              title="Poste convoité"
              icon={Briefcase}
              options={positions.map((p) => ({ value: p._id, label: p.name }))}
            />
          </div>

          {/* Champ 4 — Photo officielle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-title">
              Photo officielle de profil <span className="text-brand-red">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {photoPreview ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-blue flex-shrink-0 bg-slate-100">
                  <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 flex-shrink-0 bg-surface-subtle">
                  <Upload className="w-6 h-6 stroke-1 mb-1" />
                  <span className="text-[10px]">Photo</span>
                </div>
              )}

              <div className="flex-1 w-full space-y-1.5">
                <input
                  type="file"
                  id="candidate-photo-file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="candidate-photo-file"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-content-title hover:bg-surface-subtle cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Choisir une photo (Max 3 Mo)</span>
                </label>
                <p className="text-[11px] text-content-muted">
                  Sélectionnez un portrait officiel net, cadré de face et de bonne qualité.
                </p>
              </div>
            </div>
          </div>

          {/* Champ 5 — Pitch et programme */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="candidate-pitch" className="block text-xs font-bold uppercase tracking-wider text-content-title">
                Pitch et programme de campagne <span className="text-brand-red">*</span>
              </label>
              <span className="text-[10px] font-mono text-content-muted">{pitch.length} / 2000</span>
            </div>
            <textarea
              id="candidate-pitch"
              required={true}
              rows={5}
              maxLength={2000}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Présentez vos motivations, votre vision pour ce poste et vos engagements concrets..."
              className="w-full p-3.5 bg-surface-base border border-surface-border rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Champ 6 — Lien Vidéo (Facultatif) */}
          <div className="space-y-1.5">
            <label htmlFor="candidate-video" className="block text-xs font-bold uppercase tracking-wider text-content-title">
              Lien vidéo de présentation <span className="text-content-muted font-normal text-[11px]">(Facultatif)</span>
            </label>
            <div className="relative">
              <input
                id="candidate-video"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="ex : https://www.youtube.com/watch?v=..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-surface-border rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-all"
              />
              <Video className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-content-muted">
              Lien vers votre vidéo de présentation hébergée sur YouTube ou Google Drive.
            </p>
          </div>

          {/* Affichage d'erreur */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-brand-red/20 rounded-xl">
              <p className="text-xs font-semibold text-brand-red leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Bouton de soumission */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth={true}
              isLoading={isSubmitting}
              icon={<FileText className="w-4 h-4" />}
            >
              Soumettre ma candidature
            </Button>
          </div>
        </form>
      )}
    </main>
  );
};
