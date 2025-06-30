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

<main class="px-4 sm:px-6">
  <div class="text-center">
    <!-- Hero Section -->
    <div class="my-8 md:my-16 px-4">
      <h1 class="text-3xl sm:text-4xl md:text-7xl font-black mb-6 md:mb-8 animate-in fade-in slide-in-from-left-12 duration-700 serif-heading">
        {$t.servicesPage.heroTitle}
      </h1>
    </div>
    
    <!-- Services Card -->
    <div class="gradient-border-card cf-hover my-6 md:my-10 w-full max-w-2xl mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div class="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
        <!-- Free Consultations -->
        <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/1" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 last:border-b-0 min-h-[3rem] non-cursive">
            <span class="pr-2 flex-1 text-left">{$t.servicesPage.freeConsultations}</span>
            <span class="text-base sm:text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              <span class="hidden sm:inline">{$t.servicesPage.bookNow} </span>&rarr;
            </span>
          </div>
        </a>
        
        <!-- Neuromodulator Treatments -->
        <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/2" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 last:border-b-0 min-h-[3rem] non-cursive">
            <span class="pr-2 flex-1 text-left">{$t.servicesPage.neuromodulatorTreatments}</span>
            <span class="text-base sm:text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              <span class="hidden sm:inline">{$t.servicesPage.bookNow} </span>&rarr;
            </span>
          </div>
        </a>
        
        <!-- Fillers -->
        <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/3" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 last:border-b-0 min-h-[3rem] non-cursive">
            <span class="pr-2 flex-1 text-left">{$t.servicesPage.fillers}</span>
            <span class="text-base sm:text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              <span class="hidden sm:inline">{$t.servicesPage.bookNow} </span>&rarr;
            </span>
          </div>
        </a>
        
        <!-- Free Follow Up -->
        <a href="https://cachetcache.janeapp.com" target="_blank" rel="noopener noreferrer" class="block group">
          <div class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-all flex justify-between items-center py-2 sm:py-3 min-h-[3rem] non-cursive">
            <span class="pr-2 flex-1 text-left">{$t.servicesPage.freeFollowUp}</span>
            <span class="text-base sm:text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              <span class="hidden sm:inline">{$t.servicesPage.bookNow} </span>&rarr;
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</main>
