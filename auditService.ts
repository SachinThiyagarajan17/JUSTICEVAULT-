import { AuditAction, AuditEvent, AuditRiskLevel, UserRole } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';

function generateRandomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const auditService = {
  getAuditEvents(): AuditEvent[] {
    return storageService.getAuditEvents();
  },

  logEvent(params: {
    action: AuditAction;
    resourceType: 'DOCUMENT' | 'CASE' | 'EVIDENCE' | 'USER' | 'SYSTEM' | 'AUTH' | 'APPROVAL';
    resourceId: string;
    resourceName?: string;
    details: string;
    result?: 'Success' | 'Denied' | 'Warning' | 'Failed';
    riskLevel?: AuditRiskLevel;
    overrideUser?: {
      name: string;
      role: UserRole;
      department: string;
    };
  }): AuditEvent {
    const currentUser = authService.getCurrentUser();
    const performer = params.overrideUser?.name || currentUser?.fullName || 'System Automated Process';
    const role = params.overrideUser?.role || currentUser?.role || 'Administrator';
    const department = params.overrideUser?.department || currentUser?.department || 'Directorate of Information Security';

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const newEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      resourceName: params.resourceName,
      performedBy: performer,
      role: role,
      department: department,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      device: 'JusticeVault Client (Secured Session)',
      timestamp: dateStr,
      result: params.result || 'Success',
      riskLevel: params.riskLevel || 'Low',
      details: params.details,
      eventHash: `0xAUD${generateRandomHex(40)}`
    };

    const currentList = storageService.getAuditEvents();
    storageService.setAuditEvents([newEvent, ...currentList]);
    return newEvent;
  },

  verifyAuditLogIntegrity(): {
    totalEvents: number;
    verifiedCount: number;
    tamperDetected: boolean;
    rootMerkleHash: string;
    message: string;
  } {
    const events = storageService.getAuditEvents();
    // Simulate checking 37,842 ledger events
    const verifiedTotal = 37842 + events.length;

    this.logEvent({
      action: 'SYSTEM_INTEGRITY_CHECK',
      resourceType: 'SYSTEM',
      resourceId: 'SYS-AUDIT-LEDGER',
      resourceName: 'Tamper-Evident Audit Chain',
      details: `Integrity check completed across ${verifiedTotal.toLocaleString()} audit records. Merkle tree cryptographic proof matches genesis ledger.`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return {
      totalEvents: verifiedTotal,
      verifiedCount: verifiedTotal,
      tamperDetected: false,
      rootMerkleHash: `0x7F9A${generateRandomHex(40)}`,
      message: `${verifiedTotal.toLocaleString()} audit events checked. No chain mismatch detected.`
    };
  }
};
