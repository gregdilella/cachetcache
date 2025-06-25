<script>
	import lisashot from '$lib/assets/lisashot.jpeg';
	import me from '$lib/assets/lisa.png';
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
		<h1 class="text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 blur-in duration-700" style="font-family: 'Sacramento', cursive;">
			{$t.aboutPage.heroTitle}
		</h1>
	</div>
</section>

<!-- About Section -->
<section id="about">
	<div class="mx-auto max-w-4xl px-6 space-y-8">
		<!-- First Box: Meet Dr. Lisa Henriques -->
		<div class="gradient-border-card cf-hover transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-8 text-center">
				<h1 class="text-4xl font-black mb-6 non-cursive text-gray-800">{$t.aboutPage.meetDrLisa}</h1>
				<img
					src={me}
					alt="Dr. Lisa Henriques"
					loading="lazy"
					class="max-w-xs md:max-w-sm rounded-2xl mx-auto mb-6"
				/>
				<div class="text-left max-w-3xl mx-auto">
					<p class="text-lg leading-relaxed text-balance pb-4 text-gray-700">
						{$t.aboutPage.aboutParagraph1}
					</p>
					<p class="text-lg leading-relaxed text-balance pb-4 text-gray-700">
						{$t.aboutPage.aboutParagraph2}
					</p>
					<p class="text-lg leading-relaxed text-balance text-gray-700">
						{$t.aboutPage.aboutParagraph3}
					</p>
				</div>
			</div>
		</div>
		
		<!-- Second Box: Education & Photo -->
		<div class="gradient-border-card cf-hover transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-8 md:flex md:items-start md:gap-8">
				<div class="md:flex-1">
					<h2 class="text-2xl font-black mb-4 text-gray-800 non-cursive">
						{$t.aboutPage.educationTitle}
					</h2>
					<ul class="text-lg leading-relaxed text-gray-700 space-y-2">
						<li>• {$t.aboutPage.medicalDegree}</li>
						<li>• {$t.aboutPage.residency}</li>
						<li>• {$t.aboutPage.aestheticTraining}</li>
					</ul>
				</div>
				<img
					src={lisashot}
					alt="Dr. Lisa Henriques"
					loading="lazy"
					class="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl mt-6 md:mt-0 mx-auto md:mx-0 flex-shrink-0"
				/>
			</div>
		</div>
	</div>
</section>


