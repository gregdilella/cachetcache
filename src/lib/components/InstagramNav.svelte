<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { Home, Search, Heart, User, Syringe, Mail, MessageCircle, PlusSquare, LogOut, Settings, Clock, Users, Languages } from 'lucide-svelte';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { t, currentLanguage, switchLanguage } from '$lib/i18n/translations';
	
	export let mobile = false;
	export let session: Session | null = null;
	export let supabase: SupabaseClient | undefined = undefined;
	export let user: any = null;
	
	$: currentPath = $page.url.pathname;
	$: isAuthenticated = session !== null && session !== undefined;
	
	function isActive(path: string) {
		return currentPath === path;
	}
	
	async function handleSignOut() {
		if (!supabase) return;
		const { error } = await supabase.auth.signOut();
		if (!error) {
			await invalidateAll();
			goto('/welcome');
		}
	}
	
	function toggleLanguage() {
		const newLanguage = $currentLanguage === 'en' ? 'fr' : 'en';
		switchLanguage(newLanguage);
	}
</script>

{#if mobile}
	<!-- Mobile Bottom Navigation -->
	<div class="flex justify-around items-center py-2" style="background-color: #f6f1ea;">
		{#if isAuthenticated}
			<!-- Authenticated navigation -->
			<a href="/user_profile" class="flex flex-col items-center p-2 {isActive('/user_profile') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<Settings class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.profile}</span>
			</a>
			<a href="/dashboard" class="flex flex-col items-center p-2 {isActive('/dashboard') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<Clock class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.timeline}</span>
			</a>
			{#if user?.is_admin}
				<a href="/admin/patient-search" class="flex flex-col items-center p-2 {isActive('/admin/patient-search') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
					<Users class="w-6 h-6" />
					<span class="text-xs mt-1">{$t.patients}</span>
				</a>
			{/if}
			<!-- Language Toggle -->
			<button 
				on:click={toggleLanguage}
				class="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700"
			>
				<Languages class="w-6 h-6" />
				<span class="text-xs mt-1">{$currentLanguage === 'en' ? $t.french : $t.english}</span>
			</button>
			<button 
				on:click={handleSignOut}
				class="flex flex-col items-center p-2 text-red-600 hover:text-red-700"
			>
				<LogOut class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.signOut}</span>
			</button>
		{:else}
			<!-- Unauthenticated navigation -->
			<a href="/welcome" class="flex flex-col items-center p-2 {isActive('/welcome') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<Home class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.home}</span>
			</a>
			<a href="/services" class="flex flex-col items-center p-2 {isActive('/services') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<Syringe class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.services}</span>
			</a>
			<a href="/about" class="flex flex-col items-center p-2 {isActive('/about') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<Search class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.about}</span>
			</a>
			<a href="/contact" class="flex flex-col items-center p-2 {isActive('/contact') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<Mail class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.contact}</span>
			</a>
			<!-- Language Toggle -->
			<button 
				on:click={toggleLanguage}
				class="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700"
			>
				<Languages class="w-6 h-6" />
				<span class="text-xs mt-1">{$currentLanguage === 'en' ? $t.french : $t.english}</span>
			</button>
			<a href="/signin" class="flex flex-col items-center p-2 {isActive('/signin') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<User class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.signin}</span>
			</a>
		{/if}
	</div>
{:else}
	<!-- Desktop Sidebar Navigation -->
	<div class="flex flex-col h-full" style="background-color: #f6f1ea;">
		<!-- Logo/Brand -->
		<div class="p-6 flex justify-center">
			<img 
				src="/ChatGPTCCthumbnail.png" 
				alt="Cachet Caché" 
				class="max-w-[280px] w-full h-auto rounded-2xl"
			/>
		</div>
		
		<!-- Navigation Items -->
		<nav class="flex-1 p-4">
			<ul class="space-y-2 sidebar-nav">
				{#if isAuthenticated}
					<!-- Authenticated navigation -->
					<li>
						<a 
							href="/user_profile" 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover-sage"
						>
							<Settings class="w-6 h-6" />
							<span class="font-medium">{$t.profile}</span>
						</a>
					</li>
					<li>
						<a 
							href="/dashboard" 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover-sage"
						>
							<Clock class="w-6 h-6" />
							<span class="font-medium">{$t.timeline}</span>
						</a>
					</li>
					{#if user?.is_admin}
						<li>
							<a 
								href="/admin/patient-search" 
								class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover-sage"
							>
								<Users class="w-6 h-6" />
								<span class="font-medium">{$t.patients}</span>
							</a>
						</li>
					{/if}
					<!-- Language Toggle -->
					<li>
						<button 
							on:click={toggleLanguage}
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-hover
								text-blue-600 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
						>
							<Languages class="w-6 h-6" />
							<span class="font-medium">{$currentLanguage === 'en' ? $t.french : $t.english}</span>
						</button>
					</li>
					<li>
						<button 
							on:click={handleSignOut}
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-hover
								text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left"
						>
							<LogOut class="w-6 h-6" />
							<span class="font-medium">{$t.signOut}</span>
						</button>
					</li>
				{:else}
					<!-- Unauthenticated navigation -->
					<li>
						<a 
							href="/welcome" 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover"
						>
							<Home class="w-6 h-6" />
							<span class="font-medium">{$t.home}</span>
						</a>
					</li>
					<li>
						<a 
							href="/services" 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover"
						>
							<Syringe class="w-6 h-6" />
							<span class="font-medium">{$t.services}</span>
						</a>
					</li>
					<li>
						<a 
							href="/about" 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover"
						>
							<Search class="w-6 h-6" />
							<span class="font-medium">{$t.about}</span>
						</a>
					</li>
					<li>
						<a 
							href="/contact" 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover"
						>
							<Mail class="w-6 h-6" />
							<span class="font-medium">{$t.contact}</span>
						</a>
					</li>
					<!-- Language Toggle -->
					<li>
						<button 
							on:click={toggleLanguage}
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-hover
								text-blue-600 hover:bg-blue-50 hover:text-blue-700 w-full text-left"
						>
							<Languages class="w-6 h-6" />
							<span class="font-medium">{$currentLanguage === 'en' ? $t.french : $t.english}</span>
						</button>
					</li>
					<li>
						<a 
							href="/signin" 
							class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cf-text sidebar-hover"
						>
							<User class="w-6 h-6" />
							<span class="font-medium">{$t.signin}</span>
						</a>
					</li>
				{/if}
			</ul>
		</nav>
	</div>
{/if} 