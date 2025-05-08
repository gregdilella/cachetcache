<script lang="ts">
	import { goto } from '$app/navigation';
	import cachetCacheImage from '$lib/assets/cachetcache1.png';
	
	function navigateToWelcome() {
		goto('/welcome');
	}
</script>

<svelte:head>
	<title>Cachet Caché</title>
	<meta name="description" content="The Homepage of Cachet Cache" />
	<meta property="og:title" content="Cachet Cache" />
	<meta property="og:image" content="ccpink.png" />
	<meta property="og:description" content="Homepage of Cachet Cache" />
	<meta property="og:url" content="https://www.cachetcache.com" />
</svelte:head>

<style>
	.slow-blur-in {
		animation: blur-in 2s ease-out both;
	}
</style>

<div class="flex flex-col items-center justify-center min-h-screen w-full p-0 m-0 bg-black">
	<button 
		on:click={navigateToWelcome}
		class="border-none bg-transparent cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none"
		aria-label="Enter Cachet Caché"
	>
		<img 
			src={cachetCacheImage} 
			alt="Cachet Caché logo" 
			class="max-w-full md:max-w-2xl animate-in fade-in slow-blur-in duration-500" 
		/>
	</button>
</div> 