<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Upload, Image as ImageIcon, X, ChevronLeft, ChevronRight, FileText } from 'lucide-svelte';
	import { t } from '$lib/i18n/translations/index.js';
	
	export let placeholder = 'Upload photos';
	export let multiple = true;
	export let photos: Array<{id: string, url: string, uploading?: boolean, doctorNote?: string}> = [];
	export let userProfile: any = null; // User profile to check admin status
	export let readonly = false; // Whether the component is in read-only mode
	
	const dispatch = createEventDispatcher();
	
	let fileInput: HTMLInputElement;
	let dragOver = false;
	let currentIndex = 0;
	let showModal = false;
	let modalImageUrl = '';
	
	// Reset currentIndex when photos change
	$: if (photos.length > 0 && currentIndex >= photos.length) {
		currentIndex = Math.max(0, photos.length - 1);
	}
	
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
		// Adjust currentIndex if needed
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
		// Close modal if clicking the backdrop (not the image or its container)
		const target = event.target as HTMLElement;
		if (target.classList.contains('modal-backdrop')) {
			closeModal();
		}
	}
	
	// Action to portal an element to document.body so it's not confined by ancestor transforms
	function appendToBody(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}
</script>

{#if photos.length > 0}
	<!-- Photo Carousel -->
	<div class="space-y-3">
		<div class="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-gray-100">
			<!-- Main Photo Display -->
			<div class="relative w-full h-full flex items-center justify-center">
				<button
					type="button"
					class="w-full h-full p-0 border-0 bg-transparent cursor-pointer"
					on:click={() => openModal(photos[currentIndex].url)}
					aria-label="{$t.photoUpload.viewEnlargedPhoto} {currentIndex + 1}"
				>
					<img
						src={photos[currentIndex].url}
						alt="{$t.photoUpload.photo} {currentIndex + 1}"
						class="w-full h-full object-cover hover:opacity-90 transition-opacity"
					/>
				</button>
				
				<!-- Upload Overlay -->
				{#if photos[currentIndex].uploading}
					<div class="absolute inset-0 bg-black/50 flex items-center justify-center">
						<div class="text-white text-sm">{$t.photoUpload.uploading}</div>
					</div>
				{/if}
				
				<!-- Remove Photo Button - Admin only -->
				{#if userProfile?.is_admin && !readonly}
				<button
					on:click|stopPropagation={() => removePhoto(photos[currentIndex].id)}
					class="absolute top-2 right-2 w-10 h-10 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full 
						hover:bg-red-600 transition-colors flex items-center justify-center z-10 touch-manipulation"
				>
					<X class="w-5 h-5 sm:w-4 sm:h-4" />
				</button>
				{/if}
				
				<!-- Navigation Arrows (only show if multiple photos) -->
				{#if photos.length > 1}
					<button
						on:click|stopPropagation={prevPhoto}
						class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-8 sm:h-8 bg-black/50 text-white rounded-full 
							hover:bg-black/70 transition-colors flex items-center justify-center z-10 touch-manipulation"
					>
						<ChevronLeft class="w-5 h-5 sm:w-4 sm:h-4" />
					</button>
					
					<button
						on:click|stopPropagation={nextPhoto}
						class="absolute right-12 sm:right-10 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-8 sm:h-8 bg-black/50 text-white rounded-full 
							hover:bg-black/70 transition-colors flex items-center justify-center z-10 touch-manipulation"
					>
						<ChevronRight class="w-5 h-5 sm:w-4 sm:h-4" />
					</button>
				{/if}
			</div>
			
			<!-- Photo Indicators/Dots (only show if multiple photos) -->
			{#if photos.length > 1}
				<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-1">
					{#each photos as _, index}
						<button
							on:click={() => goToPhoto(index)}
							class="w-3 h-3 sm:w-2 sm:h-2 rounded-full transition-colors touch-manipulation
								{index === currentIndex ? 'bg-white' : 'bg-white/50'}"
						/>
					{/each}
				</div>
			{/if}
			
			<!-- Photo Counter (only show if multiple photos) -->
			{#if photos.length > 1}
				<div class="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
					{currentIndex + 1} / {photos.length}
				</div>
			{/if}
		</div>
		
		<!-- Doctor's Note for Current Photo -->
		<div class="space-y-2">
			<label for="doctor-note-{photos[currentIndex].id}" class="flex items-center gap-2 text-sm font-medium text-pink-700">
				<FileText class="w-4 h-4" />
				{$t.photoUpload.doctorNote} {photos.length > 1 ? `(${$t.photoUpload.photo} ${currentIndex + 1})` : ''}
			</label>
			<textarea
				id="doctor-note-{photos[currentIndex].id}"
				name="doctor-note-{photos[currentIndex].id}"
				bind:value={photos[currentIndex].doctorNote}
				on:blur={() => updateDoctorNote(photos[currentIndex].id, photos[currentIndex].doctorNote || '')}
				placeholder={$t.photoUpload.addNotesPlaceholder}
				class="w-full p-3 border border-pink-200 rounded-xl {userProfile?.is_admin && !readonly ? 'focus:ring-2 focus:ring-pink-500 focus:border-transparent' : 'bg-gray-50'} resize-none text-sm sm:text-base"
				rows="3"
				readonly={!userProfile?.is_admin || readonly}
			></textarea>
		</div>
		
		<!-- Add More Photos Button - Admin only -->
		{#if userProfile?.is_admin && !readonly}
		<div
			class="w-full p-4 sm:p-3 border-2 border-dashed border-pink-200 rounded-xl text-pink-600 
				hover:border-pink-300 hover:bg-pink-25 transition-colors cursor-pointer touch-manipulation
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
				<Upload class="w-5 h-5" />
				<span class="text-sm sm:text-base">{$t.photoUpload.addMorePhotos}</span>
			</div>
		</div>
		{/if}
	</div>
{:else}
	<!-- Empty State - Upload Zone -->
	{#if userProfile?.is_admin && !readonly}
	<div
		class="w-full h-48 sm:h-64 border-2 border-dashed border-pink-200 rounded-xl 
			hover:border-pink-300 hover:bg-pink-25 transition-colors cursor-pointer touch-manipulation
			{dragOver ? 'border-pink-400 bg-pink-50' : ''}"
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:click={() => fileInput.click()}
		on:keydown={(e) => e.key === 'Enter' && fileInput.click()}
		role="button"
		tabindex="0"
	>
		<div class="flex flex-col items-center justify-center h-full text-pink-600 p-4">
			<ImageIcon class="w-12 h-12 mb-4" />
			<h3 class="text-base sm:text-lg font-medium mb-2 non-cursive">{placeholder}</h3>
			<p class="text-sm text-center">{$t.photoUpload.dropYourPhotos}</p>
			<p class="text-xs text-pink-500 mt-2">{$t.photoUpload.fileFormats}</p>
		</div>
	</div>
	{:else}
	<div class="w-full h-48 sm:h-64 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
		<div class="text-center text-gray-500 p-4">
			<ImageIcon class="w-12 h-12 mx-auto mb-4" />
			<p class="text-sm sm:text-base">No photos uploaded</p>
		</div>
	</div>
	{/if}
{/if}

<!-- Hidden File Input -->
<input
	bind:this={fileInput}
	type="file"
	accept="image/*"
	{multiple}
	class="hidden"
	id="photo-upload-input"
	name="photo-upload"
	on:change={handleFileSelect}
/>

<!-- Modal for full-screen image view -->
{#if showModal}
<div 
	use:appendToBody
	class="fixed inset-0 w-screen h-screen bg-black/95 z-50 flex items-center justify-center modal-backdrop"
	on:click={handleModalClick}
	on:keydown={(e) => e.key === 'Escape' && closeModal()}
	role="dialog"
	aria-modal="true"
	tabindex="-1"
>
	<!-- Modal Content Container -->
	<div class="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
		<!-- Image Container -->
		<div class="relative flex items-center justify-center max-w-[90vw] max-h-[90vh]">
			<img
				src={modalImageUrl}
				alt={$t.photoUpload.enlargedPhotoView}
				class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
				style="min-width: 200px; min-height: 150px; max-width: 90vw; max-height: 90vh;"
			/>
		</div>
		
		<!-- Close Button - Enhanced visibility -->
		<button
			on:click={closeModal}
			class="absolute top-4 right-4 sm:top-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 
				bg-white/90 text-gray-900 rounded-full hover:bg-white transition-all duration-200 
				flex items-center justify-center touch-manipulation shadow-2xl border-2 border-gray-200
				hover:scale-110 z-10"
			aria-label="Close full-screen view"
		>
			<X class="w-7 h-7 sm:w-8 sm:h-8 stroke-2" />
		</button>
		
		<!-- Instructions Text -->
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm text-center bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
			<p>Click outside image or press ESC to close</p>
		</div>
	</div>
</div>
{/if} 