import React from 'react';

export default function TerminalView() {
  return (
    <section className="border-4 border-primary bg-primary p-4 brutalist-shadow-neon flex flex-col font-code h-64 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full bg-surface border-b-2 border-primary p-2 flex gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-error border border-primary"></div>
        <div className="w-3 h-3 rounded-full bg-secondary-container border border-primary"></div>
        <div className="w-3 h-3 rounded-full bg-white border border-primary"></div>
        <span className="ml-4 font-label-bold text-[10px] uppercase text-primary">Terminal_TTY1</span>
      </div>
      <div className="mt-8 flex-1 overflow-y-auto text-secondary-fixed text-sm p-2 space-y-1">
        <div><span className="text-white opacity-50">[10:42:05.112]</span> <span className="text-cyan-400">INFO</span> Initiating execution context EX-0942A...</div>
        <div><span className="text-white opacity-50">[10:42:05.240]</span> <span className="text-cyan-400">INFO</span> Auth token validated for user system_admin.</div>
        <div><span className="text-white opacity-50">[10:42:06.001]</span> <span className="text-secondary-fixed">EXEC</span> Pulling image swarm_core:latest -&gt; node-alpha-us-e</div>
        <div><span className="text-white opacity-50">[10:42:07.150]</span> <span className="text-secondary-fixed">EXEC</span> Pulling image swarm_core:latest -&gt; node-beta-us-e</div>
        <div><span className="text-white opacity-50">[10:42:08.555]</span> <span className="text-cyan-400">INFO</span> Image pull successful. Checksums match.</div>
        <div><span className="text-white opacity-50">[10:42:09.102]</span> <span className="text-tertiary-fixed-dim">WARN</span> High latency detected on eu-w subnet routing.</div>
        <div><span className="text-white opacity-50">[10:42:10.000]</span> <span className="text-secondary-fixed">EXEC</span> Starting deployment on node-gamma-eu-w...</div>
        <div className="animate-pulse">_</div>
      </div>
    </section>
  );
}
