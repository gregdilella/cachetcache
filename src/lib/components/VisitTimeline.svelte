<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Calendar, ChevronDown, ChevronRight, Plus, Upload, X } from 'lucide-svelte';
	import PhotoUpload from './PhotoUpload.svelte';
	import { t } from '$lib/i18n/translations/index.js';
	import { currentLanguage } from '$lib/i18n/index.js';
	
	export let visits: Visit[] = [];
	export let userProfile: any = null; // Add user profile prop to check admin status
	
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
		
		// Get today's date in local timezone (YYYY-MM-DD format)
		const today = new Date();
		const localDate = today.getFullYear() + '-' + 
			String(today.getMonth() + 1).padStart(2, '0') + '-' + 
			String(today.getDate()).padStart(2, '0');
		
		const newVisit: Visit = {
			id: crypto.randomUUID(),
			title: newVisitTitle.trim(),
			expanded: true,
			initialConsultDate: localDate, // Set today as default in local timezone
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
		if (confirm($t.visitTimeline.deleteConfirm)) {
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
			return $t.visitTimeline.noPhotosYet;
		}
		
		const parts = [];
		if (initialCount > 0) {
			const photoText = initialCount > 1 ? $t.visitTimeline.initialConsultPhotos : $t.visitTimeline.initialConsultPhoto;
			parts.push(`${initialCount} ${photoText}`);
		}
		if (followUpCount > 0) {
			const photoText = followUpCount > 1 ? $t.visitTimeline.followUpPhotos : $t.visitTimeline.followUpPhoto;
			parts.push(`${followUpCount} ${photoText}`);
		}
		
		return parts.join(' & ');
	}
	
	function formatDateToMonthYear(dateString: string | undefined): string {
		if (!dateString) return '';
		
		try {
			const date = new Date(dateString);
			// Use the current language locale for date formatting
			const locale = $currentLanguage === 'fr' ? 'fr-CA' : 'en-US';
			return date.toLocaleDateString(locale, { 
				year: 'numeric', 
				month: 'long' 
			});
		} catch {
			return '';
		}
	}
</script>

