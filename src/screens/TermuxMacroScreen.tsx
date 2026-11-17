import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommandMacro } from '../types';
import { PredefinedScriptsSection } from '../components/PredefinedScriptsSection';
import { IA22SessionCard } from '../components/IA22SessionCard';
import { 
  Terminal, 
  Plus, 
  Search, 
  Star, 
  Play, 
  Edit3, 
  Trash2, 
  Phone, 
  HelpCircle, 
  Check, 
  X, 
  Code2, 
  Zap, 
  Server 
} from 'lucide-react';

export const TermuxMacroScreen: React.FC = () => {
  const {
    macros,
    saveMacro,
    updateMacro,
    deleteMacro,
    toggleFavoriteMacro,
    executeMacro,
    executeRawShellCommand,
    tr,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0); // 0: Macros, 1: Predefined Scripts, 2: S24 IA22
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [customShellInput, setCustomShellInput] = useState('');
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Dialog state
  const [showMacroModal, setShowMacroModal] = useState(false);
  const [editingMacro, setEditingMacro] = useState<CommandMacro | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<'RCLONE' | 'ADB' | 'TERMUX' | 'Z_GHOST'>('TERMUX');
  const [descriptionInput, setDescriptionInput] = useState('');

  const categories = [
    { key: 'ALL', label: 'Toutes' },
    { key: 'RCLONE', label: 'Rclone' },
    { key: 'TERMUX', label: 'Termux' },
    { key: 'ADB', label: 'ADB' },
    { key: 'Z_GHOST', label: 'Z_GHOST' }
  ];

  const filteredMacros = macros.filter(m => {
    const matchCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    if (!matchCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      m.name.toLowerCase().includes(q) ||
      m.commandText.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  const handleOpenCreate = () => {
    setEditingMacro(null);
    setNameInput('');
    setCommandInput('');
    setCategoryInput('TERMUX');
    setDescriptionInput('');
    setShowMacroModal(true);
  };

  const handleOpenEdit = (m: CommandMacro) => {
    setEditingMacro(m);
    setNameInput(m.name);
    setCommandInput(m.commandText);
    setCategoryInput(m.category);
    setDescriptionInput(m.description);
    setShowMacroModal(true);
  };

  const handleSaveMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !commandInput.trim()) {
      addToast("Veuillez renseigner un nom et une commande.", 'warning');
      return;
    }

    if (editingMacro) {
      updateMacro({
        ...editingMacro,
        name: nameInput.trim(),
        commandText: commandInput.trim(),
        category: categoryInput,
        description: descriptionInput.trim()
      });
    } else {
      saveMacro({
        name: nameInput.trim(),
        commandText: commandInput.trim(),
        category: categoryInput,
        description: descriptionInput.trim(),
        isFavorite: false,
        requiresRoot: false
      });
    }
    setShowMacroModal(false);
  };

  const handleRunRawShell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customShellInput.trim()) return;
    executeRawShellCommand(customShellInput.trim());
    setCustomShellInput('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Top Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {tr("Éditeur & Macro Shell Termux / ADB", "Termux / ADB Shell Macro Editor")}
              </h2>
              <p className="text-xs text-slate-400">
                {tr("Créez, éditez, sauvegardez et exécutez vos commandes shell", "Create, edit, save and execute your shell commands")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreate}
              data-testid="add_macro_button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{tr("Créer", "New")}</span>
            </button>
            <button
              onClick={() => setShowGuideModal(true)}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700"
              title="Guide Termux"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Phone Number Display Badge */}
        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
            <Phone className="w-3.5 h-3.5" />
            <span>Cible Téléphonie / Réveil Fido : +1 438-985-5041</span>
          </div>
          <span className="text-[10px] text-slate-400">Z_GHOST Trailer</span>
        </div>
      </div>

      {/* 2. Section Selector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab(0)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 0 ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tr("Macros Enregistrées", "Saved Macros")} ({macros.length})
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 1 ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tr("Scripts Prédéfinis", "Predefined Scripts")}
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 2 ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tr("Noeud S24 IA22", "S24 Node IA22")}
        </button>
      </div>

      {/* Tab 0: Saved Custom Macros */}
      {activeTab === 0 && (
        <div className="space-y-3">
          {/* Quick Ad-Hoc Shell Runner */}
          <form onSubmit={handleRunRawShell} className="flex gap-2">
            <div className="relative flex-1">
              <span className="text-emerald-500 font-mono text-xs absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <input
                type="text"
                placeholder="Exécuter une commande shell Termux directe..."
                value={customShellInput}
                onChange={(e) => setCustomShellInput(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0 border border-slate-700"
            >
              Envoyer
            </button>
          </form>

          {/* Filters & Search */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Macros List */}
          <div className="space-y-2">
            {filteredMacros.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Aucune macro trouvée pour cette sélection.
              </div>
            ) : (
              filteredMacros.map(macro => (
                <div
                  key={macro.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-100">{macro.name}</h4>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-400">
                          {macro.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{macro.description}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavoriteMacro(macro.id)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                      >
                        <Star className={`w-3.5 h-3.5 ${macro.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(macro)}
                        className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMacro(macro.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="truncate">{macro.commandText}</span>
                    <button
                      onClick={() => executeMacro(macro)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 cursor-pointer shrink-0"
                    >
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>Exécuter</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 1: Predefined Scripts Catalog */}
      {activeTab === 1 && (
        <PredefinedScriptsSection />
      )}

      {/* Tab 2: S24 Node & IA22 Session */}
      {activeTab === 2 && (
        <IA22SessionCard />
      )}

      {/* Create / Edit Macro Modal */}
      {showMacroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveMacro}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                {editingMacro ? "Modifier la Macro" : "Créer une Macro"}
              </h3>
              <button
                type="button"
                onClick={() => setShowMacroModal(false)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nom de la macro :</label>
                <input
                  type="text"
                  placeholder="Ex: Sync Ghost Vocal to Drive"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Catégorie :</label>
                <select
                  value={categoryInput}
                  onChange={(e: any) => setCategoryInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="TERMUX">TERMUX</option>
                  <option value="RCLONE">RCLONE</option>
                  <option value="ADB">ADB</option>
                  <option value="Z_GHOST">Z_GHOST</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Commande Shell :</label>
                <textarea
                  rows={3}
                  placeholder="rclone copy ... ou termux-..."
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description :</label>
                <input
                  type="text"
                  placeholder="Description concise du fonctionnement"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowMacroModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guide Dialog */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                Guide des Macros & Intents Termux
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                L'API RUN_COMMAND de Termux permet de déclencher des commandes shell en tâche de fond ou en session interactive depuis Audio Sync Hub.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
                <li>Package ciblé : com.termux</li>
                <li>Action Intent : com.termux.RUN_COMMAND</li>
                <li>Permission requise : com.termux.permission.RUN_COMMAND</li>
                <li>Chemin binaire par défaut : /data/data/com.termux/files/usr/bin/bash</li>
              </ul>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
