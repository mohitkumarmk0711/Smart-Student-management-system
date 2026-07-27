import React from 'react';

export default function StatCard({ title, value, icon: Icon, tone = 'ink' }) {
  const toneClasses = tone === 'gold'
    ? 'bg-gold-500 text-ink-950'
    : 'bg-ink-900 text-gold-400';

  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-900/50">{title}</p>
        <h3 className="text-2xl font-display font-semibold text-ink-950 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${toneClasses}`}>
        <Icon className="text-xl" />
      </div>
    </div>
  );
}
