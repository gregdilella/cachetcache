<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/translations';
	import cachetCacheImage from '$lib/assets/cachetcachetrasnlucent.png';
	
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
		<div class="mb-4 animate-in fade-in slide-in-from-left-12 blur-in duration-700 text-center flex justify-center">
			<img 
				src={cachetCacheImage} 
				alt="Cachet Caché" 
				class="w-[300px] md:w-[400px] h-auto"
			/>
		</div>

		<h2 class="text-center text-2xl md:text-3xl font-bold animate-in fade-in slide-in-from-bottom-8 delay-200 animate-blur-in text-gray-800 serif-heading">
			Medical Aesthetics Clinic
		</h2>
		<p class="text-center text-xl md:text-2xl mt-4 text-pink-600 font-semibold">
			✨ The speakeasy of esthetic medicine clinics ✨
		</p>
	</div>
</section>

<!-- What's in a name Section -->
<section id="about" class="mt-16 md:mt-20">
	<div class="mx-auto max-w-6xl px-6">
		<div class="gradient-border-card cf-hover w-full transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-8">
				<h1 class="text-4xl font-black mb-6 text-center serif-heading">{$t.welcomePage.whatInNameTitle}</h1>
				<div class="space-y-6 max-w-3xl mx-auto">
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<span class="text-pink-500 font-bold non-cursive">Cachet:</span>
							<span class="text-pink-700 non-cursive">{$t.welcomePage.cachetDef}</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-pink-500 font-bold non-cursive">Caché:</span>
							<span class="text-pink-700 non-cursive">{$t.welcomePage.cacheDef}</span>
						</div>
					</div>
					
					<ul class="space-y-3 text-lg text-pink-700 non-cursive">
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1">•</span>
							<span>{$t.welcomePage.philosophy3}</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1">•</span>
							<span>{$t.welcomePage.philosophy4}</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1">•</span>
							<span>{$t.welcomePage.philosophy5}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

