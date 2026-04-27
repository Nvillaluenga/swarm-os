'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Nav from '../components/Nav';
import RecentExecutions from '../components/RecentExecutions';
import ExecutionOverview from '../components/ExecutionOverview';
import ExecutionPlan from '../components/ExecutionPlan';
import TaskResults from '../components/TaskResults';
import TerminalView from '../components/TerminalView';

export default function Home() {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch list of runs initially
    fetch('/api/runs')
      .then(res => res.json())
      .then(data => {
        setRuns(data);
        if (data.length > 0) {
          // Fetch details for the first run by default
          fetchRunDetails(data[0].id);
        } else {
          setLoading(false);
        }
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

  return (
    <>
      <Header />
      <Nav />

      {/* Main Content Wrapper */}
      <div className="ml-72 pt-28 px-6 pb-12 min-h-screen flex gap-6">
        <RecentExecutions 
          runs={runs} 
          selectedRun={selectedRun} 
          onSelectRun={fetchRunDetails} 
        />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 flex flex-col gap-6">
          {loading ? (
            <div className="glass-panel border-4 border-primary p-6 brutalist-shadow flex items-center justify-center">
              <div className="font-h3 text-h3 text-primary uppercase animate-pulse">Loading Run Data...</div>
            </div>
          ) : selectedRun ? (
            <>
              {/* Header */}
              <div className="mb-2">
                <h1 className="font-h1 text-h1 text-primary uppercase tracking-tighter leading-none border-b-4 border-primary pb-1 inline-block max-w-full break-words">
                  GOAL: {selectedRun.goal}
                </h1>
              </div>

              <ExecutionOverview selectedRun={selectedRun} />

              {/* Middle Section: 2 Columns */}
              <section className="grid grid-cols-12 gap-6">
                <ExecutionPlan selectedRun={selectedRun} />
                <TaskResults selectedRun={selectedRun} />
              </section>

              <TerminalView />
            </>
          ) : (
            <div className="glass-panel border-4 border-primary p-6 brutalist-shadow text-center">
              <div className="font-h3 text-h3 text-primary uppercase">No Runs Found</div>
              <p className="text-surface-tint mt-2">Run the swarm from the backend to generate data.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
