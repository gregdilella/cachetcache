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

<svelte:head>
	<title>About | Cachet Caché</title>
	<meta name="description" content="About Dr. Lisa Henriques and Cachet Caché" />
</svelte:head>

<!-- Hero Section -->
<section class="flex justify-center items-start pt-5 py-10 md:pt-20">
	<div class="flex flex-col items-center">
		<h1 class="text-8xl md:text-10xl font-black mb-4 animate-in fade-in slide-in-from-left-12 blur-in duration-700" style="font-family: 'Sacramento', cursive;">
			About
		</h1>
		<h3 class="text-center text-xl md:text-2xl font-semibold italic animate-in fade-in slide-in-from-bottom-8 delay-200 animate-blur-in">
			<span class="font-extrabold text-pink-500 transition-all duration-200 ease-in-out hover:tracking-widest">Dr. Lisa</span>
			Henriques
		</h3>
	</div>
</section>

<!-- About Section -->
<section id="about">
	<div class="mx-auto max-w-6xl px-6 md:grid md:grid-cols-2 md:gap-8 items-center">
		<div class="transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<h1 class="text-4xl font-black mb-4" style="font-family: 'Sacramento', cursive;">Meet Dr. Lisa</h1>
			<p class="text-lg leading-relaxed text-balance pb-4 text-pink-800">
				Dr. Lisa Henriques is a dedicated family physician who has expanded her practice to include aesthetic medicine.
			</p>
			<p class="text-lg leading-relaxed text-balance pb-4 text-pink-800">
				Since 2017, she has been providing comprehensive healthcare while maintaining the highest standards of patient care and privacy.
			</p>
			<p class="text-lg leading-relaxed text-balance text-pink-800">
				Her approach combines medical expertise with an artistic eye for natural-looking results.
			</p>
		</div>

		<img
			src={lisashot}
			alt="Dr. Lisa Henriques"
			loading="lazy"
			class="max-w-xs md:max-w-sm border-2 border-pink-300 rounded-2xl fade-in slide-in-from-left-12 animate-blur-in duration-700 mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}"
		/>
	</div>
</section>

<!-- Credentials Section -->
<section id="credentials" class="mt-16 md:mt-0">
	<div class="mx-auto max-w-6xl px-6 md:grid md:grid-cols-2 md:gap-8 items-start">
		<div class="border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-sm p-8 md:col-span-2 w-full transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<h2 class="text-2xl font-black mb-4 text-pink-800" style="font-family: 'Sacramento', cursive;">
				Education & Training
			</h2>
			<ul class="text-lg leading-relaxed text-pink-800 space-y-2">
				<li>• Medical Degree - Université de Montréal (2015)</li>
				<li>• Family Medicine Residency - McGill Ste-Mary's Hospital (2017)</li>
				<li>• Aesthetic Medicine Training - CMQ Certified (2024)</li>
			</ul>
		</div>
	</div>
</section>
