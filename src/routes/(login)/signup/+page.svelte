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
	<div class="text-center">
		<div class="my-16">
			<h1 class="text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 duration-700">{$t.signupPage.heroTitle}</h1>
			<h2 class="text-2xl md:text-3xl font-bold text-pink-700 mb-2 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">{$t.signupPage.createAccount}</h2>
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
			class="space-y-4 max-w-md mx-auto mt-10 text-left transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}"
		>
			{#if form?.error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="text-sm text-red-700">{form.error}</div>
				</div>
			{/if}
			
			<div>
				<label for="email" class="block mb-1 font-semibold text-pink-700">{$t.emailAddress}</label>
				<input 
					id="email" 
					name="email" 
					type="email" 
					autocomplete="email" 
					required 
					value={form?.email ?? ''}
					class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50" 
				/>
			</div>
			<div>
				<label for="password" class="block mb-1 font-semibold text-pink-700">{$t.password}</label>
				<input 
					id="password" 
					name="password" 
					type="password" 
					autocomplete="new-password" 
					required 
					class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50" 
				/>
			</div>
			<div>
				<label for="confirm-password" class="block mb-1 font-semibold text-pink-700">{$t.confirmPassword}</label>
				<input 
					id="confirm-password" 
					name="confirm-password" 
					type="password" 
					autocomplete="new-password" 
					required 
					class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50" 
				/>
			</div>
			<button 
				type="submit" 
				disabled={loading} 
				class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg py-2 px-4 rounded border border-pink-300 transition-all duration-300 hover:from-pink-500 hover:to-purple-500 w-full disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? $t.creatingAccount : $t.signup}
			</button>
			<div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 w-full">
				<div class="text-sm text-center sm:text-left w-full justify-center flex">
					<span class="text-gray-500">{$t.signupPage.alreadyHaveAccount}</span>
					<a href="/signin" class="ml-1 font-medium text-pink-600 hover:text-pink-500">{$t.signupPage.signInLink}</a>
				</div>
			</div>
		</form>
	</div>
</main> 