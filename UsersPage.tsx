import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  UserCheck,
  Layers,
  Plus,
  Lock,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { authService, ROLE_PERMISSIONS } from '../services/authService';
import { storageService } from '../services/storageService';
import { User, UserRole } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { toast } from '../components/common/ToastContainer';

interface UsersPageProps {
  onNavigate: (page: string) => void;
}

export function UsersPage({ onNavigate }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'USERS' | 'MATRIX'>('USERS');

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Investigating Officer');
  const [newDept, setNewDept] = useState('Special Crime Investigation Branch');

  const currentUser = authService.getCurrentUser();

  const filteredUsers = users.filter((u) => {
    if (selectedRoleFilter !== 'ALL' && u.role !== selectedRoleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSwitchUserRole = (role: UserRole) => {
    authService.switchRole(role);
    toast.info(`Switched active demo session to ${role}.`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Name and official email are required.');
      return;
    }

    const created: User = {
      id: `USR-${Date.now()}`,
      fullName: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      department: newDept,
      organization: 'Central Justice Directorate',
      phone: '+91 98765 43210',
      status: 'Active',
      mfaEnabled: true,
      badgeNumber: `DET-${Math.floor(1000 + Math.random() * 9000)}`,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      avatarInitials: newName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    };

    const currentList = storageService.getUsers();
    storageService.setUsers([...currentList, created]);
    setUsers([...currentList, created]);
    toast.success(`User ${created.fullName} provisioned with role ${created.role}.`);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

  const allRoles: UserRole[] = [
    'Administrator',
    'Investigating Officer',
    'Forensic Officer',
    'Prosecutor',
    'Auditor',
    'Court Officer',
    'Legal Officer',
    'Read-Only Reviewer'
  ];

  const permissionKeys: { key: keyof typeof ROLE_PERMISSIONS['Administrator']; label: string }[] = [
    { key: 'viewCases', label: 'View Case Dossiers' },
    { key: 'createCases', label: 'Register New Cases' },
    { key: 'uploadDocuments', label: 'Upload Evidentiary Documents' },
    { key: 'editDocuments', label: 'Edit Document Metadata' },
    { key: 'downloadDocuments', label: 'Export / Download Sealed Records' },
    { key: 'shareDocuments', label: 'Inter-Agency Sharing' },
    { key: 'approveDocuments', label: 'Judicial / Supervisory Approvals' },
    { key: 'digitallySign', label: 'Apply Cryptographic Signatures' },
    { key: 'transferEvidence', label: 'Execute Custody Transfers' },
    { key: 'viewAuditLogs', label: 'Inspect Immutable Audit Ledger' },
    { key: 'manageUsers', label: 'Manage Personnel & RBAC' },
    { key: 'configureSettings', label: 'Configure System Settings' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Personnel Directory & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authenticated law enforcement officers, forensic examiners, prosecutors, and judicial reviewers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New User</span>
          </button>
        </div>
      </div>

      {/* Tabs: Users List vs RBAC Matrix */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'USERS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Authorized Personnel ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'MATRIX'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          RBAC Permissions Matrix
        </button>
      </div>

      {activeTab === 'USERS' ? (
        <>
          {/* Filter Bar */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name, email, department, role..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="ALL">All Roles</option>
                  {allRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Personnel Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Officer / Personnel</th>
                    <th className="px-4 py-3.5">Role Classification</th>
                    <th className="px-4 py-3.5">Assigned Department</th>
                    <th className="px-4 py-3.5">Badge / ID</th>
                    <th className="px-4 py-3.5">Security MFA</th>
                    <th className="px-4 py-3.5">Last Login</th>
                    <th className="px-4 py-3.5 text-right">Demo Role Switch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isCurrent = currentUser?.id === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3.5 font-medium text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {u.avatarInitials}
                            </div>
                            <div>
                              <div className="font-bold flex items-center gap-1.5">
                                {u.fullName}
                                {isCurrent && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded font-normal">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={u.role}>{u.role}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">{u.department}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-600">{u.badgeNumber || 'N/A'}</td>
                        <td className="px-4 py-3.5">
                          {u.mfaEnabled ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Enforced
                            </span>
                          ) : (
                            <span className="text-slate-400">Optional</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">{u.lastLogin.split(' ')[0]}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleSwitchUserRole(u.role)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-xs font-semibold text-slate-700 transition cursor-pointer"
                          >
                            Simulate Role
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* RBAC Permissions Matrix */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase">
              Role-Based Access Control (RBAC) Governance Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Granular access and verification permissions by operational assignment
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="p-3 font-bold">Operational Capability</th>
                  {allRoles.map((r) => (
                    <th key={r} className="p-3 text-center font-bold">
                      {r.replace(' Officer', '').replace(' Reviewer', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {permissionKeys.map(({ key, label }) => (
                  <tr key={key} className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-800">{label}</td>
                    {allRoles.map((role) => {
                      const allowed = ROLE_PERMISSIONS[role]?.[key] ?? false;
                      return (
                        <td key={role} className="p-3 text-center">
                          {allowed ? (
                            <span className="inline-flex p-1 bg-emerald-100 text-emerald-700 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="inline-flex p-1 bg-slate-100 text-slate-300 rounded-full">
                              <XCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Provision New Official User"
        subtitle="Zero-Trust Directory Registration"
        size="md"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Officer Full Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Inspector Rajesh Varma"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. rajesh.varma@police.gov.in"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Assigned Role *
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              Provision Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
