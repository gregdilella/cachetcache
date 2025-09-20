import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	console.log('🎯 Blog page load function called');
	
	try {
		const { session, user } = await safeGetSession();
		console.log('📋 Session check:', { hasSession: !!session, hasUser: !!user });

		if (!session || !user) {
			console.log('❌ No session or user found');
			return {
				posts: [],
				user: null,
				tablesExist: true
			};
		}

		// Get user profile to check admin status
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('*')
			.eq('id', user.id)
			.single();

		console.log('✅ User authenticated:', user.id, 'Admin:', userProfile?.is_admin);

		// Fetch blog posts with author info, comments, and reactions
		const { data: posts, error } = await supabase
			.from('blog_posts')
			.select(`
				*,
				author:user_profile!blog_posts_author_id_fkey(id, name),
				comments:blog_comments(
					*,
					author:user_profile!blog_comments_author_id_fkey(id, name),
					replies:blog_replies(
						*,
						author:user_profile!blog_replies_author_id_fkey(id, name)
					)
				),
				reactions:blog_reactions(
					*,
					user_profile!blog_reactions_user_id_fkey(id, name)
				)
			`)
			.eq('published', true)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('❌ Error fetching blog posts:', error);
			return {
				posts: [],
				user: userProfile,
				tablesExist: false,
				error: error.message
			};
		}

		// Process posts to add computed fields
		const processedPosts = posts?.map(post => {
			const likesCount = post.reactions?.filter(r => r.reaction_type === 'like').length || 0;
			const dislikesCount = post.reactions?.filter(r => r.reaction_type === 'dislike').length || 0;
			const commentsCount = post.comments?.length || 0;
			const userReaction = post.reactions?.find(r => r.user_id === user.id)?.reaction_type || null;

			return {
				...post,
				likesCount,
				dislikesCount,
				commentsCount,
				userReaction
			};
		}) || [];

		console.log('✅ Blog posts processed:', processedPosts.length);

		return {
			posts: processedPosts,
			user: userProfile,
			tablesExist: true
		};

	} catch (err) {
		console.error('💥 Blog load error:', err);
		return {
			posts: [],
			user: null,
			tablesExist: false,
			error: 'Failed to load blog data'
		};
	}
};

export const actions: Actions = {
	createPost: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		if (!title?.trim() || !content?.trim()) {
			return fail(400, { error: 'Title and content are required' });
		}

		const { error: insertError } = await supabase
			.from('blog_posts')
			.insert({
				title: title.trim(),
				content: content.trim(),
				author_id: user.id,
				published: true,
				created_at: new Date().toISOString()
			});

		if (insertError) {
			console.error('Error creating blog post:', insertError);
			return fail(500, { error: 'Failed to create blog post' });
		}

		return { success: true };
	},

	addComment: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const postId = formData.get('postId') as string;
		const content = formData.get('content') as string;

		if (!postId || !content?.trim()) {
			return fail(400, { error: 'Post ID and content are required' });
		}

		const { error: insertError } = await supabase
			.from('blog_comments')
			.insert({
				post_id: postId,
				author_id: user.id,
				content: content.trim(),
				created_at: new Date().toISOString()
			});

		if (insertError) {
			console.error('Error adding comment:', insertError);
			return fail(500, { error: 'Failed to add comment' });
		}

		return { success: true };
	},

	addReply: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required to reply' });
		}

		const formData = await request.formData();
		const commentId = formData.get('commentId') as string;
		const content = formData.get('content') as string;

		if (!commentId || !content?.trim()) {
			return fail(400, { error: 'Comment ID and content are required' });
		}

		const { error: insertError } = await supabase
			.from('blog_replies')
			.insert({
				comment_id: commentId,
				author_id: user.id,
				content: content.trim(),
				created_at: new Date().toISOString()
			});

		if (insertError) {
			console.error('Error adding reply:', insertError);
			return fail(500, { error: 'Failed to add reply' });
		}

		return { success: true };
	},

	toggleReaction: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const postId = formData.get('postId') as string;
		const reactionType = formData.get('reactionType') as 'like' | 'dislike';

		if (!postId || !['like', 'dislike'].includes(reactionType)) {
			return fail(400, { error: 'Invalid post ID or reaction type' });
		}

		// Check if user already has a reaction on this post
		const { data: existingReaction } = await supabase
			.from('blog_reactions')
			.select('*')
			.eq('post_id', postId)
			.eq('user_id', user.id)
			.single();

		if (existingReaction) {
			if (existingReaction.reaction_type === reactionType) {
				// Remove reaction if clicking the same type
				const { error: deleteError } = await supabase
					.from('blog_reactions')
					.delete()
					.eq('id', existingReaction.id);

				if (deleteError) {
					console.error('Error removing reaction:', deleteError);
					return fail(500, { error: 'Failed to remove reaction' });
				}
			} else {
				// Update reaction type
				const { error: updateError } = await supabase
					.from('blog_reactions')
					.update({ reaction_type: reactionType })
					.eq('id', existingReaction.id);

				if (updateError) {
					console.error('Error updating reaction:', updateError);
					return fail(500, { error: 'Failed to update reaction' });
				}
			}
		} else {
			// Create new reaction
			const { error: insertError } = await supabase
				.from('blog_reactions')
				.insert({
					post_id: postId,
					user_id: user.id,
					reaction_type: reactionType,
					created_at: new Date().toISOString()
				});

			if (insertError) {
				console.error('Error adding reaction:', insertError);
				return fail(500, { error: 'Failed to add reaction' });
			}
		}

		return { success: true };
	},

	deletePost: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const postId = formData.get('postId') as string;

		if (!postId) {
			return fail(400, { error: 'Post ID is required' });
		}

		// Delete the post (cascade will handle comments, reactions, and replies)
		const { error: deleteError } = await supabase
			.from('blog_posts')
			.delete()
			.eq('id', postId);

		if (deleteError) {
			console.error('Error deleting blog post:', deleteError);
			return fail(500, { error: 'Failed to delete blog post' });
		}

		return { success: true };
	}
};
