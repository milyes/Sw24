import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { BottomNavBar } from './components/BottomNavBar';
import { ToastContainer } from './components/ToastContainer';
import { RecorderVaultScreen } from './screens/RecorderVaultScreen';
import { CloudSyncScreen } from './screens/CloudSyncScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { LiveStreamScreen } from './screens/LiveStreamScreen';
import { TermuxMacroScreen } from './screens/TermuxMacroScreen';
import { AiStudioScreen } from './screens/AiStudioScreen';
import { LoginScreen } from './screens/LoginScreen';

import { RealModeSettingsDialog } from './components/dialogs/RealModeSettingsDialog';
import { PlayStoreListingDialog } from './components/dialogs/PlayStoreListingDialog';
import { CameraCaptureDialog } from './components/dialogs/CameraCaptureDialog';
import { ThemePickerDialog } from './components/dialogs/ThemePickerDialog';

const MainLayout: React.FC = () => {
  const { 
    currentTab, 
    themeMode,
    showRealModeDialog, 
    setShowRealModeDialog,
    showPlayStoreDialog, 
    setShowPlayStoreDialog,
    showCameraDialog, 
    setShowCameraDialog,
    showThemeDialog, 
    setShowThemeDialog
  } = useApp();

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'RECORDER_VAULT':
        return <RecorderVaultScreen />;
      case 'CLOUD_SYNC':
        return <CloudSyncScreen />;
      case 'CONTACTS':
        return <ContactsScreen />;
      case 'LIVE_STREAM':
        return <LiveStreamScreen />;
      case 'TERMUX_MACROS':
        return <TermuxMacroScreen />;
      case 'AI_STUDIO':
        return <AiStudioScreen />;
      case 'LOGIN':
        return <LoginScreen />;
      default:
        return <RecorderVaultScreen />;
    }
  };

  const bgClass = themeMode === 'OLED' 
    ? 'bg-black text-slate-100' 
    : themeMode === 'LIGHT'
    ? 'bg-slate-100 text-slate-900'
    : 'bg-slate-950 text-slate-100';

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors duration-200`}>
      <TopBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        {renderActiveScreen()}
      </main>

      <BottomNavBar />
      <ToastContainer />

      {/* Global Modals */}
      {showRealModeDialog && (
        <RealModeSettingsDialog onClose={() => setShowRealModeDialog(false)} />
      )}
      {showPlayStoreDialog && (
        <PlayStoreListingDialog onClose={() => setShowPlayStoreDialog(false)} />
      )}
      {showCameraDialog && (
        <CameraCaptureDialog onClose={() => setShowCameraDialog(false)} />
      )}
      {showThemeDialog && (
        <ThemePickerDialog onClose={() => setShowThemeDialog(false)} />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
