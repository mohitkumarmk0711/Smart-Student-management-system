import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuLayoutDashboard, LuUsers, LuCalendarCheck, LuFileText,
  LuGraduationCap, LuLogOut, LuBookMarked,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';

const NAV_BY_ROLE = {
  admin: [
    { to: '/dashboard', label: 'Overview', icon: LuLayoutDashboard },
    { to: '/students', label: 'Students', icon: LuUsers },
    { to: '/attendance', label: 'Attendance', icon: LuCalendarCheck },
    { to: '/assignments', label: 'Assignments', icon: LuFileText },
    { to: '/marks', label: 'Gradebook', icon: LuGraduationCap },
  ],
  teacher: [
    { to: '/dashboard', label: 'Overview', icon: LuLayoutDashboard },
    { to: '/students', label: 'Class Roster', icon: LuUsers },
    { to: '/attendance', label: 'Attendance', icon: LuCalendarCheck },
    { to: '/assignments', label: 'Assignments', icon: LuFileText },
    { to: '/marks', label: 'Gradebook', icon: LuGraduationCap },
  ],
  student: [
    { to: '/dashboard', label: 'Overview', icon: LuLayoutDashboard },
    { to: '/attendance', label: 'My Attendance', icon: LuCalendarCheck },
    { to: '/assignments', label: 'Assignments', icon: LuFileText },
    { to: '/marks', label: 'My Grades', icon: LuGraduationCap },
  ],
};

export default function Sidebar() {
  const { userRole, logout } = useAuth();
  const items = NAV_BY_ROLE[userRole] || NAV_BY_ROLE.student;

  return (
    <aside className="w-64 shrink-0 bg-ink-950 text-paper flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/10">
        <LuBookMarked className="text-gold-400 text-2xl" />
        <div>
          <p className="font-display text-lg leading-tight">SSMS</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-paper/50">Student Register</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold-500 text-ink-950'
                  : 'text-paper/70 hover:bg-white/5 hover:text-paper'
              }`
            }
          >
            <Icon className="text-base shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-5 border-t border-white/10">
        <span className="block px-3.5 pb-2 text-[11px] uppercase tracking-[0.14em] text-paper/40">
          Signed in as {userRole}
        </span>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium text-paper/70 hover:bg-white/5 hover:text-paper transition-colors"
        >
          <LuLogOut className="text-base" />
          Log out
        </button>
      </div>
    </aside>
  );
}
