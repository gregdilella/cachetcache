<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/translations';
	import { onMount } from 'svelte';
	
	let mounted = $state(false);
	let hovered = $state(false);
	let showButton = $state(false);
	
	onMount(() => {
		// Start logo animation
		setTimeout(() => {
			mounted = true;
		}, 100);
		
		// Show button after text animation completes
		// Words start at 0ms and end at 1000ms + 300ms animation = 1300ms
		// Add buffer time for smooth transition
		setTimeout(() => {
			showButton = true;
		}, 1500); // 100ms (mounted) + 1300ms (last word) + 100ms (buffer)
	});
	
	/**
	 * Navigate to the welcome page
	 */
	function navigateToWelcome() {
		goto('/welcome');
	}
</script>

<svelte:head>
	<title>Cachet Caché</title>
	<meta name="description" content={$t.welcomePage.description} />
	<meta property="og:title" content="Cachet Caché" />
	<meta property="og:image" content="https://www.cachetcache.com/ChatGPTCCthumbnail.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:description" content={$t.welcomePage.description} />
	<meta property="og:url" content="https://www.cachetcache.com" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://www.cachetcache.com/ChatGPTCCthumbnail.png" />
	<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<style>
	.landing-container {
		background: radial-gradient(ellipse at top, #1a1a1a 0%, #000000 100%);
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
	
	.landing-container::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 244, 188, 0.03) 0%, transparent 70%);
		animation: rotate 30s linear infinite;
		pointer-events: none;
	}
	
	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	
	/* Logo with soft natural glow - similar to button */
	.logo-wrapper {
		position: relative;
		animation: logo-glow 4s ease-in-out infinite;
		/* No float animation - keep it stable */
		border-radius: 32px; /* Match the image border-radius */
		background: transparent; /* Ensure no background color */
		overflow: visible; /* Don't clip the glow */
	}
	
	@keyframes logo-glow {
		0%, 100% {
			box-shadow: 
				0 0 30px rgba(255, 244, 188, 0.4),
				0 0 60px rgba(213, 138, 148, 0.3),
				0 10px 40px rgba(213, 138, 148, 0.2);
		}
		50% {
			box-shadow: 
				0 0 50px rgba(255, 244, 188, 0.6),
				0 0 90px rgba(213, 138, 148, 0.5),
				0 15px 60px rgba(213, 138, 148, 0.3);
		}
	}
	
	/* Mobile: gentler glow */
	@media (max-width: 768px) {
		@keyframes logo-glow {
			0%, 100% {
				box-shadow: 
					0 0 20px rgba(255, 244, 188, 0.3),
					0 0 40px rgba(213, 138, 148, 0.25),
					0 8px 30px rgba(213, 138, 148, 0.15);
			}
			50% {
				box-shadow: 
					0 0 35px rgba(255, 244, 188, 0.5),
					0 0 60px rgba(213, 138, 148, 0.4),
					0 12px 45px rgba(213, 138, 148, 0.25);
			}
		}
	}
	
	.logo-wrapper img {
		border-radius: 32px;
		position: relative;
		z-index: 1;
	}
	
	/* Text container */
	.entrance-text {
		font-family: 'Great Vibes', cursive;
		line-height: 1.5; /* Give extra space for tall letters */
		overflow: visible; /* Make sure nothing gets clipped */
	}
	
	/* Word-by-word animation with gradient */
	.word {
		display: inline-block;
		opacity: 0;
		transform: translateY(10px);
		animation: word-appear 0.3s ease-out forwards;
		background: linear-gradient(135deg, #fff4bc 0%, #D58A94 50%, #B1BCA0 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		background-size: 200% 200%;
		animation: word-appear 0.3s ease-out forwards, shimmer 3s ease-in-out infinite;
		padding: 0.2em 0; /* Extra padding top/bottom for tall letters */
		margin: 0.1em 0; /* Small margin for breathing room */
	}
	
	@keyframes word-appear {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes shimmer {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}
	
	/* Enhanced button glow */
	.enter-button {
		position: relative;
		animation: button-glow 3s ease-in-out infinite;
	}
	
	@keyframes button-glow {
		0%, 100% {
			box-shadow: 
				0 0 20px rgba(255, 244, 188, 0.3),
				0 0 40px rgba(213, 138, 148, 0.2),
				0 4px 15px rgba(213, 138, 148, 0.3);
		}
		50% {
			box-shadow: 
				0 0 30px rgba(255, 244, 188, 0.5),
				0 0 60px rgba(213, 138, 148, 0.4),
				0 8px 25px rgba(213, 138, 148, 0.4);
		}
	}
	
	.enter-button:hover {
		animation: button-glow-intense 1.5s ease-in-out infinite;
	}
	
	@keyframes button-glow-intense {
		0%, 100% {
			box-shadow: 
				0 0 30px rgba(255, 244, 188, 0.6),
				0 0 60px rgba(213, 138, 148, 0.5),
				0 8px 30px rgba(213, 138, 148, 0.5);
		}
		50% {
			box-shadow: 
				0 0 50px rgba(255, 244, 188, 0.8),
				0 0 90px rgba(213, 138, 148, 0.6),
				0 12px 40px rgba(213, 138, 148, 0.6);
		}
	}
</style>

<div class="landing-container flex flex-col items-center justify-center">
	<!-- Ambient glow orbs -->
	<div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl opacity-30"></div>
	<div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/10 to-red-200/10 rounded-full blur-3xl opacity-30"></div>
	
	<div class="relative z-10 flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto px-4 min-h-screen">
		<!-- Hero Image with elegant entrance -->
		<button 
			onclick={navigateToWelcome}
			onmouseenter={() => hovered = true}
			onmouseleave={() => hovered = false}
			class="border-none bg-transparent cursor-pointer focus:outline-none group"
			aria-label="Enter Cachet Caché"
		>
			<div class="logo-wrapper transition-all duration-[1500ms] {mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}">
				<img 
					src="/Frontpageimage.png" 
					alt="Cachet Caché" 
					class="w-[240px] md:w-[320px] h-auto object-contain" 
					style="border-radius: 32px;"
				/>
			</div>
		</button>
		
		<!-- Elegant subtitle with word-by-word animation -->
		<p class="entrance-text text-3xl md:text-5xl font-light text-center px-4 py-16">
			{#if mounted}
				<span class="word" style="animation-delay: 0ms;">The</span>
				{' '}
				<span class="word" style="animation-delay: 200ms;">Speakeasy</span>
				{' '}
				<span class="word" style="animation-delay: 400ms;">of</span>
				{' '}
				<span class="word" style="animation-delay: 600ms;">Medical</span>
				{' '}
				<span class="word" style="animation-delay: 800ms;">Aesthetics</span>
				{' '}
				<span class="word" style="animation-delay: 1000ms;">Clinics</span>
			{/if}
		</p>
		
		<!-- Enter button with healthy glow - appears after text animation -->
		<div class="transition-all duration-1000 {showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}">
			<button
				onclick={navigateToWelcome}
				class="enter-button group relative px-10 py-5 overflow-hidden rounded-full font-bold text-xl
					bg-gradient-to-r from-yellow-100 to-pink-100 hover:from-yellow-200 hover:to-pink-200
					transition-all duration-500 hover:scale-110
					border-2 border-white/30"
			>
				<span class="relative z-10 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
					Enter
				</span>
				<div class="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-pink-400/30 to-yellow-400/0 
					translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
			</button>
		</div>
		
		<!-- Decorative elements -->
		<div class="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent
			transition-all duration-[2200ms] delay-[1800ms] {mounted ? 'opacity-100' : 'opacity-0'}"></div>
	</div>
</div> 