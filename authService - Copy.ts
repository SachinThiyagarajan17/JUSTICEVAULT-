import { User, UserRole } from '../types';
import { storageService } from './storageService';

const AUTH_KEY = 'jv_auth_session_v1';

export interface AuthSession {
  user: User;
  isAuthenticated: boolean;
  mfaVerified: boolean;
  token: string;
  loginTime: string;
}

export const DEMO_CREDENTIALS = [
  { email: 'admin@justicevault.demo', password: 'Admin@123', role: 'Administrator', label: 'Administrator' },
  { email: 'officer@justicevault.demo', password: 'Officer@123', role: 'Investigating Officer', label: 'Investigating Officer' },
  { email: 'forensic@justicevault.demo', password: 'Forensic@123', role: 'Forensic Officer', label: 'Forensic Officer' },
  { email: 'prosecutor@justicevault.demo', password: 'Prosecutor@123', role: 'Prosecutor', label: 'Prosecutor' },
  { email: 'auditor@justicevault.demo', password: 'Auditor@123', role: 'Auditor', label: 'Auditor' },
  { email: 'defence@justicevault.demo', password: 'Defence@123', role: 'Defence Officer', label: 'Defence Officer' }
];

export const ROLE_PERMISSIONS: Record<UserRole, {
  viewCases: boolean;
  createCases: boolean;
  uploadDocuments: boolean;
  editDocuments: boolean;
  downloadDocuments: boolean;
  shareDocuments: boolean;
  approveDocuments: boolean;
  digitallySign: boolean;
  transferEvidence: boolean;
  viewAuditLogs: boolean;
  manageUsers: boolean;
  configureSettings: boolean;
}> = {
  'Administrator': {
    viewCases: true,
    createCases: true,
    uploadDocuments: true,
    editDocuments: true,
    downloadDocuments: true,
    shareDocuments: true,
    approveDocuments: true,
    digitallySign: true,
    transferEvidence: true,
    viewAuditLogs: true,
    manageUsers: true,
    configureSettings: true,
  },
  'Investigating Officer': {
    viewCases: true,
    createCases: true,
    uploadDocuments: true,
    editDocuments: true,
    downloadDocuments: true,
    shareDocuments: true,
    approveDocuments: false,
    digitallySign: false,
    transferEvidence: true,
    viewAuditLogs: true,
    manageUsers: false,
    configureSettings: false,
  },
  'Forensic Officer': {
    viewCases: true,
    createCases: false,
    uploadDocuments: true,
    editDocuments: true,
    downloadDocuments: true,
    shareDocuments: false,
    approveDocuments: false,
    digitallySign: true,
    transferEvidence: true,
    viewAuditLogs: true,
    manageUsers: false,
    configureSettings: false,
  },
  'Prosecutor': {
    viewCases: true,
    createCases: false,
    uploadDocuments: true,
    editDocuments: true,
    downloadDocuments: true,
    shareDocuments: true,
    approveDocuments: true,
    digitallySign: true,
    transferEvidence: true,
    viewAuditLogs: true,
    manageUsers: false,
    configureSettings: false,
  },
  'Court Officer': {
    viewCases: true,
    createCases: false,
    uploadDocuments: true,
    editDocuments: false,
    downloadDocuments: true,
    shareDocuments: false,
    approveDocuments: true,
    digitallySign: true,
    transferEvidence: true,
    viewAuditLogs: true,
    manageUsers: false,
    configureSettings: false,
  },
  'Legal Officer': {
    viewCases: true,
    createCases: true,
    uploadDocuments: true,
    editDocuments: true,
    downloadDocuments: true,
    shareDocuments: true,
    approveDocuments: false,
    digitallySign: true,
    transferEvidence: false,
    viewAuditLogs: true,
    manageUsers: false,
    configureSettings: false,
  },
  'Auditor': {
    viewCases: true,
    createCases: false,
    uploadDocuments: false,
    editDocuments: false,
    downloadDocuments: true,
    shareDocuments: false,
    approveDocuments: false,
    digitallySign: false,
    transferEvidence: false,
    viewAuditLogs: true,
    manageUsers: false,
    configureSettings: false,
  },
  'Read-Only Reviewer': {
    viewCases: true,
    createCases: false,
    uploadDocuments: false,
    editDocuments: false,
    downloadDocuments: false,
    shareDocuments: false,
    approveDocuments: false,
    digitallySign: false,
    transferEvidence: false,
    viewAuditLogs: false,
    manageUsers: false,
    configureSettings: false,
  },
  'Defence Officer': {
    viewCases: true,
    createCases: true,
    uploadDocuments: true,
    editDocuments: true,
    downloadDocuments: true,
    shareDocuments: true,
    approveDocuments: true,
    digitallySign: true,
    transferEvidence: true,
    viewAuditLogs: true,
    manageUsers: false,
    configureSettings: true,
  }
};

export const authService = {
  getCurrentSession(): AuthSession | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      // Default to initial logged-in user for instant convenience, or return null
      const users = storageService.getUsers();
      const admin = users[0];
      const defaultSession: AuthSession = {
        user: admin,
        isAuthenticated: true,
        mfaVerified: true,
        token: 'jv-sec-token-admin-demo',
        loginTime: new Date().toISOString()
      };
      this.saveSession(defaultSession);
      return defaultSession;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveSession(session: AuthSession) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    storageService.notify();
  },

  getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    return session?.user || null;
  },

  validateCredentials(email: string, pass: string): { user: User; requiresMfa: boolean } | null {
    const users = storageService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return null;

    // Check against demo password rules
    const matchDemo = DEMO_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === pass
    );

    if (matchDemo || pass.length >= 6) {
      return { user, requiresMfa: user.mfaEnabled };
    }
    return null;
  },

  verifyOtp(user: User, otp: string): boolean {
    // 123456 is standard mock OTP
    if (otp.trim() === '123456' || otp.trim() === '000000') {
      const session: AuthSession = {
        user,
        isAuthenticated: true,
        mfaVerified: true,
        token: `jv-token-${user.id}-${Date.now()}`,
        loginTime: new Date().toISOString()
      };
      this.saveSession(session);
      return true;
    }
    return false;
  },

  switchRole(role: UserRole) {
    const users = storageService.getUsers();
    const targetUser = users.find((u) => u.role === role) || users[0];
    const session: AuthSession = {
      user: targetUser,
      isAuthenticated: true,
      mfaVerified: true,
      token: `jv-token-${targetUser.id}-${Date.now()}`,
      loginTime: new Date().toISOString()
    };
    this.saveSession(session);
  },

  switchUser(userId: string) {
    const users = storageService.getUsers();
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      const session: AuthSession = {
        user: targetUser,
        isAuthenticated: true,
        mfaVerified: true,
        token: `jv-token-${targetUser.id}-${Date.now()}`,
        loginTime: new Date().toISOString()
      };
      this.saveSession(session);
    }
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
    storageService.notify();
  },

  hasPermission(role: UserRole | undefined, permission: keyof typeof ROLE_PERMISSIONS['Administrator']): boolean {
    if (!role) return false;
    const perms = ROLE_PERMISSIONS[role];
    return perms ? !!perms[permission] : false;
  }
};
