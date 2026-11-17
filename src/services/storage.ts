import { AudioRecording, CommandMacro, Contact, SyncLog, RcloneSyncConfig, RealDeviceParameters, Ia22SessionState } from '../types';

export const DEFAULT_CONTACT_NESRIN: Contact = {
  id: 1,
  firstName: "Nesrin Ouis",
  lastName: "",
  organization: "Nesrin Ouis",
  phoneNumber: "+1 438-985-5041",
  phoneLabel: "Mobile",
  email: "",
  addressFormatted: "4347 Rue De Venise Saint-Leonard QC H1S1G2 Canada",
  street: "4347 Rue De Venise",
  city: "Saint-Leonard",
  region: "QC",
  postalCode: "H1S1G2",
  country: "Canada",
  extendedAddress: "Saint-Leonard",
  notes: "Here is the link to Nesrin Ouis profile on CanadaPages.com. https://www.canadapages.com/wp/nesrin-ouis-saintleonard-qc-4383809395/",
  profileUrl: "https://www.canadapages.com/wp/nesrin-ouis-saintleonard-qc-4383809395/",
  labels: "* myContacts ::: * starred",
  isStarred: true,
  createdAt: Date.now() - 86400000 * 5
};

export const INITIAL_RECORDINGS: AudioRecording[] = [
  {
    id: 1,
    title: "Flux WAY Vocal Capture",
    fileName: "enregistrement_ghost_vocal.wav",
    durationSeconds: 60,
    fileSizeMb: 10.4,
    localPath: "./storage/enregistrement_ghost_vocal.wav",
    cloudPath: "gdrive:/Z-CORE/Captures/enregistrement_ghost_vocal.wav",
    isSynced: false,
    syncStatus: "LOCAL_ONLY",
    sourceStream: "Flux WAY (Z-CORE)",
    timestamp: Date.now() - 3600000,
    transcription: "Capture vocale d'une minute issue du flux WAY. Écoutable et prêt pour transfert cloud vers gdrive:/Z-CORE/Captures/.",
    aiSummary: "Enregistrement vocal de 60s capturé en local sur l'instance Z-CORE. Prêt à être transféré via rclone vers Google Drive.",
    waveformData: "20,45,80,65,30,90,70,85,95,60,40,75,85,90,65,50,80,95,70,40"
  },
  {
    id: 2,
    title: "Archives Vocales 2023",
    fileName: "enregistrement2023-02-06 07-11-38.wav",
    durationSeconds: 185,
    fileSizeMb: 31.2,
    localPath: "./storage/archives/enregistrement2023-02-06.wav",
    cloudPath: "gdrive:/Archives/2023/enregistrement2023-02-06 07-11-38.wav",
    isSynced: true,
    syncStatus: "CLOUD_SYNCED",
    sourceStream: "Drive Archive",
    timestamp: Date.now() - 86400000 * 30,
    transcription: "Archive audio historique de février 2023 déjà présente sur le Google Drive principal.",
    aiSummary: "Fichier audio archivé de 3m05s. Sauvegarde confirmée sur le stockage cloud distant.",
    waveformData: "15,30,40,50,45,60,70,65,80,75,60,50,40,30,25,35,45,55,60,50"
  }
];

export const INITIAL_MACROS: CommandMacro[] = [
  {
    id: 1,
    name: "Sync Ghost Vocal to Drive",
    category: "RCLONE",
    commandText: "rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/Z-CORE/Captures/",
    description: "Copie chiffrée de l'enregistrement Z-CORE vers Google Drive.",
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 2,
    name: "Sync Root Drive Folder",
    category: "RCLONE",
    commandText: "rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/",
    description: "Envoie le fichier directement à la racine de Google Drive.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 3,
    name: "Setup Termux API Tools",
    category: "TERMUX",
    commandText: "pkg update && pkg install termux-api",
    description: "Installe les extensions Termux API pour gérer le matériel et l'affichage.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 4,
    name: "Acquire Wake Lock",
    category: "TERMUX",
    commandText: "termux-wake-lock",
    description: "Empêche l'écran de se mettre en veille pendant les transferts.",
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 5,
    name: "Release Wake Lock",
    category: "TERMUX",
    commandText: "termux-wake-unlock",
    description: "Permet à l'écran de se remettre en veille normalement.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 6,
    name: "ADB Wake Screen",
    category: "ADB",
    commandText: "adb shell input keyevent 26",
    description: "Simule l'appui sur le bouton d'alimentation pour réveiller le téléphone.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 7,
    name: "ADB Swipe Unlock",
    category: "ADB",
    commandText: "adb shell input swipe 500 1500 500 500 200",
    description: "Simule un glissement vers le haut pour afficher l'écran de déverrouillage.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 8,
    name: "Z_GHOST Trailer Wakeup (Fido)",
    category: "Z_GHOST",
    commandText: "mode Z_GHOST_TLE wakeup --target +14389855041 --network FIDO --trailer-ghost",
    description: "Commande de réveil à distance Z_GHOST Trailer via le réseau cellulaire Fido (+1 438 985-5041).",
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 9,
    name: "Appel Trailer Ghost (Réseau Fido)",
    category: "Z_GHOST",
    commandText: "termux-telephony-call +14389855041",
    description: "Déclenche un appel cellulaire direct vers le terminal Trailer Ghost sur le réseau Fido.",
    isFavorite: true,
    requiresRoot: false
  }
];

