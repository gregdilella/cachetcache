<script>
	import lisashot from '$lib/assets/lisashot.jpeg';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/translations';
	
	let visible = false;
	
	onMount(() => {
		// Slight delay to trigger animation after page loads
		setTimeout(() => {
			visible = true;
		}, 50);
	});
</script>

<svelte:head>
	<title>{$t.aboutPage.title}</title>
	<meta name="description" content={$t.aboutPage.description} />
</svelte:head>

<!-- Hero Section -->
<section class="flex justify-center items-start pt-5 py-10 md:pt-20">
	<div class="flex flex-col items-center">
		<h1 class="text-8xl md:text-10xl font-black mb-4 animate-in fade-in slide-in-from-left-12 blur-in duration-700" style="font-family: 'Sacramento', cursive;">
			{$t.aboutPage.heroTitle}
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
			<h1 class="text-4xl font-black mb-4" style="font-family: 'Sacramento', cursive;">{$t.aboutPage.meetDrLisa}</h1>
			<p class="text-lg leading-relaxed text-balance pb-4 text-pink-800">
				{$t.aboutPage.aboutParagraph1}
			</p>
			<p class="text-lg leading-relaxed text-balance pb-4 text-pink-800">
				{$t.aboutPage.aboutParagraph2}
			</p>
			<p class="text-lg leading-relaxed text-balance text-pink-800">
				{$t.aboutPage.aboutParagraph3}
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
				{$t.aboutPage.educationTitle}
			</h2>
			<ul class="text-lg leading-relaxed text-pink-800 space-y-2">
				<li>• {$t.aboutPage.medicalDegree}</li>
				<li>• {$t.aboutPage.residency}</li>
				<li>• {$t.aboutPage.aestheticTraining}</li>
			</ul>
		</div>
	</div>
</section>
