<script>
  import { onMount } from 'svelte';
  
  let visible = false;
  
  onMount(() => {
    // Slight delay to trigger animation after page loads
    setTimeout(() => {
      visible = true;
    }, 50);
  });
</script>

<main class="">
  <div class="text-center">
    <div class="my-16">
      <h1 class="text-4xl md:text-7xl font-black mb-8 animate-in fade-in slide-in-from-left-12 duration-700">
        Services
      </h1>
    </div>
    
    <div class="flex flex-col items-start gap-6 my-10 w-full max-w-2xl mx-auto transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/1" target="_blank" rel="noopener noreferrer" class="w-full group">
        <h3 class="text-2xl md:text-3xl font-semibold text-pink-700 border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-6 py-3 shadow-sm text-left w-full hover:from-pink-100 hover:to-purple-100 transition-all flex justify-between items-center">
          <span>Free consultations</span>
          <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Book now &rarr;</span>
        </h3>
      </a>
      
      <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/2" target="_blank" rel="noopener noreferrer" class="w-full group">
        <h3 class="text-2xl md:text-3xl font-semibold text-pink-700 border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-6 py-3 shadow-sm text-left w-full hover:from-pink-100 hover:to-purple-100 transition-all flex justify-between items-center">
          <span>Neuromodulator Treatments - Botox</span>
          <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Book now &rarr;</span>
        </h3>
      </a>
      
      <a href="https://cachetcache.janeapp.com/#/staff_member/1/treatment/3" target="_blank" rel="noopener noreferrer" class="w-full group">
        <h3 class="text-2xl md:text-3xl font-semibold text-pink-700 border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-6 py-3 shadow-sm text-left w-full hover:from-pink-100 hover:to-purple-100 transition-all flex justify-between items-center">
          <span>Fillers</span>
          <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Book now &rarr;</span>
        </h3>
      </a>
      
      <a href="https://cachetcache.janeapp.com" target="_blank" rel="noopener noreferrer" class="w-full group">
        <h3 class="text-2xl md:text-3xl font-semibold text-pink-700 border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-6 py-3 shadow-sm text-left w-full hover:from-pink-100 hover:to-purple-100 transition-all flex justify-between items-center">
          <span>Free follow-up and touch-ups</span>
          <span class="text-lg text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Book now &rarr;</span>
        </h3>
      </a>
    </div>
    

  </div>
</main>
