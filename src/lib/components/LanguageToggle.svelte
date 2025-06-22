<script lang="ts">
	import { currentLanguage, switchLanguage, type Language } from '$lib/i18n';
	import { t } from '$lib/i18n/translations';
	import { Languages } from 'lucide-svelte';

	let showDropdown = false;

	function handleLanguageChange(lang: Language) {
		switchLanguage(lang);
		showDropdown = false;
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-toggle')) {
			showDropdown = false;
		}
	}

	$: if (typeof window !== 'undefined') {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}
	}
</script>

<div class="language-toggle relative">
	<button
		on:click={toggleDropdown}
		class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
		aria-label={$t.language}
	>
		<Languages class="w-4 h-4" />
		<span class="text-sm font-medium">
			{$currentLanguage === 'en' ? $t.english : $t.french}
		</span>
		<svg 
			class="w-3 h-3 transition-transform duration-200 {showDropdown ? 'rotate-180' : ''}" 
			fill="none" 
			viewBox="0 0 24 24" 
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if showDropdown}
		<div class="absolute top-full left-0 mt-1 bg-white border border-pink-200 rounded-lg shadow-lg min-w-[120px] z-50">
			<button
				on:click={() => handleLanguageChange('en')}
				class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150 rounded-t-lg
					{$currentLanguage === 'en' ? 'bg-pink-100 text-pink-700 font-medium' : ''}"
			>
				{$t.english}
			</button>
			<button
				on:click={() => handleLanguageChange('fr')}
				class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150 rounded-b-lg
					{$currentLanguage === 'fr' ? 'bg-pink-100 text-pink-700 font-medium' : ''}"
			>
				{$t.french}
			</button>
		</div>
	{/if}
</div> 