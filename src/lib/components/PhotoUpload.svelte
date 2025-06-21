<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Upload, Image as ImageIcon, X, ChevronLeft, ChevronRight, FileText } from 'lucide-svelte';
	
	export let placeholder = 'Upload photos';
	export let multiple = true;
	export let photos: Array<{id: string, url: string, uploading?: boolean, doctorNote?: string}> = [];
	
	const dispatch = createEventDispatcher();
	
	let fileInput: HTMLInputElement;
	let dragOver = false;
	let currentIndex = 0;
	let showModal = false;
	let modalImageUrl = '';
	
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			const files = Array.from(target.files);
			files.forEach(file => {
				dispatch('upload', file);
			});
		}
	}
	
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		if (event.dataTransfer?.files) {
			const files = Array.from(event.dataTransfer.files);
			files.forEach(file => {
				dispatch('upload', file);
			});
		}
	}
	
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}
	
	function handleDragLeave() {
		dragOver = false;
	}
	
	function removePhoto(photoId: string) {
		dispatch('remove', photoId);
		if (currentIndex >= photos.length - 1) {
			currentIndex = Math.max(0, photos.length - 2);
		}
	}
	
	function nextPhoto() {
		currentIndex = (currentIndex + 1) % photos.length;
	}
	
	function prevPhoto() {
		currentIndex = (currentIndex - 1 + photos.length) % photos.length;
	}
	
	function goToPhoto(index: number) {
		currentIndex = index;
	}
	
	function updateDoctorNote(photoId: string, note: string) {
		dispatch('noteUpdate', { photoId, note });
	}
	
	function openModal(imageUrl: string) {
		modalImageUrl = imageUrl;
		showModal = true;
		document.body.style.overflow = 'hidden'; // Prevent scrolling
	}
	
	function closeModal() {
		showModal = false;
		modalImageUrl = '';
		document.body.style.overflow = 'auto'; // Restore scrolling
	}
	
	function handleModalClick(event: MouseEvent) {
		// Close modal if clicking the backdrop (not the image)
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

{#if photos.length > 0}
	<!-- Photo Carousel -->
	<div class="space-y-3">
		<div class="relative h-64 rounded-xl overflow-hidden bg-gray-100">
			<!-- Main Photo Display -->
			<div class="relative w-full h-full flex items-center justify-center">
				<img
					src={photos[currentIndex].url}
					alt="Photo {currentIndex + 1}"
					class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
					on:click={() => openModal(photos[currentIndex].url)}
					on:keydown={(e) => e.key === 'Enter' && openModal(photos[currentIndex].url)}
					role="button"
					tabindex="0"
				/>
				
				<!-- Upload Overlay -->
				{#if photos[currentIndex].uploading}
					<div class="absolute inset-0 bg-black/50 flex items-center justify-center">
						<div class="text-white text-sm">Uploading...</div>
					</div>
				{/if}
				
				<!-- Remove Photo Button -->
				<button
					on:click|stopPropagation={() => removePhoto(photos[currentIndex].id)}
					class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full 
						hover:bg-red-600 transition-colors flex items-center justify-center z-10"
				>
					<X class="w-4 h-4" />
				</button>
				
				<!-- Navigation Arrows (only show if multiple photos) -->
				{#if photos.length > 1}
					<button
						on:click|stopPropagation={prevPhoto}
						class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full 
							hover:bg-black/70 transition-colors flex items-center justify-center z-10"
					>
						<ChevronLeft class="w-4 h-4" />
					</button>
					
					<button
						on:click|stopPropagation={nextPhoto}
						class="absolute right-10 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full 
							hover:bg-black/70 transition-colors flex items-center justify-center z-10"
					>
						<ChevronRight class="w-4 h-4" />
					</button>
				{/if}
			</div>
			
			<!-- Photo Indicators/Dots -->
			{#if photos.length > 1}
				<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
					{#each photos as _, index}
						<button
							on:click={() => goToPhoto(index)}
							class="w-2 h-2 rounded-full transition-colors
								{index === currentIndex ? 'bg-white' : 'bg-white/50'}"
						/>
					{/each}
				</div>
			{/if}
			
			<!-- Photo Counter -->
			{#if photos.length > 1}
				<div class="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
					{currentIndex + 1} / {photos.length}
				</div>
			{/if}
		</div>
		
		<!-- Doctor's Note for Current Photo -->
		<div class="space-y-2">
			<label class="flex items-center gap-2 text-sm font-medium text-pink-700">
				<FileText class="w-4 h-4" />
				Doctor's Note {photos.length > 1 ? `(Photo ${currentIndex + 1})` : ''}
			</label>
			<textarea
				bind:value={photos[currentIndex].doctorNote}
				on:blur={() => updateDoctorNote(photos[currentIndex].id, photos[currentIndex].doctorNote || '')}
				placeholder="Add notes about this visit..."
				class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
				rows="3"
			></textarea>
		</div>
		
		<!-- Add More Photos Button -->
		<div
			class="w-full p-3 border-2 border-dashed border-pink-200 rounded-xl text-pink-600 
				hover:border-pink-300 hover:bg-pink-25 transition-colors cursor-pointer
				{dragOver ? 'border-pink-400 bg-pink-50' : ''}"
			on:drop={handleDrop}
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:click={() => fileInput.click()}
			on:keydown={(e) => e.key === 'Enter' && fileInput.click()}
			role="button"
			tabindex="0"
		>
			<div class="flex items-center justify-center gap-2">
				<Upload class="w-4 h-4" />
				{dragOver ? 'Drop photos here' : 'Add More Photos'}
			</div>
		</div>
	</div>
{:else}
	<!-- Initial Upload Area -->
	<div
		class="border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer h-64 flex flex-col items-center justify-center
			{dragOver 
				? 'border-pink-400 bg-pink-50' 
				: 'border-pink-200 hover:border-pink-300 hover:bg-pink-25'}"
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:click={() => fileInput.click()}
		on:keydown={(e) => e.key === 'Enter' && fileInput.click()}
		role="button"
		tabindex="0"
	>
		<ImageIcon class="w-8 h-8 text-pink-400 mb-3" />
		<p class="text-pink-700 font-medium mb-1">
			{dragOver ? 'Drop your photos here' : placeholder}
		</p>
		<p class="text-sm text-pink-500">
			JPEG, PNG, WebP up to 10MB each
		</p>
		<p class="text-xs text-pink-400 mt-1">
			Select multiple files or drag & drop
		</p>
	</div>
{/if}

<!-- Image Modal -->
{#if showModal}
	<div 
		class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
		on:click={handleModalClick}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="relative w-[95vw] h-[95vh] max-w-6xl max-h-6xl">
			<img
				src={modalImageUrl}
				alt="Enlarged photo"
				class="w-full h-full object-cover rounded-lg"
			/>
			<button
				on:click={closeModal}
				class="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full 
					hover:bg-black/70 transition-colors flex items-center justify-center"
			>
				<X class="w-5 h-5" />
			</button>
		</div>
	</div>
{/if}

<input
	bind:this={fileInput}
	type="file"
	accept="image/jpeg,image/jpg,image/png,image/webp"
	{multiple}
	on:change={handleFileSelect}
	class="hidden"
/> 