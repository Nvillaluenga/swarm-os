import React from 'react';
import Card from './Card';

interface ExecutionOverviewProps {
  selectedRun: any;
}

export default function ExecutionOverview({ selectedRun }: ExecutionOverviewProps) {
  return (
    <Card 
      shadowColor={selectedRun.valid ? 'neon' : 'error'}
      bgHue={selectedRun.valid ? 'success' : 'error'}
      className="w-full"
    >
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-primary">memory</span>
            <h2 className="font-h2 text-h2 text-primary uppercase leading-none">Execution Overview</h2>
          </div>
          <p className="font-code text-code text-surface-tint uppercase tracking-widest mt-2">Session ID: {selectedRun.id}</p>
        </div>
        <div className={`border-2 border-primary px-4 py-2 brutalist-shadow-sm flex items-center gap-2 ${selectedRun.valid ? 'bg-secondary-container' : 'bg-error-container'}`}>
          <div className={`w-3 h-3 rounded-full ${selectedRun.valid ? 'bg-primary' : 'bg-error'}`}></div>
          <span className="font-label-bold text-label-bold text-primary uppercase tracking-widest">
            {selectedRun.valid ? 'Success' : 'Failed'}
          </span>
        </div>
      </div>
      
      {selectedRun.feedback && (
        <div className="mt-2 p-3 border-2 border-primary bg-white z-10">
          <h4 className="font-label-bold text-primary uppercase mb-1">Critique Feedback:</h4>
          <p className="font-body-md text-sm text-primary">{selectedRun.feedback}</p>
        </div>
      )}
    </Card>
  );
}
