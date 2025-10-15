<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import { Settings } from 'lucide-svelte';
	import { t } from '$lib/i18n/translations/index.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();

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
	let birthdate = $state(data.userProfile?.birthdate || getBirthdateFromAge(data.userProfile?.age || null));
	
	// Svelte 5 $derived for computed age
	let calculatedAge = $derived(calculateAge(birthdate));
</script>

<svelte:head>
	<title>{$t.userProfile.title}</title>
</svelte:head>

<style>
	.profile-header {
		background: linear-gradient(135deg, #B1BCA0 0%, #a0ab8f 100%);
		border-radius: 20px;
		padding: 24px;
		margin-bottom: 32px;
	}
</style>

<!-- Modern Profile Settings -->
<div class="max-w-4xl mx-auto">
	<!-- Header Section -->
	<div class="profile-header shadow-lg mb-8">
		<div class="flex items-center gap-5">
			<div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
				<Settings class="w-8 h-8 text-white" />
			</div>
			<div>
				<h1 class="font-bold text-white text-3xl" 
					style="font-family: 'Playfair Display', serif !important;">
					{$t.userProfile.heading}
				</h1>
				<p class="text-white/80 text-base" 
					style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
					{$t.userProfile.subtitle}
				</p>
			</div>
		</div>
	</div>

	{#if form?.error}
		<div class="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-xl">
			<p class="text-red-700 font-medium">{form.error}</p>
		</div>
	{/if}

	{#if form?.success}
		<div class="mb-8 p-5 bg-green-50 border-2 border-green-200 rounded-xl">
			<p class="text-green-700 font-medium">{$t.userProfile.profileUpdated}</p>
		</div>
	{/if}

	<!-- Form Card -->
	<div class="gradient-border-card">
		<div class="p-10">
			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
						await invalidateAll();
					};
				}}
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<label for="name" class="block text-base font-semibold text-gray-700 mb-3" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.userProfile.fullNameRequired}
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={data.userProfile?.name || ''}
							required
							class="premium-input"
							placeholder={$t.userProfile.enterFullName}
						/>
					</div>

					<div>
						<label for="phone_number" class="block text-base font-semibold text-gray-700 mb-3" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.userProfile.phoneNumber}
						</label>
						<input
							type="tel"
							id="phone_number"
							name="phone_number"
							value={data.userProfile?.phone_number || ''}
							class="premium-input"
							placeholder={$t.userProfile.enterPhone}
						/>
					</div>

					<div>
						<label for="sex" class="block text-base font-semibold text-gray-700 mb-3" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.userProfile.sex}
						</label>
						<select
							id="sex"
							name="sex"
							class="premium-input"
						>
							<option value="">{$t.userProfile.selectSex}</option>
							<option value="Male" selected={data.userProfile?.sex === 'Male'}>{$t.userProfile.male}</option>
							<option value="Female" selected={data.userProfile?.sex === 'Female'}>{$t.userProfile.female}</option>
							<option value="Other" selected={data.userProfile?.sex === 'Other'}>{$t.userProfile.other}</option>
						</select>
					</div>

					<div>
						<label for="birthdate" class="block text-base font-semibold text-gray-700 mb-3" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.userProfile.dateOfBirth}
						</label>
						<input
							type="date"
							id="birthdate"
							name="birthdate"
							bind:value={birthdate}
							max={new Date().toISOString().split('T')[0]}
							class="premium-input"
						/>
						{#if calculatedAge !== null}
							<p class="text-sm text-gray-600 mt-3" 
								style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
								{$t.userProfile.age}: {calculatedAge} {$t.userProfile.yearsOld}
							</p>
						{/if}
					</div>
				</div>

				<div class="mt-10">
					<button
						type="submit"
						disabled={loading}
						class="w-full text-white py-4 px-8 rounded-xl font-semibold text-lg
							disabled:opacity-50 disabled:cursor-not-allowed 
							bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700
							transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;"
					>
						{loading ? $t.userProfile.updating : $t.userProfile.updateProfile}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

When you're done with your current set of changes to this file, you should call the read_lints tool with the specific file path and fix any newly introduced errors. 