<div class="space-y-6">
	<!-- Add New Visit - Only show for admin users -->
	{#if userProfile?.is_admin}
	<div class="auth-gradient-border cf-hover">
		<div class="p-4 sm:p-8">
			<div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
				<div class="w-3 h-3 rounded-full" style="background-color: #B1BCA0;"></div>
				<div>
					<h3 class="font-bold cf-text text-lg sm:text-xl timeline-heading">{$t.visitTimeline.addNewVisit}</h3>
					<p class="text-sm sm:text-base cf-text-muted mt-1">{$t.visitTimeline.createNewRecord}</p>
				</div>
			</div>
			
			<div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
				<div class="flex-1 auth-gradient-border">
					<input
						type="text"
						bind:value={newVisitTitle}
						placeholder={$t.visitTimeline.visitTitlePlaceholder}
						class="w-full px-4 py-3 sm:py-2 rounded-lg border-0 focus:ring-2 focus:ring-pink-500 cf-text text-base sm:text-sm"
						on:keydown={(e) => e.key === 'Enter' && addNewVisit()}
						id="new-visit-title"
						name="newVisitTitle"
					/>
				</div>
				<button
					on:click={addNewVisit}
					disabled={!newVisitTitle.trim()}
					class="px-6 py-3 sm:py-2 text-base sm:text-sm font-medium text-white 
						disabled:opacity-50 disabled:cursor-not-allowed 
						transition-all duration-200 cf-hover touch-manipulation rounded-lg"
					style="background-color: #B1BCA0;"
				>
					<span class="flex items-center gap-2">
						<Plus class="w-5 h-5 sm:w-4 sm:h-4" />
						{$t.visitTimeline.addVisit}
					</span>
				</button>
			</div>
		</div>
	</div>
	{/if}
	
	<!-- Visit Timeline -->
	{#each visits as visit (visit.id)}
		<div class="auth-gradient-border cf-hover">
			<div class="p-4 sm:p-8">
				<!-- Visit Header -->
				<div class="flex items-start justify-between mb-4 sm:mb-6">
					<button
						on:click={() => toggleVisit(visit.id)}
						class="flex items-center gap-3 sm:gap-4 flex-1 text-left cf-hover transition-all duration-200 touch-manipulation"
						aria-expanded={visit.expanded}
					>
						<div class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: #B1BCA0;"></div>
						<div class="min-w-0">
							<h3 class="font-bold cf-text text-lg sm:text-xl visit-title">{visit.title}</h3>
							<p class="text-sm sm:text-base cf-text-muted mt-1">{getPhotosSummary(visit)}</p>
						</div>
						<div class="ml-auto flex-shrink-0">
							{#if visit.expanded}
								<ChevronDown class="w-5 h-5" style="color: #B1BCA0;" />
							{:else}
								<ChevronRight class="w-5 h-5" style="color: #B1BCA0;" />
							{/if}
						</div>
					</button>

					<!-- Delete Button - Admin only -->
					{#if userProfile?.is_admin}
					<button
						on:click|stopPropagation={() => deleteVisit(visit.id)}
						class="ml-3 sm:ml-4 p-2 text-red-600 hover:text-red-700 transition-colors 
							cf-hover rounded-lg touch-manipulation"
						aria-label="Delete visit {visit.title}"
					>
						<X class="w-5 h-5" />
					</button>
					{/if}
				</div>

				<!-- Expanded Content -->
				{#if visit.expanded}
					<div class="space-y-6 sm:space-y-8 ml-7 sm:ml-7">
						<!-- Initial Consultation -->
						<div class="space-y-3 sm:space-y-4">
							<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
								<h4 class="font-semibold cf-text text-base sm:text-lg visit-content">
									{$t.visitTimeline.initialConsult}
								</h4>
								{#if userProfile?.is_admin}
								<input
									type="date"
									bind:value={visit.initialConsultDate}
									on:change={() => updateVisitDate(visit.id, 'initialConsultDate', visit.initialConsultDate || '')}
									class="text-sm sm:text-base cf-text border border-pink-200 rounded-lg px-3 py-2 
										focus:ring-2 focus:ring-pink-500 focus:border-transparent"
									id="initial-consult-date-{visit.id}"
									name="initialConsultDate-{visit.id}"
								/>
								{:else if visit.initialConsultDate}
								<span class="text-sm sm:text-base cf-text-muted">
									{formatDateToMonthYear(visit.initialConsultDate)}
								</span>
								{/if}
							</div>
							
							<PhotoUpload
								placeholder={$t.visitTimeline.uploadInitialPhotos}
								photos={visit.initialConsultPhotos || []}
								{userProfile}
								readonly={!userProfile?.is_admin}
								on:upload={(event) => handlePhotoUpload(visit.id, 'initialConsult', event)}
								on:remove={(event) => handlePhotoRemove(visit.id, 'initialConsult', event.detail)}
								on:noteUpdate={(event) => handleNoteUpdate(visit.id, 'initialConsult', event)}
							/>
						</div>

						<!-- Follow-up -->
						<div class="space-y-3 sm:space-y-4">
							<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
								<h4 class="font-semibold cf-text text-base sm:text-lg visit-content">
									{$t.visitTimeline.followUp}
								</h4>
								{#if userProfile?.is_admin}
								<input
									type="date"
									bind:value={visit.followUpDate}
									on:change={() => updateVisitDate(visit.id, 'followUpDate', visit.followUpDate || '')}
									class="text-sm sm:text-base cf-text border border-pink-200 rounded-lg px-3 py-2 
										focus:ring-2 focus:ring-pink-500 focus:border-transparent"
									id="follow-up-date-{visit.id}"
									name="followUpDate-{visit.id}"
								/>
								{:else if visit.followUpDate}
								<span class="text-sm sm:text-base cf-text-muted">
									{formatDateToMonthYear(visit.followUpDate)}
								</span>
								{/if}
							</div>
							
							<PhotoUpload
								placeholder={$t.visitTimeline.uploadFollowUpPhotos}
								photos={visit.followUpPhotos || []}
								{userProfile}
								readonly={!userProfile?.is_admin}
								on:upload={(event) => handlePhotoUpload(visit.id, 'followUp', event)}
								on:remove={(event) => handlePhotoRemove(visit.id, 'followUp', event.detail)}
								on:noteUpdate={(event) => handleNoteUpdate(visit.id, 'followUp', event)}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="text-center py-12 sm:py-16">
			<Calendar class="mx-auto h-12 w-12 text-gray-400 mb-4" />
			<h3 class="text-lg sm:text-xl font-medium font-normal cf-text mb-2">{$t.visitTimeline.noVisitsYet}</h3>
		</div>
	{/each}
</div>

<!-- Photo Upload Component --> 