<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { t } from '$lib/i18n/translations';
	import { Heart, MessageCircle, ThumbsDown, ThumbsUp, FileText, Trash2, Edit, Reply } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let newPostTitle = '';
	let newPostContent = '';
	let commentInputs: { [key: string]: string } = {};
	let replyInputs: { [key: string]: string } = {};
	let showReplies: { [key: string]: boolean } = {};

	// Auto-resize textarea
	function autoResize(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		target.style.height = 'auto';
		target.style.height = target.scrollHeight + 'px';
	}

	function toggleReplies(commentId: string) {
		showReplies[commentId] = !showReplies[commentId];
		showReplies = { ...showReplies };
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function getReactionTooltip(reactions: any[], type: 'like' | 'dislike') {
		const filteredReactions = reactions.filter(r => r.reaction_type === type);
		if (filteredReactions.length === 0) return '';
		
		const names = filteredReactions.map(r => r.user_profile?.name || 'Unknown');
		return `${type === 'like' ? $t.blogPage.likedBy : $t.blogPage.dislikedBy}: ${names.join(', ')}`;
	}

	// Real-time updates
	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 10000); // Refresh every 10 seconds

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{$t.pageTitle.blog} | Cachet Caché</title>
	<meta name="description" content={$t.blogPage.description} />
</svelte:head>

