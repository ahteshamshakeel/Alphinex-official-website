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

// GET single blog by ID or slug
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ],
        ...(session ? {} : { isPublished: true })
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

// PUT update blog (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, author, category, tags, isPublished, order } = body;

    const updateData: any = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      isPublished,
      order,
    };

    // Set publishedAt when publishing for the first time
    const existingBlog = await prisma.blog.findUnique({ where: { id: params.id } });
    if (isPublished && !existingBlog?.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE blog (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.blog.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
