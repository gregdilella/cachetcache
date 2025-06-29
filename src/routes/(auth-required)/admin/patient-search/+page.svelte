<script lang="ts">
	import { Search, User, Calendar, Phone, Users as UsersIcon } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/translations/index.js';

	export let data: PageData;

	let searchTerm = '';
	$: filteredUsers = data.users.filter(user => {
		if (!searchTerm) return true;
		const search = searchTerm.toLowerCase();
		return (
			user.name?.toLowerCase().includes(search) ||
			user.phone_number?.toLowerCase().includes(search) ||
			user.sex?.toLowerCase().includes(search) ||
			user.id?.toString().includes(search)
		);
	});

	function formatDate(dateString: string | null) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString();
	}

	function calculateAge(birthdate: string | null, age: number | null) {
		if (birthdate) {
			const today = new Date();
			const birth = new Date(birthdate);
			let calculatedAge = today.getFullYear() - birth.getFullYear();
			const monthDiff = today.getMonth() - birth.getMonth();
			
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
				calculatedAge--;
			}
			return calculatedAge;
		}
		return age || 'N/A';
	}

	function navigateToPatientTimeline(userId: string) {
		goto(`/dashboard/${userId}`);
	}
</script>

<svelte:head>
	<title>{$t.patientSearch.title}</title>
</svelte:head>

