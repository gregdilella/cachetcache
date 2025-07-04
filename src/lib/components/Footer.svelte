<script lang="ts">
	import { Instagram } from 'lucide-svelte';
	
	const currentYear = new Date().getFullYear();
</script>

<footer class="w-full border-t-2 border-gray-300 text-right py-6 px-4 mt-auto" style="background-color: #B1BCA0;">
	<div class="flex flex-col items-end gap-4 max-w-6xl mx-auto">
		<!-- Copyright -->
		<p class="text-white font-medium non-cursive">
			Copyright © {currentYear}
		</p>
		
		<!-- Instagram Link -->
		<a 
			href="https://www.instagram.com/cachet.cache/" 
			target="_blank" 
			rel="noopener noreferrer"
			class="flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 non-cursive"
		>
			<Instagram class="w-6 h-6" />
			<span class="font-medium">@cachet.cache</span>
		</a>
	</div>
</footer>
