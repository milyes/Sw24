import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signInWithGoogle, signOutUser } from '../services/firebase';
import { NetsecureProLicenseCard } from '../components/NetsecureProLicenseCard';
import { 
  User, 
  Key, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut, 
  Languages, 
  Cpu, 
  BatteryCharging, 
  HardDrive, 
  Wifi, 
  Zap 
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const {
    userGoogleAccountEmail,
    googleAccountDisplayName,
    isGoogleAccountConnected,
    updateGoogleAccount,
    disconnectGoogleAccount,
    appLanguage,
    setAppLanguage,
    setShowRealModeDialog,
    tr,
    addToast
  } = useApp();

  const [emailInput, setEmailInput] = useState(userGoogleAccountEmail);
  const [displayNameInput, setDisplayNameInput] = useState(googleAccountDisplayName);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    try {
      const res = await signInWithGoogle();
      if (res.success && res.user) {
        updateGoogleAccount(res.user.email, res.user.displayName || '');
        addToast(`Connecté avec Google (${res.user.email}) !`, 'success');
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleDisconnect = async () => {
    await signOutUser();
    disconnectGoogleAccount();
    addToast("Compte Google déconnecté", 'info');
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      updateGoogleAccount(emailInput.trim(), displayNameInput.trim());
      setShowManualDialog(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-xl mx-auto">
      {/* 1. Mode Appareil Réel & Language Pill */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowRealModeDialog(true)}
          data-testid="device_mode_indicator_badge"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-colors cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          <span>Mode Appareil Réel (Device Mode)</span>
        </button>

        <button
          onClick={() => setAppLanguage(appLanguage === 'FR' ? 'EN' : 'FR')}
          data-testid="login_language_toggle_btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Languages className="w-4 h-4 text-emerald-400" />
          <span>{appLanguage === 'FR' ? 'Version FR 🇫🇷' : 'Version EN 🇬🇧'}</span>
        </button>
      </div>

      {/* 2. Hero Icon & Title */}
      <div className="text-center py-4 space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/40">
          <Key className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          Compte Google & Synchronisation Cloud
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Gestion des autorisations Google Drive OAuth2, Firebase Auth et noeud Z-CORE S24
        </p>
      </div>

      {/* 3. Authentication Status Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">
                  {isGoogleAccountConnected ? googleAccountDisplayName : 'Non connecté'}
                </span>
                {isGoogleAccountConnected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ACTIF
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {isGoogleAccountConnected ? userGoogleAccountEmail : 'Veuillez vous authentifier'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          {isGoogleAccountConnected ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowManualDialog(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              >
                Modifier Compte
              </button>
              <button
                onClick={handleDisconnect}
                className="py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-bold transition-colors cursor-pointer border border-rose-500/30 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnecter</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoadingAuth}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
            >
              <User className="w-4 h-4" />
              <span>{isLoadingAuth ? 'Connexion en cours...' : 'Se connecter avec Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Hardware Diagnostics Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Diagnostic Matériel & Environnement Réel (S24)</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10.5px] block">Modèle Appareil :</span>
            <span className="text-slate-200 font-bold">Galaxy S24 (SM-S928B)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10.5px] block">Noeud Maître :</span>
            <span className="text-emerald-400 font-bold">Z-CORE Montreal Node</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10.5px] block">Échantillonnage Audio :</span>
            <span className="text-slate-200 font-bold">44.1 kHz PCM Lossless</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10.5px] block">Stockage Local :</span>
            <span className="text-emerald-400 font-bold">/sdcard/recordings</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10.5px] block">Tunnel Cloudflare :</span>
            <span className="text-emerald-400 font-bold">ACTIF (979V11)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10.5px] block">Protocole Cloud :</span>
            <span className="text-slate-200 font-bold">Rclone CLI v1.66+</span>
          </div>
        </div>
      </div>

      {/* 5. Official License Card */}
      <NetsecureProLicenseCard isInitiallyExpanded={false} />

      {/* Manual Email Input Modal */}
      {showManualDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveManual}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                Paramètres Compte Google Manuel
              </h3>
              <button
                type="button"
                onClick={() => setShowManualDialog(false)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Email Google :</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nom d'affichage :</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowManualDialog(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 cursor-pointer"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
