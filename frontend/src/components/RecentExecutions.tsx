import React from 'react';
import ExecutionCard from './ExecutionCard';
import Card from './Card';

interface RecentExecutionsProps {
  runs: any[];
  selectedRun: any;
  onSelectRun: (id: string) => void;
}

export default function RecentExecutions({ runs, selectedRun, onSelectRun }: RecentExecutionsProps) {
  return (
    <aside className="w-80 flex-shrink-0 flex flex-col gap-4">
      <Card className="h-full flex flex-col" shadowColor="default">
        <h3 className="font-h3 text-h3 text-primary uppercase mb-4 border-b-2 border-primary pb-2 flex justify-between items-center">
          Recent Executions
          <span className="material-symbols-outlined">history</span>
        </h3>
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 flex-1">
          {runs.map(run => (
            <ExecutionCard
              key={run.id}
              run={run}
              isSelected={selectedRun && selectedRun.id === run.id}
              onClick={() => onSelectRun(run.id)}
            />
          ))}
          {runs.length === 0 && (
            <div className="text-center text-surface-tint p-4">No runs recorded yet.</div>
          )}
        </div>
      </Card>
    </aside>
  );
}
