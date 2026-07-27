import React from 'react';

export default function EmptyState({ title, description, icon: Icon }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && <Icon className="text-3xl text-ink-900/25 mb-3" />}
      <p className="font-display text-lg text-ink-950">{title}</p>
      {description && <p className="text-sm text-ink-900/50 mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
