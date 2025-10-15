<script lang="ts">
	import '../app.postcss';
	import InstagramNav from '$lib/components/InstagramNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	// import { inject } from '@vercel/analytics';
	// import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { page } from '$app/state';
	import { Menu, X } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();

	// Vercel Analytics - Only works when deployed on Vercel
	// Since you're on Cloudflare Pages, commenting these out to prevent 404 errors
	// inject();
	// injectSpeedInsights();
	
	// Check if current path is the home page using Svelte 5 $derived
	let isHomePage = $derived(page.url.pathname === '/');
	let isWelcomePage = $derived(page.url.pathname === '/welcome');
	let isCreamBackgroundPage = $derived(['/welcome', '/services', '/about', '/contact', '/signin', '/signup', '/blog'].includes(page.url.pathname));
	
	// Mobile sidebar state
	let showMobileSidebar = $state(false);
	
	/**
	 * Toggle mobile sidebar visibility
	 */
	function toggleMobileSidebar() {
		showMobileSidebar = !showMobileSidebar;
		// Prevent body scroll when sidebar is open
		if (showMobileSidebar) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}
	
	/**
	 * Close mobile sidebar
	 */
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

{#if isHomePage}
	<!-- Home page with original design - no footer -->
	<div class="w-full min-h-screen flex flex-col">
		<div class="flex-1 w-full">
			<slot />
		</div>
	</div>
{:else}
	<!-- Simplified layout for other pages -->
	<div class="flex flex-col min-h-screen {isCreamBackgroundPage ? '' : 'bg-gradient-to-br from-gray-50 to-slate-100'}" style="{isCreamBackgroundPage ? 'background-color: #FAF9F6;' : ''}">
		<!-- Main Content with Sidebar -->
		<div class="flex flex-1 relative">
			<!-- Desktop Sidebar Navigation (extends to bottom, stops before footer) -->
			<div class="hidden lg:block w-64 shadow-sm {data.session ? 'auth-gradient-border' : 'pink-gradient-border'}" 
				style="background-color: #f6f1ea; min-height: calc(100vh - 120px);">
				<div class="sticky top-0 h-screen flex flex-col">
					<InstagramNav session={data.session} supabase={data.supabase} user={data.userProfile} />
				</div>
			</div>
			
			<!-- Main Content Area -->
			<div class="flex-1 flex flex-col min-h-screen">
				
				<div class="lg:hidden fixed top-4 left-4 z-50">
					<button
						onclick={toggleMobileSidebar}
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
							onclick={closeMobileSidebar}
							onkeydown={(e) => e.key === 'Escape' && closeMobileSidebar()}
							role="button"
							tabindex="-1"
							aria-label="Close menu"
						></div>
						
						<!-- Sidebar -->
						<div class="absolute left-0 top-0 h-full w-80 max-w-[85vw] shadow-xl {data.session ? 'auth-gradient-border' : 'pink-gradient-border'}" style="background-color: #f6f1ea;">
							<!-- Close Button -->
							<div class="absolute top-4 right-4 z-10">
								<button
									onclick={closeMobileSidebar}
									class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center
										text-pink-700 hover:bg-pink-200 transition-colors touch-manipulation"
									aria-label="Close menu"
								>
									<X class="w-5 h-5" />
								</button>
							</div>
							
						<!-- Navigation Content -->
						<nav class="overflow-y-auto pb-8" aria-label="Mobile navigation">
							<InstagramNav mobile={false} session={data.session} supabase={data.supabase} user={data.userProfile} />
						</nav>
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
	/* Premium typography system */
	:global(h1, h2, h3, h4, h5, h6) {
		font-family: 'Montserrat', sans-serif !important;
		color: #1f2937 !important;
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	
	:global(h1) {
		font-size: clamp(2rem, 5vw, 4rem);
		line-height: 1.1;
	}
	
	:global(h2) {
		font-size: clamp(1.5rem, 4vw, 3rem);
		line-height: 1.2;
	}
	
	:global(.font-normal) {
		font-family: 'Montserrat', sans-serif !important;
		font-style: normal !important;
	}
	
	:global(body) {
		font-family: 'Montserrat', sans-serif;
		color: #1f2937;
		background: linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%);
	}
	
	:global(p) {
		color: #374151 !important;
		line-height: 1.7;
		font-weight: 400;
	}
	
	/* Modern card designs */
	:global(.instagram-card) {
		background: linear-gradient(to bottom, #ffffff 0%, #fffef9 100%);
		border-radius: 20px;
		border: 1px solid rgba(213, 138, 148, 0.1);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
		margin-bottom: 1.5rem;
		overflow: hidden;
		backdrop-filter: blur(10px);
	}
	
	:global(.instagram-post) {
		background: linear-gradient(to bottom, #ffffff 0%, #fffef9 100%);
		border-radius: 20px;
		border: 1px solid rgba(213, 138, 148, 0.1);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
		margin-bottom: 2rem;
		overflow: hidden;
		backdrop-filter: blur(10px);
	}
	
	/* Refined color palette */
	:global(.text-pink-600),
	:global(.text-pink-500),
	:global(.text-pink-700) {
		color: #D58A94 !important;
	}
	
	/* Modern typography for special elements */
	:global(.visit-title),
	:global(.timeline-heading),
	:global(.visit-content h3),
	:global(.visit-content h4),
	:global(.non-cursive) {
		font-family: 'Montserrat', sans-serif !important;
		font-weight: 600;
	}
	
	/* Premium gradient backgrounds */
	:global(.bg-gradient-to-br) {
		background-image: linear-gradient(
			to bottom right, 
			#fafafa 0%, 
			#fff9f5 50%, 
			#faf5f0 100%
		);
	}

	/* Sidebar enhancements */
	:global(.sidebar-full-height) {
		min-height: 100vh;
		height: 100%;
		background: linear-gradient(to bottom, #faf9f6 0%, #f6f1ea 50%, #faf9f6 100%);
	}
	
	/* Smooth transitions */
	:global(*) {
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
