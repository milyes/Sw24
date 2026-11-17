import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  User, 
  SunMoon, 
  Tv, 
  Camera, 
  ShoppingBag
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    currentTab,
    setTab,
    appLanguage,
    setAppLanguage,
    setShowRealModeDialog,
    setShowThemeDialog,
    setShowCameraDialog,
    setShowPlayStoreDialog
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Title & Branding */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h1 className="text-lg font-bold text-emerald-400 tracking-tight truncate">
              Audio Sync Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400 truncate hidden sm:block">
            Z-CORE Voice & Google Drive Sync Infrastructure
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Real Mode Status Pill Button */}
          <button
            onClick={() => setShowRealModeDialog(true)}
            data-testid="top_bar_real_mode_btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-colors cursor-pointer"
            title="Configuration du Mode Réel Matériel"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span className="hidden xs:inline">
              {appLanguage === 'FR' ? 'MODE RÉEL' : 'REAL MODE'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setAppLanguage(appLanguage === 'FR' ? 'EN' : 'FR')}
            data-testid="top_bar_language_btn"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
            title="Changer de langue / Switch language"
          >
            <span>{appLanguage === 'FR' ? 'FR 🇫🇷' : 'EN 🇬🇧'}</span>
          </button>

          {/* Google Account */}
          <button
            onClick={() => setTab('LOGIN')}
            data-testid="top_bar_account_btn"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              currentTab === 'LOGIN' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Compte Google / Connexion"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Theme Picker */}
          <button
            onClick={() => setShowThemeDialog(true)}
            data-testid="top_bar_theme_btn"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Thème d'affichage"
          >
            <SunMoon className="w-4 h-4" />
          </button>

          {/* Live TV Shortcut */}
          <button
            onClick={() => setTab('LIVE_STREAM')}
            data-testid="top_bar_live_tv_btn"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              currentTab === 'LIVE_STREAM' 
                ? 'bg-rose-500/20 text-rose-400' 
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
            }`}
            title="Flux Direct BEIN 1 HF"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Camera Capture */}
          <button
            onClick={() => setShowCameraDialog(true)}
            data-testid="top_bar_camera_btn"
            className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Capturer une photo"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Play Store Info */}
          <button
            onClick={() => setShowPlayStoreDialog(true)}
            data-testid="top_bar_play_store_btn"
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Google Play Store Listing"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
