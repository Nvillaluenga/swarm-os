'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ExecutionDropdown from './ExecutionDropdown';

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: 'chat', label: 'Home' },
    { href: '/executions', icon: 'terminal', label: 'Execution' },
    { href: '/tasks-agents', icon: 'account_tree', label: 'Tasks & Agents' },
    { href: '/system-logs', icon: 'description', label: 'System Logs' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-72 pt-24 pb-8 px-4 flex flex-col gap-2 bg-white/60 backdrop-blur-[20px] docked border-r-4 border-black shadow-[6px_0px_0px_0px_rgba(0,0,0,1)] z-40">
      <div className="mb-8 border-b-4 border-black pb-4">
        <h2 className="text-xl font-black text-black font-h2 uppercase">SWARM_OS</h2>
        <p className="font-label-bold uppercase text-black text-xs mt-1">V2.0.4-STABLE</p>
      </div>
      <Suspense fallback={<div className="px-2 my-2 text-xs text-black">Loading Runs...</div>}>
        <ExecutionDropdown />
      </Suspense>
      <div className="flex flex-col gap-3 font-label-bold uppercase">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                isActive
                  ? 'bg-lime-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black border-2 border-transparent hover:bg-cyan-300 hover:translate-x-1'
              } flex items-center gap-3 p-4 transition-all active:translate-x-2`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
