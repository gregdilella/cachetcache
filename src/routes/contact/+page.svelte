<script>
	export let data;
  </script>
  
  <main class="">
	<div class="text-center">
	  <div class="my-16">
		<h1 class="text-4xl md:text-7xl font-black mb-4 animate-in fade-in slide-in-from-left-12 duration-700">Contact</h1>
		<h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Address:</h2>
		<p class="text-lg md:text-xl text-white mb-4">Clinique VIP, suite 400, 529 rue Jarry est, Montreal, Qc</p>
		<p class="text-lg md:text-xl text-white">To book an appointment, please fill out the form below:</p>
	  </div>
  
	  <form method="POST" class="space-y-4 max-w-md mx-auto mt-10 text-left">
		<div>
		  <label for="name" class="block mb-1 font-semibold">Name</label>
		  <input id="name" name="name" type="text" class="w-full p-2 border rounded text-black" required />
		</div>
  
		<div>
		  <label for="email" class="block mb-1 font-semibold">Email</label>
		  <input id="email" name="email" type="email" class="w-full p-2 border rounded text-black" required />
		</div>
  
		<div>
		  <label for="phonenumber" class="block mb-1 font-semibold">Phone Number</label>
		  <input id="phonenumber" name="phonenumber" type="tel" class="w-full p-2 border rounded text-black" required />
		</div>
  
		<div>
		  <label for="message" class="block mb-1 font-semibold">Message</label>
		  <textarea id="message" name="message" class="w-full p-2 border rounded text-black" required></textarea>
		</div>
  
		<button
		  type="submit"
		  class="bg-gradient-to-bl from-primary-700 to-secondary-700 text-white font-bold text-lg py-2 px-4 rounded border border-white transition-all duration-300 hover:bg-blue-700 hover:bg-none hover:from-transparent hover:to-transparent"
		>
		  Send
		</button>	
	  </form>
  
	  <br/>
	  <div class="my-6 text-xl font-bold">Or</div>
	  <div class="mt-2 mb-12">
		<a href="https://cachetcache.janeapp.com" target="_blank" rel="noopener noreferrer" 
		   class="text-xl font-bold text-white hover:text-primary-300 transition-colors duration-300 underline">
		  Book at Jane App
		</a>
	  </div>
  
  </main>