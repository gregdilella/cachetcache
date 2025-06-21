<script lang="ts">
	import { page } from '$app/stores';
	import { Home, Search, Heart, User, Syringe, Mail, MessageCircle, PlusSquare } from 'lucide-svelte';
	import cachetCacheImage from '$lib/assets/cachetcachewhite.png';
	
	export let mobile = false;
	
	$: currentPath = $page.url.pathname;
	
	function isActive(path: string) {
		return currentPath === path;
	}
	
	const navItems = [
		{ href: '/welcome', icon: Home, label: 'Home' },
		{ href: '/services', icon: Syringe, label: 'Services' },
		{ href: '/about', icon: Search, label: 'About' },
		{ href: '/contact', icon: Mail, label: 'Contact' },
		{ href: '/signin', icon: User, label: 'Profile' }
	];
</script>

{#if mobile}
	<!-- Mobile Bottom Navigation -->
	<div class="flex justify-around items-center py-2 bg-white">
		{#each navItems as item}
			<a href={item.href} class="flex flex-col items-center p-2 {isActive(item.href) ? 'text-pink-600' : 'text-gray-600 hover:text-pink-500'}">
				<svelte:component this={item.icon} class="w-6 h-6" />
				<span class="text-xs mt-1">{item.label}</span>
			</a>
		{/each}
	</div>
{:else}
	<!-- Desktop Sidebar Navigation -->
	<div class="flex flex-col h-full">
		<!-- Logo/Brand -->
		<div class="p-6 border-b border-pink-200 flex justify-center">
			<img 
				src={cachetCacheImage} 
				alt="Cachet Caché" 
				class="max-w-[280px] w-full h-auto"
			/>
		</div>
		
		<!-- Navigation Items -->
		<nav class="flex-1 p-4">
			<ul class="space-y-2">
				{#each navItems as item}
					<li>
						<a 
							href={item.href} 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 
								{isActive(item.href) 
									? 'bg-pink-100 text-pink-700 shadow-sm' 
									: 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'}"
						>
							<svelte:component this={item.icon} class="w-6 h-6" />
							<span class="font-medium">{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
{/if} 