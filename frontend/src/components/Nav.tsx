import React from 'react';

export default function Nav() {
  return (
    <nav className="fixed left-0 top-0 h-full w-72 pt-24 pb-8 px-4 flex flex-col gap-2 bg-white/60 dark:bg-black/60 backdrop-blur-[20px] docked border-r-4 border-black dark:border-white shadow-[6px_0px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_0px_0px_0px_rgba(163,230,53,1)] z-40">
      <div className="mb-8 border-b-4 border-black dark:border-lime-400 pb-4">
        <h2 className="text-xl font-black text-black dark:text-lime-400 font-h2 uppercase">SWARM_OS</h2>
        <p className="font-label-bold uppercase text-black dark:text-white text-xs mt-1">V2.0.4-STABLE</p>
      </div>
      <div className="flex flex-col gap-3 font-label-bold uppercase">
        <a className="text-black dark:text-white border-2 border-transparent flex items-center gap-3 p-4 hover:bg-cyan-300 dark:hover:bg-cyan-700 hover:translate-x-1 transition-all active:translate-x-2" href="#">
          <span className="material-symbols-outlined">hub</span>
          Fleet Status
        </a>
        <a className="text-black dark:text-white border-2 border-transparent flex items-center gap-3 p-4 hover:bg-cyan-300 dark:hover:bg-cyan-700 hover:translate-x-1 transition-all active:translate-x-2" href="#">
          <span className="material-symbols-outlined">account_tree</span>
          Node Map
        </a>
        <a className="bg-lime-400 dark:bg-lime-500 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 p-4 hover:bg-cyan-300 dark:hover:bg-cyan-700 hover:translate-x-1 transition-all active:translate-x-2" href="#">
          <span className="material-symbols-outlined">memory</span>
          Execution
        </a>
        <a className="text-black dark:text-white border-2 border-transparent flex items-center gap-3 p-4 hover:bg-cyan-300 dark:hover:bg-cyan-700 hover:translate-x-1 transition-all active:translate-x-2" href="#">
          <span className="material-symbols-outlined">terminal</span>
          System Logs
        </a>
      </div>
    </nav>
  );
}
