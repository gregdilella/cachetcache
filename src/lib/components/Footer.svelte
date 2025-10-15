<script lang="ts">
	import { Instagram, Heart } from 'lucide-svelte';
	
	const currentYear = new Date().getFullYear();
</script>

<style>
	.footer-gradient {
		background: linear-gradient(135deg, #B1BCA0 0%, #a0ab8f 50%, #B1BCA0 100%);
		position: relative;
		overflow: hidden;
	}
	
	.footer-gradient::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, 
			transparent 0%, 
			rgba(255, 244, 188, 0.5) 25%, 
			rgba(213, 138, 148, 0.5) 50%, 
			rgba(255, 244, 188, 0.5) 75%, 
			transparent 100%
		);
		animation: shimmer-border 3s ease-in-out infinite;
	}
	
	@keyframes shimmer-border {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}
</style>

<footer class="footer-gradient w-full text-right py-8 px-4 mt-auto">
	<div class="flex flex-col items-end gap-5 max-w-6xl mx-auto">
		<!-- Instagram Link with modern design -->
		<a 
			href="https://www.instagram.com/cachet.cache/" 
			target="_blank" 
			rel="noopener noreferrer"
			class="group flex items-center gap-3 px-6 py-3 rounded-xl
				bg-white/10 backdrop-blur-sm border border-white/20
				hover:bg-white/20 hover:scale-105
				transition-all duration-300"
		>
			<Instagram class="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
			<span class="font-semibold text-white" 
				style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
				@cachet.cache
			</span>
		</a>
		
		<!-- Copyright with icon -->
		<div class="flex items-center gap-2 text-white/90">
			<span class="font-medium" 
				style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
				Copyright © {currentYear}
			</span>
			<Heart class="w-4 h-4 text-pink-200" fill="currentColor" />
		</div>
	</div>
</footer>
