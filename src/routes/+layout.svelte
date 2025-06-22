<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		Drawer,
		Modal,
		getDrawerStore,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import InstagramNav from '$lib/components/InstagramNav.svelte';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	inject();
	injectSpeedInsights();
	initializeStores();

	const drawerStore = getDrawerStore();
	
	// Check if current path is the home page
	$: isHomePage = $page.url.pathname === '/';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Sacramento&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<Modal />

{#if isHomePage}
	<!-- Home page with original design -->
	<div class="w-full h-full">
		<slot />
	</div>
{:else}
	<!-- Simplified layout for other pages -->
	<div class="flex min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
		<!-- Sidebar Navigation -->
		<div class="hidden md:block w-64 bg-white border-r border-pink-200 shadow-sm">
			<InstagramNav session={data.session} supabase={data.supabase} user={data.userProfile} />
		</div>
		
		<!-- Main Content Area -->
		<div class="flex-1 overflow-y-auto">
			<div class="max-w-2xl mx-auto px-4 py-6">
				<slot />
			</div>
		</div>
		
		<!-- Mobile Bottom Navigation -->
		<div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-lg">
			<InstagramNav mobile={true} session={data.session} supabase={data.supabase} user={data.userProfile} />
		</div>
	</div>
{/if}

<style>
	:global(h1, h2, h3) {
		font-family: 'Sacramento', cursive !important;
	}
	
	:global(body) {
		font-family: 'Poppins', sans-serif;
	}
	
	:global(.instagram-card) {
		background: white;
		border-radius: 16px;
		border: 1px solid rgb(243 244 246);
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
		margin-bottom: 1.5rem;
		overflow: hidden;
	}
	
	:global(.instagram-post) {
		background: white;
		border-radius: 12px;
		border: 1px solid #e4e6ea;
		margin-bottom: 2rem;
		overflow: hidden;
	}
</style>
