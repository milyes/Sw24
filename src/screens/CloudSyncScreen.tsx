import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NetsecureProLicenseCard } from '../components/NetsecureProLicenseCard';
import { SyncProgressDashboard } from '../components/SyncProgressDashboard';
import { 
  Cloud,
  CloudUpload, 
  AlertCircle, 
  Zap, 
  Sliders, 
  User, 
  Key, 
  Terminal, 
  Play, 
  RefreshCw, 
  HardDrive, 
  FolderArchive, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const CloudSyncScreen: React.FC = () => {
  const {
    recordings,
    syncLogs,
    isSyncingActive,
    syncProgressPercent,
    activeSyncCommand,
    isAutoSyncEnabled,
    toggleAutoSync,
    rcloneSyncConfig,
    updateRcloneConfig,
    syncRecordingToGoogleDrive,
    uploadAudioFileToGoogleDrive,
    runCustomRcloneCommand,
    triggerBackgroundSyncNow,
    userGoogleAccountEmail,
    googleAccountDisplayName,
    isGoogleAccountConnected,
    remoteDriveFiles,
    isFetchingDriveFiles,
    fetchRemoteDriveFiles,
    deleteRemoteDriveFile,
    activateAllRealModeParameters,
    setShowRealModeDialog,
    setTab,
    appLanguage,
    tr
  } = useApp();

  const isFr = appLanguage === 'FR';

  const [filterMode, setFilterMode] = useState<'ALL' | 'UNSYNCED' | 'SYNCED'>('ALL');
  const [customCommandInput, setCustomCommandInput] = useState(
    'rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/Z-CORE/Captures/'
  );

  // Stats
  const totalFiles = recordings.length;
  const totalSizeMb = recordings.reduce((acc, r) => acc + r.fileSizeMb, 0).toFixed(1);
  const syncedCount = recordings.filter(r => r.isSynced || r.syncStatus === 'CLOUD_SYNCED').length;
  const pendingCount = recordings.filter(r => !r.isSynced && r.syncStatus !== 'SYNCING' && r.syncStatus !== 'SYNC_FAILED').length;
  const failedCount = recordings.filter(r => r.syncStatus === 'SYNC_FAILED' || r.syncStatus === 'ERROR').length;

  const filteredRecordings = recordings.filter(r => {
    if (filterMode === 'UNSYNCED') return !r.isSynced && r.syncStatus !== 'CLOUD_SYNCED';
    if (filterMode === 'SYNCED') return r.isSynced || r.syncStatus === 'CLOUD_SYNCED';
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Storage & Sync Metrics Summary */}
      <div 
        data-testid="sync_dashboard_summary"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
      >
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Stockage Total</span>
          <span className="text-lg font-bold text-slate-100 font-mono mt-0.5 block">{totalSizeMb} MB</span>
          <span className="text-[10px] text-slate-500 font-mono">{totalFiles} fichiers</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Synchronisés</span>
          <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block">{syncedCount}</span>
          <span className="text-[10px] text-emerald-500/80 font-mono">Google Drive OK</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">En Attente</span>
          <span className="text-lg font-bold text-amber-400 font-mono mt-0.5 block">{pendingCount}</span>
          <span className="text-[10px] text-amber-500/80 font-mono">Local Only</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Erreurs</span>
          <span className={`text-lg font-bold font-mono mt-0.5 block ${failedCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {failedCount}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">À retester</span>
        </div>
      </div>

      {/* 2. Real Hardware & Execution Mode Master Banner */}
      <div 
        data-testid="real_mode_master_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-lg space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5 fill-emerald-400 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {isFr ? "Mode Réel Matériel (Live)" : "Real Hardware Mode (Live)"}
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  100% ACTIF
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFr ? "Micro direct, Rclone sans simulation, OAuth2 & Auto-Sync" : "Direct mic, non-simulation Rclone, OAuth2 & Auto-Sync"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={activateAllRealModeParameters}
            data-testid="banner_activate_all_real_btn"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{isFr ? "Activer Tous Paramètres" : "Activate All Parameters"}</span>
          </button>

          <button
            onClick={() => setShowRealModeDialog(true)}
            data-testid="banner_details_real_mode_btn"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
          >
            <Sliders className="w-4 h-4" />
            <span>{isFr ? "Paramètres" : "Settings"}</span>
          </button>
        </div>
      </div>

      {/* 3. Official NETSECUREPRO License */}
      <NetsecureProLicenseCard />

      {/* 4. Google Account Card */}
      <div 
        data-testid="google_account_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">{googleAccountDisplayName}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  CONNECTÉ
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{userGoogleAccountEmail}</p>
            </div>
          </div>

          <button
            onClick={() => runCustomRcloneCommand("rclone lsd gdrive:")}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700 shrink-0"
          >
            Tester Accès Drive
          </button>
        </div>
      </div>

      {/* 5. Google Drive Remote File Manager */}
      <div 
        data-testid="gdrive_file_manager_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Fichiers Distants sur Google Drive
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Dossier distant: {rcloneSyncConfig.remotePath}
              </p>
            </div>
          </div>

          <button
            onClick={fetchRemoteDriveFiles}
            disabled={isFetchingDriveFiles}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
            title="Rafraîchir les fichiers distants"
          >
            <RefreshCw className={`w-4 h-4 ${isFetchingDriveFiles ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        <div className="space-y-2">
          {remoteDriveFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="font-bold text-slate-200 block truncate">{file.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{file.size} • {file.updated}</span>
              </div>
              <button
                onClick={() => deleteRemoteDriveFile(file.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Supprimer du Drive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Recharts Visual 30-Day Success vs Failures Telemetry */}
      <SyncProgressDashboard syncLogs={syncLogs} isFr={isFr} />

      {/* 7. Cloud Sync Engine Master & Auto-Sync Switch */}
      <div 
        data-testid="cloud_status_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Moteur de Synchronisation Google Drive
              </h3>
              <p className="text-xs text-slate-400">
                Bridge Cloud RClone & Termux (Z-CORE)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
              Auto-Sync :
            </span>
            <button
              onClick={() => toggleAutoSync(!isAutoSyncEnabled)}
              data-testid="auto_sync_switch"
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isAutoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  isAutoSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={triggerBackgroundSyncNow}
          data-testid="bg_sync_trigger_btn"
          className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncingActive ? 'animate-spin' : ''}`} />
          <span>
            {pendingCount > 0 ? `Synchroniser Tout (${pendingCount})` : "Lancer Sync Arrière-Plan"}
          </span>
        </button>

        {/* Sync Progress Bar */}
        {isSyncingActive && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
              <span>Transfert Rclone en cours...</span>
              <span>{syncProgressPercent}%</span>
            </div>
            <div 
              data-testid="sync_progress_bar"
              className="w-full h-2 rounded-full bg-slate-800 overflow-hidden"
            >
              <div
                style={{ width: `${syncProgressPercent}%` }}
                className="h-full bg-emerald-500 transition-all duration-200"
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {activeSyncCommand}
            </p>
          </div>
        )}
      </div>

      {/* 8. Rclone Service Configuration Card */}
      <div 
        data-testid="rclone_config_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Paramètres du Service Rclone
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">rclone.conf</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 block font-medium">Remote Google Drive :</label>
            <input
              type="text"
              value={rcloneSyncConfig.remoteName}
              onChange={(e) => updateRcloneConfig({ ...rcloneSyncConfig, remoteName: e.target.value })}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 block font-medium">Dossier Distant :</label>
            <input
              type="text"
              value={rcloneSyncConfig.remotePath}
              onChange={(e) => updateRcloneConfig({ ...rcloneSyncConfig, remotePath: e.target.value })}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 block font-medium">Limite Débit (Bwlimit) :</label>
            <input
              type="text"
              value={rcloneSyncConfig.bandwidthLimit}
              onChange={(e) => updateRcloneConfig({ ...rcloneSyncConfig, bandwidthLimit: e.target.value })}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 block font-medium">Nombre de Retries :</label>
            <input
              type="number"
              value={rcloneSyncConfig.maxRetries}
              onChange={(e) => updateRcloneConfig({ ...rcloneSyncConfig, maxRetries: parseInt(e.target.value, 10) || 3 })}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 9. Local Audio File Sync Table with Filters */}
      <div 
        data-testid="file_sync_dashboard_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Tableau des Fichiers Audio Local
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredRecordings.length} élément(s)
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterMode('ALL')}
            data-testid="sync_filter_chip_all"
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'ALL'
                ? 'bg-slate-700 text-slate-100 border border-slate-600'
                : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            Tous ({totalFiles})
          </button>
          <button
            onClick={() => setFilterMode('UNSYNCED')}
            data-testid="sync_filter_chip_unsynced"
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'UNSYNCED'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            Non Synchro ({pendingCount})
          </button>
          <button
            onClick={() => setFilterMode('SYNCED')}
            data-testid="sync_filter_chip_synced"
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'SYNCED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            Drive Synchro ({syncedCount})
          </button>
        </div>

        {/* Files List */}
        <div className="space-y-2">
          {filteredRecordings.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              Aucun fichier ne correspond à ce filtre.
            </p>
          ) : (
            filteredRecordings.map(rec => (
              <div
                key={rec.id}
                data-testid={`sync_file_item_${rec.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 truncate">{rec.title}</span>
                    {rec.isSynced ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Drive Synchro
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Local Only
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block truncate">
                    {rec.fileName} • {rec.durationSeconds}s • {rec.fileSizeMb} MB
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!rec.isSynced && (
                    <button
                      onClick={() => syncRecordingToGoogleDrive(rec)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                    >
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>Sync</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 10. CLI Command Console */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Console Commandes RClone & Termux
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={customCommandInput}
            onChange={(e) => setCustomCommandInput(e.target.value)}
            data-testid="rclone_command_input"
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomCommandInput("rclone copy ./storage/ gdrive:/Z-CORE/Captures/ --progress")}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-mono hover:bg-slate-700 cursor-pointer"
            >
              rclone copy
            </button>
            <button
              onClick={() => setCustomCommandInput("rclone sync ./storage/ gdrive:/Z-CORE/Captures/ --delete-after")}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-mono hover:bg-slate-700 cursor-pointer"
            >
              rclone sync
            </button>
            <button
              onClick={() => runCustomRcloneCommand(customCommandInput)}
              disabled={isSyncingActive}
              data-testid="execute_rclone_btn"
              className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Exécuter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 11. Recent Cloud Transfer Logs */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">
            Historique des Transferts Cloud
          </h3>
          <button
            onClick={triggerBackgroundSyncNow}
            className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {syncLogs.slice(0, 8).map(log => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <span className="font-mono text-slate-200 block truncate">{log.commandExecuted}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {log.bytesTransferred} • {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
