import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const outputDir = '/Users/nachov/Desktop/repos/swarm/output';
  
  try {
    if (!fs.existsSync(outputDir)) {
      return NextResponse.json([]);
    }
    
    const files = fs.readdirSync(outputDir);
    const runs = [];
    
    for (const file of files) {
      const fullPath = path.join(outputDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const summaryPath = path.join(fullPath, 'summary.json');
        if (fs.existsSync(summaryPath)) {
          try {
            const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
            const summary = JSON.parse(summaryContent);
            runs.push({
              id: file,
              goal: summary.goal,
              title: summary.plan?.title || 'No Title',
              timestamp: summary.timestamp || 'Unknown',
              valid: summary.valid
            });
          } catch (e) {
            console.error(`Failed to parse summary for ${file}:`, e);
            runs.push({ id: file, goal: 'Unknown (Parse Error)', title: 'No Title', timestamp: 'Unknown', valid: false });
          }
        } else {
          runs.push({ id: file, goal: 'Unknown (No Summary)', title: 'No Title', timestamp: 'Unknown', valid: false });
        }
      }
    }
    
    // Sort by timestamp descending, pushing 'Unknown' to the bottom
    runs.sort((a, b) => {
      if (a.timestamp === 'Unknown' && b.timestamp === 'Unknown') return 0;
      if (a.timestamp === 'Unknown') return 1;
      if (b.timestamp === 'Unknown') return -1;
      return b.timestamp.localeCompare(a.timestamp);
    });
    
    return NextResponse.json(runs);
  } catch (error) {
    console.error('Failed to read output directory:', error);
    return NextResponse.json({ error: 'Failed to read output directory' }, { status: 500 });
  }
}
