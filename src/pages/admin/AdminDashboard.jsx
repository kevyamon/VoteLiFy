import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useSocketEvent } from '../../services/socket.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { AdminStatsSkeleton } from '../../components/common/Skeleton.jsx';
import { AdminVotersTab } from '../../components/admin/AdminVotersTab.jsx';
import { AdminCandidatesTab } from '../../components/admin/AdminCandidatesTab.jsx';
import { AdminTallyTab } from '../../components/admin/AdminTallyTab.jsx';
import { AdminSettingsTab } from '../../components/admin/AdminSettingsTab.jsx';
import { AdminElectionsTab } from '../../components/admin/AdminElectionsTab.jsx';
import {
  LayoutDashboard,
  Users,
  Award,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Clock,
  CheckCircle2,
  Vote,
} from 'lucide-react';


export const AdminDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [electionsList, setElectionsList] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');

  const { admin, logout } = useAuth();
  const toast = useToast();

  const loadElectionsList = async () => {
    try {
      const data = await api.getAllElectionsAdmin();
      setElectionsList(data || []);
      if (!selectedElectionId && data && data.length > 0) {
        const active = data.find((e) => e.isActive) || data[0];
        if (active?._id) setSelectedElectionId(active._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadElectionsList();
  }, []);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const params = selectedElectionId ? { electionId: selectedElectionId } : {};
      const data = await api.getDashboardStats(params);
      setStats(data);
    } catch (err) {
      toast.error('Erreur lors de la récupération des statistiques globales.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [activeTab, selectedElectionId]);

  // Synchronisation temps réel pour le tableau de bord
  useSocketEvent('VOTE_CAST', loadStats);
  useSocketEvent('CANDIDATE_CREATED', loadStats);
  useSocketEvent('CANDIDATE_UPDATED', loadStats);
  useSocketEvent('ELECTION_UPDATED', () => {
    loadStats();
    loadElectionsList();
  });
  useSocketEvent('ELECTION_CREATED', loadElectionsList);
  useSocketEvent('ELECTION_DELETED', loadElectionsList);
  useSocketEvent('ELECTION_RESET', loadStats);
  useSocketEvent('VOTERS_IMPORTED', loadStats);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion effectuée.');
      onNavigate('home');
    } catch {
      onNavigate('home');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
    { id: 'elections', label: 'Gestion des Élections', icon: Vote },
    { id: 'voters', label: 'Électeurs & PINs', icon: Users },
    { id: 'candidates', label: 'Candidatures', icon: Award },
    { id: 'tally', label: 'Dépouillement', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres du Scrutin', icon: Settings },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle">
      {/* Barre supérieure d'administration (CDC Section 5.1) */}
      <header className="sticky top-0 z-40 bg-surface-pure border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <div className="border-l border-surface-border pl-3">
              <span className="text-sm font-extrabold text-content-title tracking-tight block">
                VoteLi<span className="text-brand-red">Fy</span> Admin
              </span>
              <span className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider block -mt-0.5">
                Commission Électorale
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-subtle rounded-xl border border-surface-border text-xs">
              <Shield className="w-3.5 h-3.5 text-brand-red" />
              <span className="font-bold text-content-title">{admin?.username || 'Administrateur'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('home')}
            >
              <span className="hidden sm:inline">Voir le site</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon={<LogOut className="w-3.5 h-3.5 text-brand-red" />}
              onClick={handleLogout}
            >
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal et onglets */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Navigation par onglets */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-surface-pure rounded-2xl border border-surface-border shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'text-content-body hover:bg-surface-subtle hover:text-content-title'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filtre par scrutin actif */}
        {activeTab !== 'elections' && electionsList.length > 0 && (
          <div className="bg-surface-pure rounded-2xl border border-surface-border p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-brand-red flex-shrink-0" />
              <span className="text-xs font-bold text-content-title">Filtrer par scrutin :</span>
            </div>
            <select
              value={selectedElectionId}
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="p-2 bg-surface-base border border-surface-border rounded-xl text-xs font-semibold text-content-title focus:border-brand-red focus:outline-none min-w-[240px]"
            >
              <option value="">Tous les scrutins confondus</option>
              {electionsList.map((el) => (
                <option key={el._id} value={el._id}>
                  {el.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 1. Onglet Vue d'ensemble (CDC Section 5.3) */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {isLoadingStats && !stats ? (
              <AdminStatsSkeleton />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
                <span className="text-xs font-bold text-content-muted block mb-1">Électeurs Inscrits</span>
                <span className="text-3xl font-extrabold text-content-title font-mono">
                  {stats?.participation?.totalVoters ?? '—'}
                </span>
                <span className="text-[11px] text-content-muted block mt-1">Autorisés à voter</span>
              </div>

              <div className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
                <span className="text-xs font-bold text-emerald-700 block mb-1">Participation</span>
                <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                  {stats?.participation ? `${stats.participation.participationRate} %` : '—'}
                </span>
                <span className="text-[11px] text-content-muted block mt-1">
                  {stats?.participation?.votedCount ?? 0} suffrages enregistrés
                </span>
              </div>

              <div className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
                <span className="text-xs font-bold text-content-muted block mb-1">Candidatures</span>
                <span className="text-3xl font-extrabold text-brand-blue font-mono">
                  {stats?.candidates?.total ?? '—'}
                </span>
                <span className="text-[11px] text-content-muted block mt-1">
                  {stats?.candidates?.approved ?? 0} validées · {stats?.candidates?.pending ?? 0} en attente
                </span>
              </div>

              <div className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft">
                <span className="text-xs font-bold text-content-muted block mb-1">Statut du Scrutin</span>
                <div className="pt-1">
                  {stats?.periods?.votingOpen ? (
                    <Badge variant="success" dot={true} size="md">Vote Ouvert</Badge>
                  ) : (
                    <Badge variant="danger" size="md">Vote Fermé</Badge>
                  )}
                </div>
                <span className="text-[11px] text-content-muted block mt-2">
                  {stats?.periods?.resultsPublished ? 'Résultats proclamés' : 'Résultats masqués'}
                </span>
              </div>
            </div>
          )}

            {/* Actions rapides */}
            <div className="p-6 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-3">
              <h4 className="text-sm font-bold text-content-title">Accès rapides aux opérations</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('voters')}>
                  Importer des électeurs WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('candidates')}>
                  Modérer les candidatures
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('tally')}>
                  Consulter le dépouillement
                </Button>
                <Button variant="primary" size="sm" onClick={() => setActiveTab('settings')}>
                  Gérer les ouvertures/fermetures
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Onglet Gestion des Élections */}
        {activeTab === 'elections' && <AdminElectionsTab />}

        {/* 3. Onglet Électeurs & PINs */}
        {activeTab === 'voters' && <AdminVotersTab electionId={selectedElectionId} />}

        {/* 4. Onglet Candidatures */}
        {activeTab === 'candidates' && <AdminCandidatesTab electionId={selectedElectionId} />}

        {/* 5. Onglet Dépouillement */}
        {activeTab === 'tally' && <AdminTallyTab electionId={selectedElectionId} />}

        {/* 6. Onglet Paramètres du Scrutin */}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </main>
    </div>
  );
};