<div class="max-w-7xl mx-auto p-4 sm:p-6">
	<div class="mb-6 sm:mb-8">
		<div class="flex items-center gap-3 mb-2">
			<UsersIcon class="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
			<h1 class="text-2xl sm:text-3xl font-bold cf-text">{$t.patientSearch.heading}</h1>
		</div>
		<p class="cf-text-muted text-sm sm:text-base">{$t.patientSearch.subtitle}</p>
	</div>

	<!-- Search Box -->
	<div class="mb-6">
		<div class="relative w-full sm:max-w-md pink-gradient-border">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
				<Search class="h-5 w-5 text-gray-400" />
			</div>
			<input
				type="text"
				bind:value={searchTerm}
				placeholder={$t.patientSearch.searchPlaceholder}
				class="block w-full pl-10 pr-3 py-3 sm:py-2 border-0 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 cf-text text-base sm:text-sm"
				id="patient-search"
				name="searchTerm"
			/>
		</div>
		<p class="mt-2 text-sm cf-text-light">
			{$t.patientSearch.showingResults} {filteredUsers.length} {$t.patientSearch.ofResults} {data.users.length} {$t.patientSearch.patients}
		</p>
	</div>

	<!-- Users Table - Desktop -->
	<div class="hidden sm:block gradient-border-card shadow-lg overflow-hidden">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium cf-text-light uppercase tracking-wider">
							{$t.patientSearch.patientInfo}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium cf-text-light uppercase tracking-wider">
							{$t.patientSearch.contact}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium cf-text-light uppercase tracking-wider">
							{$t.patientSearch.demographics}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium cf-text-light uppercase tracking-wider">
							{$t.patientSearch.registration}
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each filteredUsers as user (user.id)}
						<tr 
							class="hover:bg-gray-50 cf-hover cursor-pointer transition-colors" 
							on:click={() => navigateToPatientTimeline(user.id)}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && navigateToPatientTimeline(user.id)}
						>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-shrink-0 h-10 w-10">
										<div class="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
											<User class="h-5 w-5 text-pink-600" />
										</div>
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium cf-text">
											{user.name || $t.patientSearch.noName}
										</div>
										<div class="text-sm cf-text-muted">
											ID: {user.id}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm cf-text flex items-center gap-2">
									<Phone class="h-4 w-4 text-gray-400" />
									{user.phone_number || $t.patientSearch.noPhone}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm cf-text">
									<div class="flex items-center gap-4">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{user.sex || 'N/A'}
										</span>
										<span class="cf-text-muted">
											{$t.patientSearch.age}: {calculateAge(user.birthdate, user.age)}
										</span>
									</div>
								</div>
								{#if user.birthdate}
									<div class="text-xs cf-text-light mt-1 flex items-center gap-1">
										<Calendar class="h-3 w-3" />
										{$t.patientSearch.born}: {formatDate(user.birthdate)}
									</div>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm cf-text-light">
								<div>
									{$t.patientSearch.registered}: {formatDate(user.created_at)}
								</div>
								{#if user.updated_at && user.updated_at !== user.created_at}
									<div class="text-xs">
										{$t.patientSearch.updated}: {formatDate(user.updated_at)}
									</div>
								{/if}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="px-6 py-12 text-center">
								<div class="cf-text-light">
									<UsersIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
									<h3 class="text-sm font-medium cf-text mb-1">{$t.patientSearch.noPatientsFound}</h3>
									<p class="text-sm">
										{searchTerm ? $t.patientSearch.tryAdjusting : $t.patientSearch.noRegistrations}
									</p>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Users Cards - Mobile -->
	<div class="sm:hidden space-y-4">
		{#each filteredUsers as user (user.id)}
			<div 
				class="gradient-border-card cf-hover cursor-pointer p-4"
				on:click={() => navigateToPatientTimeline(user.id)}
				role="button"
				tabindex="0"
				on:keydown={(e) => e.key === 'Enter' && navigateToPatientTimeline(user.id)}
			>
				<div class="flex items-start gap-3">
					<div class="flex-shrink-0 h-12 w-12">
						<div class="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
							<User class="h-6 w-6 text-pink-600" />
						</div>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-medium cf-text truncate">
								{user.name || $t.patientSearch.noName}
							</h3>
							<div class="flex-shrink-0">
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{user.sex || 'N/A'}
								</span>
							</div>
						</div>
						<p class="text-sm cf-text-muted">ID: {user.id}</p>
						
						<div class="mt-2 space-y-1">
							<div class="text-sm cf-text flex items-center gap-2">
								<Phone class="h-4 w-4 text-gray-400 flex-shrink-0" />
								<span class="truncate">{user.phone_number || $t.patientSearch.noPhone}</span>
							</div>
							
							<div class="text-sm cf-text-muted">
								{$t.patientSearch.age}: {calculateAge(user.birthdate, user.age)}
							</div>
							
							{#if user.birthdate}
								<div class="text-xs cf-text-light flex items-center gap-1">
									<Calendar class="h-3 w-3 flex-shrink-0" />
									<span>{$t.patientSearch.born}: {formatDate(user.birthdate)}</span>
								</div>
							{/if}
							
							<div class="text-xs cf-text-light">
								{$t.patientSearch.registered}: {formatDate(user.created_at)}
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="text-center py-12">
				<UsersIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
				<h3 class="text-lg font-medium cf-text mb-2">{$t.patientSearch.noPatientsFound}</h3>
				<p class="text-sm cf-text-muted">
					{searchTerm ? $t.patientSearch.tryAdjusting : $t.patientSearch.noRegistrations}
				</p>
			</div>
		{/each}
	</div>

	<!-- Summary Stats -->
	<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
		<div class="pink-gradient-border overflow-hidden cf-hover">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<UsersIcon class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium cf-text-light truncate">{$t.patientSearch.totalPatients}</dt>
							<dd class="text-lg font-medium cf-text">{data.users.length}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="pink-gradient-border overflow-hidden cf-hover">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<User class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium cf-text-light truncate">{$t.patientSearch.completeProfiles}</dt>
							<dd class="text-lg font-medium cf-text">
								{data.users.filter(u => u.name && u.phone_number && u.sex).length}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="pink-gradient-border overflow-hidden cf-hover">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Calendar class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium cf-text-light truncate">{$t.patientSearch.withBirthdate}</dt>
							<dd class="text-lg font-medium cf-text">
								{data.users.filter(u => u.birthdate).length}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="pink-gradient-border overflow-hidden cf-hover">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Phone class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium cf-text-light truncate">{$t.patientSearch.withPhone}</dt>
							<dd class="text-lg font-medium cf-text">
								{data.users.filter(u => u.phone_number).length}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</div> 