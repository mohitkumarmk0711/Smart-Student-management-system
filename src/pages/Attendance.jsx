import React, { useState, useEffect } from 'react';
import { LuCalendarCheck, LuCheck, LuX, LuClock } from 'react-icons/lu';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { listDocs, createDoc } from '../services/firestoreService';
import { formatDate, todayISO } from '../utils/dateFormatter';
import { computeAttendancePercentage } from '../utils/gradeCalculator';

const STATUS_STYLES = {
  present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  absent: 'bg-red-50 text-red-700 border-red-200',
  late: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function Attendance() {
  const { userRole } = useAuth();
  const canMark = userRole === 'admin' || userRole === 'teacher';

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentList, attendanceList] = await Promise.all([
        listDocs('students'),
        listDocs('attendance'),
      ]);
      setStudents(studentList);
      setRecords(attendanceList);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const markStatus = async (studentId, status) => {
    setSaving(true);
    try {
      await createDoc('attendance', { studentId, date, status });
      loadData();
    } catch (err) {
      console.error('Failed to mark attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  const todaysRecords = records.filter((r) => r.date === date);
  const overallPercentage = computeAttendancePercentage(records);

  return (
    <DashboardLayout title="Attendance">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-900/50 font-medium">Class-wide summary</p>
          <p className="font-display text-2xl text-ink-950">{overallPercentage}% overall presence</p>
        </div>
        {canMark && (
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-44" />
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-ink-900/50">Loading records…</p>
        ) : students.length === 0 ? (
          <div className="p-2">
            <EmptyState icon={LuCalendarCheck} title="No students to track yet" description="Add students in the Students module first." />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-950 text-paper">
              <tr>
                <th className="p-3 font-medium">Student</th>
                <th className="p-3 font-medium">Roll No</th>
                <th className="p-3 font-medium">Status for {formatDate(date)}</th>
                {canMark && <th className="p-3 font-medium w-64">Mark</th>}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const record = todaysRecords.find((r) => r.studentId === s.id);
                return (
                  <tr key={s.id} className="border-b border-ink-900/8 last:border-0 hover:bg-paper/60">
                    <td className="p-3 font-medium text-ink-900">{s.fullName}</td>
                    <td className="p-3 text-ink-900/70">{s.rollNumber}</td>
                    <td className="p-3">
                      {record ? (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${STATUS_STYLES[record.status]}`}>
                          {record.status}
                        </span>
                      ) : (
                        <span className="text-ink-900/35 text-xs">Not marked</span>
                      )}
                    </td>
                    {canMark && (
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button disabled={saving} onClick={() => markStatus(s.id, 'present')} className="p-1.5 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50" title="Present"><LuCheck /></button>
                          <button disabled={saving} onClick={() => markStatus(s.id, 'late')} className="p-1.5 rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50" title="Late"><LuClock /></button>
                          <button disabled={saving} onClick={() => markStatus(s.id, 'absent')} className="p-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50" title="Absent"><LuX /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
