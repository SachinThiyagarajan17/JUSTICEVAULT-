import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'signed'
  | 'submitted'
  | 'archived'
  | 'verified'
  | 'warning'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'restricted'
  | 'highly_restricted'
  | 'confidential'
  | 'neutral'
  | 'cyan'
  | 'blockchain';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant | string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export function Badge({ children, variant = 'neutral', size = 'sm', icon, className = '', pulse = false }: BadgeProps) {
  const normVariant = typeof variant === 'string' ? variant.toLowerCase().replace(/[\s-]/g, '_') : 'neutral';

  const getStyles = () => {
    switch (normVariant) {
      case 'active':
      case 'verified':
      case 'healthy':
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]';

      case 'under_review':
      case 'pending':
      case 'pending_signature':
      case 'pending_check':
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]';

      case 'signed':
      case 'digitally_signed':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]';

      case 'submitted':
      case 'court_submission':
        return 'bg-blue-500/15 text-sky-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]';

      case 'rejected':
      case 'warning':
      case 'tamper_warning':
      case 'critical':
      case 'tampered':
      case 'denied':
      case 'failed':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]';

      case 'high':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]';

      case 'restricted':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]';

      case 'highly_restricted':
      case 'top_secret':
        return 'bg-rose-900/40 text-rose-300 border-rose-500/40 font-semibold shadow-[0_0_12px_rgba(244,63,94,0.2)]';

      case 'confidential':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]';

      case 'blockchain':
      case 'cyan':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]';

      case 'archived':
      case 'closed':
      case 'low':
      case 'neutral':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700/60';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'text-[11px] px-2.5 py-0.5 rounded-full';
      case 'lg':
        return 'text-xs px-3.5 py-1.5 font-semibold rounded-full';
      case 'md':
      default:
        return 'text-xs px-3 py-1 font-medium rounded-full';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border whitespace-nowrap font-medium transition-colors ${getStyles()} ${getSize()} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
