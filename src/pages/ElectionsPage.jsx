import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useSocketEvent } from '../services/socket.js';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import {
  Vote,
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  Award,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';

/**
 * Page listant l'ensemble des élections disponibles sur la plateforme VoteLiFy.
 * Affiche de superbes cards centrées avec l'illustration des deux premières lettres.
 */
export const ElectionsPage = ({ onNavigate, onSelectElection }) => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchElections = async () => {
    setIsLoading(true);
    try {
      const data = await api.getElections();
      setElections(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des élections :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    fetchElections();
  }, []);

  // Écoute temps réel des créations et mises à jour de scrutins
  useSocketEvent('ELECTION_CREATED', fetchElections);
  useSocketEvent('ELECTION_UPDATED', fetchElections);
  useSocketEvent('ELECTION_RESET', fetchElections);

  const handleCardClick = (election) => {
    if (onSelectElection) {
      onSelectElection(election);
    }
    onNavigate('election');
  };

  return (
    <main className="flex-1 pb-16 bg-surface-subtle">
      {/* 1. En-tête compact et épuré de la page des élections */}
      <section className="bg-gradient-to-b from-surface-pure to-surface-subtle border-b border-surface-border py-4 sm:py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted hover:text-brand-red transition-colors mb-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Retour à l'accueil</span>
              </button>

              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-content-title tracking-tight">
                  Élections & Scrutins
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-red-light text-brand-red border border-brand-red/20">
                  {elections.length} disponible{elections.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-content-muted">
                Choisissez votre élection pour découvrir les candidats et déposer votre suffrage.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={fetchElections}
                disabled={isLoading}
              >
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Liste des cartes d'élections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-red mx-auto" />
            <p className="text-xs text-content-muted">Chargement des scrutins officiels...</p>
          </div>
        ) : elections.length === 0 ? (
          /* État vide si aucune élection */
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-surface-pure rounded-2xl border border-surface-border p-8 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto">
              <Vote className="w-8 h-8 stroke-1" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-content-title">Aucun scrutin disponible</h3>
              <p className="text-xs text-content-muted leading-relaxed">
                Aucune élection n'a encore été programmée par la Commission Électorale.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => onNavigate('home')}>
              Retour à l'accueil
            </Button>
          </div>
        ) : (
          /* Grille de très belles cartes d'élections centrées */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {elections.map((election) => {
              const isVotingOpen = election.voting?.isOpen;
              const isCandidacyOpen = election.candidacies?.isOpen;
              const isResultsPublished = election.results?.isPublished;
              const hasDates = election.voting?.startAt || election.voting?.endAt;

              return (
                <article
                  key={election._id}
                  onClick={() => handleCardClick(election)}
                  className="group relative bg-surface-pure rounded-3xl border border-surface-border overflow-hidden shadow-soft hover:shadow-xl hover:border-brand-red/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* 1. Visuel d'en-tête immersif couvrant toute la largeur supérieure */}
                  <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-900">
                    {election.imageUrl ? (
                      <img
                        src={election.imageUrl}
                        alt={election.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-red via-red-600 to-brand-blue flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                        <span className="relative text-4xl sm:text-5xl font-black text-white/90 tracking-widest drop-shadow-md select-none">
                          {election.initials || 'EL'}
                        </span>
                      </div>
                    )}

                    {/* Dégradé doux de protection visuelle */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

                    {/* Badge de statut flottant */}
                    <div className="absolute top-3.5 right-3.5 z-10 backdrop-blur-md bg-white/95 rounded-full shadow-sm">
                      {isVotingOpen ? (
                        <Badge variant="success" dot={true} size="sm">
                          Vote en cours
                        </Badge>
                      ) : isCandidacyOpen ? (
                        <Badge variant="info" dot={true} size="sm">
                          Candidatures ouvertes
                        </Badge>
                      ) : isResultsPublished ? (
                        <Badge variant="info" dot={false} size="sm">
                          Résultats proclamés
                        </Badge>
                      ) : hasDates && new Date() > new Date(election.voting?.endAt) ? (
                        <Badge variant="neutral" dot={false} size="sm">
                          Scrutin clos
                        </Badge>
                      ) : (
                        <Badge variant="neutral" dot={false} size="sm">
                          En préparation
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 2. Contenu descriptif et actions */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-content-title tracking-tight group-hover:text-brand-red transition-colors leading-snug">
                        {election.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-content-body line-clamp-2 leading-relaxed">
                        {election.description ||
                          'Scrutin officiel de la communauté pour le renouvellement des représentants.'}
                      </p>
                    </div>

                    {/* Jalons temporels (affichés uniquement si configurés) */}
                    {hasDates && (
                      <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border text-xs text-content-muted space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                          <span>
                            Fin des votes :{' '}
                            <strong className="text-content-title font-semibold">
                              {new Date(election.voting.endAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </strong>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bouton d'accès centré */}
                    <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-red group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>Accéder au scrutin</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(election);
                        }}
                      >
                        Participer
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};
