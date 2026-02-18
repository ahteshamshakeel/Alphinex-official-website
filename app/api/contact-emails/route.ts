export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const emails = await prisma.contactEmail.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(emails);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact emails' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const email = await prisma.contactEmail.create({
      data,
    });
    return NextResponse.json(email);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create contact email' }, { status: 500 });
  }
}
