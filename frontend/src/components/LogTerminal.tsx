import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

interface LogTerminalProps {
  logs: LogEntry[];
}

export default function LogTerminal({ logs }: LogTerminalProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleScrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  return (
    <section className="flex-1 min-h-0 relative mt-4 flex flex-col h-[500px]">
      {/* Terminal Header Decoration */}
      <div className="absolute -top-3 left-6 px-4 bg-primary text-white font-code text-[10px] uppercase tracking-[0.2em] z-10 py-1">
        Active_Stream_Buffer // Node_04
      </div>
      
      {/* Floating Action Button: Scroll to Bottom */}
      <button 
        onClick={() => { handleScrollToBottom(); setAutoScroll(true); }}
        className="fixed bottom-20 right-10 w-12 h-12 bg-[#CCFF00] border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-all hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none z-50 text-primary"
        title="Scroll to bottom & enable auto-scroll"
      >
        <span className="material-symbols-outlined text-2xl font-black">arrow_downward</span>
      </button>

      <div className="w-full flex-1 border-4 border-primary bg-white/60 glass-panel shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col min-h-0">
        {/* Inner Terminal Frame */}
        <div 
          ref={terminalRef}
          className="h-[500px] bg-stone-950 p-6 font-code text-sm overflow-y-auto overflow-x-hidden selection:bg-[#CCFF00] selection:text-black"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
            if (!isAtBottom && autoScroll) {
              setAutoScroll(false);
            }
          }}
        >
          <div className="space-y-1">
            {logs.map((log, index) => {
              let levelColor = 'text-[#00FFFF]';
              let textColor = 'text-stone-300';
              let bgClass = '';
              
              if (log.level === 'Warning') {
                levelColor = 'text-[#CCFF00]';
                textColor = 'text-[#CCFF00]';
              } else if (log.level === 'Critical') {
                levelColor = 'text-red-500';
                textColor = 'text-red-200';
                bgClass = 'bg-red-950/30 border-l-2 border-red-500 -mx-6 px-6 py-0.5';
              }
              
              return (
                <div key={index} className={`flex gap-4 group ${bgClass}`}>
                  <span className="text-stone-500 shrink-0 w-24">{log.timestamp}</span>
                  <span className={`${levelColor} shrink-0 font-bold`}>[{log.level.toUpperCase()}]</span>
                  <span className={textColor}>{log.message}</span>
                </div>
              );
            })}
            {logs.length === 0 && (
              <div className="text-stone-500 italic">No logs matching filter...</div>
            )}
            <div className="flex gap-4 group">
              <span className="text-stone-500 shrink-0 w-24"></span>
              <span className="text-[#00FFFF] shrink-0 font-bold"></span>
              <span className="text-stone-300 animate-pulse">&gt; Cursor_waiting_for_input_</span>
            </div>
          </div>
        </div>
        {/* Terminal Footer Status */}
        <div className="bg-white border-t-2 border-primary px-6 py-2 flex justify-between items-center font-code text-[11px] uppercase font-bold text-primary">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500"></span> {logs.filter(l => l.level === 'Critical').length} ERRORS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400"></span> {logs.filter(l => l.level === 'Warning').length} WARNINGS
            </span>
          </div>
          <div className="flex gap-6">
            <span>AUTO_SCROLL: <span className={autoScroll ? "text-green-600 underline" : "text-red-600 underline"}>{autoScroll ? "ON" : "OFF"}</span></span>
            <span>LINES: {logs.length}</span>
            <span>LOAD: 0.12%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
