<script lang="ts">
	import me from '$lib/assets/lisa.png?enhanced';


	import { onMount } from 'svelte';
  	let show = false;

  	onMount(() => {
    const timeout = setTimeout(() => {
      show = true;
    }, 100); // 0.2s delay
    return () => clearTimeout(timeout);
  });

</script>

<svelte:head>
	<title>Cachet Cachê - Home</title>
	<meta name="description" content="The Homepage of Cachet Cachê" />
	<meta property="og:title" content="Cachet Cachê" />
	<meta property="og:image" content="CC.png" />
	<meta property="og:description" content="Homepage of Cachet Cachê" />
	<meta property="og:url" content="https://www.cachetcache.com" />

</svelte:head>

  
<!-- Hero Section -->
<section class="flex justify-center items-start pt-5 py-10 md:pt-20">
	<div class="flex flex-col items-center">
		<h1 class="text-8xl md:text-10xl font-black mb-4 animate-in fade-in slide-in-from-left-12 blur-in duration-700 text-center">
			Cachet Cachê
		</h1>

		<h3 class="text-center text-xl md:text-2xl font-semibold italic animate-in fade-in slide-in-from-bottom-8 delay-200 animate-blur-in">
			<span
				class="font-extrabold text-primary-500 duration-200 ease-in-out hover:tracking-widest hover:text-red-500"
			>
				Esthetics
			</span>
			Medicine
			
		</h3>
	</div>
</section>

  
  <!-- About Section -->
  <section id="about">
	<div class="mx-auto max-w-6xl px-6 md:grid md:grid-cols-2 md:gap-8 items-center">
		<div>
			<h1 class="text-4xl font-black mb-4">Definition</h1>
			<ul class="text-lg leading-relaxed text-balance pb-8">
				<li><span
					class="font-extrabold text-primary-500 duration-200 ease-in-out hover:tracking-widest hover:text-red-500"
				>
					Cachet
				</span>: distinguished mark or seal, prestige</li>
				<li><span
					class="font-extrabold text-primary-500 duration-200 ease-in-out hover:tracking-widest hover:text-red-500"
				>
					Cachê
				</span>: hidden</li>
			</ul>
		</div>

		<enhanced:img
			src={me}
			alt="me:)"
			loading="lazy"
			class="max-w-xs md:max-w-sm border-2 border-base-300 rounded-2xl fade-in slide-in-from-left-12 animate-blur-in duration-700 mx-auto"
		/>
	</div>

	
</section>

<!-- Cachet Cache Philosophy Section -->
<section id="philosophy">
  <div class="mx-auto max-w-6xl px-6 md:grid md:grid-cols-2 md:gap-8 items-center">
    <div class="border-2 border-white rounded-2xl shadow-sm p-8 md:col-span-1 w-full">
      <p class="text-lg leading-relaxed text-balance pb-4 text-left">
        If you are searching for the place to get a naturally youthful look, without anyone knowing – look no further.
        <span class="block font-semibold mt-2">Cachet Cachê is the speakeasy of esthetic medicine clinics.</span>
      </p>
      <p class="text-lg leading-relaxed text-balance pb-4 text-left">
        We value your privacy and your personal preferences while treating you.
      </p>
      <p class="text-lg leading-relaxed text-balance pb-4 text-left">
        We strive to bring business through word-of-mouth and less through traditional marketing.
      </p>
      <p class="text-lg leading-relaxed text-balance text-left">
        We believe in less-is-more and organic expansion.
      </p>
    </div>
    <div class="hidden md:block"></div>
  </div>
</section>

  



  
  