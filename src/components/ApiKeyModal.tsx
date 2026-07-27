'use client';

import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
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
      <div className="relative w-full max-w-md modal-card p-7 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="icon-box icon-box-yellow">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Gemini API Key</h2>
            <p className="text-xs text-neutral-500">Optional — enables full AI features</p>
          </div>
        </div>

        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> API key saved successfully!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">API Key</label>
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIza..."
                className="input-dark"
              />
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Get a free API key from{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 inline-flex items-center gap-0.5">
              Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>.
            Your key is stored locally in the browser only.
          </p>

          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={!key.trim()} className="btn-yellow text-xs px-5 py-2.5 flex-1 disabled:opacity-50 disabled:pointer-events-none">
              Save API Key
            </button>
            {hasKey && (
              <button onClick={handleClear} className="px-5 py-2.5 rounded-full text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
