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
	<div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
		<!-- Sidebar Navigation -->
		<div class="hidden md:block w-64 bg-white shadow-sm pink-gradient-border">
			<InstagramNav session={data.session} supabase={data.supabase} user={data.userProfile} />
		</div>
		
		<!-- Main Content Area -->
		<div class="flex-1 overflow-y-auto">
			<div class="max-w-2xl mx-auto px-4 py-6">
				<slot />
			</div>
		</div>
		
		<!-- Mobile Bottom Navigation -->
		<div class="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg pink-gradient-border">
			<InstagramNav mobile={true} session={data.session} supabase={data.supabase} user={data.userProfile} />
		</div>
	</div>
{/if}

<style>
	:global(h1, h2, h3) {
		font-family: 'Sacramento', cursive !important;
		color: #111827 !important; /* Black text for headings */
	}
	
	:global(body) {
		font-family: 'Poppins', sans-serif;
		color: #111827; /* Black text for body */
	}
	
	:global(p) {
		color: #111827 !important; /* Black text for paragraphs */
	}
	
	:global(.instagram-card) {
		background: white;
		border-radius: 16px;
		border: none;
		box-shadow: none;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}
	
	:global(.instagram-post) {
		background: white;
		border-radius: 12px;
		border: none;
		margin-bottom: 2rem;
		overflow: hidden;
	}
	
	/* Override any pink text colors */
	:global(.text-pink-600),
	:global(.text-pink-500),
	:global(.text-pink-700) {
		color: #111827 !important;
	}
	
	/* Ensure timeline elements are not cursive */
	:global(.visit-title),
	:global(.timeline-heading),
	:global(.visit-content h3),
	:global(.visit-content h4) {
		font-family: 'Poppins', sans-serif !important;
	}
	
	/* Enhanced gradient backgrounds */
	:global(.bg-gradient-to-br) {
		background-image: linear-gradient(to bottom right, #f8fafc, #e2e8f0, #f1f5f9);
	}
</style>
