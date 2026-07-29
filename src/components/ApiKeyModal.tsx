'use client';

import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '@/lib/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = getStoredApiKey();
      setHasKey(!!existing);
      setKey(existing || '');
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (key.trim()) {
      setStoredApiKey(key.trim());
      setSaved(true);
      setHasKey(true);
      onSaved();
      setTimeout(onClose, 1000);
    }
  };

  const handleClear = () => {
    setStoredApiKey('');
    setKey('');
    setHasKey(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-md modal-card-castrio p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-charcoal text-cream flex items-center justify-center font-bold shadow-md">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-charcoal">Gemini API Key</h2>
            <p className="text-xs font-bold text-charcoal/60">Optional — enables live AI generation</p>
          </div>
        </div>

        {saved && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> API key saved successfully!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-charcoal mb-1.5">API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIza..."
              className="input-castrio !pl-4"
            />
          </div>

          <p className="text-xs font-bold text-charcoal/60 leading-relaxed">
            Get a free API key from{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline inline-flex items-center gap-0.5">
              Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>.
            Stored locally in browser only.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button onClick={handleSave} disabled={!key.trim()} className="w-full py-3.5 rounded-full bg-charcoal text-cream font-bold text-sm hover:bg-charcoal-light transition shadow-lg disabled:opacity-50">
              Save API Key
            </button>
            {hasKey && (
              <button onClick={handleClear} className="px-5 py-3.5 rounded-full text-xs font-bold text-coral border border-coral/20 hover:bg-coral/10 transition">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
