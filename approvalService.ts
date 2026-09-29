import { Approval, ApprovalStatus, ApprovalType, PriorityLevel } from '../types';
import { storageService } from './storageService';
import { auditService } from './auditService';
import { documentService } from './documentService';
import { authService } from './authService';

export const approvalService = {
  getApprovals(filters?: {
    status?: ApprovalStatus | 'ALL';
    type?: ApprovalType | 'ALL';
    caseId?: string | 'ALL';
  }): Approval[] {
    let approvals = storageService.getApprovals();

    if (!filters) return approvals;

    return approvals.filter((app) => {
      if (filters.status && filters.status !== 'ALL' && app.status !== filters.status) {
        return false;
      }
      if (filters.type && filters.type !== 'ALL' && app.approvalType !== filters.type) {
        return false;
      }
      if (filters.caseId && filters.caseId !== 'ALL' && app.caseId !== filters.caseId && app.caseNumber !== filters.caseId) {
        return false;
      }
      return true;
    });
  },

  getApprovalById(id: string): Approval | undefined {
    const approvals = storageService.getApprovals();
    return approvals.find((a) => a.id === id);
  },

  createApproval(params: {
    caseId: string;
    caseNumber: string;
    documentId?: string;
    documentName: string;
    requestedTo: string;
    approvalType: ApprovalType;
    dueDate: string;
    comments?: string;
    priority?: PriorityLevel;
  }): Approval {
    const currentUser = authService.getCurrentUser();
    const approvals = storageService.getApprovals();
    const nextIdx = approvals.length + 1;
    const appId = `APP-${nextIdx.toString().padStart(3, '0')}`;

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const newApproval: Approval = {
      id: appId,
      caseId: params.caseId,
      caseNumber: params.caseNumber,
      documentId: params.documentId,
      documentName: params.documentName,
      requestedBy: currentUser?.fullName || 'Investigating Officer',
      requestedTo: params.requestedTo,
      approvalType: params.approvalType,
      status: 'Pending',
      requestedAt: dateStr,
      dueDate: params.dueDate,
      comments: params.comments,
      priority: params.priority || 'High'
    };

    storageService.setApprovals([newApproval, ...approvals]);

    auditService.logEvent({
      action: 'APPROVAL_GRANTED', // request created
      resourceType: 'APPROVAL',
      resourceId: newApproval.id,
      resourceName: newApproval.documentName,
      details: `New approval workflow initiated for ${newApproval.approvalType}. Assigned to ${newApproval.requestedTo}.`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return newApproval;
  },

  approve(approvalId: string, comments?: string, applySignature: boolean = false): Approval {
    const approvals = storageService.getApprovals();
    const index = approvals.findIndex((a) => a.id === approvalId);
    if (index === -1) throw new Error('Approval not found');

    const app = approvals[index];
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const updated: Approval = {
      ...app,
      status: 'Approved',
      completedAt: dateStr,
      comments: comments ? `${app.comments || ''}\n[Approved]: ${comments}`.trim() : app.comments
    };

    approvals[index] = updated;
    storageService.setApprovals([...approvals]);

    // If document is linked and digital signature requested
    if (app.documentId && (applySignature || app.approvalType === 'Digital Signature')) {
      try {
        documentService.digitallySignDocument(app.documentId, 'SEC-APPROVAL-CERT-2026');
      } catch (err) {
        console.warn('Could not auto-sign document:', err);
      }
    }

    auditService.logEvent({
      action: 'APPROVAL_GRANTED',
      resourceType: 'APPROVAL',
      resourceId: app.id,
      resourceName: app.documentName,
      details: `Approval granted by ${authService.getCurrentUser()?.fullName} for ${app.approvalType}. Comment: ${comments || 'No remarks.'}`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return updated;
  },

  reject(approvalId: string, reason: string): Approval {
    const approvals = storageService.getApprovals();
    const index = approvals.findIndex((a) => a.id === approvalId);
    if (index === -1) throw new Error('Approval not found');

    const app = approvals[index];
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const updated: Approval = {
      ...app,
      status: 'Rejected',
      completedAt: dateStr,
      comments: `${app.comments || ''}\n[Rejected]: ${reason}`.trim()
    };

    approvals[index] = updated;
    storageService.setApprovals([...approvals]);

    auditService.logEvent({
      action: 'APPROVAL_REJECTED',
      resourceType: 'APPROVAL',
      resourceId: app.id,
      resourceName: app.documentName,
      details: `Approval rejected by ${authService.getCurrentUser()?.fullName}. Reason: ${reason}`,
      result: 'Warning',
      riskLevel: 'Medium'
    });

    return updated;
  },

  requestChanges(approvalId: string, changeNotes: string): Approval {
    const approvals = storageService.getApprovals();
    const index = approvals.findIndex((a) => a.id === approvalId);
    if (index === -1) throw new Error('Approval not found');

    const app = approvals[index];
    const updated: Approval = {
      ...app,
      comments: `${app.comments || ''}\n[Changes Requested]: ${changeNotes}`.trim()
    };

    approvals[index] = updated;
    storageService.setApprovals([...approvals]);

    auditService.logEvent({
      action: 'APPROVAL_REJECTED',
      resourceType: 'APPROVAL',
      resourceId: app.id,
      resourceName: app.documentName,
      details: `Modifications requested by ${authService.getCurrentUser()?.fullName}: ${changeNotes}`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return updated;
  }
};
