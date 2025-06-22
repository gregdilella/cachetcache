<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import { Settings } from 'lucide-svelte';
	import { t } from '$lib/i18n/translations/index.js';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	
	// Calculate age from birthdate
	function calculateAge(birthdate: string): number | null {
		if (!birthdate) return null;
		const today = new Date();
		const birth = new Date(birthdate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		
		return age;
	}
	
	// Get birthdate from age (approximate)
	function getBirthdateFromAge(age: number | null): string {
		if (!age) return '';
		const today = new Date();
		const birthYear = today.getFullYear() - age;
		return `${birthYear}-01-01`; // Default to January 1st
	}
	
	// Initialize birthdate from existing age or birthdate
	let birthdate = data.userProfile?.birthdate || getBirthdateFromAge(data.userProfile?.age || null);
	
	$: calculatedAge = calculateAge(birthdate);
</script>

<svelte:head>
	<title>{$t.userProfile.title}</title>
</svelte:head>

<!-- Profile Settings -->
<div class="instagram-card p-6">
	<div class="flex items-center gap-3 mb-6">
		<div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
			<Settings class="w-5 h-5 text-white" />
		</div>
		<div>
			<h2 class="font-semibold text-pink-800">{$t.userProfile.heading}</h2>
			<p class="text-xs text-pink-600">{$t.userProfile.subtitle}</p>
		</div>
	</div>

	{#if form?.error}
		<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
			<p class="text-red-600 text-sm">{form.error}</p>
		</div>
	{/if}

	{#if form?.success}
		<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
			<p class="text-green-600 text-sm">{$t.userProfile.profileUpdated}</p>
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
				await invalidateAll(); // Refresh the page data
			};
		}}
	>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="name" class="block text-sm font-medium text-pink-700 mb-2">
					{$t.userProfile.fullNameRequired}
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={data.userProfile?.name || ''}
					required
					class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
					placeholder={$t.userProfile.enterFullName}
				/>
			</div>

			<div>
				<label for="phone_number" class="block text-sm font-medium text-pink-700 mb-2">
					{$t.userProfile.phoneNumber}
				</label>
				<input
					type="tel"
					id="phone_number"
					name="phone_number"
					value={data.userProfile?.phone_number || ''}
					class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
					placeholder={$t.userProfile.enterPhone}
				/>
			</div>

			<div>
				<label for="sex" class="block text-sm font-medium text-pink-700 mb-2">
					{$t.userProfile.sex}
				</label>
				<select
					id="sex"
					name="sex"
					class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
				>
					<option value="">{$t.userProfile.selectSex}</option>
					<option value="Male" selected={data.userProfile?.sex === 'Male'}>{$t.userProfile.male}</option>
					<option value="Female" selected={data.userProfile?.sex === 'Female'}>{$t.userProfile.female}</option>
					<option value="Other" selected={data.userProfile?.sex === 'Other'}>{$t.userProfile.other}</option>
				</select>
			</div>

			<div>
				<label for="birthdate" class="block text-sm font-medium text-pink-700 mb-2">
					{$t.userProfile.dateOfBirth}
				</label>
				<input
					type="date"
					id="birthdate"
					name="birthdate"
					bind:value={birthdate}
					max={new Date().toISOString().split('T')[0]}
					class="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
				/>
				{#if calculatedAge !== null}
					<p class="text-sm text-pink-600 mt-1">{$t.userProfile.age}: {calculatedAge} {$t.userProfile.yearsOld}</p>
				{/if}
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
				{loading ? $t.userProfile.updating : $t.userProfile.updateProfile}
			</button>
		</div>
	</form>
</div> 