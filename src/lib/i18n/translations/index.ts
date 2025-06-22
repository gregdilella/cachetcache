import { en } from './en.js';
import { fr } from './fr.js';
import { derived } from 'svelte/store';
import { currentLanguage, switchLanguage, type Language, type Translations } from '../index.js';

// Export all translations
export const translations = {
	en,
	fr
} as const;

// Export language store and switch function
export { currentLanguage, switchLanguage };

// Create derived store for current translations
export const t = derived(
	currentLanguage,
	($currentLanguage: Language) => translations[$currentLanguage]
);

// Helper function to get translation by key path
export function getTranslation(lang: Language, keyPath: string): string {
	const keys = keyPath.split('.');
	let value: any = translations[lang];
	
	for (const key of keys) {
		if (value && typeof value === 'object' && key in value) {
			value = value[key];
		} else {
			// Fallback to English if key not found
			value = translations.en;
			for (const fallbackKey of keys) {
				if (value && typeof value === 'object' && fallbackKey in value) {
					value = value[fallbackKey];
				} else {
					return keyPath; // Return key path if translation not found
				}
			}
			break;
		}
	}
	
	return typeof value === 'string' ? value : keyPath;
} 