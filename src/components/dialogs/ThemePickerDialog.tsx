import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppThemeMode, AppLanguage } from '../../types';
import { X, Moon, Sun, Monitor, Languages, Palette } from 'lucide-react';

interface ThemePickerDialogProps {
  onClose: () => void;
}

export const ThemePickerDialog: React.FC<ThemePickerDialogProps> = ({ onClose }) => {
  const {
    themeMode,
    setThemeMode,
    isDynamicColor,
    toggleDynamicColor,
    appLanguage,
    setAppLanguage,
    tr
  } = useApp();

  const themes: { mode: AppThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      mode: 'DARK',
      label: tr('Sombre (Standard)', 'Dark (Standard)'),
      desc: tr('Palette Z-CORE ardoise foncé et vert émeraude', 'Z-CORE dark slate and emerald palette'),
      icon: <Moon className="w-4 h-4 text-emerald-400" />
    },
    {
      mode: 'OLED',
      label: tr('Noir Pur (OLED)', 'Pure Black (OLED)'),
      desc: tr('Contraste maximal et économie d\'énergie écran AMOLED', 'Max contrast and AMOLED power saving'),
      icon: <Monitor className="w-4 h-4 text-emerald-400" />
    },
    {
      mode: 'LIGHT',
      label: tr('Clair', 'Light'),
      desc: tr('Interface claire haute lisibilité en plein jour', 'High readability bright daytime interface'),
      icon: <Sun className="w-4 h-4 text-amber-400" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        data-testid="theme_picker_dialog"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">
              {tr("Thème & Apparence", "Theme & Appearance")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm">
          {/* Theme Modes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              {tr("Mode d'affichage :", "Display Mode:")}
            </label>
            <div className="space-y-1.5">
              {themes.map(t => (
                <button
                  key={t.mode}
                  onClick={() => setThemeMode(t.mode)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    themeMode === t.mode
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-slate-100'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      {t.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{t.label}</div>
                      <div className="text-[11px] text-slate-400">{t.desc}</div>
                    </div>
                  </div>
                  {themeMode === t.mode && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Color Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-200">
                {tr("Couleur Dynamique (Material You)", "Dynamic Color (Material You)")}
              </div>
              <div className="text-[11px] text-slate-400">
                {tr("Harmonise les accents avec le fond d'écran", "Harmonizes accent tones with device wallpaper")}
              </div>
            </div>
            <button
              onClick={() => toggleDynamicColor(!isDynamicColor)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isDynamicColor ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  isDynamicColor ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Languages className="w-4 h-4 text-emerald-400" />
              <span>{tr("Langue de l'application :", "Application Language:")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAppLanguage('FR')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                  appLanguage === 'FR'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Français 🇫🇷
              </button>
              <button
                onClick={() => setAppLanguage('EN')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                  appLanguage === 'EN'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                English 🇬🇧
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {tr("Fermer", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
};
