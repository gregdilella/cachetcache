<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n/translations';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;
	let visible = false;

	// Get message from URL parameters
	$: successMessage = $page.url.searchParams.get('message');

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
	<title>{$t.signinPage.title}</title>
	<meta name="description" content={$t.signinPage.description} />
</svelte:head>

<main class="">
	<div class="text-center px-4">
		<div class="my-8 sm:my-16">
			<h1 class="text-3xl sm:text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 duration-700">{$t.signinPage.heroTitle}</h1>
			<h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-pink-700 mb-2 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">{$t.signinPage.accessAccount}</h2>
		</div>
		<form 
			method="POST" 
			action="?/signin"
			use:enhance={() => {
				handleSubmit();
				return async ({ result, update }) => {
					await update();
					handleResult();
				};
			}}
			class="space-y-4 max-w-md mx-auto mt-6 sm:mt-10 text-left transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}"
		>
			{#if successMessage}
				<div class="rounded-md bg-green-50 p-4">
					<div class="text-sm sm:text-base text-green-700">{successMessage}</div>
				</div>
			{/if}
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
					autocomplete="current-password" 
					required 
					class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
						focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
						touch-manipulation transition-colors" 
				/>
			</div>
			<button 
				type="submit" 
				disabled={loading} 
				class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold 
					text-base sm:text-lg py-3 sm:py-2 px-6 sm:px-4 rounded-lg border border-pink-300 
					transition-all duration-300 hover:from-pink-500 hover:to-purple-500 w-full 
					disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
			>
				{loading ? $t.signingIn : $t.signin}
			</button>
			<div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 w-full">
				<div class="text-sm sm:text-base text-center w-full">
					<span class="text-gray-500">{$t.signinPage.dontHaveAccount}</span>
					<a href="/signup" class="ml-1 font-medium text-pink-600 hover:text-pink-500 touch-manipulation">{$t.signinPage.signUpLink}</a>
				</div>
			</div>
		</form>
	</div>
</main>
