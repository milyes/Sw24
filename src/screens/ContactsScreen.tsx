import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Contact } from '../types';
import { 
  Contact2, 
  Search, 
  Star, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Plus, 
  Upload, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  X, 
  MapPin, 
  Mail, 
  Check 
} from 'lucide-react';

export const ContactsScreen: React.FC = () => {
  const {
    contacts,
    contactsSearchQuery,
    setContactsSearchQuery,
    filterStarredOnly,
    toggleFilterStarredOnly,
    addContact,
    updateContact,
    deleteContact,
    toggleContactStarred,
    importContactsFromCsv,
    restoreDefaultContact,
    tr,
    addToast
  } = useApp();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCsvDialog, setShowCsvDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [csvContent, setCsvContent] = useState('');

  const filteredContacts = contacts.filter(contact => {
    const matchesStarred = !filterStarredOnly || contact.isStarred;
    if (!matchesStarred) return false;
    if (!contactsSearchQuery.trim()) return true;

    const q = contactsSearchQuery.toLowerCase().trim();
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      contact.organization.toLowerCase().includes(q) ||
      contact.phoneNumber.includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.city.toLowerCase().includes(q) ||
      contact.notes.toLowerCase().includes(q)
    );
  });

  const getInitials = (contact: Contact) => {
    const name = `${contact.firstName} ${contact.lastName}`.trim() || contact.organization || contact.phoneNumber;
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'CT';
  };

  const handleOpenAdd = () => {
    setFirstName('');
    setLastName('');
    setOrganization('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setNotes('');
    setShowAddDialog(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setOrganization(contact.organization);
    setPhoneNumber(contact.phoneNumber);
    setEmail(contact.email);
    setAddress(contact.addressFormatted);
    setNotes(contact.notes);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName && !lastName && !organization && !phoneNumber) {
      addToast(tr("Veuillez saisir un nom ou un numéro.", "Please enter a name or phone number."), 'warning');
      return;
    }

    if (editingContact) {
      updateContact({
        ...editingContact,
        firstName,
        lastName,
        organization,
        phoneNumber,
        email,
        addressFormatted: address,
        notes
      });
      setEditingContact(null);
    } else {
      addContact({
        firstName,
        lastName,
        organization,
        phoneNumber,
        phoneLabel: 'Mobile',
        email,
        addressFormatted: address,
        street: address,
        city: 'Saint-Leonard',
        region: 'QC',
        postalCode: '',
        country: 'Canada',
        extendedAddress: '',
        notes,
        profileUrl: notes.match(/https?:\/\/[^\s]+/)?.[0] || '',
        labels: '* myContacts',
        isStarred: false
      });
      setShowAddDialog(false);
    }
  };

  const handleImportCsv = () => {
    if (!csvContent.trim()) return;
    const count = importContactsFromCsv(csvContent);
    setShowCsvDialog(false);
    setCsvContent('');
  };

  return (
    <div className="space-y-4 pb-20" data-testid="contacts_screen">
      {/* 1. Header Card */}
      <div 
        data-testid="contacts_header_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Contact2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Contacts & Destinataires
              </h2>
              <p className="text-xs text-slate-400">
                Répertoire, partage vocal & liens CanadaPages
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 font-mono">
            {contacts.length}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleOpenAdd}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Contact</span>
          </button>

          <button
            onClick={() => setShowCsvDialog(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden xs:inline">Import CSV</span>
          </button>

          <button
            onClick={restoreDefaultContact}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            title="Restaurer Nesrin Ouis"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Search & Starred Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={contactsSearchQuery}
            onChange={(e) => setContactsSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, téléphone, ville..."
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
          {contactsSearchQuery && (
            <button
              onClick={() => setContactsSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={toggleFilterStarredOnly}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
            filterStarredOnly 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${filterStarredOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>Favoris</span>
        </button>
      </div>

      {/* 3. Contacts List */}
      <div className="space-y-3">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <Contact2 className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">Aucun contact trouvé.</p>
          </div>
        ) : (
          filteredContacts.map(contact => {
            const displayName = `${contact.firstName} ${contact.lastName}`.trim() || contact.organization || contact.phoneNumber;
            return (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Initials Avatar */}
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      {getInitials(contact)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-100">{displayName}</h3>
                        {contact.organization && contact.organization !== displayName && (
                          <span className="text-[11px] text-slate-400 font-medium">({contact.organization})</span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-400 font-mono">{contact.phoneNumber || 'Sans numéro'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleContactStarred(contact.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${contact.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(contact)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Address & CanadaPages Profile */}
                {(contact.addressFormatted || contact.profileUrl) && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                    {contact.addressFormatted && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{contact.addressFormatted}</span>
                      </div>
                    )}
                    {contact.profileUrl && (
                      <a
                        href={contact.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Profil CanadaPages.com</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Direct Telephony Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  {contact.phoneNumber && (
                    <>
                      <a
                        href={`tel:${contact.phoneNumber.replace(/\s+/g, '')}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500/25 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>
                      <a
                        href={`sms:${contact.phoneNumber.replace(/\s+/g, '')}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>SMS</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      {(showAddDialog || editingContact) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveContact}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                {editingContact ? "Modifier le Contact" : "Nouveau Contact"}
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddDialog(false); setEditingContact(null); }}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>
              <input
                type="text"
                placeholder="Organisation / Entreprise"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
              <input
                type="tel"
                placeholder="Numéro de téléphone (+1 438-985-5041)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono"
              />
              <input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
              <input
                type="text"
                placeholder="Adresse (ex: 4347 Rue De Venise Saint-Leonard QC)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
              <textarea
                placeholder="Notes ou lien CanadaPages..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => { setShowAddDialog(false); setEditingContact(null); }}
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

      {/* CSV Import Modal */}
      {showCsvDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                Importer depuis Google Contacts CSV
              </h3>
              <button
                onClick={() => setShowCsvDialog(false)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Collez le contenu textuel d'un export Google Contacts (format CSV standard avec colonnes First Name, Phone 1 - Value, etc.) :
            </p>
            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="First Name,Last Name,Phone 1 - Value,Organization Name&#10;Nesrin,Ouis,+1 438-985-5041,Nesrin Ouis"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 resize-none focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCsvDialog(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleImportCsv}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 cursor-pointer"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
