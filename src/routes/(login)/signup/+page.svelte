<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/translations';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;
	let visible = false;

	onMount(() => {
		setTimeout(() => {
			visible = true;
		}, 50);
	});

	function handleSubmit() {
		loading = true;
	}

	function handleResult() {
		loading = false;
	}
</script>

<svelte:head>
	<title>{$t.signupPage.title}</title>
	<meta name="description" content={$t.signupPage.description} />
</svelte:head>

<main class="">
	<div class="text-center px-4">
		<div class="my-8 sm:my-16">
			<h1 class="text-3xl sm:text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 duration-700 serif-heading">{$t.signupPage.heroTitle}</h1>
			<h2 class="text-xl sm:text-2xl md:text-3xl font-bold font-normal text-pink-700 mb-2 transition-all duration-1000 serif-heading {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">{$t.signupPage.createAccount}</h2>
		</div>
		<form 
			method="POST" 
			action="?/signup"
			use:enhance={() => {
				handleSubmit();
				return async ({ result, update }) => {
					await update();
					handleResult();
				};
			}}
			class="space-y-4 max-w-md mx-auto mt-6 sm:mt-10 text-left transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}"
		>
			{#if form?.error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="text-sm sm:text-base text-red-700">{form.error}</div>
				</div>
			{/if}
			
			<div>
				<label for="email" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.emailAddress}</label>
				<input 
					id="email" 
					name="email" 
					type="email" 
					autocomplete="email" 
					required 
					value={form?.email ?? ''}
					class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
						focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
						touch-manipulation transition-colors" 
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.password}</label>
				<input 
					id="password" 
					name="password" 
					type="password" 
					autocomplete="new-password" 
					required 
					class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
						focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
						touch-manipulation transition-colors" 
				/>
			</div>
			<div>
				<label for="confirm-password" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.confirmPassword}</label>
				<input 
					id="confirm-password" 
					name="confirm-password" 
					type="password" 
					autocomplete="new-password" 
					required 
					class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
						focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
						touch-manipulation transition-colors" 
				/>
			</div>

			<!-- Profile Information Section -->
			<div class="pt-4 border-t border-pink-200">
				<h3 class="text-lg font-semibold font-normal text-pink-700 mb-4 serif-heading">Profile Information</h3>
				
				<div>
					<label for="name" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.name}</label>
					<input 
						id="name" 
						name="name" 
						type="text" 
						autocomplete="name" 
						required 
						value={form?.name ?? ''}
						class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
							focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
							touch-manipulation transition-colors" 
					/>
				</div>

				<div>
					<label for="phone" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.phoneNumber}</label>
					<input 
						id="phone" 
						name="phone" 
						type="tel" 
						autocomplete="tel" 
						value={form?.phone ?? ''}
						class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
							focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
							touch-manipulation transition-colors" 
					/>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="birthdate" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">Date of Birth</label>
						<input 
							id="birthdate" 
							name="birthdate" 
							type="date" 
							value={form?.birthdate ?? ''}
							class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
								focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
								touch-manipulation transition-colors" 
						/>
					</div>

					<div>
						<label for="sex" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">Gender</label>
						<select 
							id="sex" 
							name="sex" 
							class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
								focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
								touch-manipulation transition-colors bg-white"
						>
							<option value="">Select gender</option>
							<option value="Female" selected={form?.sex === 'Female'}>Female</option>
							<option value="Male" selected={form?.sex === 'Male'}>Male</option>
							<option value="Other" selected={form?.sex === 'Other'}>Other</option>
							<option value="Prefer not to say" selected={form?.sex === 'Prefer not to say'}>Prefer not to say</option>
						</select>
					</div>
				</div>
			</div>

			<button 
				type="submit" 
				disabled={loading} 
				class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold 
					text-base sm:text-lg py-3 sm:py-2 px-6 sm:px-4 rounded-lg border border-pink-300 
					transition-all duration-300 hover:from-pink-500 hover:to-purple-500 w-full 
					disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
			>
				{loading ? $t.creatingAccount : $t.signup}
			</button>
			<div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 w-full">
				<div class="text-sm sm:text-base text-center w-full">
					<span class="text-gray-500">{$t.signupPage.alreadyHaveAccount}</span>
					<a href="/signin" class="ml-1 font-medium text-pink-600 hover:text-pink-500 touch-manipulation">{$t.signupPage.signInLink}</a>
				</div>
			</div>
		</form>
	</div>
</main> 