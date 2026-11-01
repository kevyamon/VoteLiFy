import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useSocketEvent } from '../../services/socket.js';
import { Button } from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { BarChart3, RefreshCw, Users, CheckCircle2, Award } from 'lucide-react';

export const AdminTallyTab = () => {
  const [tallyData, setTallyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const loadTally = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTally();
      setTallyData(data);
    } catch (err) {
      toast.error('Impossible de récupérer le dépouillement en direct.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTally();
  }, []);

  // Surveillance en direct du dépouillement
  useSocketEvent('VOTE_CAST', loadTally);
  useSocketEvent('ELECTION_RESET', loadTally);

  const part = tallyData?.participation;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête avec bouton d'actualisation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h3 className="text-lg font-bold text-content-title flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-blue" />
            <span>Surveillance Confidentielle du Dépouillement</span>
          </h3>
          <p className="text-xs text-content-muted">
            Réservé à la Commission Électorale. Les suffrages sont scellés et anonymes.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={loadTally}
          disabled={isLoading}
        >
          Actualiser les chiffres
        </Button>
      </div>

      {/* Cartes de synthèse de participation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted block mb-1">
            Total Électeurs
          </span>
          <span className="text-2xl font-extrabold text-content-title font-mono">
            {part?.totalVoters ?? '—'}
          </span>
        </div>

        <div className="p-4 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Votes Exprimés
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono">
            {part?.votedCount ?? '—'}
          </span>
        </div>

        <div className="p-4 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted block mb-1">
            En Attente
          </span>
          <span className="text-2xl font-extrabold text-content-title font-mono">
            {part?.remainingCount ?? '—'}
          </span>
        </div>

        <div className="p-4 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red block mb-1">
            Taux de Participation
          </span>
          <span className="text-2xl font-extrabold text-brand-red font-mono">
            {part ? `${part.participationRate} %` : '—'}
          </span>
        </div>
      </div>

      {/* Dépouillement détaillé par poste */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-content-muted">Calcul du dépouillement en cours...</div>
      ) : !tallyData?.tallyByPosition || tallyData.tallyByPosition.length === 0 ? (
        <div className="py-12 text-center text-xs text-content-muted">Aucun vote enregistré pour le moment.</div>
      ) : (
        <div className="space-y-6">
          {tallyData.tallyByPosition.map((pos) => (
            <div
              key={pos.positionId}
              className="p-6 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-blue" />
                  <h4 className="text-base font-bold text-content-title">Poste : {pos.positionName}</h4>
                </div>
                <span className="text-xs font-semibold text-content-muted">
                  {pos.totalVotesInPosition} vote(s) exprimé(s)
                </span>
              </div>

              {/* Candidats de ce poste */}
              <div className="space-y-3">
                {pos.candidates.map((cand, idx) => (
                  <div key={cand.candidateId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center font-mono text-content-muted">#{idx + 1}</span>
                        <span className="text-content-title font-bold">{cand.fullName}</span>
                      </div>
                      <div className="font-mono space-x-2">
                        <span className="text-content-title font-bold">{cand.votes} voix</span>
                        <span className="text-brand-red font-bold">({cand.percentage} %)</span>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-brand-red h-full rounded-full transition-all duration-500"
                        style={{ width: `${cand.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
