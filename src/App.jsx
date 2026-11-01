import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { ElectionsPage } from './pages/ElectionsPage.jsx';
import { Home } from './pages/Home.jsx';
import { ApplyCandidate } from './pages/ApplyCandidate.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.jsx';
import { api } from './services/api.js';
import { useSocketEvent } from './services/socket.js';

function MainApp() {
  const { isAuthenticated } = useAuth();

  // Résolution robuste de la vue active depuis le hash URL ou chemin
  const getPageFromHash = () => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].split('/')[0];
    const path = window.location.pathname.replace(/^\//, '').split('?')[0].split('/')[0];
    const candidate = hash || path;
    const validPages = ['home', 'elections', 'election', 'apply', 'results', 'admin'];
    return validPages.includes(candidate) ? candidate : 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);

  // Persistance de l'élection sélectionnée dans localStorage pour survivre aux actualisations F5
  const [selectedElection, setSelectedElection] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('votelify_selected_election');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleSelectElection = (election) => {
    setSelectedElection(election);
    if (typeof window !== 'undefined') {
      try {
        if (election) {
          localStorage.setItem('votelify_selected_election', JSON.stringify(election));
        } else {
          localStorage.removeItem('votelify_selected_election');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [electionInfo, setElectionInfo] = useState(null);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);

  // Fonction universelle de réinitialisation absolue du scroll en haut
  const scrollToTopMobileStyle = () => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // Initialisation propre de l'état dans l'historique du navigateur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      const initial = getPageFromHash();
      if (!window.history.state || window.history.state.page !== initial) {
        window.history.replaceState({ page: initial }, '', `#${initial}`);
      }
    }
  }, []);

  // Navigation synchronisée avec l'historique du téléphone (bouton Retour physique/geste)
  const navigateTo = (page, replace = false) => {
    if (typeof window !== 'undefined') {
      const targetHash = `#${page}`;
      if (replace) {
        window.history.replaceState({ page }, '', targetHash);
      } else {
        window.history.pushState({ page }, '', targetHash);
      }
    }
    setCurrentPage(page);
    scrollToTopMobileStyle();
  };

  // Écoute du geste / bouton Retour du téléphone mobile et changements de hash
  useEffect(() => {
    const handleUrlChange = (e) => {
      const targetPage = e?.state?.page || getPageFromHash();
      setCurrentPage(targetPage);
      scrollToTopMobileStyle();
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const fetchElectionInfo = async () => {
    try {
      const data = await api.getElectionInfo();
      setElectionInfo(data);
    } catch (err) {
      console.error("Erreur lors de l'actualisation des paramètres du scrutin :", err);
    }
  };

  useEffect(() => {
    fetchElectionInfo();
  }, [currentPage]);

  // Synchronisation temps réel WebSocket pour les paramètres globaux et le scrutin
  useSocketEvent('ELECTION_UPDATED', (updatedElection) => {
    fetchElectionInfo();
    if (updatedElection?._id && selectedElection?._id === updatedElection._id) {
      setSelectedElection(updatedElection);
      try {
        localStorage.setItem('votelify_selected_election', JSON.stringify(updatedElection));
      } catch (err) {
        console.error(err);
      }
    }
  });
  useSocketEvent('ELECTION_RESET', fetchElectionInfo);

  // Réinitialisation instantanée et absolue du scroll en haut à chaque changement de page
  useEffect(() => {
    scrollToTopMobileStyle();
    requestAnimationFrame(scrollToTopMobileStyle);
    const timer = setTimeout(scrollToTopMobileStyle, 50);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Si la vue demandée est l'administration
  if (currentPage === 'admin') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex flex-col bg-surface-base">
          <Header
            electionInfo={electionInfo}
            onNavigate={navigateTo}
            currentPage="home"
            onOpenAdminLogin={() => setAdminAuthModalOpen(true)}
          />
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-content-title">Accès réservé</h2>
            <p className="text-sm text-content-body max-w-sm">
              Vous devez être authentifié par la Commission Électorale pour accéder au centre de contrôle.
            </p>
            <button
              onClick={() => setAdminAuthModalOpen(true)}
              className="px-4 py-2 bg-brand-red text-white rounded-xl text-xs font-bold"
            >
              Se connecter
            </button>
          </div>
          <Footer onOpenAdminAuth={() => setAdminAuthModalOpen(true)} />
          <AdminLoginModal
            isOpen={adminAuthModalOpen}
            onClose={() => setAdminAuthModalOpen(false)}
            onSuccess={() => {
              setAdminAuthModalOpen(false);
              navigateTo('admin');
            }}
          />
        </div>
      );
    }

    return <AdminDashboard onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      {/* En-tête officiel */}
      <Header
        electionInfo={electionInfo}
        onNavigate={navigateTo}
        currentPage={currentPage}
        onOpenAdminLogin={() => setAdminAuthModalOpen(true)}
      />

      {/* Vues applicatives */}
      {currentPage === 'home' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'elections' && (
        <ElectionsPage
          onNavigate={navigateTo}
          onSelectElection={handleSelectElection}
        />
      )}
      {currentPage === 'election' && (
        <Home
          onNavigate={navigateTo}
          currentElection={selectedElection}
        />
      )}
      {currentPage === 'apply' && (
        <ApplyCandidate
          onNavigate={navigateTo}
          currentElection={selectedElection}
        />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          onNavigate={navigateTo}
          currentElection={selectedElection}
        />
      )}


      {/* Pied de page officiel avec déclencheur 10 secondes */}
      <Footer onOpenAdminAuth={() => setAdminAuthModalOpen(true)} />

      {/* Modale d'authentification discrète Commission Électorale */}
      <AdminLoginModal
        isOpen={adminAuthModalOpen}
        onClose={() => setAdminAuthModalOpen(false)}
        onSuccess={() => {
          setAdminAuthModalOpen(false);
          navigateTo('admin');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