<div class="min-h-screen">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-800 mb-2">{$t.blogPage.heroTitle}</h1>
			<p class="text-gray-600">{$t.blogPage.description}</p>
		</div>

		<!-- Admin Post Creation Form -->
		{#if data.user?.is_admin}
			<div class="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-pink-500">
				<h2 class="text-xl font-semibold mb-4 text-gray-800">{$t.blogPage.createPost}</h2>
				<form 
					method="POST" 
					action="?/createPost" 
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								// Reset the post creation form
								newPostTitle = '';
								newPostContent = '';
								// Reset textarea height
								const textarea = document.getElementById('content');
								if (textarea) {
									textarea.style.height = 'auto';
								}
							}
							await update();
						};
					}}
				>
					<div class="mb-4">
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							{$t.blogPage.postTitle}
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={newPostTitle}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
							placeholder={$t.blogPage.postTitle}
							required
						/>
					</div>
					<div class="mb-4">
						<label for="content" class="block text-sm font-medium text-gray-700 mb-2">
							{$t.blogPage.postContent}
						</label>
						<textarea
							id="content"
							name="content"
							bind:value={newPostContent}
							on:input={autoResize}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none min-h-[120px]"
							placeholder={$t.blogPage.postContent}
							required
						></textarea>
					</div>
					<button
						type="submit"
						class="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
					>
						<FileText class="w-4 h-4" />
						{$t.blogPage.publish}
					</button>
				</form>
			</div>
		{/if}

		<!-- Blog Posts -->
		<div class="space-y-6">
			{#if data.posts && data.posts.length > 0}
				{#each data.posts as post}
					<article class="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-200 hover:shadow-xl">
						<!-- Post Header -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
									{post.author?.name?.charAt(0) || 'U'}
								</div>
								<div>
									<h3 class="font-semibold text-gray-800">{post.author?.name || 'Unknown'}</h3>
									<p class="text-sm text-gray-500">{formatDate(post.created_at)}</p>
								</div>
							</div>
							{#if data.user?.is_admin}
								<div class="flex gap-2">
									<form method="POST" action="?/deletePost" use:enhance>
										<input type="hidden" name="postId" value={post.id} />
										<button
											type="submit"
											class="text-red-500 hover:text-red-700 p-1 rounded"
											onclick="return confirm('{$t.blogPage.confirmDelete}')"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</form>
								</div>
							{/if}
						</div>

						<!-- Post Content -->
						<h2 class="text-xl font-bold text-gray-800 mb-3">{post.title}</h2>
						<div class="prose max-w-none mb-6">
							<p class="text-gray-700 whitespace-pre-wrap">{post.content}</p>
						</div>

						<!-- Reactions -->
						<div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
							<form method="POST" action="?/toggleReaction" use:enhance>
								<input type="hidden" name="postId" value={post.id} />
								<input type="hidden" name="reactionType" value="like" />
								<button
									type="submit"
									class="flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 {post.userReaction === 'like' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}"
									title={getReactionTooltip(post.reactions || [], 'like')}
								>
									<ThumbsUp class="w-4 h-4" />
									<span>{post.likesCount || 0}</span>
								</button>
							</form>
							<form method="POST" action="?/toggleReaction" use:enhance>
								<input type="hidden" name="postId" value={post.id} />
								<input type="hidden" name="reactionType" value="dislike" />
								<button
									type="submit"
									class="flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 {post.userReaction === 'dislike' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'}"
									title={getReactionTooltip(post.reactions || [], 'dislike')}
								>
									<ThumbsDown class="w-4 h-4" />
									<span>{post.dislikesCount || 0}</span>
								</button>
							</form>
							<div class="flex items-center gap-2 text-gray-500">
								<MessageCircle class="w-4 h-4" />
								<span>{post.commentsCount || 0} {$t.blogPage.commentsCount}</span>
							</div>
						</div>

						<!-- Comments Section -->
						<div class="space-y-4">
							<h3 class="font-semibold text-gray-800">{$t.blogPage.comments}</h3>
							
							<!-- Add Comment Form -->
							<form 
								method="POST" 
								action="?/addComment" 
								use:enhance={() => {
									return async ({ result, update }) => {
										if (result.type === 'success') {
											// Reset the comment input for this post
											commentInputs[post.id] = '';
											commentInputs = { ...commentInputs };
										}
										await update();
									};
								}}
								class="mb-4"
							>
								<input type="hidden" name="postId" value={post.id} />
								<div class="flex gap-3">
									<div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
										{data.user?.name?.charAt(0) || 'U'}
									</div>
									<div class="flex-1">
										<textarea
											name="content"
											bind:value={commentInputs[post.id]}
											on:input={autoResize}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
											placeholder={$t.blogPage.writeComment}
											rows="2"
											required
										></textarea>
										<button
											type="submit"
											class="mt-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 text-sm"
										>
											{$t.blogPage.addComment}
										</button>
									</div>
								</div>
							</form>

							<!-- Comments List -->
							{#if post.comments && post.comments.length > 0}
								{#each post.comments as comment}
									<div class="flex gap-3 p-4 bg-gray-50 rounded-lg">
										<div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
											{comment.author?.name?.charAt(0) || 'U'}
										</div>
										<div class="flex-1">
											<div class="flex items-center gap-2 mb-1">
												<span class="font-medium text-gray-800">{comment.author?.name || 'Unknown'}</span>
												<span class="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
											</div>
											<p class="text-gray-700 mb-2">{comment.content}</p>
											
											<!-- Reply Button (Admin Only) -->
											{#if data.user?.is_admin}
												<button
													on:click={() => toggleReplies(comment.id)}
													class="text-pink-500 hover:text-pink-600 text-sm font-medium flex items-center gap-1"
												>
													<Reply class="w-3 h-3" />
													{$t.blogPage.reply}
												</button>

												<!-- Reply Form -->
												{#if showReplies[comment.id]}
													<form 
														method="POST" 
														action="?/addReply" 
														use:enhance={() => {
															return async ({ result, update }) => {
																if (result.type === 'success') {
																	// Reset the reply input for this comment
																	replyInputs[comment.id] = '';
																	replyInputs = { ...replyInputs };
																	// Hide the reply form
																	showReplies[comment.id] = false;
																	showReplies = { ...showReplies };
																}
																await update();
															};
														}}
														class="mt-3"
													>
														<input type="hidden" name="commentId" value={comment.id} />
														<div class="flex gap-2">
															<textarea
																name="content"
																bind:value={replyInputs[comment.id]}
																on:input={autoResize}
																class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
																placeholder={$t.blogPage.writeReply}
																rows="2"
																required
															></textarea>
															<button
																type="submit"
																class="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
															>
																{$t.blogPage.reply}
															</button>
														</div>
													</form>
												{/if}
											{/if}

											<!-- Replies -->
											{#if comment.replies && comment.replies.length > 0}
												<div class="mt-3 space-y-2">
													{#each comment.replies as reply}
														<div class="flex gap-2 p-3 bg-white rounded-lg border-l-2 border-pink-200">
															<div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">
																{reply.author?.name?.charAt(0) || 'A'}
															</div>
															<div class="flex-1">
																<div class="flex items-center gap-2 mb-1">
																	<span class="font-medium text-gray-800 text-sm">{reply.author?.name || 'Admin'}</span>
																	<span class="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
																	<span class="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">{$t.blogPage.adminOnly}</span>
																</div>
																<p class="text-gray-700 text-sm">{reply.content}</p>
															</div>
														</div>
													{/each}
												</div>
											{/if}
										</div>
									</div>
								{/each}
							{:else}
								<p class="text-gray-500 text-sm italic">No comments yet. Be the first to comment!</p>
							{/if}
						</div>
					</article>
				{/each}
			{:else}
				<div class="bg-white rounded-xl shadow-lg p-8 text-center">
					<FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h2 class="text-xl font-semibold text-gray-600 mb-2">{$t.blogPage.noPosts}</h2>
					<p class="text-gray-500">Check back soon for new content!</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.prose {
		line-height: 1.6;
	}
	
	textarea {
		transition: height 0.2s ease;
	}
</style>