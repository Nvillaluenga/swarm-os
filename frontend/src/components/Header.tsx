import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex justify-between items-center px-6 h-20 bg-white/60 backdrop-blur-[20px] docked full-width border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-4 border-r-4 border-black pr-6 h-full">
        <span className="text-2xl font-black italic tracking-widest text-black font-h1 uppercase">SWARM_OS</span>
      </div>
      <div className="flex-1 flex justify-end px-6">
        <div className="relative w-64 border-2 border-black bg-white flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100">
          <input className="w-full bg-transparent border-none focus:ring-0 text-black font-label-bold uppercase placeholder-black/50 px-3 py-2 text-sm outline-none" placeholder="SEARCH..." type="text"/>
          <span className="material-symbols-outlined absolute right-2 text-black">search</span>
        </div>
      </div>
      <div className="flex items-center gap-4 h-full pl-6 border-l-4 border-black">
        <button className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-crosshair">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center border-2 border-black bg-secondary-container text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-crosshair">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-crosshair">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
