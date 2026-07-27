import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuLoaderCircle } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, fullName, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use'
        ? 'An account already exists for this email.'
        : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Get started" title="Create your account" subtitle="Register to access the student portal.">
      {error && (
        <div className="mb-4 px-3.5 py-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-900/70 mb-1.5">Full name</label>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jordan Rivera" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-900/70 mb-1.5">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@institution.edu" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-900/70 mb-1.5">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-900/70 mb-1.5">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
          {loading && <LuLoaderCircle className="animate-spin" />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-ink-900/55 text-center mt-6">
        Already registered?{' '}
        <Link to="/login" className="text-ink-950 font-medium hover:text-gold-600">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
