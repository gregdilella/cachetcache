<script lang="ts">
	import '../app.postcss';
	import {
		Modal,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import InstagramNav from '$lib/components/InstagramNav.svelte';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { page } from '$app/stores';
	import { Menu, X } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	inject();
	injectSpeedInsights();
	initializeStores();
	
	// Check if current path is the home page
	$: isHomePage = $page.url.pathname === '/';
	
	// Mobile sidebar state
	let showMobileSidebar = false;
	
	function toggleMobileSidebar() {
		showMobileSidebar = !showMobileSidebar;
		// Prevent body scroll when sidebar is open
		if (showMobileSidebar) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}
	
	function closeMobileSidebar() {
		showMobileSidebar = false;
		document.body.style.overflow = 'auto';
	}
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
		<!-- Desktop Sidebar Navigation (fixed) -->
		<div class="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white shadow-sm pink-gradient-border z-30">
			<InstagramNav session={data.session} supabase={data.supabase} user={data.userProfile} />
		</div>
		
		<!-- Mobile Hamburger Menu -->
		<div class="lg:hidden fixed top-4 left-4 z-50">
			<button
				on:click={toggleMobileSidebar}
				class="w-12 h-12 bg-white rounded-xl shadow-lg border border-pink-200 flex items-center justify-center
					text-pink-700 hover:bg-pink-50 transition-colors touch-manipulation"
				aria-label="Toggle menu"
			>
				<Menu class="w-6 h-6" />
			</button>
		</div>
		
		<!-- Mobile Sidebar Modal -->
		{#if showMobileSidebar}
			<div class="lg:hidden fixed inset-0 z-40">
				<!-- Backdrop -->
				<div 
					class="absolute inset-0 bg-black/50"
					on:click={closeMobileSidebar}
					on:keydown={(e) => e.key === 'Escape' && closeMobileSidebar()}
					role="button"
					tabindex="-1"
					aria-label="Close menu"
				></div>
				
				<!-- Sidebar -->
				<div class="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl pink-gradient-border">
					<!-- Close Button -->
					<div class="absolute top-4 right-4 z-10">
						<button
							on:click={closeMobileSidebar}
							class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center
								text-pink-700 hover:bg-pink-200 transition-colors touch-manipulation"
							aria-label="Close menu"
						>
							<X class="w-5 h-5" />
						</button>
					</div>
					
					<!-- Navigation Content -->
					<div 
						class="h-full overflow-y-auto" 
						on:click={closeMobileSidebar}
						on:keydown={(e) => e.key === 'Enter' && closeMobileSidebar()}
						role="navigation"
						aria-label="Mobile navigation"
					>
						<InstagramNav mobile={false} session={data.session} supabase={data.supabase} user={data.userProfile} />
					</div>
				</div>
			</div>
		{/if}
		
		<!-- Main Content Area -->
		<div class="flex-1 overflow-y-auto lg:ml-64">
			<div class="max-w-2xl mx-auto px-4 py-6 md:pt-6 pt-20">
				<slot />
			</div>
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
	:global(.visit-content h4),
	:global(.non-cursive) {
		font-family: 'Poppins', sans-serif !important;
	}
	
	/* Enhanced gradient backgrounds */
	:global(.bg-gradient-to-br) {
		background-image: linear-gradient(to bottom right, #f8fafc, #e2e8f0, #f1f5f9);
	}
</style>
