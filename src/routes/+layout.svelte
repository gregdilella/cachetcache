<script lang="ts">
	import '../app.postcss';
	import {
		Modal,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import InstagramNav from '$lib/components/InstagramNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	// import { inject } from '@vercel/analytics';
	// import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { page } from '$app/stores';
	import { Menu, X } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// Vercel Analytics - Only works when deployed on Vercel
	// Since you're on Cloudflare Pages, commenting these out to prevent 404 errors
	// inject();
	// injectSpeedInsights();
	initializeStores();
	
	// Check if current path is the home page
	$: isHomePage = $page.url.pathname === '/';
	$: isWelcomePage = $page.url.pathname === '/welcome';
	$: isCreamBackgroundPage = ['/welcome', '/services', '/about', '/contact', '/signin', '/signup'].includes($page.url.pathname);
	
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
	<link href="https://fonts.googleapis.com/css2?family=Sacramento&family=Montserrat:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
</svelte:head>

<Modal />

{#if isHomePage}
	<!-- Home page with original design -->
	<div class="w-full min-h-screen flex flex-col">
		<div class="flex-1 max-w-6xl mx-auto w-full px-4">
			<slot />
		</div>
		<Footer />
	</div>
{:else}
	<!-- Simplified layout for other pages -->
	<div class="flex flex-col min-h-screen {isCreamBackgroundPage ? '' : 'bg-gradient-to-br from-gray-50 to-slate-100'}" style="{isCreamBackgroundPage ? 'background-color: #FAF9F6;' : ''}">
		<!-- Main Content with Sidebar -->
		<div class="flex flex-1">
			<!-- Desktop Sidebar Navigation (fixed) -->
			<div class="hidden lg:block w-64 shadow-sm {data.session ? 'auth-gradient-border' : 'pink-gradient-border'}" style="background-color: #f6f1ea;">
				<div class="sticky top-0 h-screen">
					<InstagramNav session={data.session} supabase={data.supabase} user={data.userProfile} />
				</div>
			</div>
			
			<!-- Main Content Area -->
			<div class="flex-1 flex flex-col min-h-screen">
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
						<div class="absolute left-0 top-0 h-full w-80 max-w-[85vw] shadow-xl {data.session ? 'auth-gradient-border' : 'pink-gradient-border'}" style="background-color: #f6f1ea;">
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
				
				<div class="flex-1 px-4 py-6 md:pt-6 pt-20 max-w-4xl mx-auto w-full">
					<slot />
				</div>
			</div>
		</div>
		
		<!-- Footer spans full width -->
		<Footer />
	</div>
{/if}

<style>
	/* Default font for all elements is non-cursive */
	:global(h1, h2, h3, h4, h5, h6) {
		font-family: 'Montserrat', sans-serif !important;
		color: #111827 !important; /* Black text for headings */
	}
	
	/* Keep the font-normal class for explicit override if needed */
	:global(.font-normal) {
		font-family: 'Montserrat', sans-serif !important;
		font-style: normal !important;
	}
	
	:global(body) {
		font-family: 'Montserrat', sans-serif;
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
	
	/* Ensure timeline elements and other specific elements are not cursive */
	:global(.visit-title),
	:global(.timeline-heading),
	:global(.visit-content h3),
	:global(.visit-content h4),
	:global(.non-cursive) {
		font-family: 'Montserrat', sans-serif !important;
	}
	
	/* Enhanced gradient backgrounds */
	:global(.bg-gradient-to-br) {
		background-image: linear-gradient(to bottom right, #f8fafc, #e2e8f0, #f1f5f9);
	}
</style>
