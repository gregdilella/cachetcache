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
      <h1 class="text-3xl sm:text-4xl md:text-7xl mb-6 md:mb-8 animate-in fade-in slide-in-from-left-12 duration-700" style="font-family: 'Playfair Display', serif !important; font-weight: 500 !important;">
        {$t.servicesPage.heroTitle}
      </h1>
    </div>
    
    <!-- Services Card -->
    <div class="gradient-border-card cf-hover my-6 md:my-10 w-full max-w-2xl mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div class="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
        <!-- Consultations -->
        <div class="py-2 sm:py-3 border-b border-gray-200 last:border-b-0 min-h-[3rem]">
          <div class="text-lg sm:text-xl md:text-2xl text-gray-800 mb-2" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 300 !important;">
            <span class="text-left">{$t.servicesPage.freeConsultations}</span>
          </div>
          <div class="text-sm sm:text-base text-gray-600 ml-4" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 300 !important;">
            <div>{$t.servicesPage.consultationDeduction}</div>
          </div>
        </div>
        
        <!-- Neuromodulator Treatments -->
        <div class="py-2 sm:py-3 border-b border-gray-200 last:border-b-0 min-h-[3rem]">
          <div class="text-lg sm:text-xl md:text-2xl text-gray-800 mb-2" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 300 !important;">
            <span class="text-left">{$t.servicesPage.neuromodulatorTreatments}</span>
          </div>
          <div class="text-sm sm:text-base text-gray-600 ml-4 space-y-1" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 300 !important;">
            <div>{$t.servicesPage.neuromodulatorPricing.tier1}</div>
            <div>{$t.servicesPage.neuromodulatorPricing.tier2}</div>
            <div>{$t.servicesPage.neuromodulatorPricing.tier3}</div>
          </div>
        </div>
        
        <!-- Fillers -->
        <div class="py-2 sm:py-3 border-b border-gray-200 last:border-b-0 min-h-[3rem]">
          <div class="text-lg sm:text-xl md:text-2xl text-gray-800 mb-2" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 300 !important;">
            <span class="text-left">{$t.servicesPage.fillers}</span>
          </div>
          <div class="text-sm sm:text-base text-gray-600 ml-4 space-y-1" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 300 !important;">
            <div>{$t.servicesPage.fillerPricing.full}</div>
            <div>{$t.servicesPage.fillerPricing.half}</div>
          </div>
        </div>
        
        <!-- Free Follow Up -->
        <div class="text-lg sm:text-xl md:text-2xl text-gray-800 py-2 sm:py-3 min-h-[3rem]" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; font-weight: 300 !important;">
          <span class="text-left">{$t.servicesPage.freeFollowUp}</span>
        </div>
      </div>
    </div>
  </div>
</main>
