export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    const applications = await prisma.application.findMany({
      where: jobId ? { jobId } : undefined,
      include: {
        job: {
          select: {
            title: true,
            department: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const application = await prisma.application.create({
      data: {
        jobId: data.jobId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        portfolio: data.portfolio,
        linkedinUrl: data.linkedinUrl,
        cvUrl: data.cvUrl,
        coverLetter: data.coverLetter,
      },
    });
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
