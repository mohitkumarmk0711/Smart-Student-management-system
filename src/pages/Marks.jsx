import React, { useState, useEffect } from 'react';
import { LuPlus, LuGraduationCap } from 'react-icons/lu';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { listDocs, createDoc } from '../services/firestoreService';
import { scoreToGrade } from '../utils/gradeCalculator';

const GRADE_STYLES = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-sky-50 text-sky-700 border-sky-200',
  C: 'bg-amber-50 text-amber-700 border-amber-200',
  D: 'bg-orange-50 text-orange-700 border-orange-200',
  F: 'bg-red-50 text-red-700 border-red-200',
};

export default function Marks() {
  const { userRole } = useAuth();
  const canEdit = userRole === 'admin' || userRole === 'teacher';

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [studentList, markList] = await Promise.all([listDocs('students'), listDocs('marks')]);
      setStudents(studentList);
      setMarks(markList);
      if (studentList[0]) setStudentId((prev) => prev || studentList[0].id);
    } catch (err) {
      console.error('Failed to load marks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const studentName = (id) => students.find((s) => s.id === id)?.fullName || 'Unknown';

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!studentId || !subject || score === '') return;
    setSaving(true);
    try {
      await createDoc('marks', {
        studentId, subject, term,
        score: Number(score),
        grade: scoreToGrade(score),
      });
      setSubject(''); setScore('');
      load();
    } catch (err) {
      console.error('Failed to add marks:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Gradebook">
      <div className="space-y-6">
        {canEdit && (
          <form onSubmit={handleAdd} className="card p-4 flex gap-3 flex-wrap items-end">
            <div className="w-56">
              <label className="block text-xs font-medium text-ink-900/50 mb-1">Student</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="input-field">
                {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
            </div>
            <div className="w-40">
              <label className="block text-xs font-medium text-ink-900/50 mb-1">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mathematics" className="input-field" required />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-ink-900/50 mb-1">Score</label>
              <input type="number" min="0" max="100" value={score} onChange={(e) => setScore(e.target.value)} placeholder="0-100" className="input-field" required />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-ink-900/50 mb-1">Term</label>
              <select value={term} onChange={(e) => setTerm(e.target.value)} className="input-field">
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Final</option>
              </select>
            </div>
            <button type="submit" disabled={saving || !students.length} className="btn-primary flex items-center gap-2">
              <LuPlus /> Add Score
            </button>
          </form>
        )}

        <div className="card overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-ink-900/50">Loading gradebook…</p>
          ) : marks.length === 0 ? (
            <div className="p-2">
              <EmptyState icon={LuGraduationCap} title="No scores recorded" description="Entered scores will build a transcript view here." />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-950 text-paper">
                <tr>
                  <th className="p-3 font-medium">Student</th>
                  <th className="p-3 font-medium">Subject</th>
                  <th className="p-3 font-medium">Term</th>
                  <th className="p-3 font-medium">Score</th>
                  <th className="p-3 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m) => (
                  <tr key={m.id} className="border-b border-ink-900/8 last:border-0 hover:bg-paper/60">
                    <td className="p-3 font-medium text-ink-900">{studentName(m.studentId)}</td>
                    <td className="p-3 text-ink-900/70">{m.subject}</td>
                    <td className="p-3 text-ink-900/70">{m.term}</td>
                    <td className="p-3 text-ink-900/70">{m.score}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${GRADE_STYLES[m.grade] || ''}`}>
                        {m.grade}
                      </span>
                    </td>
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
