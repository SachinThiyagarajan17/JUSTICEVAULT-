import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Link2,
  UploadCloud,
  Search,
  CheckSquare,
  History,
  ShieldAlert,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Radio,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  userRole?: UserRole;
  onOpenArchitectureHub?: () => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  userRole,
  onOpenArchitectureHub
}: SidebarProps) {
  const [approvalsCount, setApprovalsCount] = React.useState(0);
  const [alertsCount, setAlertsCount] = React.useState(0);
  const [casesCount, setCasesCount] = React.useState(0);

  React.useEffect(() => {
    const updateCounts = () => {
      const approvals = storageService.getApprovals().filter((a) => a.status === 'Pending');
      const alerts = storageService.getAlerts().filter((a) => a.status === 'New' || a.status === 'Under Investigation');
      const cases = storageService.getCases().filter((c) => c.status === 'Active');
      setApprovalsCount(approvals.length);
      setAlertsCount(alerts.length);
      setCasesCount(cases.length);
    };

    updateCounts();
    const unsub = storageService.subscribe(updateCounts);
    return unsub;
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'defence-intel', label: 'Defence Intelligence', icon: Radio, highlight: true, badge: 'DEFCON 2', badgeColor: 'bg-rose-500' },
    { id: 'cases', label: 'Cases', icon: Briefcase, badge: casesCount > 0 ? casesCount : undefined },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'evidence-chain', label: 'Evidence Chain', icon: Link2, highlight: true },
    { id: 'secure-upload', label: 'Secure Upload', icon: UploadCloud, restrictedTo: userRole !== 'Auditor' && userRole !== 'Read-Only Reviewer' },
    { id: 'search', label: 'Intelligent Search', icon: Search },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: approvalsCount > 0 ? approvalsCount : undefined },
    { id: 'audit-trail', label: 'Audit Trail', icon: History, highlight: true },
    { id: 'alerts', label: 'Alerts & Incidents', icon: ShieldAlert, badge: alertsCount > 0 ? alertsCount : undefined, badgeColor: 'bg-rose-500' },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Users & Roles', icon: Users, restrictedTo: userRole === 'Administrator' || userRole === 'Auditor' },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help-about', label: 'Help & About', icon: HelpCircle }
  ];

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300 select-none border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div
          onClick={() => handleItemClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0f172a] rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 font-['Cinzel',serif]">
                JusticeVault
              </span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase font-semibold truncate">
                Zero-Trust • Evidence OS
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive
                    ? 'text-indigo-100'
                    : item.highlight
                    ? 'text-indigo-400/90 group-hover:text-indigo-300'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && (
                <span className="flex-1 text-left truncate font-medium">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.badgeColor
                      ? `${item.badgeColor} text-white shadow-sm`
                      : isActive
                      ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-400/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-slate-950" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Architecture Hub Trigger Button */}
      {onOpenArchitectureHub && (
        <div className="px-3 mb-2">
          <button
            onClick={onOpenArchitectureHub}
            className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white transition shadow-sm group cursor-pointer ${
              isCollapsed ? 'px-2' : 'px-3'
            }`}
            title="System Architecture: Problem, Solution, 5-Stage Simulator & Tech Stack"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
            {!isCollapsed && (
              <span className="text-xs font-bold truncate">Architecture Hub</span>
            )}
          </button>
        </div>
      )}

      {/* Bento Security Status Card in Sidebar */}
      {!isCollapsed && (
        <div className="p-3.5 mx-3 mb-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-400 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-200 text-xs">Node Telemetry</span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono truncate">
            Block: #489,312 • IBFT Quorum
          </p>
        </div>
      )}

      {/* Collapse Footer Toggle (Desktop) */}
      <div className="hidden lg:flex items-center justify-between p-3 border-t border-slate-800/80 bg-slate-900/40">
        {!isCollapsed && (
          <div className="text-[11px] text-slate-500 font-mono pl-1">
            JusticeVault OS
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
