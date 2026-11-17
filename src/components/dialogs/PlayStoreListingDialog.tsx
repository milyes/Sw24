import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShoppingBag, Copy, Check, ShieldCheck } from 'lucide-react';

interface PlayStoreListingDialogProps {
  onClose: () => void;
}

export const PlayStoreListingDialog: React.FC<PlayStoreListingDialogProps> = ({ onClose }) => {
  const { tr, addToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const listingTitle = "Audio Sync Hub - Z-CORE Voice & Drive Sync";
  const packageName = "com.aistudio.audiosynchub.dbcdca";
  const shortDescription = "Enregistreur vocal HD avec synchronisation auto Google Drive/rclone & macros Termux.";
  const fullDescription = `Audio Sync Hub Z-CORE est une solution complète d'enregistrement vocal et de synchronisation multi-cloud.

FONCTIONNALITÉS CLÉS:
• Enregistrement audio HD avec visualiseur de forme d'onde en temps réel et détection de silence VAD (pause auto 5s).
• Synchronisation automatique Google Drive & rclone CLI via service arrière-plan sécurisé.
• Gestionnaire de macros et d'intents de commandes Termux / Z_GHOST / ADB.
• Analyseur vocal IA propulsé par Google Gemini Studio.
• Répertoire de contacts & destinataires avec import CSV Google Contacts.
• Lecteur de flux direct BEIN 1 HF / HLS m3u8 intégré.
• Mode de sélection en masse pour les transferts cloud volumineux.

Version: 1.0.0
Package: ${packageName}
Cible SDK: 36 (Android 15 / 16 Ready)
Développeur: Z-CORE Infrastructure (M.I. ZOUBIROU)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${listingTitle}\n\n${shortDescription}\n\n${fullDescription}`);
    setCopied(true);
    addToast(tr("Fiche Play Store copiée dans le presse-papier !", "Play Store listing copied to clipboard!"), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        data-testid="play_store_listing_dialog"
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Google Play Store Listing</h2>
              <p className="text-xs text-slate-400 font-mono">{packageName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Badge Ribbon */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              v1.0.0 Stable
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              Target SDK 36
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Certifié Z-CORE
            </span>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Titre de l'application :</label>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-100">
              {listingTitle}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Description courte (80 caractères) :</label>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              {shortDescription}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Description complète :</label>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-line font-sans leading-relaxed">
              {fullDescription}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copié !" : "Copier la fiche"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
