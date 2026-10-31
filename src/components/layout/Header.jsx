import React, { useState } from 'react';
import { Button } from '../common/Button.jsx';
import { Menu, X, Award, UserPlus } from 'lucide-react';

export const Header = ({
  electionInfo,
  onNavigate,
  currentPage,
  onOpenAdminLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isVotingOpen = electionInfo?.voting?.isOpen;
  const isCandidacyOpen = electionInfo?.candidacies?.isOpen;

  const handleNav = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-pure/95 backdrop-blur-md border-b border-surface-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo et Nom de Plateforme */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Accueil VoteLiFy"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-border shadow-sm flex items-center justify-center bg-white flex-shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Logo VoteLiFy"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="text-left flex flex-col justify-center">
              <span className="block text-xl font-extrabold tracking-tight text-content-title leading-tight">
                VoteLi<span className="text-brand-red">Fy</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-content-muted uppercase mt-1">
                Plateforme Électorale
              </span>
            </div>
          </button>

          {/* Statut du scrutin en direct (Visible en permanence sur Desktop & Mobile) */}
          <div className="flex items-center">
            {isVotingOpen ? (
              <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-200/80">
                <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-600"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase">
                  Scrutin ouvert
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-rose-50 text-rose-800 shadow-sm border border-rose-200/80">
                <span className="h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase">
                  Scrutin fermé
                </span>
              </div>
            )}
          </div>

          {/* Navigation Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant={currentPage === 'apply' ? 'primary' : 'outline'}
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => handleNav('apply')}
              disabled={!isCandidacyOpen}
            >
              Postuler
            </Button>

            <Button
              variant={currentPage === 'results' ? 'secondary' : 'outline'}
              size="sm"
              icon={<Award className="w-4 h-4" />}
              onClick={() => handleNav('results')}
            >
              Résultats
            </Button>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-content-body hover:bg-surface-subtle rounded-xl"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Déroulant */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface-pure px-4 py-4 space-y-3 animate-fade-in shadow-soft">
          <div className="pb-2 flex justify-between items-center border-b border-surface-border/50">
            <span className="text-xs font-semibold text-content-muted">Statut du scrutin</span>
            {isVotingOpen ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>Scrutin ouvert</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200/80">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Scrutin fermé</span>
              </div>
            )}
          </div>

          <Button
            variant={currentPage === 'apply' ? 'primary' : 'outline'}
            fullWidth={true}
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => handleNav('apply')}
            disabled={!isCandidacyOpen}
          >
            Déposer une candidature
          </Button>

          <Button
            variant={currentPage === 'results' ? 'secondary' : 'outline'}
            fullWidth={true}
            icon={<Award className="w-4 h-4" />}
            onClick={() => handleNav('results')}
          >
            Consulter les résultats
          </Button>
        </div>
      )}
    </header>
  );
};
