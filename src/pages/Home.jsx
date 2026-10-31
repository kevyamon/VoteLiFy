import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { CandidateCard } from '../components/candidates/CandidateCard.jsx';
import { VoteModal } from '../components/vote/VoteModal.jsx';
import { CountdownTimer } from '../components/common/CountdownTimer.jsx';
import { Button } from '../components/common/Button.jsx';
import { UserPlus, RefreshCw, Users } from 'lucide-react';

export const Home = ({ onNavigate }) => {
  const [electionInfo, setElectionInfo] = useState(null);
  const [groupedCandidates, setGroupedCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedPositionName, setSelectedPositionName] = useState('');
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [info, candidates] = await Promise.all([
        api.getElectionInfo(),
        api.getCandidates(),
      ]);
      setElectionInfo(info);
      setGroupedCandidates(candidates || []);
    } catch (error) {
      console.error('Erreur de chargement des données électorales :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVoteClick = (candidate, positionName) => {
    setSelectedCandidate(candidate);
    setSelectedPositionName(positionName);
    setVoteModalOpen(true);
  };

  const handleVoteSuccess = () => {
    fetchData();
  };

  const isVotingOpen = electionInfo?.voting?.isOpen;
  const isCandidacyOpen = electionInfo?.candidacies?.isOpen;

  // Calcul de la cible pour le compte à rebours
  const countdownTarget = isVotingOpen
    ? electionInfo?.voting?.endAt
    : isCandidacyOpen
    ? electionInfo?.candidacies?.endAt
    : electionInfo?.results?.publishAt;

  const countdownLabel = isVotingOpen
    ? 'Clôture du scrutin dans'
    : isCandidacyOpen
    ? 'Clôture des candidatures dans'
    : 'Proclamation des résultats dans';

  return (
    <main className="flex-1 pb-16">
      {/* 1. Bannière de présentation officielle du scrutin (CDC Section 5.2) */}
      <section className="bg-gradient-to-b from-surface-subtle to-surface-base border-b border-surface-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="whitespace-nowrap text-[clamp(12px,3.7vw,36px)] font-extrabold text-content-title tracking-tight max-w-none mx-auto leading-tight">
            {electionInfo?.title || 'Élection des responsables — Communauté No-Code'}
          </h1>

          <p className="text-base sm:text-lg text-content-body max-w-2xl mx-auto leading-relaxed">
            {electionInfo?.description ||
              'Exprimez votre voix en toute confidentialité grâce à votre code PIN individuel secret et participez activement à la gouvernance de notre communauté.'}
          </p>

          {/* 2. Bloc Compte à rebours dynamique (CDC Section 5.3) */}
          {countdownTarget && (
            <div className="pt-2">
              <CountdownTimer targetDate={countdownTarget} label={countdownLabel} />
            </div>
          )}
        </div>
      </section>

      {/* 3. Section des candidats regroupés par poste (CDC Section 5.4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-content-title tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-red" />
              <span>Candidats par Poste</span>
            </h2>
            <p className="text-sm text-content-muted mt-1">
              Consultez les programmes et votez pour le candidat de votre choix pour chaque poste électoral.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={fetchData}
              disabled={isLoading}
            >
              Actualiser
            </Button>
          </div>
        </div>

        {/* Chargement initial */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-content-muted">Chargement du scrutin...</p>
          </div>
        ) : groupedPositionsIsEmpty(groupedCandidates) ? (
          /* État vide si aucune candidature validée */
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 stroke-1" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-title">Aucune candidature validée</h3>
              <p className="text-sm text-content-body">
                Les candidatures sont en cours d’examen par la Commission Électorale ou le dépôt est ouvert.
              </p>
            </div>
            {isCandidacyOpen && (
              <Button
                variant="primary"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={() => onNavigate('apply')}
              >
                Déposer ma candidature
              </Button>
            )}
          </div>
        ) : (
          /* Grille des postes et de leurs candidats */
          <div className="space-y-12 mt-8">
            {groupedCandidates.map((group) => (
              <div key={group._id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-7 bg-brand-red rounded-full" />
                  <div>
                    <h3 className="text-xl font-bold text-content-title tracking-tight">
                      Poste : {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-xs text-content-muted">{group.description}</p>
                    )}
                  </div>
                </div>

                {group.candidates && group.candidates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.candidates.map((cand) => (
                      <CandidateCard
                        key={cand._id}
                        candidate={cand}
                        positionName={group.name}
                        isVotingOpen={isVotingOpen}
                        onVoteClick={handleVoteClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-surface-subtle rounded-2xl border border-surface-border text-center">
                    <p className="text-sm text-content-muted">
                      Aucune candidature approuvée pour ce poste pour le moment.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Modale de vote sécurisé par PIN */}
      <VoteModal
        isOpen={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        candidate={selectedCandidate}
        positionName={selectedPositionName}
        onVoteSuccess={handleVoteSuccess}
      />
    </main>
  );
};

// Fonction utilitaire pour détecter si aucun candidat n'est présent
function groupedPositionsIsEmpty(groups) {
  if (!groups || groups.length === 0) return true;
  return groups.every((g) => !g.candidates || g.candidates.length === 0);
}
