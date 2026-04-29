import React, { useState, useRef } from 'react';

interface LogToolbarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onRangeFilterChange: (start: string, end: string) => void;
}

export default function LogToolbar({ activeFilter, onFilterChange, onRangeFilterChange }: LogToolbarProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const handleStartChange = (val: string) => {
    setStart(val);
    onRangeFilterChange(val, end);
  };

  const handleEndChange = (val: string) => {
    setEnd(val);
    onRangeFilterChange(start, val);
  };
  const getButtonClass = (filter: string, activeBg: string, hoverBg: string) => {
    const isActive = activeFilter === filter;
    return `px-4 py-1 border-2 border-primary font-label-bold text-xs uppercase flex items-center gap-1 transition-colors ${
      isActive ? `${activeBg} text-white` : `bg-surface text-primary hover:${hoverBg}`
    }`;
  };

  return (
    <section className="flex flex-wrap items-end justify-between gap-4 mt-2">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <button 
            onClick={() => onFilterChange('All')}
            className={getButtonClass('All', 'bg-primary', 'bg-secondary-container')}
          >
            All Events
          </button>
          <button 
            onClick={() => onFilterChange('Info')}
            className={getButtonClass('Info', 'bg-primary', 'bg-secondary-container')}
          >
            <span className="material-symbols-outlined text-[14px]">info</span>
            Info
          </button>
          <button 
            onClick={() => onFilterChange('Warning')}
            className={getButtonClass('Warning', 'bg-[#FFFB00]', 'bg-[#FFFB00]')}
          >
            <span className="material-symbols-outlined text-[14px]">warning</span>
            Warning
          </button>
          <button 
            onClick={() => onFilterChange('Critical')}
            className={getButtonClass('Critical', 'bg-[#FF0055]', 'bg-[#FF0055]')}
          >
            <span className="material-symbols-outlined text-[14px]">error</span>
            Critical
          </button>
        </div>
      </div>
      <div className="flex gap-2 h-fit">
        <div 
          className="flex items-center bg-surface border-2 border-primary px-3 py-1 gap-2 brutalist-shadow-sm text-primary cursor-pointer"
          onClick={() => startInputRef.current?.showPicker()}
        >
          <span className="font-code text-xs">From:</span>
          <input 
            ref={startInputRef}
            type="datetime-local" 
            className="font-code text-xs bg-transparent outline-none border-none text-primary cursor-pointer"
            onChange={(e) => handleStartChange(e.target.value)}
          />
        </div>
        <div 
          className="flex items-center bg-surface border-2 border-primary px-3 py-1 gap-2 brutalist-shadow-sm text-primary cursor-pointer"
          onClick={() => endInputRef.current?.showPicker()}
        >
          <span className="font-code text-xs">To:</span>
          <input 
            ref={endInputRef}
            type="datetime-local" 
            className="font-code text-xs bg-transparent outline-none border-none text-primary cursor-pointer"
            onChange={(e) => handleEndChange(e.target.value)}
          />
        </div>
        <button className="bg-[#00FFFF] border-2 border-primary p-2 brutalist-shadow-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-primary">
          <span className="material-symbols-outlined">download</span>
        </button>
      </div>
    </section>
  );
}
