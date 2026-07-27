import React from 'react';
import { LuSearch, LuBell } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title = 'Overview' }) {
  const { userProfile, currentUser } = useAuth();
  const displayName = userProfile?.fullName || currentUser?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 shrink-0 bg-white border-b border-ink-900/8 flex items-center justify-between px-6">
      <div>
        <h1 className="font-display text-xl text-ink-950">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-paper px-3 py-2 rounded-md border border-ink-900/8 w-64">
          <LuSearch className="text-ink-900/40 text-sm" />
          <input
            type="text"
            placeholder="Search records..."
            className="bg-transparent text-sm flex-1 outline-none placeholder:text-ink-900/40"
          />
        </div>
        <button className="p-2 rounded-md hover:bg-paper text-ink-900/60 relative">
          <LuBell className="text-lg" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-ink-900/10">
          <div className="w-8 h-8 rounded-full bg-ink-900 text-gold-400 flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <span className="text-sm font-medium text-ink-900 capitalize hidden sm:inline">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
}
