<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		Drawer,
		Modal,
		getDrawerStore,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { page } from '$app/stores';

	inject();
	injectSpeedInsights();
	initializeStores();

	const drawerStore = getDrawerStore();
	
	// Check if current path is the home page
	$: isHomePage = $page.url.pathname === '/';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Sacramento&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<Modal />

<AppShell class={!isHomePage ? 'bg-white text-black' : ''}>
	<svelte:fragment slot="sidebarLeft">
		{#if !isHomePage}
			<Navbar />
		{/if}
	</svelte:fragment>
	<main class={isHomePage ? '' : 'mx-8 md:mx-auto md:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] font-girly'}>
		<slot />
	</main>
	<svelte:fragment slot="footer">
		{#if !isHomePage}
			<Footer />
		{/if}
	</svelte:fragment>
</AppShell>



<style>
	:global(h1, h2, h3) {
		font-family: 'Sacramento', cursive !important;
	}
	
	:global(body:not(.homepage)) {
		font-family: 'Poppins', sans-serif;
	}
</style>
