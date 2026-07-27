import React, { useState, useEffect } from 'react';
import { LuPlus, LuFileText, LuUpload, LuLoaderCircle, LuExternalLink } from 'react-icons/lu';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { listDocs, createDoc } from '../services/firestoreService';
import { uploadFile } from '../services/storageService';
import { formatDate } from '../utils/dateFormatter';

export default function Assignments() {
  const { userRole, currentUser } = useAuth();
  const isTeacherOrAdmin = userRole === 'admin' || userRole === 'teacher';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setAssignments(await listDocs('assignments'));
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== 'application/pdf') {
      setFormError('Only PDF files are accepted.');
      setFile(null);
      return;
    }
    setFormError('');
    setFile(selected || null);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    setSubmitting(true);
    setFormError('');
    try {
      let fileUrl = '';
      if (file) {
        fileUrl = await uploadFile(file, 'assignments', setProgress);
      }
      await createDoc('assignments', {
        title, description, dueDate, fileUrl,
        createdBy: currentUser?.uid || 'unknown',
      });
      setTitle(''); setDescription(''); setDueDate(''); setFile(null); setProgress(0);
      load();
    } catch (err) {
      setFormError(err.message || 'Failed to post assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Assignments">
      <div className="space-y-6">
        {isTeacherOrAdmin && (
          <form onSubmit={handlePost} className="card p-5 space-y-3">
            <h3 className="font-display text-lg text-ink-950">Post a new assignment</h3>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="input-field" required />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" required />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Instructions for students" className="input-field min-h-[80px]" />
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-ink-900/70 border border-dashed border-ink-900/25 rounded-md px-3 py-2 cursor-pointer hover:border-gold-500">
                <LuUpload /> {file ? file.name : 'Attach PDF guide (optional, max 5MB)'}
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
              </label>
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                {submitting ? <LuLoaderCircle className="animate-spin" /> : <LuPlus />}
                {submitting ? `Uploading ${Math.round(progress)}%` : 'Post Assignment'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-ink-900/50">Loading assignments…</p>
        ) : assignments.length === 0 ? (
          <EmptyState icon={LuFileText} title="No assignments posted" description="New assignments will appear here as a running list." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {assignments.map((a) => (
              <div key={a.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-display text-lg text-ink-950">{a.title}</h4>
                  <span className="text-xs shrink-0 px-2 py-1 rounded-full bg-paper border border-ink-900/10 text-ink-900/60">
                    Due {formatDate(a.dueDate)}
                  </span>
                </div>
                {a.description && <p className="text-sm text-ink-900/60 mt-2">{a.description}</p>}
                {a.fileUrl && (
                  <a href={a.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ink-950 font-medium mt-3 hover:text-gold-600">
                    <LuExternalLink /> View attached PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
