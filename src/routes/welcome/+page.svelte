<script lang="ts">
	import me from '$lib/assets/lisa.png';
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
</svelte:head>

<!-- Hero Section -->
<section class="flex justify-center items-start pt-5 py-10 md:pt-20">
	<div class="flex flex-col items-center">
		<h1 class="text-8xl md:text-10xl font-black mb-4 animate-in fade-in slide-in-from-left-12 blur-in duration-700 text-center" style="font-family: 'Sacramento', cursive;">
			{$t.welcomePage.heroTitle}
		</h1>

		<h3 class="text-center text-xl md:text-2xl font-semibold italic animate-in fade-in slide-in-from-bottom-8 delay-200 animate-blur-in text-pink-700">
			<span class="font-extrabold text-pink-500 transition-all duration-200 ease-in-out hover:tracking-widest hover:text-pink-600">
				{$t.welcomePage.heroSubtitle}
			</span>
		</h3>
		<p class="text-center text-pink-600 italic mt-4 text-lg">
			{$t.welcomePage.heroTagline}
		</p>
	</div>
</section>

<!-- About Section -->
<section id="about">
	<div class="mx-auto max-w-6xl px-6 md:grid md:grid-cols-2 md:gap-8 items-center">
		<div class="transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<h1 class="text-4xl font-black mb-4" style="font-family: 'Sacramento', cursive;">{$t.welcomePage.whatInNameTitle}</h1>
			<div class="space-y-3">
				<div class="flex items-start gap-3">
					<span class="text-pink-500 font-bold">Cachet:</span>
					<span class="text-pink-700">{$t.welcomePage.cachetDef}</span>
				</div>
				<div class="flex items-start gap-3">
					<span class="text-pink-500 font-bold">Caché:</span>
					<span class="text-pink-700">{$t.welcomePage.cacheDef}</span>
				</div>
			</div>
		</div>

		<img
			src={me}
			alt="Dr. Lisa Henriques"
			loading="lazy"
			class="max-w-xs md:max-w-sm border-2 border-pink-300 rounded-2xl fade-in slide-in-from-left-12 animate-blur-in duration-700 mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}"
		/>
	</div>
</section>

<!-- Philosophy Section -->
<section id="philosophy" class="mt-24 md:mt-20">
	<div class="mx-auto max-w-6xl px-6 md:grid md:grid-cols-2 md:gap-8 items-start">
		<div class="border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-sm p-12 md:col-span-2 w-full transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<p class="text-lg leading-relaxed text-balance pb-4 text-left text-pink-800">
				{$t.welcomePage.philosophy1}
				<span class="block font-semibold mt-2">{$t.welcomePage.philosophy2}</span>
			</p>
			<p class="text-lg leading-relaxed text-balance pb-4 text-left text-pink-800">
				{$t.welcomePage.philosophy3}
			</p>
			<p class="text-lg leading-relaxed text-balance pb-4 text-left text-pink-800">
				{$t.welcomePage.philosophy4}
			</p>
			<p class="text-lg leading-relaxed text-balance text-left text-pink-800">
				{$t.welcomePage.philosophy5}
			</p>
		</div>
	</div>
</section> 