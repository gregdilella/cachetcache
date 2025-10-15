<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n/translations';
  import type { ActionData } from './$types';

  export let form: ActionData;
  
  let visible = false;
  let loading = false;
  
  onMount(() => {
    // Slight delay to trigger animation after page loads
    setTimeout(() => {
      visible = true;
    }, 50);
  });

  function handleSubmit() {
    loading = true;
  }

  function handleResult() {
    loading = false;
  }
</script>

<svelte:head>
	<title>{$t.contactPage.title}</title>
	<meta name="description" content={$t.contactPage.description} />
</svelte:head>
  
<main class="">
  <!-- Hero Section -->
  <section class="flex justify-center items-start pt-8 py-12 md:pt-24">
    <div class="flex flex-col items-center max-w-5xl mx-auto px-4">
      <h1 class="text-5xl md:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 text-center
        bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent" 
        style="font-family: 'Playfair Display', serif !important; font-weight: 700 !important; letter-spacing: -0.02em;">
        {$t.contactPage.heroTitle}
      </h1>
    </div>
  </section>

  <!-- Contact Information Section -->
  <section class="mx-auto max-w-5xl px-6 space-y-10">
    <!-- Address Section -->
    <div class="gradient-border-card cf-hover transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div class="p-10 md:p-14 text-center">
        <h2 class="text-3xl md:text-4xl mb-8 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent" 
          style="font-family: 'Playfair Display', serif !important; font-weight: 600 !important;">
          {$t.contactPage.address}
        </h2>
        
        <!-- Map Section with modern styling -->
        <div class="mb-8 rounded-2xl overflow-hidden shadow-xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.8!2d-73.6219!3d45.5555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91bc4c0e3b6e3%3A0x5e3e8c8e6c9b8c8e!2s529%20Rue%20Jarry%20E%2C%20Montr%C3%A9al%2C%20QC!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
            width="100%"
            height="350"
            style="border: 0;"
            allowfullscreen={true}
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Map showing 529 Rue Jarry Est, Montreal, QC"
          ></iframe>
        </div>

        <p class="text-lg md:text-xl text-gray-700 font-medium" 
          style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
          {$t.contactPage.addressValue}
        </p>
      </div>
    </div>

    <!-- Contact Form Section with premium design -->
    <div class="gradient-border-card cf-hover transition-all duration-1000 delay-200 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div class="p-10 md:p-14">
        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl mb-6 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent" 
            style="font-family: 'Playfair Display', serif !important; font-weight: 600 !important;">
            {$t.contactPage.getInTouch}
          </h2>
          <p class="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto" 
            style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
            {$t.contactPage.bookingInstructions}
          </p>
        </div>

        <div class="mb-10">
          <form 
            method="POST" 
            action="/contact" 
            use:enhance={() => {
              handleSubmit();
              return async ({ result, update }) => {
                await update();
                handleResult();
              };
            }}
            class="space-y-6 max-w-xl mx-auto"
          >
            {#if form?.error}
              <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {form.error}
              </div>
            {/if}

            <div>
              <label for="name" class="block mb-3 font-semibold text-gray-700 text-base" 
                style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
                {$t.name}
              </label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                class="premium-input"
                required 
              />
            </div>

            <div>
              <label for="email" class="block mb-3 font-semibold text-gray-700 text-base" 
                style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
                {$t.email}
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                class="premium-input"
                required 
              />
            </div>

            <div>
              <label for="phonenumber" class="block mb-3 font-semibold text-gray-700 text-base" 
                style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
                {$t.phoneNumber}
              </label>
              <input 
                id="phonenumber" 
                name="phonenumber" 
                type="tel" 
                class="premium-input"
              />
            </div>

            <div>
              <label for="message" class="block mb-3 font-semibold text-gray-700 text-base" 
                style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
                {$t.message}
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows="5"
                class="premium-input resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="premium-button w-full text-lg"
            >
              {loading ? $t.sending : $t.send}
            </button>	
          </form>
        </div>

        <!-- Divider -->
        <div class="relative my-10">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-pink-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500" 
              style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
              OR
            </span>
          </div>
        </div>

        <!-- Booking Alternative Section -->
        <div class="text-center">
          <h3 class="text-xl md:text-2xl text-gray-700 mb-6" 
            style="font-family: 'Playfair Display', serif !important; font-weight: 500 !important;">
            {$t.contactPage.or}
          </h3>
          <a href="https://cachetcache.janeapp.com" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="inline-block px-8 py-4 rounded-xl font-semibold text-lg
               bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600
               text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
             style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
            {$t.contactPage.bookAtJaneApp}
          </a>
        </div>
      </div>
    </div>
  </section>
</main>