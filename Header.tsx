import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Bell,
  UserCheck,
  LogOut,
  ChevronDown,
  Menu,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';
import { alertService } from '../../services/alertService';
import { storageService } from '../../services/storageService';
import { User, UserRole } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: (query?: string) => void;
  onOpenSystemIntegrity: () => void;
  onOpenAIAssistant: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentUser: User | null;
}

export function Header({
  onToggleSidebar,
  onOpenSearch,
  onOpenSystemIntegrity,
  onOpenAIAssistant,
  onNavigate,
  onLogout,
  currentUser
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [alerts, setAlerts] = useState(alertService.getAlerts());

  const userMenuRef = useRef<HTMLDivElement>(null);
  const alertsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setAlerts(alertService.getAlerts());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (alertsMenuRef.current && !alertsMenuRef.current.contains(e.target as Node)) {
        setShowAlertsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenSearch(searchQuery);
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    authService.switchRole(role);
    setShowUserMenu(false);
  };

  const pendingAlertsCount = alerts.filter((a) => a.status === 'New' || a.status === 'Under Investigation').length;

  const rolesList: UserRole[] = [
    'Administrator',
    'Investigating Officer',
    'Forensic Officer',
    'Prosecutor',
    'Auditor',
    'Court Officer',
    'Legal Officer',
    'Read-Only Reviewer'
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/90 backdrop-blur-md text-white border-b border-slate-800/80 shadow-lg">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Side: Mobile toggle + Search */}
        <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-2xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl lg:hidden transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, documents, hashes, blockchain TX..."
                className="w-full pl-9 pr-4 py-2 bg-slate-800/60 text-sm text-slate-100 placeholder-slate-400 rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </form>
        </div>

        {/* Right Side: Bento Header Segments, Security Badges, AI Assistant, Alerts, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bento Quick Filter / Nav Segment */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 text-xs">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 bg-slate-700/80 text-white rounded-lg font-medium transition shadow-sm"
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('evidence-chain')}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 rounded-lg font-medium transition"
            >
              Custody
            </button>
            <button
              onClick={() => onNavigate('audit-trail')}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 rounded-lg font-medium transition"
            >
              Ledger
            </button>
          </div>

          {/* System Integrity Trigger */}
          <button
            onClick={onOpenSystemIntegrity}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition cursor-pointer shadow-sm"
            title="Click to perform full cryptographic system integrity check"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="font-mono">Ledger: 100% Verified</span>
          </button>

          {/* JusticeVault AI Assistant Button */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/25 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Alerts Notification Dropdown */}
          <div className="relative" ref={alertsMenuRef}>
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition border border-slate-700/30"
              aria-label="View security alerts"
            >
              <Bell className="w-5 h-5" />
              {pendingAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-sm">
                  {pendingAlertsCount}
                </span>
              )}
            </button>

            {showAlertsMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-100 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold">Security Alerts</span>
                  </div>
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-medium">
                    {pendingAlertsCount} Active
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80">
                  {alerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowAlertsMenu(false);
                        onNavigate('alerts');
                      }}
                      className="p-3.5 hover:bg-slate-800/60 cursor-pointer transition flex items-start gap-2.5"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          alert.severity === 'Critical'
                            ? 'bg-rose-500 ring-4 ring-rose-500/20'
                            : alert.severity === 'High'
                            ? 'bg-orange-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-200 truncate">{alert.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {alert.timestamp.split(' ')[1]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{alert.description}</p>
                        <p className="text-[10px] text-indigo-400 mt-1 font-mono">{alert.relatedResource}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-800 bg-slate-950/80 text-center">
                  <button
                    onClick={() => {
                      setShowAlertsMenu(false);
                      onNavigate('alerts');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View All Security Incidents →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-800/80 transition text-left border border-slate-700/50 bg-slate-800/30"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/20">
                {currentUser?.avatarInitials || 'JV'}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight">
                  {currentUser?.fullName || 'Authorized User'}
                </div>
                <div className="text-[11px] text-indigo-400 font-medium leading-tight">
                  {currentUser?.role || 'Guest'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {/* User Info */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {currentUser?.avatarInitials || 'JV'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{currentUser?.fullName}</h4>
                      <p className="text-xs text-slate-400">{currentUser?.email}</p>
                      <p className="text-[11px] text-indigo-400 font-medium mt-0.5">{currentUser?.department}</p>
                    </div>
                  </div>
                </div>

                {/* Role Switcher for Testing */}
                <div className="p-3 border-b border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-400" /> Switch Demo Role
                    </span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">
                      RBAC Active
                    </span>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {rolesList.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleSwitch(r)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                          currentUser?.role === r
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{r}</span>
                        {currentUser?.role === r && <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2 bg-slate-950/80">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
                  >
                    Security Settings & Policies
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
