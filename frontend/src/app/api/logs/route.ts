import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const logFilePath = '/Users/nachov/Desktop/repos/swarm/output/swarm.log';
  
  try {
    if (!fs.existsSync(logFilePath)) {
      return NextResponse.json([]);
    }
    
    const content = fs.readFileSync(logFilePath, 'utf-8');
    const lines = content.split('\n');
    const logs = [];
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      // Parse format: [YYYY-MM-DD HH:MM:SS] message
      const match = line.match(/^\[(.*?)\] (.*)$/);
      
      let timestamp = 'Unknown';
      let message = line;
      
      if (match) {
        timestamp = match[1];
        message = match[2];
      }
      
      let level = 'Info';
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('failed') || lowerMessage.includes('error')) {
        level = 'Critical';
      } else if (lowerMessage.includes('warning') || lowerMessage.includes('429') || lowerMessage.includes('quota') || lowerMessage.includes('exhausted')) {
        level = 'Warning';
      }
      
      logs.push({
        timestamp,
        level,
        message
      });
    }
    
    // Return last 1000 lines or all if less
    const limitedLogs = logs.slice(-1000);
    
    return NextResponse.json(limitedLogs);
  } catch (error) {
    console.error('Failed to read log file:', error);
    return NextResponse.json({ error: 'Failed to read log file' }, { status: 500 });
  }
}
