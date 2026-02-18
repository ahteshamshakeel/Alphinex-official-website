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
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
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
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
