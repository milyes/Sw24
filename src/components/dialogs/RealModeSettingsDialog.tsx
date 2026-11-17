import React from 'react';
import { useApp } from '../../context/AppContext';
import { RealDeviceParameters } from '../../types';
import { 
  X, 
  Zap, 
  Mic, 
  Volume2, 
  Ear, 
  CloudUpload, 
  Key, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  HardDrive 
} from 'lucide-react';

interface RealModeSettingsDialogProps {
  onClose: () => void;
}

export const RealModeSettingsDialog: React.FC<RealModeSettingsDialogProps> = ({ onClose }) => {
  const { 
    realDeviceParameters, 
    toggleRealParameter, 
    activateAllRealModeParameters, 
    tr 
  } = useApp();

  const parameterDefs: {
    key: keyof RealDeviceParameters;
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'realHardwareDac',
      titleFr: 'DAC Audio Matériel Haute Définition (44.1 kHz PCM)',
      titleEn: 'Hardware Audio DAC Lossless (44.1 kHz PCM)',
      descFr: 'Capture non compressée directement via le bus audio système Z-CORE.',
      descEn: 'Lossless audio capture directly through the Z-CORE system audio bus.',
      icon: <Volume2 className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realMicrophoneDirect',
      titleFr: 'Accès Direct Microphone Physique',
      titleEn: 'Direct Physical Microphone Hardware Access',
      descFr: 'Désactive tout filtre logiciel artificiel ou mock pour capter l\'audio réel.',
      descEn: 'Bypasses synthetic mock audio to capture real hardware sound stream.',
      icon: <Mic className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realSilenceVAD',
      titleFr: 'Détecteur de Silence VAD (Pause 5s & Reprise Vocale)',
      titleEn: 'VAD Silence Detection (5s Auto-Pause & Voice Resume)',
      descFr: 'Analyse l\'amplitude RMS pour suspendre l\'enregistrement après 5 secondes de silence.',
      descEn: 'RMS amplitude analysis to pause recording after 5 seconds of silence.',
      icon: <Ear className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realRcloneExecution',
      titleFr: 'Exécution Rclone Réelle (dryRun = false)',
      titleEn: 'Real Rclone Transmission (dryRun = false)',
      descFr: 'Transmission réseau effective vers le stockage Google Drive distant.',
      descEn: 'Live network transfer to remote Google Drive cloud storage.',
      icon: <CloudUpload className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realGoogleAuthOAuth',
      titleFr: 'Authentification Google Drive OAuth2 & Firebase',
      titleEn: 'Google Drive OAuth2 & Firebase Authentication',
      descFr: 'Gestion des jetons d\'accès authentifiés et identifiant 1976ilies@gmail.com.',
      descEn: 'Authenticated access token handling for 1976ilies@gmail.com.',
      icon: <Key className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realAutoCloudSync',
      titleFr: 'Synchronisation Cloud Automatique en Arrière-Plan',
      titleEn: 'Automatic Background Cloud Sync',
      descFr: 'Déclenche immédiatement le téléversement cloud à l\'arrêt de l\'enregistrement.',
      descEn: 'Immediately queues remote cloud upload upon recording termination.',
      icon: <RefreshCw className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realTermuxSocket',
      titleFr: 'Socket Termux & Intent API (RUN_COMMAND)',
      titleEn: 'Termux Socket & Intent API (RUN_COMMAND)',
      descFr: 'Transmission de commandes shell et scripts bash vers le runtime Termux.',
      descEn: 'Dispatches shell commands and bash scripts to Termux runtime.',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realExponentialRetry',
      titleFr: 'Reprise Réseau avec Retry Exponentiel',
      titleEn: 'Network Auto-Retry with Exponential Backoff',
      descFr: 'Jusqu\'à 5 tentatives de reconnexion automatique en cas de perte réseau.',
      descEn: 'Up to 5 automatic reconnection attempts on network packet drop.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realStorageAccess',
      titleFr: 'Accès Stockage Dédié Local (Z-CORE)',
      titleEn: 'Dedicated Scoped Storage Access (Z-CORE)',
      descFr: 'Persistance sur le système de fichiers local et répertoire /sdcard/recordings.',
      descEn: 'Persistence to local filesystem and /sdcard/recordings directory.',
      icon: <HardDrive className="w-4 h-4 text-emerald-400" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        data-testid="real_mode_settings_dialog"
        className="w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5 fill-emerald-400 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {tr("Paramètres du Mode Réel Matériel", "Real Hardware Mode Settings")}
              </h2>
              <p className="text-xs text-emerald-400 font-medium">
                {tr("9/9 Paramètres Opérationnels • Z-CORE Live Node", "9/9 Operational Parameters • Z-CORE Live Node")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Banner */}
        <div className="px-5 py-3 bg-emerald-950/25 border-b border-emerald-500/20 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            {tr("Activez tous les paramètres pour garantir une exécution 100% réelle sans simulation.", "Activate all parameters to guarantee 100% real execution without simulation.")}
          </div>
          <button
            onClick={activateAllRealModeParameters}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer shrink-0"
          >
            {tr("Activer Tous", "Activate All")}
          </button>
        </div>

        {/* Parameters List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {parameterDefs.map(param => {
            const isEnabled = realDeviceParameters[param.key];
            return (
              <div
                key={param.key}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-800/80 mt-0.5 shrink-0">
                    {param.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      {tr(param.titleFr, param.titleEn)}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {tr(param.descFr, param.descEn)}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleRealParameter(param.key, !isEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
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
