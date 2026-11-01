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
        <div className="md:hidden border-t border-surface-border bg-surface-pure px-4 py-4 space-y-2.5 animate-fade-in shadow-soft">
          {/* Ligne 1 : Bouton Résultats et Bouton Élections */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant={currentPage === 'results' ? 'secondary' : 'outline'}
              size="sm"
              fullWidth={true}
              icon={<Award className="w-4 h-4" />}
              onClick={() => handleNav('results')}
            >
              Résultats
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

          {/* Ligne 2 : Bouton Accueil qui remplit tout l'espace d'en bas */}
          <div>
            <Button
              variant={currentPage === 'home' ? 'primary' : 'outline'}
              size="sm"
              fullWidth={true}
              icon={<Home className="w-4 h-4" />}
              onClick={() => handleNav('home')}
            >
              Accueil
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

