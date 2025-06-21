<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Calendar, ChevronDown, ChevronRight, Plus, Upload, X } from 'lucide-svelte';
	import PhotoUpload from './PhotoUpload.svelte';
	
	export let visits: Visit[] = [];
	
	const dispatch = createEventDispatcher();
	
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
	
	let newVisitTitle = '';
	
	function addNewVisit() {
		if (!newVisitTitle.trim()) return;
		
		const newVisit: Visit = {
			id: crypto.randomUUID(),
			title: newVisitTitle.trim(),
			expanded: true,
			initialConsultPhotos: [],
			followUpPhotos: []
		};
		
		visits = [newVisit, ...visits];
		newVisitTitle = '';
		
		dispatch('visitAdded', newVisit);
	}
	
	function toggleVisit(visitId: string) {
		visits = visits.map(visit => 
			visit.id === visitId 
				? { ...visit, expanded: !visit.expanded }
				: visit
		);
	}
	
	function deleteVisit(visitId: string) {
		if (confirm('Are you sure you want to delete this visit and all its photos?')) {
			visits = visits.filter(visit => visit.id !== visitId);
			dispatch('visitDeleted', { visitId });
		}
	}
	
	function handlePhotoUpload(visitId: string, type: 'initialConsult' | 'followUp', event: CustomEvent<File>) {
		const file = event.detail;
		
		// Create new photo object
		const newPhoto = {
			id: crypto.randomUUID(),
			url: URL.createObjectURL(file),
			uploading: true,
			doctorNote: ''
		};
		
		// Update the visit to add the new photo
		visits = visits.map(visit => {
			if (visit.id === visitId) {
				const photosKey = `${type}Photos` as keyof Visit;
				const currentPhotos = visit[photosKey] as Array<any> || [];
				
				return {
					...visit,
					[photosKey]: [...currentPhotos, newPhoto]
				};
			}
			return visit;
		});
		
		dispatch('photoUpload', { visitId, type, file, photoId: newPhoto.id });
	}
	
	function handlePhotoRemove(visitId: string, type: 'initialConsult' | 'followUp', photoId: string) {
		visits = visits.map(visit => {
			if (visit.id === visitId) {
				const photosKey = `${type}Photos` as keyof Visit;
				const currentPhotos = visit[photosKey] as Array<any> || [];
				
				return {
					...visit,
					[photosKey]: currentPhotos.filter(photo => photo.id !== photoId)
				};
			}
			return visit;
		});
		
		dispatch('photoRemoved', { visitId, type, photoId });
	}
	
	function handleNoteUpdate(visitId: string, type: 'initialConsult' | 'followUp', event: CustomEvent) {
		const { photoId, note } = event.detail;
		
		visits = visits.map(visit => {
			if (visit.id === visitId) {
				const photosKey = `${type}Photos` as keyof Visit;
				const currentPhotos = visit[photosKey] as Array<any> || [];
				
				return {
					...visit,
					[photosKey]: currentPhotos.map(photo => 
						photo.id === photoId 
							? { ...photo, doctorNote: note }
							: photo
					)
				};
			}
			return visit;
		});
		
		dispatch('noteUpdated', { visitId, type, photoId, note });
	}
	
	function updateVisitDate(visitId: string, dateType: 'initialConsultDate' | 'followUpDate', date: string) {
		visits = visits.map(visit => 
			visit.id === visitId 
				? { ...visit, [dateType]: date }
				: visit
		);
		
		dispatch('dateUpdated', { visitId, dateType, date });
	}
	
	function getPhotosSummary(visit: Visit): string {
		const initialCount = visit.initialConsultPhotos?.length || 0;
		const followUpCount = visit.followUpPhotos?.length || 0;
		
		if (initialCount === 0 && followUpCount === 0) {
			return 'No photos yet';
		}
		
		const parts = [];
		if (initialCount > 0) {
			parts.push(`${initialCount} initial consult photo${initialCount > 1 ? 's' : ''}`);
		}
		if (followUpCount > 0) {
			parts.push(`${followUpCount} follow-up photo${followUpCount > 1 ? 's' : ''}`);
		}
		
		return parts.join(' & ');
	}
	
	function formatDateToMonthYear(dateString: string | undefined): string {
		if (!dateString) return '';
		
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'long' 
			});
		} catch {
			return '';
		}
	}
</script>