export function generateInitialSyncLogs(): SyncLog[] {
  const logs: SyncLog[] = [];
  const now = Date.now();
  const dayMillis = 86400000;

  const pattern = [
    [4, 0], [6, 1], [5, 0], [8, 0], [3, 1],
    [7, 0], [9, 1], [4, 0], [6, 0], [8, 1],
    [5, 0], [11, 1], [7, 0], [6, 0], [9, 2],
    [5, 0], [8, 0], [12, 1], [6, 0], [7, 1],
    [10, 0], [8, 0], [14, 1], [9, 0], [11, 1],
    [13, 0], [10, 1], [15, 0], [12, 1], [8, 0]
  ];

  let idCounter = 1;

  pattern.forEach(([successCount, failCount], index) => {
    const daysAgo = 29 - index;
    const baseTime = now - daysAgo * dayMillis;

    for (let s = 0; s < successCount; s++) {
      const timeOffset = s * 3600000 * 2 + ((s * 17) % 30) * 60000;
      const mbSize = (4.2 + ((s * 1.8) % 15.0)).toFixed(1);
      logs.push({
        id: idCounter++,
        recordingId: s % 2 === 0 ? 1 : 2,
        commandExecuted:
          s % 3 === 0
            ? "rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/Z-CORE/Captures/ --progress"
            : s % 3 === 1
            ? "rclone sync ./storage/ gdrive:/Z-CORE/Captures/ --fast-list"
            : "rclone copy ./storage/archives/ gdrive:/Archives/2026/ --checksum",
        status: "SUCCESS",
        progressPercent: 100,
        bytesTransferred: `${mbSize} MB`,
        timestamp: baseTime + timeOffset,
        errorMessage: null
      });
    }

    for (let f = 0; f < failCount; f++) {
      const timeOffset = (f + 3) * 3600000 * 3 + 15 * 60000;
      logs.push({
        id: idCounter++,
        recordingId: 1,
        commandExecuted: "rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/Z-CORE/Captures/",
        status: "FAILED",
        progressPercent: 35 + f * 15,
        bytesTransferred: "1.2 MB",
        timestamp: baseTime + timeOffset,
        errorMessage:
          f % 3 === 0
            ? "Erreur HTTP 504 Gateway Timeout (Réseau distant instable)"
            : f % 3 === 1
            ? "Jeton OAuth Google temporairement expiré (rafraîchissement automatique)"
            : "Connexion socket interrompue pendant l'upload"
      });
    }
  });

  return logs.sort((a, b) => b.timestamp - a.timestamp);
}

export const INITIAL_RCLONE_CONFIG: RcloneSyncConfig = {
  remoteName: "gdrive:",
  remotePath: "/Z-CORE/Captures/",
  dryRun: false,
  autoSyncEnabled: true,
  verboseLogging: true,
  maxRetries: 5,
  bandwidthLimit: "10M",
  syncOnWifiOnly: false
};

export const INITIAL_REAL_PARAMS: RealDeviceParameters = {
  realHardwareDac: true,
  realMicrophoneDirect: true,
  realSilenceVAD: true,
  realRcloneExecution: true,
  realGoogleAuthOAuth: true,
  realAutoCloudSync: true,
  realTermuxSocket: true,
  realExponentialRetry: true,
  realStorageAccess: true
};

export const INITIAL_IA22_SESSION: Ia22SessionState = {
  isSessionActive: true,
  masterNode: "S24",
  operatorName: "M.I. ZOUBIROU",
  lastBroadcastMessage: "Tunnel Cloudflare actif : retailers-mitchell-customs-rotation (979V11)",
  lastUpdatedTimestamp: Date.now(),
  isTunnelActive: true,
  tunnelUrl: "https://retailers-mitchell-customs-rotation.trycloudflare.com",
  tunnelStatus: "OPERATIONAL (QUIC 98% - 979V11 Montreal QC)",
  isRamCleaned: false,
  totalBroadcastCount: 1
};
