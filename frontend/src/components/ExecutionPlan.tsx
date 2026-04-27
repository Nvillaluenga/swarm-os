import React from 'react';
import Card from './Card';

interface ExecutionPlanProps {
  selectedRun: any;
}

export default function ExecutionPlan({ selectedRun }: ExecutionPlanProps) {
  return (
    <Card className="col-span-5" shadowColor="default">
      <h3 className="font-h3 text-h3 text-primary uppercase mb-4 border-b-2 border-primary pb-2">Execution Plan</h3>
      <div className="flex flex-col relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-1 before:bg-primary before:-z-10">
        {selectedRun.plan?.tasks?.map((task: any, index: number) => (
          <div key={task.id} className="flex items-start gap-4 mb-4 bg-white p-2 border-2 border-primary">
            <div className={`w-8 h-8 rounded-none border-2 border-primary flex items-center justify-center shrink-0 mt-1 ${selectedRun.results[task.id] ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
              {selectedRun.results[task.id] ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                <span className="font-bold text-sm">{index + 1}</span>
              )}
            </div>
            <div>
              <h4 className="font-label-bold text-label-bold text-primary uppercase">{task.agent_name}</h4>
              <p className="font-body-md text-sm text-surface-tint mt-1">{task.description}</p>
            </div>
          </div>
        ))}
        {(!selectedRun.plan?.tasks || selectedRun.plan.tasks.length === 0) && (
          <div className="text-center text-surface-tint p-4">No plan generated for this run.</div>
        )}
      </div>
    </Card>
  );
}
