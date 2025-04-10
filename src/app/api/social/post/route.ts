import { NextRequest, NextResponse } from 'next/server';
import { 
  SocialPost, 
  MediaAttachment, 
  SocialPlatformType 
} from '@/models/social';
import { 
  PostRepository, 
  PlatformRepository 
} from '@/repositories/socialMediaRepository';
import { 
  createPost, 
  publishPost, 
  schedulePost 
} from '@/services/socialMediaService';

/**
 * POST /api/social/post
 * 
 * Creates a new social media post
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    if (!body.platforms || !Array.isArray(body.platforms) || body.platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform must be selected' },
        { status: 400 }
      );
    }
    
    // Validate platforms
    const platforms = body.platforms as SocialPlatformType[];
    const connectedPlatforms = await PlatformRepository.getAll();
    const validPlatforms = connectedPlatforms
      .filter(p => p.connected)
      .map(p => p.platformType);
    
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { error: `Invalid or disconnected platforms: ${invalidPlatforms.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Parse scheduled time
    let scheduledTime: Date;
    if (body.scheduledTime) {
      scheduledTime = new Date(body.scheduledTime);
      if (isNaN(scheduledTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid scheduled time' },
          { status: 400 }
        );
      }
    } else {
      scheduledTime = new Date(); // Default to now
    }
    
    // Parse media attachments
    const mediaAttachments: MediaAttachment[] = body.mediaAttachments || [];
    
    // Create the post
    const post = await createPost(
      body.content,
      platforms,
      scheduledTime,
      mediaAttachments,
      { id: body.authorId || 'system', name: body.authorName || 'System' }
    );
    
    // Determine if we should publish now or schedule for later
    if (body.publishNow) {
      // Publish immediately
      const publishedPost = await publishPost(post.id);
      return NextResponse.json(publishedPost);
    } else {
      // Schedule for later
      const scheduledPost = await schedulePost(post.id);
      return NextResponse.json(scheduledPost);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/social/post
 * 
 * Updates an existing social media post
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Get the existing post
    const existingPost = await PostRepository.getById(body.id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Only allow updates to draft or scheduled posts
    if (existingPost.status !== 'draft' && existingPost.status !== 'scheduled') {
      return NextResponse.json(
        { error: `Cannot update post with status: ${existingPost.status}` },
        { status: 400 }
      );
    }
    
    // Update the post
    const updatedPost: SocialPost = {
      ...existingPost,
      content: body.content || existingPost.content,
      platforms: body.platforms || existingPost.platforms,
      mediaAttachments: body.mediaAttachments || existingPost.mediaAttachments,
      updatedAt: new Date()
    };
    
    // Update scheduled time if provided
    if (body.scheduledTime) {
      const scheduledTime = new Date(body.scheduledTime);
      if (isNaN(scheduledTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid scheduled time' },
          { status: 400 }
        );
      }
      
      updatedPost.scheduledTime = scheduledTime;
      updatedPost.scheduledFor = formatScheduledDate(scheduledTime);
    }
    
    // Save the updated post
    await PostRepository.save(updatedPost);
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// Helper function to format scheduled date
function formatScheduledDate(date: Date): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
      `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}
