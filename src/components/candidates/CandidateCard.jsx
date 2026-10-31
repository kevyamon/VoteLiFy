import React, { useState } from 'react';
import { Button } from '../common/Button.jsx';
import { PlayCircle, CheckCircle, ChevronDown, ChevronUp, User } from 'lucide-react';

export const CandidateCard = ({
  candidate,
  positionName,
  isVotingOpen,
  onVoteClick,
}) => {
  const [pitchExpanded, setPitchExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const firstName = candidate.fullName.trim().split(' ')[0] || candidate.fullName;
  const isPitchLong = candidate.pitch && candidate.pitch.length > 180;

  return (
    <article className="group bg-surface-pure rounded-2xl border border-surface-border shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cadre Photo Standardisé */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {!imageError && candidate.photoUrl ? (
          <img
            src={candidate.photoUrl}
            alt={candidate.fullName}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <User className="w-16 h-16 stroke-1 mb-2" />
            <span className="text-xs font-medium">Photo officielle</span>
          </div>
        )}

        {/* Badge du poste sur l'image */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-brand-blue shadow-sm backdrop-blur-sm border border-slate-100">
            {positionName}
          </span>
        </div>
      </div>

      {/* Contenu et Détails du Candidat */}
      <div className="p-5 flex-1 flex flex-col">
        <h4 className="text-lg font-bold text-content-title tracking-tight mb-2">
          {candidate.fullName}
        </h4>

        {/* Programme / Pitch avec lecture développable */}
        <div className="text-sm text-content-body leading-relaxed mb-4 flex-1">
          <p className="whitespace-pre-line">
            {isPitchLong && !pitchExpanded
              ? `${candidate.pitch.slice(0, 180)}...`
              : candidate.pitch}
          </p>

          {isPitchLong && (
            <button
              onClick={() => setPitchExpanded(!pitchExpanded)}
              className="mt-1 text-xs font-bold text-brand-blue hover:text-brand-blue-hover inline-flex items-center gap-1 focus:outline-none"
            >
              {pitchExpanded ? (
                <>
                  Réduire <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Lire la suite <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Lien Vidéo si disponible */}
        {candidate.videoUrl && (
          <div className="mb-4 pt-2 border-t border-surface-border/60">
            <a
              href={candidate.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
            >
              <PlayCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
              <span>Voir la vidéo de présentation</span>
            </a>
          </div>
        )}

        {/* Bouton d'Action Principale : Voter pour */}
        <Button
          variant="primary"
          fullWidth={true}
          disabled={!isVotingOpen}
          onClick={() => onVoteClick(candidate, positionName)}
          icon={<CheckCircle className="w-4 h-4" />}
        >
          {isVotingOpen ? `Voter pour ${firstName}` : 'Scrutin fermé'}
        </Button>
      </div>
    </article>
  );
};
