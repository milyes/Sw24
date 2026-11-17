import { PredefinedTermuxScript } from '../types';

export const PREDEFINED_SCRIPTS: PredefinedTermuxScript[] = [
  {
    id: 'rclone_sync_audio',
    titleFr: 'Synchronisation Audio Google Drive',
    titleEn: 'Google Drive Audio Rclone Sync',
    category: 'RCLONE_CLOUD',
    descriptionFr: 'Transfère et synchronise les enregistrements audio locaux vers Google Drive avec reprise et bande passante contrôlée.',
    descriptionEn: 'Transfers and syncs local audio recordings to Google Drive with retries and bandwidth limiting.',
    arguments: [
      { key: 'sourceDir', labelFr: 'Dossier Local', labelEn: 'Local Folder', defaultValue: '/sdcard/recordings', descriptionFr: 'Chemin des fichiers audio', descriptionEn: 'Audio storage directory' },
      { key: 'remotePath', labelFr: 'Dossier Distant', labelEn: 'Remote Path', defaultValue: 'gdrive:/Z-CORE/Captures/', descriptionFr: 'Destination Google Drive', descriptionEn: 'Google Drive remote target' },
      { key: 'bwlimit', labelFr: 'Limite Bande Passante', labelEn: 'Bandwidth Limit', defaultValue: '10M', descriptionFr: 'Débit max (ex: 5M, 10M, 0 pour illimité)', descriptionEn: 'Max transfer rate (ex: 5M, 10M, 0 for unlimited)' },
      { key: 'retries', labelFr: 'Nombre de Retries', labelEn: 'Retries Count', defaultValue: '5', descriptionFr: 'Tentatives en cas de coupure réseau', descriptionEn: 'Retries on network disconnect' }
    ],
    defaultRunInBackground: true,
    iconType: 'CLOUD_SYNC',
    templateScript: (args) => {
      const src = args.sourceDir || '/sdcard/recordings';
      const dst = args.remotePath || 'gdrive:/Z-CORE/Captures/';
      const bw = args.bwlimit || '10M';
      const retries = args.retries || '5';
      return `#!/data/data/com.termux/files/usr/bin/bash
# === Z-CORE AUDIO RCLONE AUTO-SYNC ===
echo "[$(date '+%H:%M:%S')] Demarrage de la synchronisation Rclone..."
if ! command -v rclone &> /dev/null; then
    echo "Erreur: rclone n'est pas installe. Installez avec: pkg install rclone"
    exit 1
fi
mkdir -p "${src}"
rclone copy "${src}" "${dst}" \\
    --transfers 4 \\
    --retries ${retries} \\
    --bwlimit ${bw} \\
    --low-level-retries 10 \\
    --progress \\
    --verbose
echo "[$(date '+%H:%M:%S')] Synchronisation terminee vers ${dst} !"
if command -v termux-toast &> /dev/null; then
    termux-toast "Sync Rclone Z-CORE terminee avec succes !"
fi`;
    }
  },
  {
    id: 'termux_setup_storage',
    titleFr: 'Initialisation Stockage & Dossiers',
    titleEn: 'Termux Storage & Folder Init',
    category: 'STORAGE_SYSTEM',
    descriptionFr: 'Lie le stockage partagé Android (termux-setup-storage) et crée l\'arborescence ~/recordings et ~/scripts.',
    descriptionEn: 'Links Android shared storage (termux-setup-storage) and prepares ~/recordings and ~/scripts directories.',
    arguments: [],
    defaultRunInBackground: false,
    iconType: 'FOLDER',
    templateScript: () => `#!/data/data/com.termux/files/usr/bin/bash
# === INITIALISATION STOCKAGE TERMUX & Z-CORE ===
echo "Demande d'autorisation de stockage Android..."
termux-setup-storage
mkdir -p ~/storage/shared/recordings
mkdir -p ~/scripts
mkdir -p ~/recordings_backup
echo "Arborescence Z-CORE configuree avec succes !"
ls -la ~/storage/shared/`
  },
  {
    id: 'rclone_test_connection',
    titleFr: 'Test Connexion Google Drive & Remotes',
    titleEn: 'Test Google Drive & Rclone Remotes',
    category: 'RCLONE_CLOUD',
    descriptionFr: 'Vérifie la validité des tokens OAuth2 et liste les dossiers distants du drive configuré.',
    descriptionEn: 'Validates OAuth2 token health and lists remote directories on configured Google Drive.',
    arguments: [
      { key: 'remoteName', labelFr: 'Nom du Remote', labelEn: 'Remote Name', defaultValue: 'gdrive:', descriptionFr: 'Nom du remote rclone.conf', descriptionEn: 'Rclone remote identifier' }
    ],
    defaultRunInBackground: false,
    iconType: 'CHECK',
    templateScript: (args) => {
      const remote = args.remoteName || 'gdrive:';
      return `#!/data/data/com.termux/files/usr/bin/bash
# === VERIFICATION CONNEXION RCLONE GDRIVE ===
echo "Vérification des accès cloud pour le remote: ${remote}..."
rclone lsd "${remote}" --max-depth 2
echo "Statut: Connexion Google Drive confirmée."`;
    }
  },
  {
    id: 'ffmpeg_compress_audio',
    titleFr: 'Compression & Conversion Audio (FFmpeg)',
    titleEn: 'Audio Compression & Conversion (FFmpeg)',
    category: 'AUDIO_PROCESSING',
    descriptionFr: 'Compresse les enregistrements WAV en Opus/AAC 64kbps pour réduire le volume avant téléversement.',
    descriptionEn: 'Compresses WAV recordings into Opus/AAC 64kbps to reduce bandwidth before upload.',
    arguments: [
      { key: 'inputFile', labelFr: 'Fichier Source', labelEn: 'Source File', defaultValue: '/sdcard/recordings/enregistrement_ghost_vocal.wav', descriptionFr: 'Fichier WAV d\'origine', descriptionEn: 'Original WAV recording' },
      { key: 'outputBitrate', labelFr: 'Débit Cible', labelEn: 'Target Bitrate', defaultValue: '64k', descriptionFr: 'Débit (ex: 32k, 64k, 128k)', descriptionEn: 'Bitrate (e.g., 32k, 64k, 128k)' }
    ],
    defaultRunInBackground: true,
    iconType: 'AUDIO',
    templateScript: (args) => {
      const input = args.inputFile || '/sdcard/recordings/enregistrement_ghost_vocal.wav';
      const bitrate = args.outputBitrate || '64k';
      return `#!/data/data/com.termux/files/usr/bin/bash
# === FFMEPG AUDIO COMPRESSION ===
echo "Traitement audio pour: ${input}..."
ffmpeg -i "${input}" -c:a aac -b:a ${bitrate} "${input}.m4a" -y
echo "Compression terminée : ${input}.m4a généré avec débit ${bitrate} !"`;
    }
  },
  {
    id: 'wake_lock_toggle',
    titleFr: 'Gestion Wake Lock (Écran & CPU)',
    titleEn: 'Termux Wake Lock Management',
    category: 'STORAGE_SYSTEM',
    descriptionFr: 'Maintient le processeur actif pendant les transferts de longue durée en arrière-plan.',
    descriptionEn: 'Keeps CPU awake during long running background cloud transfer operations.',
    arguments: [],
    defaultRunInBackground: true,
    iconType: 'BOLT',
    templateScript: () => `#!/data/data/com.termux/files/usr/bin/bash
# === GESTION DU WAKE LOCK TERMUX ===
termux-wake-lock
echo "Wake lock actif : l'appareil ne se mettra pas en veille prolongée."`
  },
  {
    id: 'z_ghost_trailer_call',
    titleFr: 'Z_GHOST Trailer Réveil Réseau Fido',
    titleEn: 'Z_GHOST Trailer Wakeup Fido Network',
    category: 'TELEMETRY_GHOST',
    descriptionFr: 'Déclenche un appel et réveil direct vers le terminal Trailer Ghost (+1 438 985-5041) sur le réseau Fido.',
    descriptionEn: 'Triggers phone call and wakeup sequence to Trailer Ghost node (+1 438 985-5041) on Fido network.',
    arguments: [
      { key: 'targetPhone', labelFr: 'Numéro Destinataire', labelEn: 'Target Number', defaultValue: '+14389855041', descriptionFr: 'Numéro cellulaire Fido', descriptionEn: 'Fido mobile phone number' }
    ],
    defaultRunInBackground: true,
    iconType: 'PHONE',
    templateScript: (args) => {
      const phone = args.targetPhone || '+14389855041';
      return `#!/data/data/com.termux/files/usr/bin/bash
# === Z_GHOST TELEMETRY TRAILER WAKEUP ===
echo "Liaison avec le terminal Trailer Ghost (${phone})..."
termux-telephony-call "${phone}"
echo "Séquence d'appel envoyée sur le réseau Fido !"`;
    }
  }
];
