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
		<div class="text-center mb-12">
			<h1 class="text-5xl md:text-6xl font-bold mb-4
				bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent" 
				style="font-family: 'Playfair Display', serif !important; letter-spacing: -0.02em;">
				{$t.blogPage.heroTitle}
			</h1>
			<p class="text-lg text-gray-600" 
				style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
				{$t.blogPage.description}
			</p>
		</div>

		<!-- Admin Post Creation Form -->
		{#if data.user?.is_admin}
			<div class="gradient-border-card cf-hover mb-10">
				<div class="p-8">
					<h2 class="text-2xl font-semibold mb-6 bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent" 
						style="font-family: 'Playfair Display', serif !important;">
						{$t.blogPage.createPost}
					</h2>
					<form 
						method="POST" 
						action="?/createPost" 
						use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') {
									newPostTitle = '';
									newPostContent = '';
									const textarea = document.getElementById('content');
									if (textarea) {
										textarea.style.height = 'auto';
									}
								}
								await update();
							};
						}}
					>
						<div class="mb-6">
							<label for="title" class="block text-base font-semibold text-gray-700 mb-3" 
								style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
								{$t.blogPage.postTitle}
							</label>
							<input
								type="text"
								id="title"
								name="title"
								bind:value={newPostTitle}
								class="premium-input"
								placeholder={$t.blogPage.postTitle}
								required
							/>
						</div>
						<div class="mb-6">
							<label for="content" class="block text-base font-semibold text-gray-700 mb-3" 
								style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
								{$t.blogPage.postContent}
							</label>
							<textarea
								id="content"
								name="content"
								bind:value={newPostContent}
								on:input={autoResize}
								class="premium-input resize-none min-h-[140px]"
								placeholder={$t.blogPage.postContent}
								required
							></textarea>
						</div>
						<button
							type="submit"
							class="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 
								text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 
								hover:scale-[1.02] hover:shadow-lg flex items-center gap-2"
						>
							<FileText class="w-5 h-5" />
							{$t.blogPage.publish}
						</button>
					</form>
				</div>
			</div>
		{/if}

		<!-- Blog Posts -->
		<div class="space-y-8">
			{#if data.posts && data.posts.length > 0}
				{#each data.posts as post}
					<article class="gradient-border-card cf-hover">
						<div class="p-8">
							<!-- Post Header -->
							<div class="flex items-center justify-between mb-6">
								<div class="flex items-center gap-4">
									<div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg
										bg-gradient-to-br from-sage-500 to-sage-600 shadow-md">
										{post.author?.name?.charAt(0) || 'U'}
									</div>
									<div>
										<h3 class="font-semibold text-gray-800 text-base" 
											style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
											{post.author?.name || 'Unknown'}
										</h3>
										<p class="text-sm text-gray-500">{formatDate(post.created_at)}</p>
									</div>
								</div>
								{#if data.user?.is_admin}
									<div class="flex gap-2">
										<form method="POST" action="?/deletePost" use:enhance>
											<input type="hidden" name="postId" value={post.id} />
											<button
												type="submit"
												class="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
												onclick="return confirm('{$t.blogPage.confirmDelete}')"
											>
												<Trash2 class="w-5 h-5" />
											</button>
										</form>
									</div>
								{/if}
							</div>

							<!-- Post Content -->
							<h2 class="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" 
								style="font-family: 'Playfair Display', serif !important;">
								{post.title}
							</h2>
							<div class="prose max-w-none mb-6">
								<p class="text-gray-700 whitespace-pre-wrap text-base leading-relaxed" 
									style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
									{post.content}
								</p>
							</div>

						<!-- Reactions with modern design -->
						<div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
							<form method="POST" action="?/toggleReaction" use:enhance>
								<input type="hidden" name="postId" value={post.id} />
								<input type="hidden" name="reactionType" value="like" />
								<button
									type="submit"
									class="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 
										{post.userReaction === 'like' 
											? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 shadow-sm' 
											: 'bg-gray-50 hover:bg-gray-100 text-gray-600'}"
									title={getReactionTooltip(post.reactions || [], 'like')}
								>
									<ThumbsUp class="w-5 h-5" />
									<span class="font-semibold">{post.likesCount || 0}</span>
								</button>
							</form>
							<form method="POST" action="?/toggleReaction" use:enhance>
								<input type="hidden" name="postId" value={post.id} />
								<input type="hidden" name="reactionType" value="dislike" />
								<button
									type="submit"
									class="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 
										{post.userReaction === 'dislike' 
											? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 shadow-sm' 
											: 'bg-gray-50 hover:bg-gray-100 text-gray-600'}"
									title={getReactionTooltip(post.reactions || [], 'dislike')}
								>
									<ThumbsDown class="w-5 h-5" />
									<span class="font-semibold">{post.dislikesCount || 0}</span>
								</button>
							</form>
							<div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600">
								<MessageCircle class="w-5 h-5" />
								<span class="font-semibold">{post.commentsCount || 0}</span>
							</div>
						</div>

						<!-- Comments Section -->
						<div class="space-y-6">
							<h3 class="font-semibold text-gray-800 text-lg" 
								style="font-family: 'Playfair Display', serif !important;">
								{$t.blogPage.comments}
							</h3>
							
							<!-- Add Comment Form -->
							<form 
								method="POST" 
								action="?/addComment" 
								use:enhance={() => {
									return async ({ result, update }) => {
										if (result.type === 'success') {
											commentInputs[post.id] = '';
											commentInputs = { ...commentInputs };
										}
										await update();
									};
								}}
								class="mb-6"
							>
								<input type="hidden" name="postId" value={post.id} />
								<div class="flex gap-4">
									<div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold
										bg-gradient-to-br from-pink-400 to-orange-400 shadow-sm">
										{data.user?.name?.charAt(0) || 'U'}
									</div>
									<div class="flex-1">
										<textarea
											name="content"
											bind:value={commentInputs[post.id]}
											on:input={autoResize}
											class="premium-input resize-none"
											placeholder={$t.blogPage.writeComment}
											rows="2"
											required
										></textarea>
										<button
											type="submit"
											class="mt-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 
												text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 text-sm"
										>
											{$t.blogPage.addComment}
										</button>
									</div>
								</div>
							</form>

						<!-- Comments Section -->
						<div class="space-y-6">
							<h3 class="font-semibold text-gray-800 text-lg" 
								style="font-family: 'Playfair Display', serif !important;">
								{$t.blogPage.comments}
							</h3>
							
							<!-- Add Comment Form -->
							<form 
								method="POST" 
								action="?/addComment" 
								use:enhance={() => {
									return async ({ result, update }) => {
										if (result.type === 'success') {
											commentInputs[post.id] = '';
											commentInputs = { ...commentInputs };
										}
										await update();
									};
								}}
								class="mb-6"
							>
								<input type="hidden" name="postId" value={post.id} />
								<div class="flex gap-4">
									<div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold
										bg-gradient-to-br from-gray-400 to-gray-500 shadow-sm">
										{data.user?.name?.charAt(0) || 'U'}
									</div>
									<div class="flex-1">
										<textarea
											name="content"
											bind:value={commentInputs[post.id]}
											on:input={autoResize}
											class="premium-input resize-none"
											placeholder={$t.blogPage.writeComment}
											rows="2"
											required
										></textarea>
										<button
											type="submit"
											class="mt-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 
												text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 text-sm"
										>
											{$t.blogPage.addComment}
										</button>
									</div>
								</div>
							</form>

							<!-- Comments List -->
							{#if post.comments && post.comments.length > 0}
								{#each post.comments as comment}
									<div class="flex gap-4 p-5 bg-gradient-to-br from-gray-50 to-pink-50/30 rounded-xl border border-gray-100">
										<div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold
											bg-gradient-to-br from-gray-400 to-gray-500 shadow-sm">
											{comment.author?.name?.charAt(0) || 'U'}
										</div>
										<div class="flex-1">
											<div class="flex items-center gap-3 mb-2">
												<span class="font-semibold text-gray-800" 
													style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
													{comment.author?.name || 'Unknown'}
												</span>
												<span class="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
											</div>
											<p class="text-gray-700 mb-3 leading-relaxed" 
												style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
												{comment.content}
											</p>
											
											<!-- Reply Button (Admin Only) -->
											{#if data.user?.is_admin}
												<button
													on:click={() => toggleReplies(comment.id)}
													class="text-sage-600 hover:text-sage-700 text-sm font-semibold flex items-center gap-1.5 
														px-3 py-1.5 rounded-lg hover:bg-sage-50 transition-all duration-200"
												>
													<Reply class="w-4 h-4" />
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
																	replyInputs[comment.id] = '';
																	replyInputs = { ...replyInputs };
																	showReplies[comment.id] = false;
																	showReplies = { ...showReplies };
																}
																await update();
															};
														}}
														class="mt-4"
													>
														<input type="hidden" name="commentId" value={comment.id} />
														<div class="flex gap-3">
															<textarea
																name="content"
																bind:value={replyInputs[comment.id]}
																on:input={autoResize}
																class="premium-input resize-none text-sm flex-1"
																placeholder={$t.blogPage.writeReply}
																rows="2"
																required
															></textarea>
															<button
																type="submit"
																class="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 
																	text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
															>
																{$t.blogPage.reply}
															</button>
														</div>
													</form>
												{/if}
											{/if}

											<!-- Replies -->
											{#if comment.replies && comment.replies.length > 0}
												<div class="mt-4 space-y-3">
													{#each comment.replies as reply}
														<div class="flex gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border-l-4 border-sage-300 shadow-sm">
															<div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm
																bg-gradient-to-br from-sage-500 to-sage-600">
																{reply.author?.name?.charAt(0) || 'A'}
															</div>
															<div class="flex-1">
																<div class="flex items-center gap-2 mb-1.5">
																	<span class="font-semibold text-gray-800 text-sm" 
																		style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
																		{reply.author?.name || 'Admin'}
																	</span>
																	<span class="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
																	<span class="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-md font-medium">
																		{$t.blogPage.adminOnly}
																	</span>
																</div>
																<p class="text-gray-700 text-sm leading-relaxed" 
																	style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
																	{reply.content}
																</p>
															</div>
														</div>
													{/each}
												</div>
											{/if}
										</div>
									</div>
								{/each}
							{:else}
								<p class="text-gray-500 text-sm italic p-4 text-center bg-gray-50 rounded-lg" 
									style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
									No comments yet. Be the first to comment!
								</p>
							{/if}
						</div>
					</div>
					</article>
				{/each}
			{:else}
				<div class="gradient-border-card text-center">
					<div class="p-12">
						<FileText class="w-20 h-20 text-gray-400 mx-auto mb-6" />
						<h2 class="text-2xl font-semibold text-gray-600 mb-3" 
							style="font-family: 'Playfair Display', serif !important;">
							{$t.blogPage.noPosts}
						</h2>
						<p class="text-gray-500 text-lg" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							Check back soon for new content!
						</p>
					</div>
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