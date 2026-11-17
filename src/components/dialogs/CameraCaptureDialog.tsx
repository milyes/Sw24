import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, RefreshCw, Download, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface CameraCaptureDialogProps {
  onClose: () => void;
}

interface StoredPhoto {
  id: string;
  name: string;
  dataUrl: string;
  timestamp: string;
}

export const CameraCaptureDialog: React.FC<CameraCaptureDialogProps> = ({ onClose }) => {
  const { tr, addToast, triggerBackgroundSyncNow } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [streamActive, setStreamActive] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('capture_camera_zcore');
  const [photos, setPhotos] = useState<StoredPhoto[]>(() => {
    const saved = localStorage.getItem('ash_camera_photos');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ash_camera_photos', JSON.stringify(photos));
  }, [photos]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      addToast(tr("Impossible d'accéder à la caméra web, mode import actif", "Camera access denied, upload mode available"), 'warning');
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const cleanName = `${photoTitle.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.jpg`;
      const newPhoto: StoredPhoto = {
        id: Date.now().toString(),
        name: cleanName,
        dataUrl,
        timestamp: new Date().toLocaleTimeString('fr-FR')
      };

      setPhotos(prev => [newPhoto, ...prev]);
      setSelectedPreview(dataUrl);
      addToast(`Photo capturée : ${cleanName}`, 'success');

      // Auto sync trigger
      triggerBackgroundSyncNow();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newPhoto: StoredPhoto = {
          id: Date.now().toString(),
          name: file.name,
          dataUrl,
          timestamp: new Date().toLocaleTimeString('fr-FR')
        };
        setPhotos(prev => [newPhoto, ...prev]);
        setSelectedPreview(dataUrl);
        addToast(`Photo importée : ${file.name}`, 'success');
        triggerBackgroundSyncNow();
      };
      reader.readAsDataURL(file);
    }
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (selectedPreview) setSelectedPreview(null);
    addToast("Photo supprimée", 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div 
        data-testid="camera_capture_dialog"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">
              {tr("Capture Photo Caméra Z-CORE", "Z-CORE Camera Photo Capture")}
            </h2>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Live Viewport or Fallback Container */}
          <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {streamActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  {tr("Flux caméra inactif. Cliquez sur Démarrer ou importez un fichier image.", "Camera stream inactive. Click Start or import an image file.")}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                  >
                    {tr("Activer Caméra", "Start Camera")}
                  </button>
                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 cursor-pointer">
                    {tr("Importer Image", "Upload Image")}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Capture Controls */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              placeholder="Nom de la photo..."
              className="flex-1 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              onClick={takePhoto}
              disabled={!streamActive}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0 ${
                streamActive 
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{tr("Prendre Photo", "Snap Photo")}</span>
            </button>
          </div>

          {/* Gallery of Stored Photos */}
          {photos.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-300">
                {tr(`Photos Enregistrées (${photos.length}) :`, `Stored Photos (${photos.length}):`)}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPreview(p.dataUrl)}
                    className="group relative aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors"
                  >
                    <img src={p.dataUrl} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={p.dataUrl}
                        download={p.name}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-md bg-slate-800 text-slate-200 hover:text-emerald-400"
                        title="Télécharger"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto(p.id);
                        }}
                        className="p-1 rounded-md bg-slate-800 text-slate-200 hover:text-rose-400"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {tr("Fermer", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
};
