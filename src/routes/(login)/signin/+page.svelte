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
		<!-- Hero Section -->
		<div class="my-12 sm:my-20">
			<h1 class="text-5xl sm:text-6xl md:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700
				bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent" 
				style="font-family: 'Playfair Display', serif !important; font-weight: 700 !important; letter-spacing: -0.02em;">
				{$t.signinPage.heroTitle}
			</h1>
			<h2 class="text-xl sm:text-2xl md:text-3xl mb-2 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}
				bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent" 
				style="font-family: 'Playfair Display', serif !important; font-weight: 500 !important;">
				{$t.signinPage.accessAccount}
			</h2>
		</div>
		
		<!-- Modern Form Card -->
		<div class="gradient-border-card cf-hover max-w-lg mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-10 md:p-12">
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
					class="space-y-6 text-left"
				>
					{#if successMessage}
						<div class="p-4 rounded-xl bg-green-50 border border-green-200">
							<div class="text-base text-green-700">{successMessage}</div>
						</div>
					{/if}
					{#if form?.error}
						<div class="p-4 rounded-xl bg-red-50 border border-red-200">
							<div class="text-base text-red-700">{form.error}</div>
						</div>
					{/if}
					
					<div>
						<label for="email" class="block mb-3 font-semibold text-gray-700 text-base" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.emailAddress}
						</label>
						<input 
							id="email" 
							name="email" 
							type="email" 
							autocomplete="email" 
							required 
							value={form?.email ?? ''}
							class="premium-input"
						/>
					</div>
					
					<div>
						<label for="password" class="block mb-3 font-semibold text-gray-700 text-base" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.password}
						</label>
						<input 
							id="password" 
							name="password" 
							type="password" 
							autocomplete="current-password" 
							required 
							class="premium-input"
						/>
					</div>
					
					<button 
						type="submit" 
						disabled={loading} 
						class="premium-button w-full text-lg"
					>
						{loading ? $t.signingIn : $t.signin}
					</button>
					
					<div class="text-center pt-4">
						<span class="text-gray-600" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.signinPage.dontHaveAccount}
						</span>
						<a href="/signup" 
							class="ml-2 font-semibold text-pink-600 hover:text-pink-700 transition-colors">
							{$t.signinPage.signUpLink}
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
