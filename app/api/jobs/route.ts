export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const isConnectionError = message.includes('connect') || message.includes('ECONNREFUSED') || message.includes('Tenant') || message.includes('reach');
    return NextResponse.json(
      { 
        error: isConnectionError 
          ? 'Unable to connect to the database. Please try again later.' 
          : 'Failed to fetch jobs',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const job = await prisma.job.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        experience: data.experience,
        description: data.description,
        requirements: data.requirements,
        salary: data.salary,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error in POST /api/jobs:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
