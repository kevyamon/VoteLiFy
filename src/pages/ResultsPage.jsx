import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { CountdownTimer } from '../components/common/CountdownTimer.jsx';
import { ResultsSkeleton } from '../components/common/Skeleton.jsx';
import { ResultsParticipationCards } from '../components/results/ResultsParticipationCards.jsx';
import { useSocketEvent } from '../services/socket.js';
import {
  Award,
  ArrowLeft,
  Clock,
  Trophy,
  Scale,
  Calendar,
  Vote,
  ShieldCheck,
} from 'lucide-react';

export const ResultsPage = ({ onNavigate }) => {
  const [resultsData, setResultsData] = useState(null);
  const [electionInfo, setElectionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const [resData, info] = await Promise.all([
        api.getResults(),
        api.getElectionInfo(),
      ]);
      setResultsData(resData);
      setElectionInfo(info);
    } catch (err) {
      console.error('Erreur lors du chargement des résultats :', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    fetchResults();
  }, []);

  // Synchronisation temps réel automatique
  useSocketEvent('ELECTION_UPDATED', fetchResults);
  useSocketEvent('VOTE_CAST', fetchResults);
  useSocketEvent('ELECTION_RESET', fetchResults);

  if (isLoading) {
    return <ResultsSkeleton />;
  }

  const isPublished = resultsData?.isPublished;
  const isVotingOpen = electionInfo?.voting?.isOpen;
  const isCandidacyOpen = electionInfo?.candidacies?.isOpen;
  const publishTarget = resultsData?.publishAt || electionInfo?.results?.publishAt;

  // Traitement propre du titre électoral : suppression des "—" cadratins
  const rawTitle = electionInfo?.title || resultsData?.title || 'Élection des responsables — Communauté No-Code';
  const sanitizedTitle = rawTitle.replace(/([a-zA-ZÀ-ÿ])—([a-zA-ZÀ-ÿ])/g, '$1-$2');
  const titleParts = sanitizedTitle.split(/\s*[—–]\s*|\s+-\s+/);
  const line1 = titleParts[0]?.replace(/[—–]/g, '').trim() || 'Élection des responsables';
  const line2 = titleParts.slice(1).join(' ').replace(/[—–]/g, '').trim() || (titleParts.length === 1 ? '' : 'Communauté No-Code');

  return (
    <main className="flex-1 pb-16">
      {/* 1. ÉTAT A : Résultats en attente de proclamation (CDC Section 10.1) */}
      {!isPublished ? (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
          {/* Carte descriptive officielle de l'élection */}
          <div className="bg-surface-pure rounded-2xl border border-surface-border p-4 sm:p-8 shadow-soft space-y-5">
            {/* Barre supérieure : Catégorie + Badge de statut */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-blue-50 text-brand-blue rounded-xl flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-brand-blue uppercase tracking-wider">
                  Scrutin Communautaire
                </span>
              </div>

              <div>
                {isVotingOpen ? (
                  <Badge variant="success" dot={true} size="sm">
                    Scrutin en cours
                  </Badge>
                ) : isCandidacyOpen ? (
                  <Badge variant="info" dot={true} size="sm">
                    Candidatures ouvertes
                  </Badge>
                ) : (
                  <Badge variant="neutral" dot={false} size="sm">
                    Scrutin clos
                  </Badge>
                )}
              </div>
            </div>

            {/* Titre principal épuré sans "—" */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-content-title tracking-tight leading-snug">
                <span className="block">{line1}</span>
                {line2 && (
                  <span className="block text-brand-red">{line2}</span>
                )}
              </h2>
            </div>

            <p className="text-sm text-content-body leading-relaxed">
              {electionInfo?.description ||
                'Scrutin officiel et confidentiel de la communauté FORMATION NO-CODE pour le renouvellement des représentants.'}
            </p>

            {/* Calendrier et jalons temporels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border flex items-center gap-3">
                <Calendar className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <div>
                  <span className="text-content-muted block">Phase de vote</span>
                  <span className="font-semibold text-content-title">
                    {electionInfo?.voting?.endAt
                      ? `Jusqu'au ${new Date(electionInfo.voting.endAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                      : 'Période officielle annoncée'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-red flex-shrink-0" />
                <div>
                  <span className="text-content-muted block">Proclamation certifiée</span>
                  <span className="font-semibold text-content-title">
                    {publishTarget
                      ? new Date(publishTarget).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                      : 'À l’issue du dépouillement'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc d'attente de proclamation avec pulse */}
          <div className="bg-surface-pure rounded-2xl border border-surface-border p-8 text-center space-y-6 shadow-soft">
            <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-blue-50/90 text-brand-blue border border-brand-blue/20 shadow-xs mx-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-blue"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase">
                Décompte en cours
              </span>
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-content-title tracking-tight">
                Proclamation Officielle en Attente
              </h1>
              <p className="text-sm text-content-body leading-relaxed">
                {resultsData?.message ||
                  'Scrutin en cours d’évaluation. Les résultats certifiés seront proclamés par la Commission Électorale à l’issue de la période officielle.'}
              </p>
            </div>

            {/* Compte à rebours dynamique si date fixée */}
            {publishTarget && (
              <div className="pt-2">
                <CountdownTimer
                  targetDate={publishTarget}
                  label="Proclamation officielle des résultats dans"
                />
              </div>
            )}

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              {isVotingOpen && (
                <Button
                  variant="primary"
                  icon={<Vote className="w-4 h-4" />}
                  onClick={() => onNavigate('home')}
                >
                  Participer au vote dès maintenant
                </Button>
              )}
              <Button
                variant="outline"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => onNavigate('home')}
              >
                Retourner à l’accueil
              </Button>
            </div>
          </div>
        </section>
      ) : (
        /* 2. ÉTAT B : Résultats Proclamés et Certifiés (CDC Section 10.2 à 10.5) */
        <div className="space-y-10 animate-fade-in">
          {/* Bannière officielle */}
          <section className="bg-gradient-to-b from-blue-50/60 to-surface-base border-b border-surface-border py-12 text-center space-y-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-brand-blue/30 text-xs font-bold text-brand-blue shadow-sm">
                <Award className="w-4 h-4 text-brand-red" />
                <span>Commission Électorale Indépendante</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-title tracking-tight">
                {resultsData.banner || 'Résultats définitifs et certifiés'}
              </h1>

              <p className="text-sm sm:text-base text-content-body max-w-2xl mx-auto">
                <span className="font-semibold text-content-title">
                  {(resultsData.electionTitle || '').replace(/[—–]/g, ' - ').trim()}
                </span>
                <span className="block text-xs sm:text-sm text-content-muted mt-1">
                  Décompte officiel certifié et inaltérable.
                </span>
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Statistiques globales officielles de participation (CDC Section 10.3) */}
            <ResultsParticipationCards participation={resultsData?.participation} />

            {/* Résultats détaillés par poste électoral (CDC Section 10.4 & 10.5) */}
            <div className="space-y-8">
              {resultsData?.resultsByPosition?.map((pos) => (
                <div
                  key={pos.positionId}
                  className="bg-surface-pure rounded-2xl border border-surface-border p-6 sm:p-8 shadow-soft space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-2">
                    <div>
                      <h2 className="text-xl font-extrabold text-content-title flex items-center gap-2">
                        <Award className="w-6 h-6 text-brand-blue" />
                        <span>Poste : {pos.positionName}</span>
                      </h2>
                      {pos.positionDescription && (
                        <p className="text-xs text-content-muted mt-0.5">{pos.positionDescription}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-content-muted">
                        {pos.totalVotes} vote(s) exprimé(s)
                      </span>
                      {pos.isTie && (
                        <Badge variant="warning" size="sm" dot={false}>
                          Égalité parfaite
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Alerte si égalité parfaite (CDC Section 10.5) */}
                  {pos.isTie && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p>
                        <strong>Égalité détectée :</strong> Deux ou plusieurs candidats ont obtenu le même nombre de voix. La Commission Électorale applique la règle de départage prévue au règlement.
                      </p>
                    </div>
                  )}

                  {/* Liste classée des candidats pour ce poste */}
                  <div className="space-y-4">
                    {pos.candidates.map((cand, idx) => {
                      const isWinner = pos.hasWinner && String(pos.winnerCandidateId) === String(cand.candidateId);

                      return (
                        <div
                          key={cand.candidateId}
                          className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                            isWinner
                              ? 'bg-gradient-to-r from-amber-500/15 via-amber-50/60 to-surface-pure border-amber-400/90 ring-2 ring-amber-300/40 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                              : 'bg-surface-pure border-surface-border hover:border-slate-300 hover:shadow-soft hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3.5">
                              {/* Rang ou trophée doré animé */}
                              <div
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold font-mono text-xs flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                                  isWinner
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm ring-2 ring-amber-300/60'
                                    : 'bg-surface-subtle text-content-body border border-surface-border'
                                }`}
                              >
                                {isWinner ? <Trophy className="w-5 h-5 text-white animate-pulse" /> : `#${idx + 1}`}
                              </div>

                              {cand.photoUrl && (
                                <img
                                  src={cand.photoUrl}
                                  alt={cand.fullName}
                                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
                                    isWinner
                                      ? 'border-2 border-amber-400 ring-2 ring-amber-300/60 shadow-md shadow-amber-500/20'
                                      : 'border border-surface-border shadow-xs'
                                  }`}
                                />
                              )}

                              <div>
                                <h3 className="text-base sm:text-lg font-extrabold text-content-title flex items-center gap-2">
                                  <span>{cand.fullName}</span>
                                  {isWinner && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/60 shadow-xs">
                                      ★ Élu Officiellement
                                    </span>
                                  )}
                                </h3>
                                <p className="text-xs text-content-muted mt-0.5 font-medium">
                                  Candidat officiel · Scrutin certifié
                                </p>
                              </div>
                            </div>

                            {/* Voix et pourcentage avec badge prestigieux */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-border/60">
                              <span className="text-lg sm:text-2xl font-black text-content-title font-mono tracking-tight">
                                {cand.votes} <span className="text-xs font-semibold text-content-muted">voix</span>
                              </span>
                              <span
                                className={`text-xs sm:text-sm font-extrabold font-mono px-2 py-0.5 rounded-md ${
                                  isWinner
                                    ? 'text-amber-800 bg-amber-100/90 border border-amber-300'
                                    : 'text-brand-red bg-red-50 border border-red-200/60'
                                }`}
                              >
                                {cand.percentage} %
                              </span>
                            </div>
                          </div>

                          {/* Barre de progression des suffrages avec micro-animation */}
                          <div className="w-full bg-slate-100/90 rounded-full h-3.5 overflow-hidden p-0.5 border border-surface-border/40">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                isWinner
                                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 shadow-sm'
                                  : 'bg-gradient-to-r from-brand-red to-rose-500'
                              }`}
                              style={{ width: `${Math.max(2, cand.percentage)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton de retour */}
            <div className="pt-4 text-center">
              <Button
                variant="outline"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => onNavigate('home')}
              >
                Retourner à l’espace de scrutin
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