<div class="space-y-6">
	<!-- Add New Visit -->
	<div class="instagram-card p-6">
		<div class="flex items-center gap-3 mb-4">
			<div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
				<Calendar class="w-5 h-5 text-white" />
			</div>
			<div>
				<h3 class="font-semibold text-pink-800">Add New Visit</h3>
				<p class="text-xs text-pink-600">Create a new patient visit record</p>
			</div>
		</div>
		
		<div class="flex gap-3">
			<input
				type="text"
				bind:value={newVisitTitle}
				placeholder="Visit title (e.g., 'Botox Treatment', 'Follow-up Consultation')"
				class="flex-1 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
			/>
			<button
				on:click={addNewVisit}
				disabled={!newVisitTitle.trim()}
				class="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium 
					hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed 
					transition-all duration-200 flex items-center gap-2"
			>
				<Plus class="w-4 h-4" />
				Add Visit
			</button>
		</div>
	</div>
	
	<!-- Visit Timeline -->
	{#if visits.length === 0}
		<div class="instagram-card p-12 text-center">
			<Calendar class="w-12 h-12 text-pink-300 mx-auto mb-4" />
			<h3 class="text-lg font-semibold text-pink-700 mb-2">No visits recorded yet</h3>
			<p class="text-pink-600">Add your first visit above to get started</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each visits as visit (visit.id)}
				<div class="instagram-card overflow-hidden">
					<!-- Visit Header -->
					<button
						class="w-full p-6 flex items-center justify-between hover:bg-pink-25 transition-colors"
						on:click={() => toggleVisit(visit.id)}
					>
						<div class="flex items-center gap-4">
							<div class="w-3 h-3 rounded-full bg-pink-500"></div>
							<div class="text-left">
								<h3 class="font-semibold text-pink-800">
									{visit.title}
									{#if formatDateToMonthYear(visit.initialConsultDate)}
										<span class="text-pink-600 font-normal">
											- {formatDateToMonthYear(visit.initialConsultDate)}
										</span>
									{/if}
								</h3>
								<p class="text-sm text-pink-600">
									{getPhotosSummary(visit)}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<button
								on:click|stopPropagation={() => deleteVisit(visit.id)}
								class="p-2 text-pink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
							>
								<X class="w-4 h-4" />
							</button>
							{#if visit.expanded}
								<ChevronDown class="w-5 h-5 text-pink-500" />
							{:else}
								<ChevronRight class="w-5 h-5 text-pink-500" />
							{/if}
						</div>
					</button>
					
					<!-- Visit Content -->
					{#if visit.expanded}
						<div class="px-6 pb-6 border-t border-pink-100">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
								<!-- Initial Consult -->
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<h4 class="font-medium text-pink-700 flex items-center gap-2">
											<div class="w-2 h-2 rounded-full bg-blue-400"></div>
											Initial Consult
											{#if visit.initialConsultPhotos && visit.initialConsultPhotos.length > 0}
												<span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
													{visit.initialConsultPhotos.length}
												</span>
											{/if}
										</h4>
									</div>
									
									<!-- Date Input -->
									<div>
										<label for="initial-consult-date-{visit.id}" class="block text-xs font-medium text-pink-600 mb-1">Date</label>
										<input
											id="initial-consult-date-{visit.id}"
											type="date"
											bind:value={visit.initialConsultDate}
											on:change={() => updateVisitDate(visit.id, 'initialConsultDate', visit.initialConsultDate || '')}
											class="w-full p-2 text-sm border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
										/>
									</div>
									
									<PhotoUpload
										photos={visit.initialConsultPhotos || []}
										on:upload={(e) => handlePhotoUpload(visit.id, 'initialConsult', e)}
										on:remove={(e) => handlePhotoRemove(visit.id, 'initialConsult', e.detail)}
										on:noteUpdate={(e) => handleNoteUpdate(visit.id, 'initialConsult', e)}
										placeholder="Upload initial consult photos"
									/>
								</div>
								
								<!-- Follow Up -->
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<h4 class="font-medium text-pink-700 flex items-center gap-2">
											<div class="w-2 h-2 rounded-full bg-green-400"></div>
											Follow Up
											{#if visit.followUpPhotos && visit.followUpPhotos.length > 0}
												<span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
													{visit.followUpPhotos.length}
												</span>
											{/if}
										</h4>
									</div>
									
									<!-- Date Input -->
									<div>
										<label for="follow-up-date-{visit.id}" class="block text-xs font-medium text-pink-600 mb-1">Date</label>
										<input
											id="follow-up-date-{visit.id}"
											type="date"
											bind:value={visit.followUpDate}
											on:change={() => updateVisitDate(visit.id, 'followUpDate', visit.followUpDate || '')}
											class="w-full p-2 text-sm border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
										/>
									</div>
									
									<PhotoUpload
										photos={visit.followUpPhotos || []}
										on:upload={(e) => handlePhotoUpload(visit.id, 'followUp', e)}
										on:remove={(e) => handlePhotoRemove(visit.id, 'followUp', e.detail)}
										on:noteUpdate={(e) => handleNoteUpdate(visit.id, 'followUp', e)}
										placeholder="Upload follow-up photos"
									/>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Photo Upload Component --> 