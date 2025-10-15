<script>
	import lisashot from '$lib/assets/lisashot.jpeg';
	import me from '$lib/assets/lisa.png';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/translations';
	
	let visible = false;
	
	onMount(() => {
		setTimeout(() => {
			visible = true;
		}, 50);
	});
</script>

<svelte:head>
	<title>{$t.aboutPage.title}</title>
	<meta name="description" content={$t.aboutPage.description} />
</svelte:head>

<style>
	.photo-frame {
		position: relative;
		border-radius: 24px;
		overflow: hidden;
		box-shadow: 0 20px 50px rgba(213, 138, 148, 0.15);
	}
	
	.photo-frame::before {
		content: '';
		position: absolute;
		inset: -3px;
		background: linear-gradient(135deg, #fff4bc, #D58A94, #B1BCA0);
		border-radius: 24px;
		z-index: -1;
		animation: gradient-shift 8s ease infinite;
		background-size: 200% 200%;
	}
</style>

<!-- Hero Section with modern spacing -->
<section class="flex justify-center items-start pt-8 py-12 md:pt-24">
	<div class="flex flex-col items-center max-w-5xl mx-auto px-4">
		<h1 class="text-5xl md:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 text-center
			bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent" 
			style="font-family: 'Playfair Display', serif !important; font-weight: 700 !important; letter-spacing: -0.02em;">
			{$t.aboutPage.heroTitle}
		</h1>
	</div>
</section>

<!-- About Section with premium design -->
<section id="about" class="pb-16">
	<div class="mx-auto max-w-5xl px-6 space-y-10">
		<!-- First Card: Meet Dr. Lisa Henriques -->
		<div class="gradient-border-card cf-hover transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-10 md:p-14">
				<h2 class="text-4xl md:text-5xl mb-10 text-center bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent" 
					style="font-family: 'Playfair Display', serif !important; font-weight: 600 !important;">
					{$t.aboutPage.meetDrLisa}
				</h2>
				
				<div class="photo-frame w-full max-w-md mx-auto mb-10">
					<img
						src={me}
						alt="Dr. Lisa Henriques"
						loading="lazy"
						class="w-full rounded-2xl"
					/>
				</div>
				
				<div class="text-left max-w-3xl mx-auto space-y-6">
					<p class="text-lg md:text-xl leading-relaxed text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 400 !important;">
						{$t.aboutPage.aboutParagraph1}
					</p>
					<p class="text-lg md:text-xl leading-relaxed text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 400 !important;">
						{$t.aboutPage.aboutParagraph2}
					</p>
					<p class="text-lg md:text-xl leading-relaxed text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 400 !important;">
						{$t.aboutPage.aboutParagraph3}
					</p>
				</div>
			</div>
		</div>
		
		<!-- Second Card: Education & Photo -->
		<div class="gradient-border-card cf-hover transition-all duration-1000 delay-200 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
			<div class="p-10 md:p-14 md:flex md:items-center md:gap-12">
				<div class="md:flex-1">
					<h3 class="text-3xl md:text-4xl mb-8 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent" 
						style="font-family: 'Playfair Display', serif !important; font-weight: 600 !important;">
						{$t.aboutPage.educationTitle}
					</h3>
					<ul class="space-y-4 text-lg md:text-xl leading-relaxed text-gray-700" 
						style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 400 !important;">
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1.5 font-bold">✓</span>
							<span>{$t.aboutPage.medicalDegree}</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1.5 font-bold">✓</span>
							<span>{$t.aboutPage.residency}</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-500 mt-1.5 font-bold">✓</span>
							<span>{$t.aboutPage.aestheticTraining}</span>
						</li>
					</ul>
				</div>
				
				<div class="photo-frame w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mt-8 md:mt-0 mx-auto md:mx-0 flex-shrink-0">
					<img
						src={lisashot}
						alt="Dr. Lisa Henriques"
						loading="lazy"
						class="w-full h-full object-cover rounded-2xl"
					/>
				</div>
			</div>
		</div>
	</div>
</section>


