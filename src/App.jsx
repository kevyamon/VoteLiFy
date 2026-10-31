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
  const [currentPage, setCurrentPage] = useState('home');
  const [electionInfo, setElectionInfo] = useState(null);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();

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

  // Réinitialisation instantanée du scroll en haut comme une application mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [currentPage]);

  // Si la vue demandée est l'administration
  if (currentPage === 'admin') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex flex-col bg-surface-base">
          <Header
            electionInfo={electionInfo}
            onNavigate={setCurrentPage}
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
              setCurrentPage('admin');
            }}
          />
        </div>
      );
    }

    return <AdminDashboard onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      {/* En-tête officiel */}
      <Header
        electionInfo={electionInfo}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        onOpenAdminLogin={() => setAdminAuthModalOpen(true)}
      />

      {/* Vues applicatives */}
      {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
      {currentPage === 'apply' && <ApplyCandidate onNavigate={setCurrentPage} />}
      {currentPage === 'results' && <ResultsPage onNavigate={setCurrentPage} />}

      {/* Pied de page officiel avec déclencheur 10 secondes */}
      <Footer onOpenAdminAuth={() => setAdminAuthModalOpen(true)} />

      {/* Modale d'authentification discrète Commission Électorale */}
      <AdminLoginModal
        isOpen={adminAuthModalOpen}
        onClose={() => setAdminAuthModalOpen(false)}
        onSuccess={() => {
          setAdminAuthModalOpen(false);
          setCurrentPage('admin');
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
