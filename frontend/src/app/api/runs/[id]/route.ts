import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const outputDir = '/Users/nachov/Desktop/repos/swarm/output';
  const summaryPath = path.join(outputDir, id, 'summary.json');
  
  try {
    if (!fs.existsSync(summaryPath)) {
      return NextResponse.json({ error: 'Run summary not found' }, { status: 404 });
    }
    
    const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
    const summary = JSON.parse(summaryContent);
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error(`Failed to read summary for ${id}:`, error);
    return NextResponse.json({ error: 'Failed to read run summary' }, { status: 500 });
  }
}
