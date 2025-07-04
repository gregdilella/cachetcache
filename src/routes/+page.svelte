<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/translations';
	import cachetCacheImage from '$lib/assets/cachetcache1.png';
	
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