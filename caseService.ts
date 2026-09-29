import { Case, CaseStatus, PriorityLevel, ConfidentialityLevel } from '../types';
import { storageService } from './storageService';
import { auditService } from './auditService';
import { authService } from './authService';

export interface CaseFilterOptions {
  search?: string;
  status?: CaseStatus | 'ALL';
  priority?: PriorityLevel | 'ALL';
  confidentiality?: ConfidentialityLevel | 'ALL';
  department?: string | 'ALL';
  category?: string | 'ALL';
}

export const caseService = {
  getCases(filters?: CaseFilterOptions): Case[] {
    let cases = storageService.getCases();
    const currentUser = authService.getCurrentUser();

    // In Read-Only reviewer or non-admin, filter based on assigned access or public cases if applicable
    if (currentUser?.role === 'Read-Only Reviewer') {
      cases = cases.filter((c) => c.confidentiality !== 'Highly Restricted' && c.confidentiality !== 'Top Secret');
    }

    if (!filters) return cases;

    return cases.filter((c) => {
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchTitle = c.title.toLowerCase().includes(query);
        const matchNumber = c.caseNumber.toLowerCase().includes(query);
        const matchOfficer = c.investigatingOfficer.toLowerCase().includes(query);
        const matchCategory = c.category.toLowerCase().includes(query);
        const matchTags = c.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchNumber && !matchOfficer && !matchCategory && !matchTags) {
          return false;
        }
      }

      if (filters.status && filters.status !== 'ALL' && c.status !== filters.status) {
        return false;
      }

      if (filters.priority && filters.priority !== 'ALL' && c.priority !== filters.priority) {
        return false;
      }

      if (filters.confidentiality && filters.confidentiality !== 'ALL' && c.confidentiality !== filters.confidentiality) {
        return false;
      }

      if (filters.department && filters.department !== 'ALL' && c.department !== filters.department) {
        return false;
      }

      if (filters.category && filters.category !== 'ALL' && c.category !== filters.category) {
        return false;
      }

      return true;
    });
  },

  getCaseById(id: string): Case | undefined {
    const cases = storageService.getCases();
    return cases.find((c) => c.id === id || c.caseNumber === id);
  },

  createCase(newCaseData: Omit<Case, 'id' | 'documentCount' | 'evidenceCount' | 'progressPercentage'>): Case {
    const cases = storageService.getCases();
    const nextIndex = cases.length + 1;
    const caseId = `CASE-${nextIndex.toString().padStart(3, '0')}`;
    
    const newCase: Case = {
      ...newCaseData,
      id: caseId,
      documentCount: 0,
      evidenceCount: 0,
      progressPercentage: 15
    };

    storageService.setCases([newCase, ...cases]);

    auditService.logEvent({
      action: 'PERMISSION_CHANGE',
      resourceType: 'CASE',
      resourceId: newCase.id,
      resourceName: `${newCase.caseNumber} - ${newCase.title}`,
      details: `New case created with priority ${newCase.priority} and classification ${newCase.confidentiality}. Assigned to ${newCase.investigatingOfficer}.`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return newCase;
  },

  updateCase(id: string, updates: Partial<Case>): Case | undefined {
    const cases = storageService.getCases();
    const index = cases.findIndex((c) => c.id === id);
    if (index === -1) return undefined;

    const updated = { ...cases[index], ...updates };
    cases[index] = updated;
    storageService.setCases([...cases]);

    auditService.logEvent({
      action: 'PERMISSION_CHANGE',
      resourceType: 'CASE',
      resourceId: updated.id,
      resourceName: `${updated.caseNumber} - ${updated.title}`,
      details: `Case details updated: ${Object.keys(updates).join(', ')}`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return updated;
  },

  incrementCounts(caseId: string, type: 'document' | 'evidence') {
    const cases = storageService.getCases();
    const c = cases.find((item) => item.id === caseId || item.caseNumber === caseId);
    if (c) {
      if (type === 'document') c.documentCount += 1;
      if (type === 'evidence') c.evidenceCount += 1;
      storageService.setCases([...cases]);
    }
  }
};
