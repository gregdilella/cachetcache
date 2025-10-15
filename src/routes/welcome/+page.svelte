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
	
	.hero-image-wrapper {
		position: relative;
		border-radius: 32px;
		overflow: hidden;
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
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
	
	.modern-tagline {
		font-family: 'Great Vibes', cursive;
		background: linear-gradient(135deg, #ffffff 0%, #fffef9 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}
</style>

<!-- Hero Section with modern design -->
<section class="flex justify-center items-start pt-8 py-12 md:pt-24">
	<div class="flex flex-col items-center max-w-5xl mx-auto px-4">
		<div class="relative mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
			<div class="hero-image-wrapper w-[320px] md:w-[440px] h-[420px] md:h-[540px]">
				<img 
					src="/lips.jpg" 
					alt="Cachet Caché" 
					class="w-full h-full object-cover object-top"
				/>
				
				<!-- Refined gradient overlay -->
				<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>
				
				<!-- Modern title overlay -->
				<div class="absolute inset-0 flex flex-col items-center justify-center px-6">
					<h1 class="text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-2xl tracking-tight" 
						style="font-family: 'Playfair Display', serif !important; font-weight: 700 !important; color: white !important; letter-spacing: -0.02em;">
						CACHET CACHÉ
					</h1>
				</div>
				
				<!-- Modern tagline -->
				<div class="absolute inset-x-0 bottom-0 px-8 pb-10">
					<p class="modern-tagline text-2xl md:text-3xl lg:text-4xl font-semibold text-center">
						The <span class="sparkle-word">speakeasy</span> of medical aesthetic clinics 
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Modern "What's in a name" Section -->
<section id="about" class="mt-20 md:mt-28 mb-16">
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

