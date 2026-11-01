import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/common/Button.jsx';
import {
  ShieldCheck,
  KeyRound,
  Award,
  CheckCircle2,
  Vote,
  ArrowRight,
  Sparkles,
  Users,
  Lock,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

/**
 * Landing Page officielle de VoteLiFy.
 * Présente la vision du produit, ses garanties démocratiques et guide les utilisateurs vers les élections.
 */
export const LandingPage = ({ onNavigate }) => {
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStatsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
    const el = document.getElementById('decouvrir-fonctionnalites');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="flex-1 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-subtle via-surface-pure to-surface-base border-b border-surface-border py-16 sm:py-24">
        {/* Cercles d'ambiance design discrets */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Titre d'accroche institutionnel avec animation à l'ouverture et au rechargement */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-content-title tracking-tight leading-tight max-w-4xl mx-auto animate-hero-title">
            La démocratie communautaire{' '}
            <span className="block text-brand-red mt-1 sm:mt-2">
              simple, secrète et infalsifiable
            </span>
          </h1>

          {/* Description claire et rassurante */}
          <p className="text-base sm:text-lg md:text-xl text-content-body max-w-3xl mx-auto leading-relaxed font-normal">
            VoteLiFy centralise et sécurise l’intégralité de vos processus électoraux.
            Fini les votes dispersés et contestés dans les conversations : chaque électeur dispose
            d’un code PIN individuel secret, et chaque suffrage est certifié en toute impartialité.
          </p>

          {/* Boutons d'action principaux au design haut de gamme */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('elections')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-brand-red to-rose-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-brand-red/30 hover:shadow-xl hover:shadow-brand-red/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-red/50 cursor-pointer"
            >
              <Vote className="w-5 h-5 flex-shrink-0" />
              <span>Voir les élections disponibles</span>
              <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </button>

            <Button
              variant="outline"
              size="lg"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto rounded-2xl font-bold border-2 hover:bg-surface-subtle"
            >
              Comment ça fonctionne ?
            </Button>
          </div>

          {/* Déclencheur / Flèche rouge animée pour inviter au défilement */}
          <div className="pt-6 pb-2 flex flex-col items-center justify-center">
            <button
              onClick={scrollToFeatures}
              className="group flex flex-col items-center gap-2 text-content-muted hover:text-brand-red transition-all cursor-pointer focus:outline-none"
              aria-label="Faire défiler pour mieux connaître VoteLiFy"
            >
              <span className="text-xs font-bold tracking-wide uppercase transition-colors group-hover:text-brand-red">
                Mieux connaître VoteLiFy
              </span>
              <div className="w-9 h-9 rounded-full bg-red-50 text-brand-red flex items-center justify-center border border-red-200 shadow-sm animate-bounce group-hover:scale-110 transition-transform">
                <ChevronDown className="w-5 h-5 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* Indicateurs clés de confiance avec animation de soulèvement au défilement */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-surface-border text-center"
          >
            <div
              className={`p-4 bg-surface-pure rounded-2xl border transition-all duration-500 ease-out hover:-translate-y-3.5 hover:shadow-xl hover:border-brand-red/50 ${
                statsInView
                  ? '-translate-y-2.5 shadow-xl border-brand-red/30'
                  : 'translate-y-0 shadow-soft border-surface-border'
              }`}
            >
              <span className="block text-2xl sm:text-3xl font-black text-content-title font-sans tracking-tight">
                100 %
              </span>
              <span className="text-xs text-content-muted font-bold mt-1.5 block">
                Suffrage Anonyme
              </span>
            </div>
            <div
              className={`p-4 bg-surface-pure rounded-2xl border transition-all duration-500 ease-out delay-100 hover:-translate-y-3.5 hover:shadow-xl hover:border-brand-blue/50 ${
                statsInView
                  ? '-translate-y-2.5 shadow-xl border-brand-blue/30'
                  : 'translate-y-0 shadow-soft border-surface-border'
              }`}
            >
              <span className="block text-2xl sm:text-3xl font-black text-brand-blue font-sans tracking-tight">
                1 PIN = 1 Voix
              </span>
              <span className="text-xs text-content-muted font-bold mt-1.5 block">
                Sécurité Unique
              </span>
            </div>
            <div
              className={`p-4 bg-surface-pure rounded-2xl border transition-all duration-500 ease-out delay-200 hover:-translate-y-3.5 hover:shadow-xl hover:border-emerald-500/50 ${
                statsInView
                  ? '-translate-y-2.5 shadow-xl border-emerald-500/30'
                  : 'translate-y-0 shadow-soft border-surface-border'
              }`}
            >
              <span className="block text-2xl sm:text-3xl font-black text-emerald-600 font-sans tracking-tight">
                Temps Réel
              </span>
              <span className="text-xs text-content-muted font-bold mt-1.5 block">
                Dépouillement Certifié
              </span>
            </div>
            <div
              className={`p-4 bg-surface-pure rounded-2xl border transition-all duration-500 ease-out delay-300 hover:-translate-y-3.5 hover:shadow-xl hover:border-brand-red/50 ${
                statsInView
                  ? '-translate-y-2.5 shadow-xl border-brand-red/30'
                  : 'translate-y-0 shadow-soft border-surface-border'
              }`}
            >
              <span className="block text-2xl sm:text-3xl font-black text-brand-red font-sans tracking-tight">
                0 Tricherie
              </span>
              <span className="text-xs text-content-muted font-bold mt-1.5 block">
                Intégrité Totale
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION POURQUOI VOTELIFY */}
      <section
        id="decouvrir-fonctionnalites"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block">
            Une Rupture Technologique
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-content-title tracking-tight">
            Pourquoi choisir VoteLiFy pour vos scrutins ?
          </h2>
          <p className="text-sm sm:text-base text-content-body leading-relaxed">
            Les sondages informels sur les réseaux sociaux engendrent contestations, doublons et perte de crédibilité.
            VoteLiFy instaure un cadre officiel digne des plus hautes exigences démocratiques.
          </p>
        </div>

        {/* Comparatif synthétique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mauvaise pratique traditionnelle */}
          <div className="p-6 sm:p-8 bg-surface-pure rounded-2xl border border-red-200/60 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-status-danger font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <span className="text-sm font-black">✕</span>
              </div>
              <h3>Les votes informels classiques</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-content-body">
              <li className="flex items-start gap-2">
                <span className="text-status-danger font-bold">•</span>
                <span>Messages perdus au milieu des discussions WhatsApp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-status-danger font-bold">•</span>
                <span>Pressions sociales, manque total d'anonymat et de discrétion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-status-danger font-bold">•</span>
                <span>Comptabilisation manuelle fastidieuse sujette aux erreurs et contestations.</span>
              </li>
            </ul>
          </div>

          {/* Standard VoteLiFy */}
          <div className="p-6 sm:p-8 bg-surface-pure rounded-2xl border border-emerald-200/80 shadow-soft space-y-4">
            <div className="flex items-center gap-3 text-emerald-700 font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3>La rigueur certifiée VoteLiFy</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-content-body">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Interface web dédiée et fluide sur mobile, tablette et ordinateur.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Secret absolu du vote grâce au découplage de l’urne numérique.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Calcul automatisé instantané avec statistiques d'émargement transparentes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. LES 3 PILIERS DE CONFIANCE */}
      <section className="bg-gradient-to-b from-surface-pure to-surface-subtle border-y border-surface-border py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
              Garanties Démocratiques
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-content-title tracking-tight">
              Trois piliers fondamentaux de sécurité
            </h2>
            <p className="text-sm sm:text-base text-content-body leading-relaxed">
              Une architecture pensée pour inspirer confiance aux candidats comme aux électeurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="p-6 sm:p-8 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-4 hover:border-brand-red/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-red-light text-brand-red flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-content-title">
                1. Code PIN Individuel Secret
              </h3>
              <p className="text-xs sm:text-sm text-content-body leading-relaxed">
                Chaque électeur autorisé reçoit un code PIN à usage unique transmis de manière confidentielle.
                Ce sésame garantit le principe démocratique immuable : un électeur, une voix.
              </p>
            </article>

            <article className="p-6 sm:p-8 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-4 hover:border-brand-blue/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-content-title">
                2. Secret Absolu du Suffrage
              </h3>
              <p className="text-xs sm:text-sm text-content-body leading-relaxed">
                Le registre d’émargement atteste uniquement de votre participation.
                Le bulletin déposé dans l’urne numérique est irréversiblement anonymisé :
                nul ne peut savoir pour qui vous avez voté.
              </p>
            </article>

            <article className="p-6 sm:p-8 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-4 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-content-title">
                3. Proclamation Certifiée
              </h3>
              <p className="text-xs sm:text-sm text-content-body leading-relaxed">
                Dès la clôture officielle du scrutin, les résultats sont proclamés avec des taux de participation
                audités et une répartition claire des suffrages exprimés pour chaque poste.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. COMMENT ÇA FONCTIONNE (4 ÉTAPES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-content-muted uppercase tracking-wider block">
            Parcours Utilisateur
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-content-title tracking-tight">
            Participer en 4 étapes simples
          </h2>
          <p className="text-sm sm:text-base text-content-body leading-relaxed">
            Aucun compte complexe à créer : votre participation se fait en quelques secondes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-surface-pure rounded-2xl border border-surface-border space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-black">
              1
            </span>
            <h4 className="text-base font-bold text-content-title">Choisissez le scrutin</h4>
            <p className="text-xs text-content-muted leading-relaxed">
              Consultez la liste des élections actives sur la plateforme et sélectionnez celle de votre groupe.
            </p>
          </div>

          <div className="p-6 bg-surface-pure rounded-2xl border border-surface-border space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs font-black">
              2
            </span>
            <h4 className="text-base font-bold text-content-title">Découvrez les candidats</h4>
            <p className="text-xs text-content-muted leading-relaxed">
              Lisez les programmes, regardez les présentations vidéo et comparez les visions des prétendants.
            </p>
          </div>

          <div className="p-6 bg-surface-pure rounded-2xl border border-surface-border space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
              3
            </span>
            <h4 className="text-base font-bold text-content-title">Votez avec votre PIN</h4>
            <p className="text-xs text-content-muted leading-relaxed">
              Cliquez sur « Voter », saisissez votre code PIN individuel à 6 chiffres et confirmez votre choix.
            </p>
          </div>

          <div className="p-6 bg-surface-pure rounded-2xl border border-surface-border space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
              4
            </span>
            <h4 className="text-base font-bold text-content-title">Suivez les résultats</h4>
            <p className="text-xs text-content-muted leading-relaxed">
              Consultez la proclamation officielle dès la clôture du scrutin avec le classement certifié.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BANNIÈRE FINALE CALL-TO-ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl border border-slate-700">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Prêt à faire entendre votre voix ?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Accédez sans attendre aux scrutins ouverts, découvrez les candidats pour chaque poste électoral et déposez votre vote.
          </p>
          <div className="pt-3">
            <button
              onClick={() => onNavigate('elections')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-red via-red-600 to-rose-600 text-white font-extrabold text-base shadow-xl shadow-brand-red/35 hover:shadow-2xl hover:shadow-brand-red/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-red/50 cursor-pointer group"
            >
              <Vote className="w-5 h-5 flex-shrink-0" />
              <span>Accéder aux élections</span>
              <ChevronRight className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
