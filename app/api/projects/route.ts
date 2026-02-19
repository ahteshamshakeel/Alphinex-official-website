export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const isConnectionError = message.includes('connect') || message.includes('ECONNREFUSED') || message.includes('Tenant') || message.includes('reach');
    return NextResponse.json(
      { 
        error: isConnectionError 
          ? 'Unable to connect to the database. Please try again later.' 
          : 'Failed to fetch projects',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      }, 
      { status: 500 }
    );
  }
}

// POST new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: body,
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
