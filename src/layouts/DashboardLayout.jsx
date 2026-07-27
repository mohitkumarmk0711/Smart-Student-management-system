import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-paper flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
