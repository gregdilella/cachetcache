<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { PageData, ActionData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import VisitTimeline from '$lib/components/VisitTimeline.svelte';
	import { User, Settings, Calendar } from 'lucide-svelte';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let activeTab = 'visits'; // Set to 'visits' to see the timeline by default
	
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

	// Visit timeline handlers
	async function handleVisitAdded(event: CustomEvent) {
		const visit = event.detail;
		console.log('Visit added:', visit);
		
		// Use fetch to submit without page reload
		try {
			const formData = new FormData();
			formData.append('title', visit.title);
			
			const response = await fetch('?/createVisit', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				// Optionally refresh data or handle success
				console.log('Visit created successfully');
			}
		} catch (error) {
			console.error('Error creating visit:', error);
		}
	}
	
	async function handleVisitDeleted(event: CustomEvent) {
		const { visitId } = event.detail;
		console.log('Visit deleted:', visitId);
		
		// Use fetch to submit without page reload
		try {
			const formData = new FormData();
			formData.append('visitId', visitId);
			
			const response = await fetch('?/deleteVisit', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				console.log('Visit deleted successfully');
			}
		} catch (error) {
			console.error('Error deleting visit:', error);
		}
	}
	
	function handlePhotoUpload(event: CustomEvent) {
		const { visitId, type, file, photoId } = event.detail;
		console.log('Photo upload:', { visitId, type, file, photoId });
		
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
				
				if (response.ok) {
					console.log('Photo uploaded successfully');
					// Refresh the page data to show the uploaded photo
					window.location.reload();
				} else {
					console.error('Failed to upload photo');
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
		console.log('Photo removed:', { visitId, type, photoId });
		
		try {
			const formData = new FormData();
			formData.append('photoId', photoId);
			
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				console.log('Photo deleted successfully');
				// Refresh the page data to reflect the deletion
				window.location.reload();
			} else {
				console.error('Failed to delete photo');
			}
		} catch (error) {
			console.error('Error deleting photo:', error);
		}
	}
	
	async function handleNoteUpdated(event: CustomEvent) {
		const { visitId, type, photoId, note } = event.detail;
		console.log('Note updated:', { visitId, type, photoId, note });
		
		// Use fetch to submit without page reload
		try {
			const formData = new FormData();
			formData.append('photoId', photoId);
			formData.append('note', note);
			
			const response = await fetch('?/updatePhotoNote', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				console.log('Note updated successfully');
			}
		} catch (error) {
			console.error('Error updating note:', error);
		}
	}
	
	async function handleDateUpdated(event: CustomEvent) {
		const { visitId, dateType, date } = event.detail;
		console.log('Date updated:', { visitId, dateType, date });
		
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
			
			if (response.ok) {
				console.log('Date updated successfully');
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
	<title>Dashboard | Cachet Caché</title>
</svelte:head>

<!-- Dashboard Header -->
<div class="instagram-card p-6 mb-6">
	<div class="flex flex-col sm:flex-row items-center gap-6">
		<div class="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
			{#if mostRecentPhoto}
				<img 
					src={mostRecentPhoto.url} 
					alt="Profile" 
					class="w-full h-full object-cover"
				/>
			{:else}
				<User class="w-10 h-10 text-white" />
			{/if}
		</div>
		<div class="flex-1 text-center sm:text-left">
			<h1 class="text-2xl font-bold text-pink-800 mb-2">
				{data.userProfile?.name || 'Welcome'}
			</h1>
			<p class="text-pink-600">{data.userProfile?.email || 'Complete your profile'}</p>
			
			<!-- Stats -->
			<div class="flex justify-center sm:justify-start gap-6 mt-4">
				<div class="text-center">
					<span class="block font-bold text-pink-800">{visits.length || 0}</span>
					<span class="text-sm text-pink-600">Visits</span>
				</div>
				<div class="text-center">
					<span class="block font-bold text-pink-800">Private</span>
					<span class="text-sm text-pink-600">Account</span>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Tab Navigation -->
<div class="instagram-card p-0 mb-6">
	<div class="flex border-b border-pink-200">
		<button
			class="flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors
				{activeTab === 'profile' 
					? 'text-pink-700 border-b-2 border-pink-500 bg-pink-50' 
					: 'text-pink-600 hover:text-pink-700 hover:bg-pink-25'}"
			on:click={() => activeTab = 'profile'}
		>
			<Settings class="w-5 h-5" />
			Profile Settings
		</button>
		<button
			class="flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors
				{activeTab === 'visits' 
					? 'text-pink-700 border-b-2 border-pink-500 bg-pink-50' 
					: 'text-pink-600 hover:text-pink-700 hover:bg-pink-25'}"
			on:click={() => activeTab = 'visits'}
		>
			<Calendar class="w-5 h-5" />
			Visit Timeline
		</button>
	</div>
</div>

{#if activeTab === 'profile'}
	<!-- Profile Settings Tab -->
	<div class="instagram-card p-6">
		<div class="flex items-center gap-3 mb-6">
			<div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
				<Settings class="w-5 h-5 text-white" />
			</div>
			<div>
				<h2 class="font-semibold text-pink-800">Profile Information</h2>
				<p class="text-xs text-pink-600">Update your personal details</p>
			</div>
		</div>

		{#if form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
				<p class="text-red-600 text-sm">{form.error}</p>
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
				<p class="text-green-600 text-sm">Profile updated successfully!</p>
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateProfile"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label for="name" class="block text-sm font-medium text-pink-700 mb-2">
						Full Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={data.userProfile?.name || ''}
						required
						class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
						placeholder="Enter your full name"
					/>
				</div>

				<div>
					<label for="phone_number" class="block text-sm font-medium text-pink-700 mb-2">
						Phone Number
					</label>
					<input
						type="tel"
						id="phone_number"
						name="phone_number"
						value={data.userProfile?.phone_number || ''}
						class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
						placeholder="Enter your phone number"
					/>
				</div>

				<div>
					<label for="sex" class="block text-sm font-medium text-pink-700 mb-2">
						Sex
					</label>
					<select
						id="sex"
						name="sex"
						class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
					>
						<option value="">Select...</option>
						<option value="Male" selected={data.userProfile?.sex === 'Male'}>Male</option>
						<option value="Female" selected={data.userProfile?.sex === 'Female'}>Female</option>
						<option value="Other" selected={data.userProfile?.sex === 'Other'}>Other</option>
					</select>
				</div>

				<div>
					<label for="age" class="block text-sm font-medium text-pink-700 mb-2">
						Age
					</label>
					<input
						type="number"
						id="age"
						name="age"
						value={data.userProfile?.age || ''}
						min="0"
						max="150"
						class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
						placeholder="Enter your age"
					/>
				</div>
			</div>

			<div class="mt-8">
				<button
					type="submit"
					disabled={loading}
					class="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium 
						hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed 
						transition-all duration-200"
				>
					{loading ? 'Updating...' : 'Update Profile'}
				</button>
			</div>
		</form>
	</div>

{:else if activeTab === 'visits'}
	<!-- Visit Timeline Tab -->
	<VisitTimeline 
		bind:visits={visits}
		on:visitAdded={handleVisitAdded}
		on:visitDeleted={handleVisitDeleted}
		on:photoUpload={handlePhotoUpload}
		on:photoRemoved={handlePhotoRemoved}
		on:noteUpdated={handleNoteUpdated}
		on:dateUpdated={handleDateUpdated}
	/>
{/if}
