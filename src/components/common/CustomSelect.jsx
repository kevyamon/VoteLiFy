import React, { useState } from 'react';
import { Modal } from './Modal.jsx';
import { ChevronDown, Check, Search } from 'lucide-react';

/**
 * Composant CustomSelect : remplace les éléments <select> natifs du navigateur
 * par une interface sur-mesure conforme au design system VoteLiFy.
 * Évite l'ouverture des popups radio brutes du système d'exploitation mobile.
 */
export const CustomSelect = ({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  title = 'Sélectionner une option',
  icon: Icon,
  disabled = false,
  isMulti = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Résolution du libellé de l'option actuellement sélectionnée
  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayText = isMulti
    ? Array.isArray(value) && value.length > 0
      ? `${value.length} sélectionné(s)`
      : placeholder
    : selectedOption?.label || placeholder;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (optValue) => {
    if (isMulti) {
      const currentList = Array.isArray(value) ? value : [];
      const exists = currentList.includes(optValue);
      const updated = exists
        ? currentList.filter((v) => v !== optValue)
        : [...currentList, optValue];
      onChange(updated);
    } else {
      onChange(optValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const isSelected = (optValue) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(optValue);
    }
    return String(value) === String(optValue);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton déclencheur élégant avec design VoteLiFy */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(true)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-surface-base border border-surface-border rounded-xl text-xs sm:text-sm font-medium text-left transition-all ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-slate-400 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 cursor-pointer'
        } ${value ? 'text-content-title font-semibold' : 'text-content-muted'}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />}
          <span className="truncate">{displayText}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>

      {/* Modale de sélection sur-mesure */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchTerm('');
        }}
        title={title}
        maxWidth="max-w-md"
      >
        <div className="space-y-3">
          {/* Recherche si plus de 5 options */}
          {options.length > 5 && (
            <div className="relative mb-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrer les options..."
                className="w-full pl-9 pr-3 py-2 bg-surface-base border border-surface-border rounded-xl text-xs focus:border-brand-red focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          )}

          {/* Liste tactile d'options */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto no-scrollbar py-1">
            {filteredOptions.length === 0 ? (
              <p className="text-center py-6 text-xs text-content-muted">
                Aucune option disponible.
              </p>
            ) : (
              filteredOptions.map((opt) => {
                const active = isSelected(opt.value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs sm:text-sm transition-all border ${
                      active
                        ? 'border-brand-red bg-red-50/60 text-brand-red font-bold shadow-xs'
                        : 'border-surface-border/60 hover:border-surface-border hover:bg-surface-subtle text-content-body'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                          active
                            ? 'border-brand-red bg-brand-red text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {opt.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-subtle text-content-muted">
                        {opt.badge}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Bouton de confirmation en mode multi-sélection */}
          {isMulti && (
            <div className="pt-3 border-t border-surface-border flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red/90 transition-all"
              >
                Valider ({Array.isArray(value) ? value.length : 0})
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
