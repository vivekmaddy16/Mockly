'use client';

import React, { useState } from 'react';
import { X, LogOut, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ExperienceLevel } from '@/types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Web Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    (user?.experienceLevel as ExperienceLevel) || 'Mid-Level (2-4 yrs)'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({ name, targetRole, experienceLevel });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="relative w-full max-w-md modal-card-castrio p-8 space-y-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-charcoal">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-charcoal/10 pb-5">
          <div className="w-14 h-14 rounded-full bg-charcoal text-cream font-display font-black text-xl flex items-center justify-center shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-charcoal">{user.name}</h3>
            <p className="text-xs font-bold text-charcoal/60">{user.email}</p>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-extrabold text-charcoal mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-castrio !pl-4" />
          </div>

          <div>
            <label className="block font-extrabold text-charcoal mb-1.5">Default Target Role</label>
            <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="input-castrio !pl-4" />
          </div>

          <div>
            <label className="block font-extrabold text-charcoal mb-1.5">Experience Seniority</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-full text-charcoal text-xs font-bold outline-none"
            >
              <option value="Entry-Level / Junior">Entry-Level / Junior</option>
              <option value="Mid-Level (2-4 yrs)">Mid-Level (2-4 yrs)</option>
              <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
              <option value="Lead / Architect">Lead / Architect</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => { logout(); onClose(); }}
              className="px-5 py-3 rounded-full border border-coral/20 bg-coral/10 text-coral hover:bg-coral/20 font-bold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-full bg-charcoal text-cream hover:bg-charcoal-light font-bold flex items-center gap-2 transition shadow-lg"
            >
              {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
