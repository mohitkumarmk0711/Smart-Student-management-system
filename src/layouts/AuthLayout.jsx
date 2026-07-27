import React from 'react';
import { LuBookMarked } from 'react-icons/lu';

export default function AuthLayout({ children, eyebrow, title, subtitle }) {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <LuBookMarked className="text-gold-400 text-2xl" />
          <span className="font-display text-xl text-paper">Smart Student Management</span>
        </div>
        <div className="card p-8">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.14em] text-gold-500 font-semibold mb-2">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-2xl text-ink-950 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-ink-900/55 mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
