import React, { useEffect, useState } from 'react';
import { LuUsers, LuUserCheck, LuCalendarCheck, LuGraduationCap } from 'react-icons/lu';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { listDocs } from '../services/firestoreService';
import { computeAttendancePercentage } from '../utils/gradeCalculator';

export default function Dashboard() {
  const { userRole, userProfile, currentUser } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, attendance: 0, assignments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [students, users, attendance, assignments] = await Promise.all([
          listDocs('students'),
          listDocs('users'),
          listDocs('attendance'),
          listDocs('assignments'),
        ]);
        const teacherCount = users.filter((u) => u.role === 'teacher').length;
        setStats({
          students: students.length,
          teachers: teacherCount,
          attendance: computeAttendancePercentage(attendance),
          assignments: assignments.length,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const name = userProfile?.fullName || currentUser?.email?.split('@')[0] || 'there';

  return (
    <DashboardLayout title="Overview">
      <div className="mb-6">
        <p className="text-sm text-ink-900/55">Welcome back,</p>
        <h2 className="font-display text-2xl text-ink-950 capitalize">{name}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {userRole !== 'student' && (
          <StatCard title="Total Students" value={loading ? '—' : stats.students} icon={LuUsers} />
        )}
        {userRole === 'admin' && (
          <StatCard title="Teachers" value={loading ? '—' : stats.teachers} icon={LuUserCheck} tone="gold" />
        )}
        <StatCard title="Attendance Rate" value={loading ? '—' : `${stats.attendance}%`} icon={LuCalendarCheck} />
        <StatCard title="Open Assignments" value={loading ? '—' : stats.assignments} icon={LuGraduationCap} tone="gold" />
      </div>

      <div className="card p-6">
        <h3 className="font-display text-lg text-ink-950 mb-1">Role permissions</h3>
        <p className="text-sm text-ink-900/55 mb-4 capitalize">Signed in as {userRole}</p>
        <div className="ledger-rule -mx-2 px-2 py-1 text-sm text-ink-900/70 leading-[28px]">
          {userRole === 'admin' && (
            <>
              Full read, write and delete access across all collections.<br />
              Manage teacher and student accounts, department configuration, and system analytics.
            </>
          )}
          {userRole === 'teacher' && (
            <>
              Read and write access for assigned classes.<br />
              Mark attendance, post assignments and enter marks for your students.
            </>
          )}
          {userRole === 'student' && (
            <>
              Read-only access to your own profile, grades and attendance.<br />
              Submit homework through the Assignments module.
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
