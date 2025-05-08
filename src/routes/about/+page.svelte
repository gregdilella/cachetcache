<script>
	import lisashot from '$lib/assets/lisashot.jpeg';
	import { onMount } from 'svelte';
	
	let visible = false;
	
	onMount(() => {
		// Slight delay to trigger animation after page loads
		setTimeout(() => {
			visible = true;
		}, 50);
	});
</script>

<main class="">
	<div class="text-center">
		<div class="my-16">
			<h1 class="text-4xl md:text-7xl font-black mb-8 text-center animate-in fade-in slide-in-from-left-12 duration-700">About Us</h1>
		</div>
		
		<div class="flex flex-col items-center mb-10 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="w-64 h-64 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg mb-6">
				<img src={lisashot} alt="Dr. Lisa Henriques" class="w-full h-full object-cover" />
			</div>
		</div>
		
		<div class="max-w-2xl mx-auto border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-sm p-8 text-pink-800 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<h2 class="text-2xl font-bold mb-2">Lisa Henriques, BSC, MD</h2>
			<p class="mb-2">Lisa is a practicing family doctor since 2017.</p>
			<p class="mb-2">She graduated from Université de Montréal medical school in 2015 and completed her family medicine residency at McGill Ste-Mary's Hospital in 2017.</p>
			<p class="mb-2">With an interest in procedures and dermatology, she completed her esthetic medicine training with the CMQ in 2024 and has been practicing ever since.</p>
		</div>
	</div>
</main>
