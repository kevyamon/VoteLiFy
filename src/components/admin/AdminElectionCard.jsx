import React from 'react';
import { Badge } from '../common/Badge.jsx';
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Vote,
  Users,
  Award,
  Lock,
  Unlock,
  Play,
  Square,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';

/**
 * Carte de gestion unitaire d'une élection.
 * Offre le pilotage granulaire : candidatures, vote 48h, résultats, édition et suppression sécurisée.
 */
export const AdminElectionCard = ({
  election,
  isActionLoading,
  onToggleVoting,
  onToggleCandidacies,
  onToggleResults,
  onEdit,
  onDelete,
}) => {
  const hasDates = election.voting?.startAt || election.voting?.endAt;
  const isClosed = hasDates && new Date() > new Date(election.voting?.endAt);

  const isVotingOpen = Boolean(election.voting?.isOpen);
  const isCandidacyOpen = Boolean(election.candidacies?.isOpen);
  const isResultsPublished = Boolean(election.results?.isPublished);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-surface-pure rounded-2xl border border-surface-border p-5 shadow-soft hover:shadow-card transition-all flex flex-col justify-between gap-4">
      {/* 1. En-tête : Visuel + Titre + Badges */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {election.imageUrl ? (
              <img
                src={election.imageUrl}
                alt={election.title}
                className="w-12 h-12 rounded-xl object-cover border border-surface-border flex-shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red to-brand-blue text-white flex items-center justify-center font-black text-base flex-shrink-0 shadow-sm">
                <span>{election.initials || 'EL'}</span>
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-base font-extrabold text-content-title truncate" title={election.title}>
                {election.title}
              </h4>
              <span className="text-[11px] text-content-muted block">
                Créée le {new Date(election.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isVotingOpen ? (
              <Badge variant="success" dot={true} size="sm">Vote Ouvert</Badge>
            ) : isCandidacyOpen ? (
              <Badge variant="info" dot={true} size="sm">Candidatures</Badge>
            ) : isResultsPublished ? (
              <Badge variant="brand" size="sm">Résultats Publiés</Badge>
            ) : isClosed ? (
              <Badge variant="danger" size="sm">Scrutin Clos</Badge>
            ) : (
              <Badge variant="neutral" size="sm">En Préparation</Badge>
            )}
          </div>
        </div>

        {election.description && (
          <p className="text-xs text-content-body line-clamp-2 leading-relaxed">
            {election.description}
          </p>
        )}

        {/* 2. Périodes officielles */}
        <div className="bg-surface-subtle p-3 rounded-xl border border-surface-border text-xs text-content-muted space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
              <span>Scrutin :</span>
            </span>
            <strong className="text-content-title font-medium text-right">
              {formatDate(election.voting?.endAt) ? `Jusqu'au ${formatDate(election.voting?.endAt)}` : 'Non programmé'}
            </strong>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
              <span>Candidatures :</span>
            </span>
            <strong className="text-content-title font-medium text-right">
              {formatDate(election.candidacies?.endAt) ? `Fin le ${formatDate(election.candidacies?.endAt)}` : 'Non programmées'}
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Boutons d'action unitaire */}
      <div className="space-y-2 pt-2 border-t border-surface-border/70">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Action Candidatures */}
          <button
            type="button"
            disabled={isActionLoading}
            onClick={() => onToggleCandidacies(election)}
            className={`w-full py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
              isCandidacyOpen
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-blue-50 text-brand-blue border-blue-200 hover:bg-blue-100'
            }`}
          >
            {isCandidacyOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isCandidacyOpen ? 'Clôturer dépôts' : 'Ouvrir dépôts'}</span>
          </button>

          {/* Action Scrutin / Vote */}
          <button
            type="button"
            disabled={isActionLoading}
            onClick={() => onToggleVoting(election)}
            className={`w-full py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
              isVotingOpen
                ? 'bg-red-50 text-brand-red border-red-200 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isVotingOpen ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isVotingOpen ? 'Clôturer vote' : 'Ouvrir vote (48h)'}</span>
          </button>

          {/* Action Résultats */}
          <button
            type="button"
            disabled={isActionLoading}
            onClick={() => onToggleResults(election)}
            className={`w-full py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
              isResultsPublished
                ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            {isResultsPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
            <span>{isResultsPublished ? 'Suspendre pub.' : 'Publier résultats'}</span>
          </button>
        </div>

        {/* Actions secondaires : Modifier et Supprimer */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => onEdit(election)}
            className="px-3 py-1.5 text-[11px] font-semibold text-content-muted hover:text-brand-blue bg-surface-base hover:bg-blue-50 border border-surface-border rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(election)}
            className="px-3 py-1.5 text-[11px] font-semibold text-content-muted hover:text-brand-red bg-surface-base hover:bg-red-50 border border-surface-border rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
