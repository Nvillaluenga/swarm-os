import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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

export async function POST(request: Request) {
  const outputDir = '/Users/nachov/Desktop/repos/swarm/output';
  
  try {
    const formData = await request.formData();
    const goal = formData.get('goal') as string;
    const file = formData.get('file') as File | null;
    
    if (!goal) {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }
    
    // Generate session ID
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const randomId = Math.random().toString(36).substring(2, 10);
    const sessionId = `${timestamp}-${randomId}`;
    const sessionDir = path.join(outputDir, sessionId);
    
    // Ensure directory exists
    fs.mkdirSync(sessionDir, { recursive: true });
    
    // Handle file upload
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(sessionDir, file.name), buffer);
    }
    
    // Run swarm in background using the virtual environment python
    const out = fs.openSync(path.join(sessionDir, 'out.log'), 'a');
    const err = fs.openSync(path.join(sessionDir, 'err.log'), 'a');
    
    const pythonProcess = spawn('/Users/nachov/Desktop/repos/swarm/.venv/bin/python', ['main.py', goal, sessionId], {
      cwd: '/Users/nachov/Desktop/repos/swarm',
      detached: true,
      stdio: ['ignore', out, err]
    });
    
    pythonProcess.unref();
    
    return NextResponse.json({ success: true, id: sessionId });
  } catch (error) {
    console.error('Failed to start run:', error);
    return NextResponse.json({ error: 'Failed to start run' }, { status: 500 });
  }
}
