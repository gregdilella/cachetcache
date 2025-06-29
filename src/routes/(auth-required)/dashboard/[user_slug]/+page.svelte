<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import VisitTimeline from '$lib/components/VisitTimeline.svelte';
	import { User, Calendar } from 'lucide-svelte';
	import { t } from '$lib/i18n/translations/index.js';

	export let data: PageData;

	let loading = false;
	
	// Use visits data from the server
	interface Visit {
		id: string;
		title: string;
		expanded: boolean;
		initialConsultDate?: string;
		followUpDate?: string;
		initialConsultPhotos?: Array<{
			id: string;
			url: string;
			uploading?: boolean;
			doctorNote?: string;
		}>;
		followUpPhotos?: Array<{
			id: string;
			url: string;
			uploading?: boolean;
			doctorNote?: string;
		}>;
	}
	
	// Initialize visits from server data
	let visits: Visit[] = data.visits || [];
	
	// Update local visits when server data changes (e.g., after successful upload)
	$: {
		if (data.visits) {
			// Update visits with fresh server data
			visits = data.visits;
		}
	}

	// Visit timeline handlers
	async function handleVisitAdded(event: CustomEvent) {
		const visit = event.detail;
		
		// Use fetch to submit without page reload
		try {
			const formData = new FormData();
			formData.append('title', visit.title);
			
			const response = await fetch('?/createVisit', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				// Refresh server data to get the new visit with correct ID
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error creating visit:', error);
		}
	}
	
	async function handleVisitDeleted(event: CustomEvent) {
		const { visitId } = event.detail;
		
		// Use fetch to submit without page reload
		try {
			const formData = new FormData();
			formData.append('visitId', visitId);
			
			const response = await fetch('?/deleteVisit', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				// Refresh server data without full page reload
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error deleting visit:', error);
		}
	}
	
	function handlePhotoUpload(event: CustomEvent) {
		const { visitId, type, file, photoId } = event.detail;
		
		// Upload to server
		const uploadPhoto = async () => {
			try {
				const formData = new FormData();
				formData.append('photo', file);
				formData.append('visitId', visitId);
				formData.append('photoType', type === 'initialConsult' ? 'initial_consult' : 'follow_up');
				
				const response = await fetch('?/uploadPhoto', {
					method: 'POST',
					body: formData
				});
				
				const result = await response.json();
				
				if (response.ok) {
					// Refresh server data to get the uploaded photo
					await invalidateAll();
				} else {
					console.error('Failed to upload photo:', result);
					// Remove the photo from local state on failure
					visits = visits.map(visit => {
						if (visit.id === visitId) {
							const photosKey = `${type}Photos` as keyof Visit;
							const photos = (visit[photosKey] as Array<{id: string, url: string, uploading?: boolean, doctorNote?: string}>) || [];
							return {
								...visit,
								[photosKey]: photos.filter(photo => photo.id !== photoId)
							};
						}
						return visit;
					});
				}
			} catch (error) {
				console.error('Error uploading photo:', error);
				// Remove the photo from local state on error
				visits = visits.map(visit => {
					if (visit.id === visitId) {
						const photosKey = `${type}Photos` as keyof Visit;
						const photos = (visit[photosKey] as Array<{id: string, url: string, uploading?: boolean, doctorNote?: string}>) || [];
						return {
							...visit,
							[photosKey]: photos.filter(photo => photo.id !== photoId)
						};
					}
					return visit;
				});
			}
		};
		
		uploadPhoto();
	}
	
	async function handlePhotoRemoved(event: CustomEvent) {
		const { visitId, type, photoId } = event.detail;
		
		try {
			const formData = new FormData();
			formData.append('photoId', photoId);
			
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				// Refresh server data without full page reload
				await invalidateAll();
			} else {
				console.error('Failed to delete photo');
			}
		} catch (error) {
			console.error('Error deleting photo:', error);
		}
	}
	
	async function handleNoteUpdated(event: CustomEvent) {
		const { visitId, type, photoId, note } = event.detail;
		
		// Use fetch to submit without page reload
		try {
			const formData = new FormData();
			formData.append('photoId', photoId);
			formData.append('note', note);
			
			const response = await fetch('?/updatePhotoNote', {
				method: 'POST',
				body: formData
			});
			
			if (!response.ok) {
				console.error('Failed to update note');
			}
		} catch (error) {
			console.error('Error updating note:', error);
		}
	}
	
	async function handleDateUpdated(event: CustomEvent) {
		const { visitId, dateType, date } = event.detail;
		
		// Use fetch to submit without page reload
		try {
			const formData = new FormData();
			formData.append('visitId', visitId);
			formData.append('expanded', 'true'); // Keep expanded state
			
			if (dateType === 'initialConsultDate') {
				formData.append('initialConsultDate', date);
			} else if (dateType === 'followUpDate') {
				formData.append('followUpDate', date);
			}
			
			const response = await fetch('?/updateVisit', {
				method: 'POST',
				body: formData
			});
			
			if (!response.ok) {
				console.error('Failed to update date');
			}
		} catch (error) {
			console.error('Error updating date:', error);
		}
	}
	
	// Get the most recent photo from all visits
	function getMostRecentPhoto() {
		let mostRecentPhoto = null;
		let mostRecentDate = null;
		let hasFollowUpPhoto = false;
		
		for (const visit of visits) {
			// Check follow-up photos first (prioritize these)
			if (visit.followUpPhotos && visit.followUpPhotos.length > 0) {
				for (const photo of visit.followUpPhotos) {
					if (!photo.uploading) {
						const visitDate = new Date(visit.followUpDate || '2024-01-01');
						if (!mostRecentDate || visitDate > mostRecentDate || !hasFollowUpPhoto) {
							mostRecentDate = visitDate;
							mostRecentPhoto = photo;
							hasFollowUpPhoto = true;
						}
					}
				}
			}
			
			// Only check initial consult photos if no follow-up photos exist
			if (!hasFollowUpPhoto && visit.initialConsultPhotos && visit.initialConsultPhotos.length > 0) {
				for (const photo of visit.initialConsultPhotos) {
					if (!photo.uploading) {
						const visitDate = new Date(visit.initialConsultDate || '2024-01-01');
						if (!mostRecentDate || visitDate > mostRecentDate) {
							mostRecentDate = visitDate;
							mostRecentPhoto = photo;
						}
					}
				}
			}
		}
		
		return mostRecentPhoto;
	}
	
	$: mostRecentPhoto = getMostRecentPhoto();
</script>

<svelte:head>
	<title>{$t.dashboard.title}</title>
</svelte:head>

<!-- Dashboard Header -->
<div class="gradient-border-card mb-8">
	<div class="p-12">
		<div class="flex flex-col sm:flex-row items-center gap-8">
			<div class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
				{#if mostRecentPhoto}
					<img 
						src={mostRecentPhoto.url} 
						alt="Profile" 
						class="w-full h-full object-cover"
					/>
				{:else}
					<User class="w-12 h-12 text-white" />
				{/if}
			</div>
			<div class="flex-1 text-center sm:text-left">
				<h1 class="text-3xl font-bold cf-text mb-3">
					{data.userProfile?.name || $t.dashboard.welcome}
				</h1>
				<p class="cf-text-muted text-lg">{data.userProfile?.email || $t.dashboard.completeProfile}</p>
				
				<!-- Stats -->
				<div class="flex justify-center sm:justify-start gap-8 mt-6">
					<div class="text-center">
						<span class="block font-bold cf-text text-xl">{visits.length || 0}</span>
						<span class="text-base cf-text-muted">{$t.dashboard.visits}</span>
					</div>
					<div class="text-center">
						<span class="block font-bold cf-text text-xl">{$t.dashboard.privateAccount}</span>
						<span class="text-base cf-text-muted">{$t.dashboard.account}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Visit Timeline -->
<VisitTimeline 
	bind:visits={visits}
	userProfile={data.currentUser}
	on:visitAdded={handleVisitAdded}
	on:visitDeleted={handleVisitDeleted}
	on:photoUpload={handlePhotoUpload}
	on:photoRemoved={handlePhotoRemoved}
	on:noteUpdated={handleNoteUpdated}
	on:dateUpdated={handleDateUpdated}
/>

