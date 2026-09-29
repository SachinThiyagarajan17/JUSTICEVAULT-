import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Fingerprint
} from 'lucide-react';
import { authService, DEMO_CREDENTIALS } from '../../services/authService';
import { toast } from '../common/ToastContainer';
import { Modal } from '../common/Modal';
import { User } from '../../types';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@justicevault.demo');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // MFA state
  const [step, setStep] = useState<'LOGIN' | 'MFA'>('LOGIN');
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = authService.validateCredentials(email, password);
      if (!res) {
        setErrorMsg('Invalid authorization credentials. Ensure you are using registered demo credentials.');
        return;
      }

      if (res.requiresMfa) {
        setPendingUser(res.user);
        setStep('MFA');
      } else {
        authService.verifyOtp(res.user, '123456');
        toast.success('Identity verified. Welcome to JusticeVault.');
        onLoginSuccess(res.user);
      }
    }, 400);
  };

  const handleSelectDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!pendingUser) return;

    if (otp.trim().length !== 6) {
      setOtpError('Please enter a valid 6-digit security code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const valid = authService.verifyOtp(pendingUser, otp);
      if (valid) {
        toast.success('Identity verified. Welcome to JusticeVault.');
        onLoginSuccess(pendingUser);
      } else {
        setOtpError('Invalid security code. Please use demo code 123456.');
      }
    }, 350);
  };

  const handleResendOtp = () => {
    setOtp('');
    setOtpError('');
    toast.info('A new simulated security OTP code has been dispatched. Use: 123456');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-900 bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-wide text-white font-['Cinzel',serif]">
              JusticeVault
            </span>
            <span className="text-[10px] text-cyan-400 font-mono ml-2 uppercase font-semibold">
              v2.4 Prototype
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-700/40">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Zero-Trust Gatekeeper
          </span>
        </div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {step === 'LOGIN' ? (
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-blue-600/30 flex items-center justify-center mb-3">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Shield className="w-7 h-7 text-cyan-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-['Cinzel',serif]">
                  JusticeVault
                </h1>
                <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest mt-1 font-semibold">
                  Secure. Traceable. Court-Ready.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Official Digital Document Management System
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Official Email / ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@justicevault.demo"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Passphrase
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-950"
                    />
                    <span>Remember this secure workstation</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Proceed to MFA Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Accounts Selector */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    Quick Demo Credentials
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">1-Click Fill</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.email}
                      type="button"
                      onClick={() => handleSelectDemoAccount(cred.email, cred.password)}
                      className={`text-left p-2 rounded-lg border text-xs transition ${
                        email === cred.email
                          ? 'bg-blue-950/60 border-blue-600 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{cred.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{cred.email}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Banner */}
              <div className="mt-5 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-400">
                  <span className="text-amber-400 font-bold">Authorized personnel only.</span> All sessions are encrypted and logged to the tamper-evident audit ledger.
                </p>
              </div>
            </div>
          ) : (
            /* MFA Verification Step */
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950 border border-cyan-600/40 flex items-center justify-center mb-3">
                  <Fingerprint className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white">Multi-Factor Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verifying identity for <strong className="text-slate-200">{pendingUser?.fullName}</strong> ({pendingUser?.role})
                </p>
              </div>

              {otpError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyMfa} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                    Enter 6-Digit Security Token
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold py-3 bg-slate-950 border border-cyan-600/50 rounded-xl text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                  {/* Discreet Prototype OTP hint */}
                  <div className="mt-2 text-center">
                    <span className="inline-block text-[11px] text-cyan-400/80 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40 font-mono">
                      Use <strong>123456</strong> for prototype testing
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? 'Verifying Cryptographic Token...' : 'Verify & Enter Vault'}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('LOGIN');
                      setOtp('');
                      setOtpError('');
                    }}
                    className="text-xs text-slate-400 hover:text-white transition"
                  >
                    ← Back to Credentials
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3" /> Resend Code
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center border-t border-slate-900 bg-slate-950/80 text-xs text-slate-500 font-mono">
        JusticeVault Prototype | Secure Digital Document Management Demonstration
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setRecoverySent(false);
          setRecoveryEmail('');
        }}
        title="Simulated Account Access Recovery"
        subtitle="Department of Justice Security Directory"
        size="sm"
      >
        {recoverySent ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Recovery Instructions Sent</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A temporary security unlock token and OTP link have been dispatched to <strong>{recoveryEmail}</strong>.
            </p>
            <p className="text-xs text-slate-500">For prototype testing, you can use any of the 5 demo accounts on the login screen directly.</p>
            <button
              onClick={() => {
                setShowForgotModal(false);
                setRecoverySent(false);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (recoveryEmail) setRecoverySent(true);
            }}
            className="space-y-4"
          >
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your official department email address to initiate an identity challenge and biometric recovery workflow.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Official Email
              </label>
              <input
                type="email"
                required
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="officer@justicevault.demo"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Send Recovery OTP
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
