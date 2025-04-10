import { NextRequest, NextResponse } from 'next/server';
import { PostRepository } from '@/repositories/socialMediaRepository';
import { publishPost } from '@/services/socialMediaService';

/**
 * GET /api/social/post/:id
 * 
 * Gets a specific social media post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // Get the post
    const post = await PostRepository.getById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error getting post:', error);
    return NextResponse.json(
      { error: 'Failed to get post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/social/post/:id
 * 
 * Updates a specific social media post by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // Get the existing post
    const existingPost = await PostRepository.getById(postId);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Only allow updates to draft or scheduled posts
    if (existingPost.status !== 'draft' && existingPost.status !== 'scheduled') {
      return NextResponse.json(
        { error: `Cannot update post with status: ${existingPost.status}` },
        { status: 400 }
      );
    }
    
    // Update the post
    const updatedPost = {
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
    }
    
    // Handle status changes
    if (body.status) {
      if (body.status === 'published' && existingPost.status !== 'published') {
        // If changing to published, use the publish service
        const publishedPost = await publishPost(postId);
        return NextResponse.json(publishedPost);
      } else {
        updatedPost.status = body.status;
      }
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

/**
 * DELETE /api/social/post/:id
 * 
 * Deletes a specific social media post by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // Get the post
    const post = await PostRepository.getById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Only allow deletion of draft or scheduled posts
    if (post.status !== 'draft' && post.status !== 'scheduled') {
      return NextResponse.json(
        { error: `Cannot delete post with status: ${post.status}` },
        { status: 400 }
      );
    }
    
    // Delete the post
    const success = await PostRepository.delete(postId);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
