import React, { useState } from 'react';
import { Button } from '../common/Button.jsx';
import { Menu, X, Award, UserPlus, Vote, Home } from 'lucide-react';

export const Header = ({
  electionInfo,
  onNavigate,
  currentPage,
  onOpenAdminLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isVotingOpen = electionInfo?.voting?.isOpen;
  const isCandidacyOpen = electionInfo?.candidacies?.isOpen;
  const isResultsPublished = electionInfo?.results?.isPublished;
  const hasVotingDates = electionInfo?.voting?.endAt;
  const isScrutinClosed = hasVotingDates && new Date() > new Date(electionInfo.voting.endAt);

  const handleNav = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const renderStatusBadge = () => {
    if (isVotingOpen) {
      return (
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-semibold border border-emerald-200/80 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>Scrutin ouvert</span>
        </div>
      );
    }
    if (isCandidacyOpen) {
      return (
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[11px] sm:text-xs font-semibold border border-blue-200/80 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
          </span>
          <span>Candidatures</span>
        </div>
      );
    }
    if (isResultsPublished) {
      return (
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-semibold border border-indigo-200/80 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
          <span>Résultats</span>
        </div>
      );
    }
    if (isScrutinClosed) {
      return (
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-semibold border border-slate-200/80 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
          <span>Scrutin clos</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-semibold border border-slate-200/80 shadow-xs">
        <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
        <span>Plateforme prête</span>
      </div>
    );
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

          {/* Statut du scrutin en direct */}
          <div className="flex items-center">
            {renderStatusBadge()}
          </div>

          {/* Navigation Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <Button
              variant={currentPage === 'home' ? 'primary' : 'ghost'}
              size="sm"
              icon={<Home className="w-4 h-4" />}
              onClick={() => handleNav('home')}
            >
              Accueil
            </Button>

            <Button
              variant={currentPage === 'elections' ? 'primary' : 'outline'}
              size="sm"
              icon={<Vote className="w-4 h-4" />}
              onClick={() => handleNav('elections')}
            >
              Élections
            </Button>

            {isCandidacyOpen && (
              <Button
                variant={currentPage === 'apply' ? 'primary' : 'outline'}
                size="sm"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={() => handleNav('apply')}
              >
                Postuler
              </Button>
            )}

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
            <span className="text-xs font-semibold text-content-muted">Statut</span>
            {renderStatusBadge()}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant={currentPage === 'home' ? 'primary' : 'outline'}
              size="sm"
              fullWidth={true}
              icon={<Home className="w-4 h-4" />}
              onClick={() => handleNav('home')}
            >
              Accueil
            </Button>

            <Button
              variant={currentPage === 'elections' ? 'primary' : 'outline'}
              size="sm"
              fullWidth={true}
              icon={<Vote className="w-4 h-4" />}
              onClick={() => handleNav('elections')}
            >
              Élections
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={currentPage === 'apply' ? 'primary' : 'outline'}
              size="sm"
              fullWidth={true}
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => handleNav('apply')}
              disabled={!isCandidacyOpen}
            >
              Postuler
            </Button>

            <Button
              variant={currentPage === 'results' ? 'secondary' : 'outline'}
              size="sm"
              fullWidth={true}
              icon={<Award className="w-4 h-4" />}
              onClick={() => handleNav('results')}
            >
              Résultats
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

