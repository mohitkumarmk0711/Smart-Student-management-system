import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuLoaderCircle } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const ERROR_MESSAGES = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found for this email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Try again shortly.',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" title="Sign in to your account" subtitle="Enter your credentials to access your dashboard.">
      {error && (
        <div className="mb-4 px-3.5 py-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-900/70 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.edu"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-900/70 mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
          {loading && <LuLoaderCircle className="animate-spin" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-ink-900/55 text-center mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-ink-950 font-medium hover:text-gold-600">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
