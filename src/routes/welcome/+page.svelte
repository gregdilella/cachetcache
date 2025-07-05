<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/translations';
	
	let show = false;
	let visible = false;

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
</style>



<!-- Hero Section -->
<section class="flex justify-center items-start pt-5 py-10 md:pt-20">
	<div class="flex flex-col items-center">
		<div class="relative mb-4 animate-in fade-in slide-in-from-left-12 blur-in duration-700 text-center flex justify-center">
			<div class="relative w-[300px] md:w-[400px] h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
				<img 
					src="/lips.jpg" 
					alt="Cachet Caché" 
					class="w-full h-full object-cover object-top"
				/>
				<!-- Dark overlay for better text contrast -->
				<div class="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
				
				<!-- Center text overlay - "cache cachet" -->
				<div class="absolute inset-0 flex flex-col items-center justify-center px-6 pt-24 text-center">
					<h1 class="text-4xl md:text-5xl lg:text-6xl drop-shadow-lg" style="font-family: 'Playfair Display', serif !important; font-weight: 600 !important; color: white !important;">
						CACHET CACHÉ
					</h1>
				</div>
				
				<!-- Bottom text overlay positioned at bottom -->
				<div class="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end px-6 pb-8 text-center">
					<p class="text-xl md:text-2xl lg:text-3xl font-semibold drop-shadow-lg" style="font-family: 'Great Vibes', cursive; color: white !important;">
						 The <span class="sparkle-word">speakeasy</span> of medical aesthetic clinics 
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- What's in a name Section -->
<section id="about" class="mt-16 md:mt-20">
	<div class="mx-auto max-w-6xl px-6">
		<div class="gradient-border-card cf-hover w-full transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-8">
				<h1 class="text-4xl font-black mb-6 text-center" style="font-family: 'Great Vibes', cursive !important;">{$t.welcomePage.whatInNameTitle}</h1>
				<div class="space-y-6 max-w-3xl mx-auto">
					<h2 class="text-3xl text-left text-gray-800 font-bold" style="font-family: 'Playfair Display', serif !important;">ca·chet caché</h2>
					<h3 class="text-xl font-semibold text-left text-gray-700 sans font-thin italic" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">{$t.welcomePage.definition}</h3>
					<ul class="space-y-3 text-lg text-gray-700 sans font-normal" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1">•</span>
							<span>{@html $t.welcomePage.cachetDef}</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1">•</span>
							<span>{@html $t.welcomePage.cacheDef}</span>
						</li>
					</ul>
					
					<div class="text-left text-gray-700 sans font-normal mt-8 space-y-4" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
						<p>{$t.welcomePage.philosophy1}</p>
						<p>{$t.welcomePage.philosophy2}</p>
						<p>{$t.welcomePage.philosophy3}</p>
						<p>{$t.welcomePage.philosophy4}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

