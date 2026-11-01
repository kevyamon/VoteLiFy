import React from 'react';
import { ShieldCheck, KeyRound, Award, CheckCircle2 } from 'lucide-react';

/**
 * Section d'information sémantique officielle et d'optimisation SEO pour VoteLiFy.
 * Fournit à Googlebot et aux visiteurs le contexte complet sur la sécurité du scrutin.
 */
export const HomeSeoSection = () => {
  return (
    <section
      aria-label="Présentation officielle de la plateforme VoteLiFy"
      className="mt-16 border-t border-surface-border bg-gradient-to-b from-surface-pure to-surface-subtle py-12 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête de section SEO */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-brand-red text-xs font-bold border border-red-200/60 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Garanties Officielles de Sécurité Électorale</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-title tracking-tight">
            VoteLiFy — Le Standard de Confiance pour Vos Élections
          </h2>

          <p className="text-sm sm:text-base text-content-body leading-relaxed">
            VoteLiFy est une plateforme technologique indépendante garantissant des scrutins communautaires et associatifs impartiaux, anonymes et infalsifiables.
          </p>
        </div>

        {/* 3 Piliers de Confiance VoteLiFy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="p-6 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-3 hover:border-brand-red/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-content-title">
              1. Code PIN Individuel Secret
            </h3>
            <p className="text-xs text-content-body leading-relaxed">
              Chaque électeur officiellement inscrit reçoit un code PIN à usage unique délivré par voie sécurisée. Ce code garantit le principe démocratique fondamental : un électeur, une voix.
            </p>
          </article>

          <article className="p-6 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-3 hover:border-brand-blue/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-content-title">
              2. Secret Absolu du Suffrage
            </h3>
            <p className="text-xs text-content-body leading-relaxed">
              Grâce à une séparation architecturale stricte, le registre d’émargement atteste uniquement que vous avez participé, tandis que votre vote est déposé de manière irréversiblement anonyme dans l’urne scellée.
            </p>
          </article>

          <article className="p-6 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-3 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-content-title">
              3. Dépouillement Certifié
            </h3>
            <p className="text-xs text-content-body leading-relaxed">
              Les suffrages sont consolidés sous contrôle de la Commission Électorale. À l’issue du scrutin, les résultats sont proclamés avec statistiques de participation complètes et auditables.
            </p>
          </article>
        </div>

        {/* Foire Aux Questions Sémantique (Google FAQ) */}
        <div className="bg-surface-pure rounded-2xl border border-surface-border p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-content-title text-center sm:text-left">
            Questions Fréquentes sur VoteLiFy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-content-body">
            <div className="space-y-1.5">
              <h4 className="font-bold text-content-title flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Mon vote est-il réellement anonyme sur VoteLiFy ?</span>
              </h4>
              <p className="leading-relaxed pl-5.5 text-content-muted">
                Oui. Le système dissocie techniquement le code PIN utilisé pour émarger du bulletin enregistré dans l’urne. Personne, pas même les administrateurs, ne peut relier votre identité à votre choix de vote.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-content-title flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Que faire si je n'ai pas reçu mon code PIN ?</span>
              </h4>
              <p className="leading-relaxed pl-5.5 text-content-muted">
                Rapprochez-vous de la Commission Électorale de votre communauté. Seuls les électeurs validés sur la liste électorale officielle sont autorisés à recevoir leur sésame de vote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
