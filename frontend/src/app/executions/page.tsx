'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Card from '../../components/Card';

export default function Executions() {
  return (
    <Suspense fallback={<div className="glass-panel border-4 border-primary p-6 brutalist-shadow flex items-center justify-center min-h-screen"><div className="font-h3 text-h3 text-primary uppercase animate-pulse">Loading App State...</div></div>}>
      <ExecutionsContent />
    </Suspense>
  );
}

function ExecutionsContent() {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const fetchRunDetails = (id: string) => {
    setLoading(true);
    fetch(`/api/runs/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedRun({ ...data, id });
        setLoading(false);
      })
      .catch(err => {
        console.error(`Failed to fetch details for ${id}:`, err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Fetch list of runs initially
    fetch('/api/runs')
      .then(res => res.json())
      .then(data => {
        setRuns(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch runs:', err);
        setLoading(false);
      });

    // Poll for list of runs to see new ones
    const intervalId = setInterval(() => {
      fetch('/api/runs')
        .then(res => res.json())
        .then(data => setRuns(data))
        .catch(err => console.error('Failed to poll runs:', err));
    }, 5000); // Poll runs every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Effect to handle selection based on URL or fallback
  useEffect(() => {
    if (runId) {
      fetchRunDetails(runId);
    } else if (runs.length > 0 && !selectedRun) {
      fetchRunDetails(runs[0].id);
    }
  }, [runId, runs]);

  // Poll for selected run details
  useEffect(() => {
    if (!selectedRun) return;

    // Poll details every 3 seconds for the selected run
    const intervalId = setInterval(() => {
      fetch(`/api/runs/${selectedRun.id}`)
        .then(res => res.json())
        .then(data => {
          setSelectedRun({ ...data, id: selectedRun.id });
        })
        .catch(err => console.error(`Failed to poll details for ${selectedRun.id}:`, err));
    }, 3000); // Poll details every 3 seconds

    return () => clearInterval(intervalId);
  }, [selectedRun?.id]);



  const countUniqueAgents = (plan: any) => {
    if (!plan || !plan.agents) return 0;
    return plan.agents.length;
  };

  const getTaskStatus = (taskId: string, results: any) => {
    if (results && results[taskId]) {
      return 'Complete';
    }
    return 'Pending';
  };

  const totalTasks = selectedRun?.plan?.tasks?.length || 0;
  const completedTasks = selectedRun?.plan?.tasks?.filter((task: any) => selectedRun.results && selectedRun.results[task.id]).length || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <Header />
      <Nav />

      {/* Main Content Canvas */}
      <main className="ml-72 pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {loading ? (
            <div className="glass-panel border-4 border-primary p-6 brutalist-shadow flex items-center justify-center">
              <div className="font-h3 text-h3 text-primary uppercase animate-pulse">Loading Run Data...</div>
            </div>
          ) : selectedRun ? (
            <>
              {/* Active Goal Header */}
              <section className="bg-[#CCFF00] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-black text-white px-3 py-1 font-label-bold text-[10px] uppercase tracking-widest mb-2 inline-block">
                      Active_Mission
                    </span>
                    <h2 className="font-h1 text-h1 text-black uppercase leading-none break-words max-w-4xl">
                      {selectedRun.goal}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-label-bold text-h3 text-black">
                      {selectedRun.valid ? '100%' : `${completionPercentage}%`}
                    </span>
                    <span className="font-code text-xs uppercase font-bold">Completion</span>
                  </div>
                </div>
                <div className="mt-4 w-full h-8 bg-black/10 border-2 border-black relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-black"
                    style={{ width: selectedRun.valid ? '100%' : `${completionPercentage}%` }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center px-4 mix-blend-difference">
                    <span className="text-white font-code text-xs font-bold tracking-[0.5em]">
                      IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
                    </span>
                  </div>
                </div>
              </section>

              {/* Execution Overview Grid */}
              <div className="grid grid-cols-12 gap-6">
                {/* Stats Bento */}
                <div className="col-span-12 md:col-span-4 space-y-6">
                  <div 
                    className="bg-white/60 backdrop-blur-[20px] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:translate-y-[-2px] transition-all"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-[#00FFFF]">support_agent</span>
                      <h3 className="font-h3 text-h3 uppercase text-black">Agents</h3>
                    </div>
                    <div className="text-h1 font-h1 leading-none text-black">
                      {countUniqueAgents(selectedRun.plan)}
                    </div>
                    <p className="mt-2 font-code text-sm opacity-60 text-black">
                      Total agents deployed in plan
                    </p>
                  </div>
                  <div className={`bg-white/60 backdrop-blur-[20px] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${selectedRun.valid ? '' : (selectedRun.feedback === 'Running...' ? 'border-[#CCFF00]' : 'border-[#FF00FF]')}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`material-symbols-outlined ${selectedRun.feedback === 'Running...' ? 'text-[#CCFF00]' : 'text-[#FF00FF]'}`}>
                        {selectedRun.feedback === 'Running...' ? 'sync' : 'warning'}
                      </span>
                      <h3 className="font-h3 text-h3 uppercase text-black">
                        {selectedRun.feedback === 'Running...' ? 'Status' : 'Critical Errors'}
                      </h3>
                    </div>
                    <div className={`text-h1 font-h1 leading-none ${selectedRun.valid ? 'text-black' : (selectedRun.feedback === 'Running...' ? 'text-[#CCFF00]' : 'text-[#FF00FF]')}`}>
                      {selectedRun.feedback === 'Running...' ? '...' : (selectedRun.execution_stats?.critical_errors || 0)}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {!selectedRun.valid && (
                        <span className={`${selectedRun.feedback === 'Running...' ? 'bg-[#CCFF00] text-black' : 'bg-[#FF00FF] text-white'} px-2 py-1 text-[10px] font-bold uppercase`}>
                          {selectedRun.feedback === 'Running...' ? 'In_Progress' : 'Critique_Failed'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-[20px] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-black">timer</span>
                      <h3 className="font-h3 text-h3 uppercase text-black">Execution Time</h3>
                    </div>
                    <div className="text-h1 font-h1 leading-none text-black">
                      {selectedRun.execution_stats?.total_duration ? `${selectedRun.execution_stats.total_duration.toFixed(1)}s` : 'N/A'}
                    </div>
                    <div className="mt-2 h-1 bg-black w-full opacity-10"></div>
                    <p className="mt-2 font-code text-sm opacity-60 text-black">
                      Total duration in seconds
                    </p>
                  </div>
                </div>

                {/* Execution Plan List */}
                <div className="col-span-12 md:col-span-8 bg-white/60 backdrop-blur-[20px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                  <div className="border-b-2 border-black p-4 flex justify-between items-center bg-surface-container-low">
                    <h3 className="font-h3 text-h3 uppercase text-black">Execution Plan_Sequence</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left font-code border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-black">
                          <th className="p-4 uppercase text-xs font-black text-black">ID</th>
                          <th className="p-4 uppercase text-xs font-black text-black">Sub-task</th>
                          <th className="p-4 uppercase text-xs font-black text-black">Agent</th>
                          <th className="p-4 uppercase text-xs font-black text-black">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black/5">
                        {selectedRun.plan?.tasks.map((task: any) => {
                          const status = getTaskStatus(task.id, selectedRun.results);
                          return (
                            <tr key={task.id} className="hover:bg-[#CCFF00]/5 transition-colors">
                              <td className="p-4 text-black">{task.id}</td>
                              <td className="p-4 font-bold text-black">{task.description}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-black">
                                  <div className="w-2 h-2 rounded-full bg-[#00FFFF]"></div>
                                  {task.agent_name}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`border border-black px-2 py-0.5 text-[10px] font-black uppercase ${status === 'Complete' ? 'bg-[#CCFF00] text-black' : 'text-black'}`}>
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel border-4 border-primary p-6 brutalist-shadow text-center">
              <div className="font-h3 text-h3 text-primary uppercase">No Runs Found</div>
              <p className="text-surface-tint mt-2">Run the swarm from the backend to generate data.</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h2 className="font-h2 text-h2 uppercase text-black">[SWARM AGENTS]</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              {selectedRun?.plan?.agents?.map((agent: any, index: number) => (
                <div key={index} className="border-2 border-black p-4 bg-surface-container-low">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-label-bold uppercase text-black">{agent.name}</h4>
                    <span className="material-symbols-outlined text-[#00FFFF]">support_agent</span>
                  </div>
                  <p className="text-sm text-primary mb-2">{agent.role}</p>
                  <div className="flex gap-2 flex-wrap">
                    {agent.tools.map((tool: string, tIndex: number) => (
                      <span key={tIndex} className="bg-[#CCFF00] text-black px-2 py-0.5 text-xs font-bold uppercase border border-black">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
