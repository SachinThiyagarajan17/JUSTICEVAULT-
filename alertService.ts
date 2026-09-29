import { Alert, AlertSeverity, AlertStatus } from '../types';
import { storageService } from './storageService';
import { auditService } from './auditService';
import { authService } from './authService';

export const alertService = {
  getAlerts(filters?: {
    severity?: AlertSeverity | 'ALL';
    status?: AlertStatus | 'ALL';
  }): Alert[] {
    let alerts = storageService.getAlerts();

    if (!filters) return alerts;

    return alerts.filter((a) => {
      if (filters.severity && filters.severity !== 'ALL' && a.severity !== filters.severity) {
        return false;
      }
      if (filters.status && filters.status !== 'ALL' && a.status !== filters.status) {
        return false;
      }
      return true;
    });
  },

  updateAlertStatus(
    alertId: string,
    status: AlertStatus,
    resolutionNotes?: string,
    investigator?: string
  ): Alert {
    const alerts = storageService.getAlerts();
    const index = alerts.findIndex((a) => a.id === alertId);
    if (index === -1) throw new Error('Alert not found');

    const alert = alerts[index];
    const updated: Alert = {
      ...alert,
      status,
      resolutionNotes: resolutionNotes || alert.resolutionNotes,
      assignedInvestigator: investigator || alert.assignedInvestigator || authService.getCurrentUser()?.fullName
    };

    alerts[index] = updated;
    storageService.setAlerts([...alerts]);

    auditService.logEvent({
      action: 'PERMISSION_CHANGE',
      resourceType: 'SYSTEM',
      resourceId: alert.id,
      resourceName: alert.title,
      details: `Security incident status updated to "${status}". Action by ${authService.getCurrentUser()?.fullName}. Notes: ${resolutionNotes || 'None'}`,
      result: 'Success',
      riskLevel: alert.severity === 'Critical' ? 'High' : 'Medium'
    });

    return updated;
  },

  createAlert(params: {
    type: string;
    severity: AlertSeverity;
    title: string;
    description: string;
    relatedResource: string;
    relatedCaseId?: string;
    recommendedAction: string;
  }): Alert {
    const alerts = storageService.getAlerts();
    const nextIdx = alerts.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const newAlert: Alert = {
      id: `ALT-${nextIdx.toString().padStart(3, '0')}`,
      type: params.type,
      severity: params.severity,
      title: params.title,
      description: params.description,
      timestamp: dateStr,
      relatedResource: params.relatedResource,
      relatedCaseId: params.relatedCaseId,
      status: 'New',
      recommendedAction: params.recommendedAction
    };

    storageService.setAlerts([newAlert, ...alerts]);

    auditService.logEvent({
      action: 'TAMPER_ALERT_TRIGGERED',
      resourceType: 'SYSTEM',
      resourceId: newAlert.id,
      resourceName: newAlert.title,
      details: `Security alert triggered [${newAlert.severity}]: ${newAlert.title}`,
      result: 'Warning',
      riskLevel: newAlert.severity === 'Critical' ? 'Critical' : 'High'
    });

    return newAlert;
  }
};
