<script>
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
	<title>{$t.servicesPage.title}</title>
	<meta name="description" content={$t.servicesPage.description} />
</svelte:head>

<main class="">
  <div class="text-center">
    <div class="my-16">
      <h1 class="text-4xl md:text-7xl font-black mb-8 animate-in fade-in slide-in-from-left-12 duration-700">
        {$t.servicesPage.heroTitle}
      </h1>
    </div>
    
    <div class="gradient-border-card cf-hover my-10 w-full max-w-2xl mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div class="p-8 space-y-6">
        <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/1" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
            <span class="non-cursive">{$t.servicesPage.freeConsultations}</span>
            <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{$t.servicesPage.bookNow} &rarr;</span>
          </div>
        </a>
        
        <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/2" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
            <span class="non-cursive">{$t.servicesPage.neuromodulatorTreatments}</span>
            <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{$t.servicesPage.bookNow} &rarr;</span>
          </div>
        </a>
        
        <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/3" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
            <span class="non-cursive">{$t.servicesPage.fillers}</span>
            <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{$t.servicesPage.bookNow} &rarr;</span>
          </div>
        </a>
        
        <a href="https://cachetcache.janeapp.com" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-3">
            <span class="non-cursive">{$t.servicesPage.freeFollowUp}</span>
            <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{$t.servicesPage.bookNow} &rarr;</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</main>
