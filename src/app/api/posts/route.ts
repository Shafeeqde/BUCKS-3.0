
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { ProfilePost } from '@/types';
import admin from 'firebase-admin';

const POSTS_COLLECTION = 'posts';

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const body = await request.json();
    const { userId, user, userImage, userImageAiHint, content, media } = body;

    if (!userId || !user) {
      return NextResponse.json({ error: 'User information is required to create a post.' }, { status: 400 });
    }
    if (!content && !media) {
      return NextResponse.json({ error: 'Post must have content or media.' }, { status: 400 });
    }

    const newPostData: Omit<ProfilePost, 'id' | 'timestamp'> & { timestamp: admin.firestore.FieldValue } = {
      userId,
      user,
      userImage: userImage || '',
      userImageAiHint: userImageAiHint || '',
      content: content || '',
      media: media || null,
      likes: 0,
      comments: 0,
      commentsData: [],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(POSTS_COLLECTION).add(newPostData);
    
    // We can't get the server timestamp back immediately without another read, 
    // so we'll return the created data and let the client refetch.
    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create post.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


// GET /api/posts?userId=... - List all posts for a user, or all posts if no userId
export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query: admin.firestore.Query = db.collection(POSTS_COLLECTION);

    if (userId) {
      query = query.where('userId', '==', userId);
    }

    const snapshot = await query.orderBy('timestamp', 'desc').limit(50).get();
    
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const posts: ProfilePost[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const post: ProfilePost = {
        id: doc.id,
        userId: data.userId,
        user: data.user,
        userImage: data.userImage,
        userImageAiHint: data.userImageAiHint,
        timestamp: data.timestamp?.toDate?.().toISOString() || new Date().toISOString(),
        content: data.content,
        media: data.media,
        likes: data.likes || 0,
        comments: data.comments || 0,
        commentsData: data.commentsData || [],
      };
      posts.push(post);
    });

    return NextResponse.json(posts, { status: 200 });

  } catch (error) {
    console.error('Error fetching posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
