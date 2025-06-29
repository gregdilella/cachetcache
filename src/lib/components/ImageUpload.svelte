<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Upload, X, Image as ImageIcon } from 'lucide-svelte';
	
	export let loading = false;
	export let error = '';
	export let success = '';
	
	const dispatch = createEventDispatcher();
	
	let fileInput: HTMLInputElement;
	let dragOver = false;
	let previewUrl = '';
	let selectedFile: File | null = null;
	let description = '';
	let uploadProgress = 0;
	
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			selectFile(target.files[0]);
		}
	}
	
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
			selectFile(event.dataTransfer.files[0]);
		}
	}
	
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}
	
	function handleDragLeave() {
		dragOver = false;
	}
	
	function selectFile(file: File) {
		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			error = 'Invalid file type. Only JPEG, PNG, and WebP are allowed.';
			return;
		}
		
		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			error = 'File too large. Maximum size is 10MB.';
			return;
		}
		
		selectedFile = file;
		error = '';
		
		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			previewUrl = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}
	
	function clearSelection() {
		selectedFile = null;
		previewUrl = '';
		description = '';
		error = '';
		success = '';
		if (fileInput) fileInput.value = '';
	}
	
	async function uploadImage() {
		if (!selectedFile) return;
		
		loading = true;
		error = '';
		success = '';
		uploadProgress = 0;
		
		try {
			const formData = new FormData();
			formData.append('image', selectedFile);
			formData.append('description', description);
			
			const response = await fetch('/api/upload-image', {
				method: 'POST',
				body: formData
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Upload failed');
			}
			
			const result = await response.json();
			success = 'Image uploaded successfully!';
			
			dispatch('uploaded', result.image);
			
			// Clear form after successful upload
			setTimeout(() => {
				clearSelection();
			}, 2000);
			
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload failed';
		} finally {
			loading = false;
			uploadProgress = 0;
		}
	}
</script>

<div class="instagram-card p-6">
	<div class="flex items-center gap-3 mb-6">
		<div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
			<Upload class="w-5 h-5 text-white" />
		</div>
		<div>
			<h3 class="font-semibold text-pink-800">Upload Image</h3>
			<p class="text-xs text-pink-600">Share your photos securely</p>
		</div>
	</div>
	
	{#if !selectedFile}
		<!-- Upload Area -->
		<div
			class="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
				{dragOver 
					? 'border-pink-400 bg-pink-50' 
					: 'border-pink-200 hover:border-pink-300 hover:bg-pink-25'}"
			on:drop={handleDrop}
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:click={() => fileInput.click()}
			role="button"
			tabindex="0"
		>
			<ImageIcon class="w-12 h-12 text-pink-400 mx-auto mb-4" />
			<p class="text-pink-700 font-medium mb-2">
				{dragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
			</p>
			<p class="text-sm text-pink-500">
				JPEG, PNG, WebP up to 10MB
			</p>
		</div>
		
		<input
			bind:this={fileInput}
			type="file"
			accept="image/jpeg,image/jpg,image/png,image/webp"
			on:change={handleFileSelect}
			class="hidden"
			id="image-upload-input"
			name="image-upload"
		/>
	{:else}
		<!-- Preview and Upload -->
		<div class="space-y-4">
			<!-- Image Preview -->
			<div class="relative">
				<img
					src={previewUrl}
					alt="Preview"
					class="w-full max-h-96 object-cover rounded-2xl"
				/>
				<button
					on:click={clearSelection}
					class="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
				>
					<X class="w-4 h-4" />
				</button>
			</div>
			
			<!-- Description Input -->
			<div>
				<label for="description" class="block text-sm font-medium text-pink-700 mb-2">
					Description (optional)
				</label>
				<textarea
					id="description"
					name="description"
					bind:value={description}
					placeholder="Add a description for your image..."
					class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
					rows="3"
				></textarea>
			</div>
			
			<!-- Upload Progress -->
			{#if loading}
				<div class="space-y-2">
					<div class="flex justify-between text-sm">
						<span class="text-pink-600">Uploading...</span>
						<span class="text-pink-600">{Math.round(uploadProgress)}%</span>
					</div>
					<div class="w-full bg-pink-100 rounded-full h-2">
						<div 
							class="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
							style="width: {uploadProgress}%"
						></div>
					</div>
				</div>
			{/if}
			
			<!-- Action Buttons -->
			<div class="flex gap-3">
				<button
					on:click={uploadImage}
					disabled={loading}
					class="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium 
						hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed 
						transition-all duration-200"
				>
					{loading ? 'Uploading...' : 'Upload Image'}
				</button>
				
				<button
					on:click={clearSelection}
					disabled={loading}
					class="px-6 py-3 border border-pink-200 text-pink-600 rounded-xl font-medium 
						hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					Cancel
				</button>
			</div>
		</div>
	{/if}
	
	<!-- Messages -->
	{#if error}
		<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
			<p class="text-red-600 text-sm">{error}</p>
		</div>
	{/if}
	
	{#if success}
		<div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
			<p class="text-green-600 text-sm">{success}</p>
		</div>
	{/if}
</div> 