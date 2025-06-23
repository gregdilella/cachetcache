<script lang="ts">
	import { Search, User, Calendar, Phone, Users as UsersIcon } from 'lucide-svelte';
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
</script>

<svelte:head>
	<title>{$t.patientSearch.title}</title>
</svelte:head>

<div class="max-w-7xl mx-auto p-6">
	<div class="mb-8">
		<div class="flex items-center gap-3 mb-2">
			<UsersIcon class="w-8 h-8 text-pink-600" />
			<h1 class="text-3xl font-bold text-gray-900">{$t.patientSearch.heading}</h1>
		</div>
		<p class="text-gray-600">{$t.patientSearch.subtitle}</p>
	</div>

	<!-- Search Box -->
	<div class="mb-6">
		<div class="relative max-w-md">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Search class="h-5 w-5 text-gray-400" />
			</div>
			<input
				type="text"
				bind:value={searchTerm}
				placeholder={$t.patientSearch.searchPlaceholder}
				class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
			/>
		</div>
		<p class="mt-2 text-sm text-gray-500">
			{$t.patientSearch.showingResults} {filteredUsers.length} {$t.patientSearch.ofResults} {data.users.length} {$t.patientSearch.patients}
		</p>
	</div>

	<!-- Users Table -->
	<div class="bg-white shadow-lg rounded-lg overflow-hidden">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$t.patientSearch.patientInfo}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$t.patientSearch.contact}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$t.patientSearch.demographics}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{$t.patientSearch.registration}
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each filteredUsers as user (user.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-shrink-0 h-10 w-10">
										<div class="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
											<User class="h-5 w-5 text-pink-600" />
										</div>
									</div>
									<div class="ml-4">
																			<div class="text-sm font-medium text-gray-900">
										{user.name || $t.patientSearch.noName}
									</div>
										<div class="text-sm text-gray-500">
											ID: {user.id}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 flex items-center gap-2">
									<Phone class="h-4 w-4 text-gray-400" />
									{user.phone_number || $t.patientSearch.noPhone}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									<div class="flex items-center gap-4">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{user.sex || 'N/A'}
										</span>
										<span class="text-gray-600">
											{$t.patientSearch.age}: {calculateAge(user.birthdate, user.age)}
										</span>
									</div>
								</div>
								{#if user.birthdate}
									<div class="text-xs text-gray-500 mt-1 flex items-center gap-1">
										<Calendar class="h-3 w-3" />
										{$t.patientSearch.born}: {formatDate(user.birthdate)}
									</div>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
								<div class="text-gray-500">
									<UsersIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
									<h3 class="text-sm font-medium text-gray-900 mb-1">{$t.patientSearch.noPatientsFound}</h3>
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

	<!-- Summary Stats -->
	<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<UsersIcon class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">{$t.patientSearch.totalPatients}</dt>
							<dd class="text-lg font-medium text-gray-900">{data.users.length}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<User class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">{$t.patientSearch.completeProfiles}</dt>
							<dd class="text-lg font-medium text-gray-900">
								{data.users.filter(u => u.name && u.phone_number && u.sex).length}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Calendar class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">{$t.patientSearch.withBirthdate}</dt>
							<dd class="text-lg font-medium text-gray-900">
								{data.users.filter(u => u.birthdate).length}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Phone class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">{$t.patientSearch.withPhone}</dt>
							<dd class="text-lg font-medium text-gray-900">
								{data.users.filter(u => u.phone_number).length}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</div> 