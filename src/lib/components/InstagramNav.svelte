<script lang="ts">
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';
	import { Home, Search, Heart, User, Syringe, Mail, MessageCircle, PlusSquare, LogOut, Settings, Clock, Users, Languages, FileText } from 'lucide-svelte';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { t, currentLanguage, switchLanguage } from '$lib/i18n/translations';
	
	// Svelte 5 Props with proper types
	interface Props {
		mobile?: boolean;
		session?: Session | null | undefined;
		supabase?: SupabaseClient | undefined;
		user?: any | null;
	}
	
	let { 
		mobile = false, 
		session = null, 
		supabase = undefined, 
		user = null 
	}: Props = $props();
	
	// Reactive values using Svelte 5 $derived rune
	let currentPath = $derived(page.url.pathname);
	let isAuthenticated = $derived(session !== null && session !== undefined);
	
	/**
	 * Check if the given path matches the current path EXACTLY
	 * This ensures only ONE navigation item is highlighted at a time
	 */
	function isActive(path: string): boolean {
		return currentPath === path;
	}
	
	/**
	 * Handle user sign out
	 */
	async function handleSignOut() {
		if (!supabase) return;
		const { error } = await supabase.auth.signOut();
		if (!error) {
			await invalidateAll();
			goto('/welcome');
		}
	}
	
	/**
	 * Toggle between English and French
	 */
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
			<a href="/blog" class="flex flex-col items-center p-2 {isActive('/blog') ? 'text-pink-600' : 'cf-text hover:text-pink-500'}">
				<FileText class="w-6 h-6" />
				<span class="text-xs mt-1">{$t.blog}</span>
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
				onclick={toggleLanguage}
				class="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700"
			>
				<Languages class="w-6 h-6" />
				<span class="text-xs mt-1">{$currentLanguage === 'en' ? $t.french : $t.english}</span>
			</button>
			<button 
				onclick={handleSignOut}
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
				onclick={toggleLanguage}
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
	<!-- Desktop Sidebar Navigation with modern design -->
	<div class="flex flex-col h-full -mt-4">
		<!-- Logo/Brand - no alignment constraints, maximized size -->
		<div class="w-full">
			<div class="relative w-full h-26 flex items-center justify-center">
				<img 
					src="/logoimagecurrent.png" 
					alt="Cachet Caché" 
					class="w-full h-full opacity-90 hover:opacity-100 transition-all duration-300"
					style="object-fit: contain;"
				/>
			</div>
		</div>
		
		<!-- Navigation Items -->
		<nav class="px-4 pb-4 flex-1 -mt-4">
			<ul class="space-y-2" style="font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;">
				{#if isAuthenticated}
					<!-- Authenticated navigation with sage green to eggshell gradient -->
					<li>
						<a 
							href="/blog" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 
								{isActive('/blog') ? 'bg-gradient-to-r from-sage-500 to-[#f6f1ea] text-sage-700 shadow-md' : 'text-gray-700 sidebar-hover-sage'}"
						>
							<FileText class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.blog}</span>
						</a>
					</li>
					
					<li class="py-1"></li>
					
					<li>
						<a 
							href="/dashboard" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								{isActive('/dashboard') ? 'bg-gradient-to-r from-sage-500 to-[#f6f1ea] text-sage-700 shadow-md' : 'text-gray-700 sidebar-hover-sage'}"
						>
							<Clock class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.timeline}</span>
						</a>
					</li>
					
					<li>
						<a 
							href="/user_profile" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								{isActive('/user_profile') ? 'bg-gradient-to-r from-sage-500 to-[#f6f1ea] text-sage-700 shadow-md' : 'text-gray-700 sidebar-hover-sage'}"
						>
							<Settings class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.profile}</span>
						</a>
					</li>
					
					{#if user?.is_admin}
						<li>
							<a 
								href="/admin/patient-search" 
								class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
									{isActive('/admin/patient-search') ? 'bg-gradient-to-r from-sage-500 to-[#f6f1ea] text-sage-700 shadow-md' : 'text-gray-700 sidebar-hover-sage'}"
							>
								<Users class="w-5 h-5" />
								<span class="font-semibold text-sm">{$t.patients}</span>
							</a>
						</li>
					{/if}
					
					<li class="py-1"></li>
					
					<!-- Language Toggle -->
					<li>
						<button 
							onclick={toggleLanguage}
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								text-blue-600 hover:bg-blue-50/80 hover:text-blue-700 hover:shadow-sm w-full text-left"
						>
							<Languages class="w-5 h-5" />
							<span class="font-semibold text-sm">{$currentLanguage === 'en' ? $t.french : $t.english}</span>
						</button>
					</li>
					
					<li>
						<button 
							onclick={handleSignOut}
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								text-red-600 hover:bg-red-50/80 hover:text-red-700 hover:shadow-sm w-full text-left"
						>
							<LogOut class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.signOut}</span>
						</button>
					</li>
				{:else}
					<!-- Unauthenticated navigation with pink theme -->
					<li>
						<a 
							href="/welcome" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								{isActive('/welcome') ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md' : 'text-gray-700 sidebar-hover'}"
						>
							<Home class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.home}</span>
						</a>
					</li>
					
					<li>
						<a 
							href="/services" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								{isActive('/services') ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md' : 'text-gray-700 sidebar-hover'}"
						>
							<Syringe class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.services}</span>
						</a>
					</li>
					
					<li>
						<a 
							href="/about" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								{isActive('/about') ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md' : 'text-gray-700 sidebar-hover'}"
						>
							<Search class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.about}</span>
						</a>
					</li>
					
					<li>
						<a 
							href="/contact" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								{isActive('/contact') ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md' : 'text-gray-700 sidebar-hover'}"
						>
							<Mail class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.contact}</span>
						</a>
					</li>
					
					<li class="py-1"></li>
					
					<!-- Language Toggle -->
					<li>
						<button 
							onclick={toggleLanguage}
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								text-blue-600 hover:bg-blue-50/80 hover:text-blue-700 hover:shadow-sm w-full text-left"
						>
							<Languages class="w-5 h-5" />
							<span class="font-semibold text-sm">{$currentLanguage === 'en' ? $t.french : $t.english}</span>
						</button>
					</li>
					
					<li>
						<a 
							href="/signin" 
							class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
								{isActive('/signin') ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md' : 'text-gray-700 sidebar-hover'}"
						>
							<User class="w-5 h-5" />
							<span class="font-semibold text-sm">{$t.signin}</span>
						</a>
					</li>
				{/if}
			</ul>
		</nav>
	</div>
{/if} 