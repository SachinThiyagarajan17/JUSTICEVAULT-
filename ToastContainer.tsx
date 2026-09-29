import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

// Global toast dispatch helper
type ToastListener = (toast: ToastMessage) => void;
const toastListeners = new Set<ToastListener>();

export const toast = {
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', title?: string) {
    const t: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      duration: 4000
    };
    toastListeners.forEach((fn) => fn(t));
  },
  success(message: string, title: string = 'Success') {
    this.show(message, 'success', title);
  },
  error(message: string, title: string = 'Error') {
    this.show(message, 'error', title);
  },
  warning(message: string, title: string = 'Warning') {
    this.show(message, 'warning', title);
  },
  info(message: string, title: string = 'Notice') {
    this.show(message, 'info', title);
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    const handleToast = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 4000);
    };

    toastListeners.add(handleToast);
    return () => {
      toastListeners.delete(handleToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-xl border backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            t.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/60 shadow-emerald-950/40'
              : t.type === 'error'
              ? 'bg-rose-950/90 text-rose-100 border-rose-700/60 shadow-rose-950/40'
              : t.type === 'warning'
              ? 'bg-amber-950/90 text-amber-100 border-amber-700/60 shadow-amber-950/40'
              : 'bg-slate-900/90 text-slate-100 border-slate-700/60 shadow-slate-950/40'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {t.type === 'success' && (
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {t.type === 'error' && (
              <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {t.type === 'warning' && (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {t.type === 'info' && (
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {t.title && <div className="text-xs font-bold uppercase tracking-wider mb-0.5 opacity-90">{t.title}</div>}
            <div className="text-sm font-medium leading-snug">{t.message}</div>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
