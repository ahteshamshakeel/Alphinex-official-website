export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all blogs (public - only published, admin - all)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    const blogs = await prisma.blog.findMany({
      where: session ? {} : { isPublished: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      ...(limit && { take: parseInt(limit) })
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST create new blog (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, author, category, tags, isPublished } = body;

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author: author || 'Alphinex Solutions',
        category: category || 'Technology',
        tags: tags || [],
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
