import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ChevronDown, ChevronUp, Award, ExternalLink, Lock } from 'lucide-react';

interface NetsecureProLicenseCardProps {
  isInitiallyExpanded?: boolean;
}

export const NetsecureProLicenseCard: React.FC<NetsecureProLicenseCardProps> = ({
  isInitiallyExpanded = false
}) => {
  const { tr } = useApp();
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  return (
    <div 
      data-testid="netsecurepro_license_card"
      className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-amber-500/35 shadow-lg shadow-amber-950/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mt-0.5">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-100 tracking-tight">
                NETSECUREPRO IA SIM & eSIM
              </h3>
              {/* French Flag Badge */}
              <div className="inline-flex items-center overflow-hidden rounded border border-slate-700 w-5 h-3.5">
                <div className="w-1/3 h-full bg-[#002654]"></div>
                <div className="w-1/3 h-full bg-white"></div>
                <div className="w-1/3 h-full bg-[#CE1126]"></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Licence Officielle • MILYES-IA V9 NANS CORE
            </p>
          </div>
        </div>

        {/* RGPD Badge & Expand Toggle */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            CONFORME RGPD
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px] font-mono">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
          <span className="text-slate-400 block text-[10px]">ID Licence:</span>
          <span className="text-amber-400 font-bold">NSP-S24-979V11</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
          <span className="text-slate-400 block text-[10px]">Opérateur:</span>
          <span className="text-slate-200 font-semibold truncate block">M.I. ZOUBIROU</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
          <span className="text-slate-400 block text-[10px]">Chiffrement:</span>
          <span className="text-emerald-400 font-semibold">AES-256 GCM</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
          <span className="text-slate-400 block text-[10px]">Statut:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ACTIF (S24)
          </span>
        </div>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            Certificat de conformité délivré pour le système d'infrastructure audio Z-CORE et de synchronisation multi-cloud rclone / Google Drive.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Empreinte SHA-256 :</span>
              <span className="text-slate-300 truncate max-w-[200px]">e8c840ca18a6e00ccee3a4...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Noeud Maître :</span>
              <span className="text-emerald-400">Samsung Galaxy S24 Ultra</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Autorité de Validation :</span>
              <span className="text-slate-200">MILYES-IA Corporation QC Canada</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
