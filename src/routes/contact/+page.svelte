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
  <section class="flex justify-center items-start pt-5 py-10 md:pt-20">
    <div class="flex flex-col items-center">
      <h1 class="text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 duration-700" style="font-family: 'Sacramento', cursive;">
        {$t.contactPage.heroTitle}
      </h1>
    </div>
  </section>

  <!-- Contact Information Section -->
  <section class="mx-auto max-w-4xl px-6">
    <!-- Combined Contact Box -->
    <div class="gradient-border-card cf-hover transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div class="p-8">
        <!-- Address Section -->
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 non-cursive">{$t.contactPage.address}</h2>
          <p class="text-lg md:text-xl text-gray-700 mb-4 non-cursive">{$t.contactPage.addressValue}</p>
          <p class="text-lg md:text-xl text-gray-700 non-cursive">{$t.contactPage.bookingInstructions}</p>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-8"></div>

        <!-- Contact Form Section -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center non-cursive">{$t.contactPage.getInTouch}</h2>
          
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
            class="space-y-6 max-w-md mx-auto"
          >
            {#if form?.error}
              <div class="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm sm:text-base">
                {form.error}
              </div>
            {/if}

            <div>
              <label for="name" class="block mb-2 font-semibold text-gray-700 text-sm sm:text-base non-cursive">{$t.name}</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                class="w-full p-3 sm:p-2 border border-gray-300 rounded-lg text-gray-900 text-base sm:text-sm
                  focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
                  touch-manipulation transition-colors" 
                required 
              />
            </div>

            <div>
              <label for="email" class="block mb-2 font-semibold text-gray-700 text-sm sm:text-base non-cursive">{$t.email}</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                class="w-full p-3 sm:p-2 border border-gray-300 rounded-lg text-gray-900 text-base sm:text-sm
                  focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
                  touch-manipulation transition-colors" 
                required 
              />
            </div>

            <div>
              <label for="phonenumber" class="block mb-2 font-semibold text-gray-700 text-sm sm:text-base non-cursive">{$t.phoneNumber}</label>
              <input 
                id="phonenumber" 
                name="phonenumber" 
                type="tel" 
                class="w-full p-3 sm:p-2 border border-gray-300 rounded-lg text-gray-900 text-base sm:text-sm
                  focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
                  touch-manipulation transition-colors" 
              />
            </div>

            <div>
              <label for="message" class="block mb-2 font-semibold text-gray-700 text-sm sm:text-base non-cursive">{$t.message}</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4"
                class="w-full p-3 sm:p-2 border border-gray-300 rounded-lg text-gray-900 text-base sm:text-sm
                  focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
                  touch-manipulation transition-colors resize-none" 
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold 
                text-base sm:text-lg py-3 sm:py-2 px-6 sm:px-4 rounded-lg 
                transition-all duration-300 hover:from-pink-500 hover:to-purple-500 
                disabled:opacity-50 disabled:cursor-not-allowed w-full touch-manipulation non-cursive"
            >
              {loading ? $t.sending : $t.send}
            </button>	
          </form>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-8"></div>

        <!-- Booking Alternative Section -->
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-800 mb-4 non-cursive">{$t.contactPage.or}</h2>
          <a href="https://cachetcache.janeapp.com" target="_blank" rel="noopener noreferrer" 
             class="text-lg sm:text-xl font-bold text-pink-500 hover:text-pink-700 transition-colors duration-300 underline touch-manipulation non-cursive">
            {$t.contactPage.bookAtJaneApp}
          </a>
        </div>
      </div>
    </div>
  </section>
</main>