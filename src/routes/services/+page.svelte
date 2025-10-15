<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n/translations';
  import { Sparkles, Award, Heart } from 'lucide-svelte';
  
  let visible = false;
  
  onMount(() => {
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
      <h1 class="text-5xl sm:text-6xl md:text-7xl mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700
        bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent" 
        style="font-family: 'Playfair Display', serif !important; font-weight: 700 !important; letter-spacing: -0.02em;">
        {$t.servicesPage.heroTitle}
      </h1>
    </div>
    
    <!-- Services Card with modern design -->
    <div class="gradient-border-card cf-hover my-6 md:my-10 w-full max-w-3xl mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div class="p-8 sm:p-10 md:p-14 space-y-8">
        
        <!-- Consultations -->
        <div class="group p-6 rounded-2xl bg-gradient-to-br from-yellow-50/50 to-pink-50/50 border border-pink-100/40 
          hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div class="flex items-start gap-4 mb-3">
            <div class="p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-pink-100">
              <Sparkles class="w-6 h-6 text-pink-600" />
            </div>
            <div class="flex-1 text-left">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-2" 
                style="font-family: 'Playfair Display', serif !important;">
                {$t.servicesPage.freeConsultations}
              </h2>
              <p class="text-base sm:text-lg text-gray-600" 
                style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
                {$t.servicesPage.consultationDeduction}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Neuromodulator Treatments -->
        <div class="group p-6 rounded-2xl bg-gradient-to-br from-pink-50/50 to-orange-50/50 border border-pink-100/40 
          hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div class="flex items-start gap-4 mb-3">
            <div class="p-3 rounded-xl bg-gradient-to-br from-pink-100 to-orange-100">
              <Award class="w-6 h-6 text-orange-600" />
            </div>
            <div class="flex-1 text-left">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4" 
                style="font-family: 'Playfair Display', serif !important;">
                {$t.servicesPage.neuromodulatorTreatments}
              </h2>
              <div class="space-y-2 text-base sm:text-lg text-gray-600" 
                style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
                <p class="flex items-center gap-2">
                  <span class="text-pink-500">•</span>
                  {$t.servicesPage.neuromodulatorPricing.tier1}
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-pink-500">•</span>
                  {$t.servicesPage.neuromodulatorPricing.tier2}
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-pink-500">•</span>
                  {$t.servicesPage.neuromodulatorPricing.tier3}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Fillers -->
        <div class="group p-6 rounded-2xl bg-gradient-to-br from-orange-50/50 to-pink-50/50 border border-pink-100/40 
          hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div class="flex items-start gap-4 mb-3">
            <div class="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100">
              <Heart class="w-6 h-6 text-pink-600" />
            </div>
            <div class="flex-1 text-left">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4" 
                style="font-family: 'Playfair Display', serif !important;">
                {$t.servicesPage.fillers}
              </h2>
              <div class="space-y-2 text-base sm:text-lg text-gray-600" 
                style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
                <p class="flex items-center gap-2">
                  <span class="text-pink-500">•</span>
                  {$t.servicesPage.fillerPricing.full}
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-pink-500">•</span>
                  {$t.servicesPage.fillerPricing.half}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Free Follow Up -->
        <div class="p-6 rounded-2xl bg-gradient-to-br from-green-50/30 to-yellow-50/30 border border-green-200/40">
          <p class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800" 
            style="font-family: 'Playfair Display', serif !important;">
            {$t.servicesPage.freeFollowUp}
          </p>
        </div>
      </div>
    </div>
  </div>
</main>
