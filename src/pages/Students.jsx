import React, { useState, useEffect } from 'react';
import { LuPlus, LuTrash2, LuUsers } from 'react-icons/lu';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { listDocs, createDoc, deleteDocById } from '../services/firestoreService';

const DEPARTMENTS = ['Computer Science', 'Information Tech', 'Electronics', 'Mechanical', 'Commerce'];

export default function Students() {
  const { userRole } = useAuth();
  const canEdit = userRole === 'admin' || userRole === 'teacher';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await listDocs('students');
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !roll) return;
    setSaving(true);
    try {
      await createDoc('students', { fullName: name, rollNumber: roll, department: dept });
      setName(''); setRoll('');
      fetchStudents();
    } catch (err) {
      console.error('Failed to add student:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student record?')) return;
    try {
      await deleteDocById('students', id);
      fetchStudents();
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  return (
    <DashboardLayout title="Students">
      <div className="space-y-6">
        {canEdit && (
          <form onSubmit={handleAdd} className="card p-4 flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-ink-900/50 mb-1">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" className="input-field" required />
            </div>
            <div className="w-40">
              <label className="block text-xs font-medium text-ink-900/50 mb-1">Roll number</label>
              <input value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="CS-014" className="input-field" required />
            </div>
            <div className="w-52">
              <label className="block text-xs font-medium text-ink-900/50 mb-1">Department</label>
              <select value={dept} onChange={(e) => setDept(e.target.value)} className="input-field">
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <LuPlus /> Add Student
            </button>
          </form>
        )}

        <div className="card overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-ink-900/50">Loading records…</p>
          ) : students.length === 0 ? (
            <div className="p-2">
              <EmptyState icon={LuUsers} title="No students yet" description="Add a student above to start building the directory." />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-950 text-paper">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Roll No</th>
                  <th className="p-3 font-medium">Department</th>
                  {canEdit && <th className="p-3 font-medium w-24">Action</th>}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-ink-900/8 last:border-0 hover:bg-paper/60">
                    <td className="p-3 font-medium text-ink-900">{s.fullName}</td>
                    <td className="p-3 text-ink-900/70">{s.rollNumber}</td>
                    <td className="p-3 text-ink-900/70">{s.department}</td>
                    {canEdit && (
                      <td className="p-3">
                        <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs font-medium">
                          <LuTrash2 /> Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
