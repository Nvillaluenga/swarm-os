'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import LogToolbar from '../../components/LogToolbar';
import LogTerminal from '../../components/LogTerminal';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = () => {
      fetch('/api/logs')
        .then(res => res.json())
        .then(data => {
          setLogs(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch logs:', err);
          setLoading(false);
        });
    };

    fetchLogs();
    const intervalId = setInterval(fetchLogs, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleRangeChange = (start: string, end: string) => {
    setStartTime(start.replace('T', ' '));
    setEndTime(end.replace('T', ' '));
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = activeFilter === 'All' || log.level === activeFilter;
    
    let matchesTime = true;
    if (startTime && log.timestamp < startTime) matchesTime = false;
    if (endTime && log.timestamp > endTime) matchesTime = false;
    
    return matchesLevel && matchesTime;
  });

  return (
    <>
      <Header />
      <Nav />

      {/* Main Content Wrapper */}
      <div className="ml-72 pt-28 px-6 pb-12 min-h-screen flex gap-6">
        <main className="flex-1 flex flex-col gap-6">
          <div className="mb-2">
            <h1 className="font-h1 text-h1 text-primary uppercase tracking-tighter leading-none border-b-4 border-primary pb-1 inline-block max-w-full break-words">
              System Logs
            </h1>
          </div>

          {loading ? (
            <div className="glass-panel border-4 border-primary p-6 brutalist-shadow flex items-center justify-center">
              <div className="font-h3 text-h3 text-primary uppercase animate-pulse">Loading Logs...</div>
            </div>
          ) : (
            <>
              <LogToolbar 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter} 
                onRangeFilterChange={handleRangeChange}
              />
              <LogTerminal logs={filteredLogs} />
            </>
          )}
        </main>
      </div>
    </>
  );
}
