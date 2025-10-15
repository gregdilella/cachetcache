<script lang="ts">
	import { Heart, MessageCircle, Share, Bookmark, Trash2, Edit } from 'lucide-svelte';
	
	// Svelte 5 Props
	interface Props {
		images?: Array<{
			id: string;
			filename: string;
			original_name: string;
			description: string | null;
			created_at: string | null;
			file_size: number;
			mime_type: string;
			signedUrl?: string | null;
		}>;
		ondelete?: (data: { id: string }) => void;
		onedit?: (data: { id: string }) => void;
	}
	
	let { 
		images = [],
		ondelete = () => {},
		onedit = () => {}
	}: Props = $props();
	
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	
	function formatDate(dateString: string | null): string {
		if (!dateString) return 'Unknown';
		
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) {
			const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
			if (diffHours === 0) {
				const diffMinutes = Math.floor(diffTime / (1000 * 60));
				return `${diffMinutes}m ago`;
			}
			return `${diffHours}h ago`;
		} else if (diffDays === 1) {
			return '1 day ago';
		} else if (diffDays < 7) {
			return `${diffDays} days ago`;
		} else {
			return date.toLocaleDateString();
		}
	}
	
	function getImageUrl(image: { filename: string; signedUrl?: string | null }): string {
		// Use signed URL if available, otherwise fall back to direct URL
		if (image.signedUrl) {
			return image.signedUrl;
		}
		return `https://cachetcache.3c687933a8de78d69da8abaa15b32629.r2.cloudflarestorage.com/${image.filename}`;
	}
	
	function handleDelete(imageId: string) {
		ondelete({ id: imageId });
	}
	
	function handleEdit(imageId: string) {
		onedit({ id: imageId });
	}
</script>

<div class="space-y-6">
	{#if images.length === 0}
		<div class="instagram-card p-8 text-center">
			<div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Heart class="w-8 h-8 text-pink-400" />
			</div>
			<h3 class="text-lg font-semibold text-pink-800 mb-2">No images yet</h3>
			<p class="text-pink-600">Upload your first image to get started!</p>
		</div>
	{:else}
		{#each images as image}
			<div class="instagram-post">
				<!-- Post Header -->
				<div class="flex items-center justify-between p-4">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
							<span class="text-white font-semibold text-sm">You</span>
						</div>
						<div>
							<h3 class="font-semibold text-pink-800">Your Upload</h3>
							<p class="text-xs text-pink-600">{formatDate(image.created_at)}</p>
						</div>
					</div>
					
					<!-- Action Menu -->
					<div class="flex items-center gap-2">
						<button
							onclick={() => handleEdit(image.id)}
							class="p-2 text-pink-600 hover:text-pink-800 hover:bg-pink-50 rounded-full transition-colors"
							title="Edit image"
						>
							<Edit class="w-4 h-4" />
						</button>
						<button
							onclick={() => handleDelete(image.id)}
							class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
							title="Delete image"
						>
							<Trash2 class="w-4 h-4" />
						</button>
					</div>
				</div>
				
				<!-- Image -->
				<div class="relative">
					{#if image.signedUrl}
						<img
							src={getImageUrl(image)}
							alt={image.original_name}
							class="w-full aspect-square object-cover"
							loading="lazy"
						/>
					{:else}
						<div class="w-full aspect-square bg-pink-100 flex items-center justify-center">
							<p class="text-pink-600">Image unavailable</p>
						</div>
					{/if}
				</div>
				
				<!-- Post Actions -->
				<div class="flex items-center justify-between px-4 py-4">
					<div class="flex items-center gap-4">
						<button class="text-pink-600 hover:text-pink-800 transition-colors">
							<Heart class="w-6 h-6" />
						</button>
						<button class="text-pink-600 hover:text-pink-800 transition-colors">
							<MessageCircle class="w-6 h-6" />
						</button>
						<button class="text-pink-600 hover:text-pink-800 transition-colors">
							<Share class="w-6 h-6" />
						</button>
					</div>
					<button class="text-pink-600 hover:text-pink-800 transition-colors">
						<Bookmark class="w-6 h-6" />
					</button>
				</div>
				
				<!-- Post Content -->
				<div class="px-4 pb-4">
					<div class="mb-2">
						<p class="text-sm text-pink-700">
							<span class="font-semibold">you</span>
							{#if image.description}
								{image.description}
							{:else}
								<span class="italic text-pink-500">No description</span>
							{/if}
						</p>
					</div>
					
					<!-- Image Info -->
					<div class="text-xs text-pink-500 space-y-1">
						<p><span class="font-medium">File:</span> {image.original_name}</p>
						<p><span class="font-medium">Size:</span> {formatFileSize(image.file_size)}</p>
						<p><span class="font-medium">Type:</span> {image.mime_type}</p>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div> 