'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExecutionDropdown() {
  const [runs, setRuns] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRunId = searchParams.get('runId');

  useEffect(() => {
    fetch('/api/runs')
      .then(res => res.json())
      .then(data => setRuns(data))
      .catch(err => console.error('Failed to fetch runs for dropdown:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRunId = e.target.value;
    if (newRunId) {
      router.push(`/executions?runId=${newRunId}`);
    }
  };

  return (
    <div className="px-2 my-2">
      <label htmlFor="execution-select" className="font-label-bold text-xs uppercase text-black mb-1 block">
        Select Execution
      </label>
      <select
        id="execution-select"
        className="w-full bg-white border-2 border-black p-2 font-code text-sm text-black focus:outline-none focus:ring-2 focus:ring-lime-400"
        value={currentRunId || ''}
        onChange={handleChange}
      >
        <option value="" disabled>Select a run...</option>
        {runs.map((run) => (
          <option key={run.id} value={run.id}>
            {run.title || run.goal.substring(0, 20) + '...'}
          </option>
        ))}
      </select>
    </div>
  );
}
