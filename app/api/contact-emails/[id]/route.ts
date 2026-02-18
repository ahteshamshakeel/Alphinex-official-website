export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Prevent static generation
export async function generateStaticParams() {
  return [];
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const email = await prisma.contactEmail.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(email);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact email' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.contactEmail.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Contact email deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact email' }, { status: 500 });
  }
}
