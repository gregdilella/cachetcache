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
		<!-- Hero Section -->
		<div class="my-12 sm:my-20">
			<h1 class="text-5xl sm:text-6xl md:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700
				bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent" 
				style="font-family: 'Playfair Display', serif !important; font-weight: 700 !important; letter-spacing: -0.02em;">
				{$t.signupPage.heroTitle}
			</h1>
			<h2 class="text-xl sm:text-2xl md:text-3xl mb-2 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}
				bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent" 
				style="font-family: 'Playfair Display', serif !important; font-weight: 500 !important;">
				{$t.signupPage.createAccount}
			</h2>
		</div>
		
		<!-- Modern Form Card -->
		<div class="gradient-border-card cf-hover max-w-2xl mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-10 md:p-12">
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
					class="space-y-6 text-left"
				>
					{#if form?.error}
						<div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
							{form.error}
						</div>
					{/if}
					
					<!-- Account Credentials -->
					<div class="space-y-6">
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
								autocomplete="new-password" 
								required 
								class="premium-input"
							/>
						</div>
						
						<div>
							<label for="confirm-password" class="block mb-3 font-semibold text-gray-700 text-base" 
								style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
								{$t.confirmPassword}
							</label>
							<input 
								id="confirm-password" 
								name="confirm-password" 
								type="password" 
								autocomplete="new-password" 
								required 
								class="premium-input"
							/>
						</div>
					</div>

					<!-- Profile Information Section -->
					<div class="pt-6 mt-6 border-t-2 border-pink-100">
						<h3 class="text-2xl font-semibold mb-6 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent" 
							style="font-family: 'Playfair Display', serif !important;">
							Profile Information
						</h3>
						
						<div class="space-y-6">
							<div>
								<label for="name" class="block mb-3 font-semibold text-gray-700 text-base" 
									style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
									{$t.name}
								</label>
								<input 
									id="name" 
									name="name" 
									type="text" 
									autocomplete="name" 
									required 
									value={form?.name ?? ''}
									class="premium-input"
								/>
							</div>

							<div>
								<label for="phone" class="block mb-3 font-semibold text-gray-700 text-base" 
									style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
									{$t.phoneNumber}
								</label>
								<input 
									id="phone" 
									name="phone" 
									type="tel" 
									autocomplete="tel" 
									value={form?.phone ?? ''}
									class="premium-input"
								/>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<label for="birthdate" class="block mb-3 font-semibold text-gray-700 text-base" 
										style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
										Date of Birth
									</label>
									<input 
										id="birthdate" 
										name="birthdate" 
										type="date" 
										value={form?.birthdate ?? ''}
										class="premium-input"
									/>
								</div>

								<div>
									<label for="sex" class="block mb-3 font-semibold text-gray-700 text-base" 
										style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
										Gender
									</label>
									<select 
										id="sex" 
										name="sex" 
										class="premium-input"
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
					</div>

					<button 
						type="submit" 
						disabled={loading} 
						class="premium-button w-full text-lg mt-8"
					>
						{loading ? $t.creatingAccount : $t.signup}
					</button>
					
					<div class="text-center pt-4">
						<span class="text-gray-600" 
							style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
							{$t.signupPage.alreadyHaveAccount}
						</span>
						<a href="/signin" 
							class="ml-2 font-semibold text-pink-600 hover:text-pink-700 transition-colors">
							{$t.signupPage.signInLink}
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</main> 

When you're done with your current set of changes to this file, you should call the read_lints tool with the specific file path and fix any newly introduced errors. 