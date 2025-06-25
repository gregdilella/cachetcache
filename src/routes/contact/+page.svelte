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
  <div class="text-center px-4">
    <div class="my-8 sm:my-16">
      <h1 class="text-3xl sm:text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 duration-700">{$t.contactPage.heroTitle}</h1>
      <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-pink-700 mb-2 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">{$t.contactPage.address}</h2>
      <p class="text-base sm:text-lg md:text-xl text-pink-800 mb-4 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">{$t.contactPage.addressValue}</p>
      <p class="text-base sm:text-lg md:text-xl text-pink-800 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">{$t.contactPage.bookingInstructions}</p>
    </div>

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
      class="space-y-4 max-w-md mx-auto mt-6 sm:mt-10 text-left transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}"
    >
      {#if form?.error}
        <div class="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm sm:text-base">
          {form.error}
        </div>
      {/if}

      <div>
        <label for="name" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.name}</label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
            focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
            touch-manipulation transition-colors" 
          required 
        />
      </div>

      <div>
        <label for="email" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.email}</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
            focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
            touch-manipulation transition-colors" 
          required 
        />
      </div>

      <div>
        <label for="phonenumber" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.phoneNumber}</label>
        <input 
          id="phonenumber" 
          name="phonenumber" 
          type="tel" 
          class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
            focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
            touch-manipulation transition-colors" 
        />
      </div>

      <div>
        <label for="message" class="block mb-2 font-semibold text-pink-700 text-sm sm:text-base">{$t.message}</label>
        <textarea 
          id="message" 
          name="message" 
          rows="4"
          class="w-full p-3 sm:p-2 border border-pink-300 rounded-lg text-black text-base sm:text-sm
            focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 
            touch-manipulation transition-colors resize-none" 
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold 
          text-base sm:text-lg py-3 sm:py-2 px-6 sm:px-4 rounded-lg border border-pink-300 
          transition-all duration-300 hover:from-pink-500 hover:to-purple-500 
          disabled:opacity-50 disabled:cursor-not-allowed w-full touch-manipulation"
      >
        {loading ? $t.sending : $t.send}
      </button>	
    </form>

    <br/>
    <div class="my-4 sm:my-6 text-lg sm:text-xl font-bold text-pink-700 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">{$t.contactPage.or}</div>
    <div class="mt-2 mb-8 sm:mb-12 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <a href="https://cachetcache.janeapp.com" target="_blank" rel="noopener noreferrer" 
         class="text-lg sm:text-xl font-bold text-pink-500 hover:text-pink-700 transition-colors duration-300 underline touch-manipulation">
        {$t.contactPage.bookAtJaneApp}
      </a>
    </div>
  </div>
</main>