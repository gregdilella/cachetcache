<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/translations';
	
	// Svelte 5 $state for reactive state
	let show = $state(false);
	let visible = $state(false);

	/**
	 * Initialize animations on mount
	 */
	onMount(() => {
		const timeout = setTimeout(() => {
			show = true;
		}, 100);
		
		const blurTimeout = setTimeout(() => {
			visible = true;
		}, 50);
		
		return () => {
			clearTimeout(timeout);
			clearTimeout(blurTimeout);
		};
	});
</script>

<svelte:head>
	<title>{$t.welcomePage.title}</title>
	<meta name="description" content={$t.welcomePage.description} />
	<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<style>
	.sparkle-word {
		position: relative;
		display: inline-block;
		cursor: pointer;
	}

	.sparkle-word::before,
	.sparkle-word::after {
		content: '✨';
		position: absolute;
		font-size: 0.8em;
		opacity: 1;
		pointer-events: none;
		animation: sparkle 1.5s ease-in-out infinite alternate;
	}

	.sparkle-word::before {
		top: -10px;
		left: -15px;
	}

	.sparkle-word::after {
		bottom: -10px;
		right: -15px;
		animation-delay: 0.75s;
	}

	@keyframes sparkle {
		0% {
			transform: scale(0.8) rotate(-15deg);
			opacity: 0.6;
		}
		100% {
			transform: scale(1.2) rotate(15deg);
			opacity: 1;
		}
	}
	
	.hero-image-wrapper {
		position: relative;
		border-radius: 32px;
		overflow: hidden;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
		margin: 0 auto;
	}
	
	.hero-image-wrapper::before {
		content: '';
		position: absolute;
		inset: -2px;
		background: linear-gradient(135deg, #fff4bc, #D58A94, #fff4bc);
		border-radius: 32px;
		z-index: -1;
		animation: gradient-shift 6s ease infinite;
		background-size: 200% 200%;
	}
	
	@keyframes gradient-shift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}
	
	.modern-tagline {
		font-family: 'Great Vibes', cursive;
		/* Visible white text with shadow for contrast against dark background */
		color: white;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}
</style>

<!-- Hero Section with modern design -->
<section class="flex justify-center items-center pt-12 pb-8 md:pt-20 md:pb-12">
	<div class="flex flex-col items-center max-w-6xl mx-auto px-4 w-full">
		<div class="animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full flex flex-col items-center">
			<!-- Image without text overlay -->
			<div class="hero-image-wrapper w-[280px] md:w-[360px] mb-6">
				<img 
					src="/Frontpageimage.png" 
					alt="Cachet Caché" 
					class="w-full h-auto object-contain"
				/>
			</div>
			
			<!-- Tagline below the image -->
			<div class="text-center px-6 mb-8">
				<p class="modern-tagline text-2xl md:text-3xl lg:text-4xl font-semibold" 
					style="color: #D58A94;">
					The <span class="sparkle-word">speakeasy</span> of medical aesthetic clinics 
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Modern "What's in a name" Section -->
<section id="about" class="mt-8 md:mt-12 mb-16">
	<div class="mx-auto max-w-6xl px-6">
		<div class="gradient-border-card cf-hover w-full transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-10 md:p-14">
				<!-- Elegant title -->
				<h1 class="text-5xl md:text-6xl font-light mb-10 text-center" 
					style="font-family: 'Great Vibes', cursive !important; color: #D58A94;">
					{$t.welcomePage.whatInNameTitle}
				</h1>
				
				<div class="space-y-8 max-w-3xl mx-auto">
					<!-- Definition heading -->
					<h2 class="text-4xl md:text-5xl text-left font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" 
						style="font-family: 'Playfair Display', serif !important;">
						ca·chet caché
					</h2>
					
					<!-- Definition subtitle -->
					<h3 class="text-xl md:text-2xl font-light text-left text-gray-600 italic leading-relaxed" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
						{$t.welcomePage.definition}
					</h3>
					
					<!-- Modern definition list -->
					<ul class="space-y-5 text-lg text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
						<li class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50/50 to-pink-50/50 border border-pink-100/50">
							<span class="text-2xl mt-1">💎</span>
							<span class="leading-relaxed">{@html $t.welcomePage.cachetDef}</span>
						</li>
						<li class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50/50 to-yellow-50/50 border border-pink-100/50">
							<span class="text-2xl mt-1">🤫</span>
							<span class="leading-relaxed">{@html $t.welcomePage.cacheDef}</span>
						</li>
					</ul>
					
					<!-- Philosophy section with modern cards -->
					<div class="mt-12 space-y-6 text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
						<div class="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy1}</p>
						</div>
						<div class="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy2}</p>
						</div>
						<div class="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy3}</p>
						</div>
						<div class="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy4}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

