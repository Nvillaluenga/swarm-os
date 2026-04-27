import React from 'react';
import Card from './Card';

interface TaskResultsProps {
  selectedRun: any;
}

export default function TaskResults({ selectedRun }: TaskResultsProps) {
  return (
    <Card className="col-span-7 overflow-hidden" shadowColor="default" noPadding={true}>
      <div className="p-4 border-b-4 border-primary bg-white/80 flex justify-between items-center">
        <h3 className="font-h3 text-h3 text-primary uppercase">Task Results</h3>
      </div>
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full text-left border-collapse h-full">
          <thead>
            <tr className="border-b-4 border-primary bg-surface-container-high font-label-bold text-label-bold text-primary uppercase">
              <th className="p-2 border-r-2 border-primary">Task ID</th>
              <th className="p-2 border-r-2 border-primary">Result Output</th>
            </tr>
          </thead>
          <tbody className="font-code text-code">
            {selectedRun.plan?.tasks?.map((task: any) => (
              <tr key={task.id} className="border-b-2 border-primary bg-white hover:bg-surface transition-colors">
                <td className="p-2 border-r-2 border-primary font-bold text-primary align-top">{task.id}</td>
                <td className="p-2 align-top">
                  <div className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-primary">
                    {selectedRun.results[task.id] || <span className="text-surface-tint">No output or pending</span>}
                  </div>
                </td>
              </tr>
            ))}
            {(!selectedRun.plan?.tasks || selectedRun.plan.tasks.length === 0) && (
              <tr>
                <td colSpan={2} className="text-center text-surface-tint p-4">No tasks to display.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
