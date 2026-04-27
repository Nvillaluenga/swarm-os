import React from 'react';

interface ExecutionCardProps {
  run: {
    id: string;
    goal: string;
    title?: string;
    timestamp: string;
    valid: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function ExecutionCard({ run, isSelected, onClick }: ExecutionCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`border-2 border-primary p-2 flex flex-col gap-1 brutalist-shadow-sm cursor-pointer hover:-translate-y-1 hover:translate-x-1 transition-transform ${isSelected ? 'bg-secondary-container' : 'bg-white'}`}
    >
      <div className="flex justify-between items-center overflow-hidden">
        <div className="marquee-container flex-1 mr-2">
          <span className="font-code text-code font-bold text-primary marquee-content">{run.title || run.goal}</span>
        </div>
        <span className={`font-label-bold text-[10px] px-2 py-1 border border-primary uppercase ${run.valid ? 'bg-primary text-white' : 'bg-error text-on-error'} shrink-0`}>
          {run.valid ? 'Success' : 'Failed'}
        </span>
      </div>
      <span className="font-body-md text-sm text-surface-tint">{run.timestamp}</span>
      <span className="text-xs text-surface-tint">ID: {run.id.substring(0, 8)}...</span>
    </div>
  );
}
