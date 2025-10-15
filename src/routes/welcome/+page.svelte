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
</style>

<!-- Hero Section with modern design -->
<section class="flex justify-center items-center pt-6 pb-4 md:pt-10 md:pb-6">
	<div class="flex flex-col items-center max-w-6xl mx-auto px-4 w-full">
		<div class="animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full flex flex-col items-center">
			<!-- Image without text overlay -->
			<div class="hero-image-wrapper w-[240px] md:w-[320px] mb-4">
				<img 
					src="/Frontpageimage.png" 
					alt="Cachet Caché" 
					class="w-full h-auto object-contain"
				/>
			</div>
			
		</div>
	</div>
</section>

<!-- Modern "What's in a name" Section -->
<section id="about" class="mt-4 md:mt-6 mb-12">
	<div class="mx-auto max-w-6xl px-6">
		<div class="gradient-border-card cf-hover w-full transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-8 md:p-10">
				<!-- Elegant title -->
				<h1 class="text-5xl md:text-6xl font-light mb-6 text-center" 
					style="font-family: 'Great Vibes', cursive !important; color: #D58A94;">
					{$t.welcomePage.whatInNameTitle}
				</h1>
				
				<div class="space-y-5 max-w-3xl mx-auto">
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
					<ul class="space-y-4 text-lg text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
						<li class="flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-yellow-50/50 to-pink-50/50 border border-pink-100/50">
							<span class="text-2xl mt-1">💎</span>
							<span class="leading-relaxed">{@html $t.welcomePage.cachetDef}</span>
						</li>
						<li class="flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-pink-50/50 to-yellow-50/50 border border-pink-100/50">
							<span class="text-2xl mt-1">🤫</span>
							<span class="leading-relaxed">{@html $t.welcomePage.cacheDef}</span>
						</li>
					</ul>
					
					<!-- Philosophy section with modern cards -->
					<div class="mt-8 space-y-4 text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
						<div class="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy1}</p>
						</div>
						<div class="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy2}</p>
						</div>
						<div class="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy3}</p>
						</div>
						<div class="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100/30 shadow-sm hover:shadow-md transition-all duration-300">
							<p class="text-lg leading-relaxed">{$t.welcomePage.philosophy4}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

