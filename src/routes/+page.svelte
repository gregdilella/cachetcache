<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/translations';
	import cachetCacheImage from '$lib/assets/cachetcache1.png';
	import { onMount } from 'svelte';
	
	let mounted = false;
	let hovered = false;
	
	onMount(() => {
		setTimeout(() => {
			mounted = true;
		}, 100);
	});
	
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
	
	/* Enhanced glow effect that fades into gradient */
	@keyframes ethereal-glow {
		0%, 100% { 
			filter: drop-shadow(0 0 40px rgba(255, 244, 188, 0.4)) 
			        drop-shadow(0 0 80px rgba(213, 138, 148, 0.3))
			        drop-shadow(0 0 120px rgba(177, 188, 160, 0.2));
		}
		50% { 
			filter: drop-shadow(0 0 60px rgba(255, 244, 188, 0.6)) 
			        drop-shadow(0 0 100px rgba(213, 138, 148, 0.5))
			        drop-shadow(0 0 140px rgba(177, 188, 160, 0.3));
		}
	}
	
	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}
	
	/* Logo with soft fade-into-gradient glow */
	.logo-wrapper {
		animation: ethereal-glow 4s ease-in-out infinite, float 6s ease-in-out infinite;
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}
	
	.logo-wrapper::before {
		content: '';
		position: absolute;
		inset: -40px;
		background: radial-gradient(
			circle,
			rgba(255, 244, 188, 0.15) 0%,
			rgba(213, 138, 148, 0.1) 30%,
			rgba(177, 188, 160, 0.05) 60%,
			transparent 100%
		);
		border-radius: 50%;
		animation: pulse-glow 3s ease-in-out infinite;
		z-index: -1;
	}
	
	@keyframes pulse-glow {
		0%, 100% { 
			transform: scale(1);
			opacity: 0.6;
		}
		50% { 
			transform: scale(1.1);
			opacity: 1;
		}
	}
	
	.logo-wrapper:hover {
		transform: scale(1.08);
		animation: ethereal-glow 2s ease-in-out infinite, float 3s ease-in-out infinite;
	}
	
	.logo-wrapper img {
		border-radius: 50%;
		position: relative;
		z-index: 1;
	}
	
	/* Gradient text with shimmer */
	.entrance-text {
		font-family: 'Playfair Display', serif;
		background: linear-gradient(135deg, #fff4bc 0%, #D58A94 50%, #B1BCA0 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: shimmer 3s ease-in-out infinite;
		background-size: 200% 200%;
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
	
	<div class="relative z-10 flex flex-col items-center gap-12 max-w-4xl mx-auto px-4">
		<!-- Logo with ethereal glow that fades into background -->
		<button 
			on:click={navigateToWelcome}
			on:mouseenter={() => hovered = true}
			on:mouseleave={() => hovered = false}
			class="border-none bg-transparent cursor-pointer focus:outline-none group"
			aria-label="Enter Cachet Caché"
		>
			<div class="logo-wrapper transition-all duration-[1500ms] {mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}">
				<img 
					src={cachetCacheImage} 
					alt="Cachet Caché logo" 
					class="max-w-[280px] sm:max-w-md md:max-w-2xl w-full" 
				/>
			</div>
		</button>
		
		<!-- Elegant subtitle with slower fade -->
		<p class="entrance-text text-xl md:text-3xl font-light text-center px-4 transition-all duration-[1800ms] delay-700 {mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}">
			The Hidden Gem of Medical Aesthetics
		</p>
		
		<!-- Enter button with healthy glow -->
		<div class="transition-all duration-[2000ms] delay-[1400ms] {mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}">
			<button
				on:click={navigateToWelcome}
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