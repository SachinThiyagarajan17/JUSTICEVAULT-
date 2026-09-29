import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { storageService } from './services/storageService';
import { User, UserRole } from './types';

// Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginScreen } from './components/auth/LoginScreen';
import { SystemIntegrityModal } from './components/system/SystemIntegrityModal';
import { SystemArchitectureHub } from './components/system/SystemArchitectureHub';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { DefenceIntelligencePage } from './pages/DefenceIntelligencePage';
import { CasesPage } from './pages/CasesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { EvidenceChainPage } from './pages/EvidenceChainPage';
import { SecureUploadPage } from './pages/SecureUploadPage';
import { SearchPage } from './pages/SearchPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [navigationParams, setNavigationParams] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sidebar responsive collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Modals & Drawers
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);
  const [showArchitectureHub, setShowArchitectureHub] = useState(false);
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [selectedDocForAI, setSelectedDocForAI] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    const unsub = storageService.subscribe(handleAuthChange);
    return unsub;
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setNavigationParams(params || null);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
  };

  const handleOpenAI = (docId?: string) => {
    setSelectedDocForAI(docId);
    setShowAIDrawer(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans">
        <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Responsive Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        userRole={currentUser.role}
        onOpenArchitectureHub={() => setShowArchitectureHub(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenSearch={(q) => handleHeaderSearch(q || '')}
          onOpenSystemIntegrity={() => setShowIntegrityModal(true)}
          onOpenAIAssistant={() => handleOpenAI()}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          currentUser={currentUser}
        />

        {/* Dynamic Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1720px] w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onOpenSystemIntegrity={() => setShowIntegrityModal(true)}
              onOpenAIAssistant={handleOpenAI}
              currentUser={currentUser}
              onOpenArchitectureHub={() => setShowArchitectureHub(true)}
            />
          )}

          {currentPage === 'defence-intel' && (
            <DefenceIntelligencePage
              currentUser={currentUser}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'cases' && (
            <CasesPage
              onNavigate={handleNavigate}
              initialSelectedCaseId={navigationParams?.caseId}
              onOpenAIAssistant={handleOpenAI}
            />
          )}

          {currentPage === 'documents' && (
            <DocumentsPage
              onNavigate={handleNavigate}
              initialSelectedDocId={navigationParams?.docId}
              initialCaseId={navigationParams?.caseId}
              onOpenAIAssistant={handleOpenAI}
            />
          )}

          {currentPage === 'evidence-chain' && (
            <EvidenceChainPage
              onNavigate={handleNavigate}
              initialSelectedEvidenceId={navigationParams?.evidenceId}
              initialCaseId={navigationParams?.caseId}
            />
          )}

          {(currentPage === 'upload' || currentPage === 'secure-upload') && (
            <SecureUploadPage
              onNavigate={handleNavigate}
              initialCaseId={navigationParams?.caseId}
              initialCaseNumber={navigationParams?.caseNumber}
            />
          )}

          {currentPage === 'search' && (
            <SearchPage
              onNavigate={handleNavigate}
              initialQuery={searchQuery}
              onOpenAIAssistant={handleOpenAI}
            />
          )}

          {currentPage === 'approvals' && (
            <ApprovalsPage onNavigate={handleNavigate} />
          )}

          {(currentPage === 'audit' || currentPage === 'audit-trail') && (
            <AuditTrailPage />
          )}

          {currentPage === 'alerts' && (
            <AlertsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'reports' && (
            <ReportsPage />
          )}

          {currentPage === 'users' && (
            <UsersPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Global Modals & Sliding Drawers */}
      <SystemIntegrityModal
        isOpen={showIntegrityModal}
        onClose={() => setShowIntegrityModal(false)}
      />

      <SystemArchitectureHub
        isOpen={showArchitectureHub}
        onClose={() => setShowArchitectureHub(false)}
        onNavigate={handleNavigate}
      />

      <AIAssistantDrawer
        isOpen={showAIDrawer}
        onClose={() => setShowAIDrawer(false)}
        initialDocumentId={selectedDocForAI}
      />

      <ToastContainer />
    </div>
  );
}
