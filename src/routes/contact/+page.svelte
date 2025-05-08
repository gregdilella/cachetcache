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
      <h1 class="text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 duration-700">Contact</h1>
      <h2 class="text-2xl md:text-3xl font-bold text-pink-700 mb-2 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">Address:</h2>
      <p class="text-lg md:text-xl text-pink-800 mb-4 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">Clinique VIP, suite 400, 529 rue Jarry est, Montreal, Qc</p>
      <p class="text-lg md:text-xl text-pink-800 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">To book an appointment, please fill out the form below:</p>
    </div>

    <form method="POST" action="/contact" class="space-y-4 max-w-md mx-auto mt-10 text-left transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <div>
        <label for="name" class="block mb-1 font-semibold text-pink-700">Name</label>
        <input id="name" name="name" type="text" class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label for="email" class="block mb-1 font-semibold text-pink-700">Email</label>
        <input id="email" name="email" type="email" class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label for="phonenumber" class="block mb-1 font-semibold text-pink-700">Phone Number</label>
        <input id="phonenumber" name="phonenumber" type="tel" class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label for="message" class="block mb-1 font-semibold text-pink-700">Message</label>
        <textarea id="message" name="message" class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50" required></textarea>
      </div>

      <button
        type="submit"
        class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg py-2 px-4 rounded border border-pink-300 transition-all duration-300 hover:from-pink-500 hover:to-purple-500"
      >
        Send
      </button>	
    </form>

    <br/>
    <div class="my-6 text-xl font-bold text-pink-700 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">Or</div>
    <div class="mt-2 mb-12 transition-all duration-1000 {visible ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}">
      <a href="https://cachetcache.janeapp.com" target="_blank" rel="noopener noreferrer" 
         class="text-xl font-bold text-pink-500 hover:text-pink-700 transition-colors duration-300 underline">
        Book at Jane App
      </a>
    </div>
  </div>
</main>