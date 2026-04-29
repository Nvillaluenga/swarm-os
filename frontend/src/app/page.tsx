'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Nav from '../components/Nav';

export default function Home() {
  const [runs, setRuns] = useState<any[]>([]);
  const [goal, setGoal] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/runs')
      .then(res => res.json())
      .then(data => setRuns(data))
      .catch(err => console.error('Failed to fetch runs:', err));
  }, []);

  const handleLaunch = async () => {
    if (!goal) return;
    const formData = new FormData();
    formData.append('goal', goal);
    if (file) formData.append('file', file);
    
    try {
      const res = await fetch('/api/runs', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/executions?runId=${data.id}`);
      } else {
        alert('Failed to launch swarm: ' + data.error);
      }
    } catch (error) {
      console.error('Error launching swarm:', error);
      alert('Error launching swarm');
    }
  };
  return (
    <>
      <Header />
      <Nav />

      {/* Main Canvas */}
      <main className="pl-72 pt-20 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Hero Section: Chat Input */}
          <section className="mt-12 mb-12">
            <div className="text-center mb-12">
              <h2 className="font-h1 text-h1 text-primary mb-2 uppercase italic tracking-tighter">Initiate Swarm Sequence</h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Define your objective and deploy specialized agents to solve complex technical bottlenecks.</p>
            </div>
            <div className="relative max-w-4xl mx-auto">
              {/* Brutalist Chat Input */}
              <div className="bg-white/60 backdrop-blur-[20px] border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <span className="material-symbols-outlined text-4xl text-black">terminal</span>
                  <textarea 
                    className="w-full h-32 bg-transparent border-none focus:ring-0 font-h3 placeholder:opacity-30 resize-none text-black" 
                    placeholder="Type your Swarm Goal (e.g., 'Optimize the data pipeline for 4k stream processing' or 'Audit the security layer for CVE-2024-X')..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-between items-center pt-6 border-t-2 border-black">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-label-bold uppercase text-xs text-black cursor-pointer">
                      <span className="material-symbols-outlined text-sm">attach_file</span>
                      {file ? file.name : 'Context'}
                      <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <button 
                    className="bg-[#CCFF00] text-black border-2 border-black px-8 py-3 font-label-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    onClick={handleLaunch}
                  >
                    Launch Swarm
                  </button>
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#00FFFF] -z-0 border-2 border-black"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#FF00FF] -z-0 border-2 border-black opacity-20"></div>
            </div>
          </section>

          {/* Grid Content */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Recent Executions (Left Column) */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white/60 backdrop-blur-[20px] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
                  <h3 className="font-h3 uppercase tracking-tight flex items-center gap-2 text-black">
                    <span className="material-symbols-outlined">history</span>
                    Recent Executions
                  </h3>
                  <a className="font-label-bold text-xs uppercase underline underline-offset-4 hover:text-[#CCFF00] hover:bg-black px-2 text-black" href="#">View All</a>
                </div>
                <div className="space-y-4">
                  {runs.map((run) => (
                    <Link 
                      key={run.id}
                      href={`/executions?runId=${run.id}`}
                      className="group flex items-center justify-between border-2 border-black p-4 bg-white hover:bg-secondary-container transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 border-2 border-black flex items-center justify-center text-black ${run.valid ? 'bg-[#CCFF00]' : 'bg-[#FF00FF]/20'}`}>
                          <span className="material-symbols-outlined">
                            {run.valid ? 'check_circle' : 'error'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-label-bold uppercase text-sm text-black">{run.title || run.goal}</h4>
                          <p className="font-code text-xs opacity-60 text-black">RUN_ID: {run.id.substring(0, 8)}... • {run.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="font-code text-xs font-bold text-black">{run.valid ? 'SUCCESS' : 'FAILED'}</p>
                        </div>
                        <span className="material-symbols-outlined opacity-40 group-hover:opacity-100 text-black">chevron_right</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* System Metrics (Right Column) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Agent Status Bento */}
              <div className="bg-white/60 backdrop-blur-[20px] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-label-bold uppercase text-xs mb-6 tracking-widest opacity-60 text-black">Active Swarm Metrics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-code text-xs font-bold text-black">COGNITIVE LOAD</span>
                      <span className="font-code text-xs text-black">78%</span>
                    </div>
                    <div className="w-full h-6 bg-surface border-2 border-black p-1">
                      <div className="h-full bg-black" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-black p-3 text-center">
                      <div className="font-h2 tracking-tighter text-black">42</div>
                      <div className="text-[10px] font-bold uppercase opacity-60 text-black">Active Agents</div>
                    </div>
                    <div className="border-2 border-black p-3 text-center bg-[#CCFF00]/10 text-black">
                      <div className="font-h2 tracking-tighter">0.3s</div>
                      <div className="text-[10px] font-bold uppercase opacity-60">Mean Latency</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );;
}
