import React from 'react';
import { Link } from 'react-router-dom';
import { LuShieldAlert } from 'react-icons/lu';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-center px-4">
      <LuShieldAlert className="text-5xl text-gold-500 mb-4" />
      <h1 className="font-display text-2xl text-ink-950 mb-2">Access restricted</h1>
      <p className="text-ink-900/55 max-w-sm mb-6">
        Your account role doesn't have permission to view this page. Contact an admin if you believe this is a mistake.
      </p>
      <Link to="/dashboard" className="btn-primary">Back to dashboard</Link>
    </div>
  );
}
