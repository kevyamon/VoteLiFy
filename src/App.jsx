import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Home } from './pages/Home.jsx';
import { ApplyCandidate } from './pages/ApplyCandidate.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.jsx';
import { api } from './services/api.js';

function MainApp() {
  const { isAuthenticated } = useAuth();

  // Résolution de la vue active depuis le hash URL
  const getPageFromHash = () => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace(/^#/, '');
    return ['home', 'apply', 'results', 'admin'].includes(hash) ? hash : 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [electionInfo, setElectionInfo] = useState(null);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);

  // Initialisation propre de l'état dans l'historique du navigateur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initial = getPageFromHash();
      if (!window.history.state || window.history.state.page !== initial) {
        window.history.replaceState({ page: initial }, '', `#${initial}`);
      }
    }
  }, []);

  // Navigation synchronisée avec l'historique du téléphone (bouton Retour physique/geste)
  const navigateTo = (page, replace = false) => {
    if (page === currentPage) return;
    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({ page }, '', `#${page}`);
      } else {
        window.history.pushState({ page }, '', `#${page}`);
      }
    }
    setCurrentPage(page);
  };

  // Écoute du geste / bouton Retour du téléphone mobile
  useEffect(() => {
    const handlePopState = (e) => {
      const targetPage = e.state?.page || getPageFromHash();
      setCurrentPage(targetPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

  // Réinitialisation instantanée et absolue du scroll en haut comme une application mobile native
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      // Garantir le repositionnement en haut même après le layout et rendu React
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      });

      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }, 50);

      return () => clearTimeout(timer);
    }
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
      {currentPage === 'home' && <Home onNavigate={navigateTo} />}
      {currentPage === 'apply' && <ApplyCandidate onNavigate={navigateTo} />}
      {currentPage === 'results' && <ResultsPage onNavigate={navigateTo} />}

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
