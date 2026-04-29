'use client';

import React from 'react';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Card from '../../components/Card';

export default function TasksAgents() {
  return (
    <>
      <Header />
      <Nav />

      {/* Main Content Wrapper */}
      <div className="ml-72 pt-28 px-6 pb-12 min-h-screen flex gap-6">
        <main className="flex-1 flex flex-col gap-6">
          <div className="mb-2">
            <h1 className="font-h1 text-h1 text-primary uppercase tracking-tighter leading-none border-b-4 border-primary pb-1 inline-block max-w-full break-words">
              Tasks & Agents
            </h1>
          </div>

          <Card shadowColor="default">
            <div className="font-h3 text-h3 text-primary uppercase mb-2">Placeholder</div>
            <p className="text-surface-tint">This view is under construction. It will display the active agents and their assigned tasks.</p>
          </Card>
        </main>
      </div>
    </>
  );
}
