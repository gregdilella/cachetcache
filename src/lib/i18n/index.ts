import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Supported languages
export const supportedLanguages = ['en', 'fr'] as const;
export type Language = typeof supportedLanguages[number];

// Translation type definition
export type Translations = {
	// Navigation
	home: string;
	services: string;
	about: string;
	contact: string;
	signin: string;
	signup: string;
	profile: string;
	timeline: string;
	patients: string;
	signOut: string;
	
	// General UI
	welcome: string;
	english: string;
	french: string;
	language: string;
	
	// Common actions
	save: string;
	cancel: string;
	delete: string;
	edit: string;
	add: string;
	remove: string;
	close: string;
	confirm: string;
	send: string;
	
	// Form labels
	name: string;
	email: string;
	emailAddress: string;
	password: string;
	confirmPassword: string;
	phoneNumber: string;
	message: string;
	subject: string;
	
	// Messages
	loading: string;
	error: string;
	success: string;
	noData: string;
	sending: string;
	signingIn: string;
	creatingAccount: string;
	
	// Page titles
	pageTitle: {
		home: string;
		services: string;
		about: string;
		contact: string;
		signin: string;
		signup: string;
		profile: string;
		dashboard: string;
		admin: string;
	};
	
	// Welcome page
	welcomePage: {
		title: string;
		description: string;
		heroTitle: string;
		heroSubtitle: string;
		heroTagline: string;
		whatInNameTitle: string;
		cachetDef: string;
		cacheDef: string;
		philosophy1: string;
		philosophy2: string;
		philosophy3: string;
		philosophy4: string;
		philosophy5: string;
	};
	
	// About page
	aboutPage: {
		title: string;
		description: string;
		heroTitle: string;
		doctorName: string;
		meetDrLisa: string;
		aboutParagraph1: string;
		aboutParagraph2: string;
		aboutParagraph3: string;
		educationTitle: string;
		medicalDegree: string;
		residency: string;
		aestheticTraining: string;
	};
	
	// Services page
	servicesPage: {
		title: string;
		description: string;
		heroTitle: string;
		freeConsultations: string;
		neuromodulatorTreatments: string;
		fillers: string;
		freeFollowUp: string;
		bookNow: string;
	};
	
	// Contact page
	contactPage: {
		title: string;
		description: string;
		heroTitle: string;
		address: string;
		addressValue: string;
		bookingInstructions: string;
		or: string;
		bookAtJaneApp: string;
	};
	
	// Sign in page
	signinPage: {
		title: string;
		description: string;
		heroTitle: string;
		accessAccount: string;
		dontHaveAccount: string;
		signUpLink: string;
	};
	
	// Sign up page
	signupPage: {
		title: string;
		description: string;
		heroTitle: string;
		createAccount: string;
		alreadyHaveAccount: string;
		signInLink: string;
	};
	
	// User profile page
	userProfile: {
		title: string;
		heading: string;
		subtitle: string;
		fullName: string;
		fullNameRequired: string;
		phoneNumber: string;
		sex: string;
		selectSex: string;
		male: string;
		female: string;
		other: string;
		dateOfBirth: string;
		age: string;
		yearsOld: string;
		updateProfile: string;
		updating: string;
		profileUpdated: string;
		enterFullName: string;
		enterPhone: string;
	};
	
	// Dashboard/Timeline page
	dashboard: {
		title: string;
		welcome: string;
		completeProfile: string;
		visits: string;
		privateAccount: string;
		account: string;
		visitTimeline: string;
		trackProgress: string;
	};
	
	// Admin patient search page
	patientSearch: {
		title: string;
		heading: string;
		subtitle: string;
		searchPlaceholder: string;
		showingResults: string;
		ofResults: string;
		patients: string;
		patientInfo: string;
		contact: string;
		demographics: string;
		registration: string;
		noName: string;
		noPhone: string;
		age: string;
		born: string;
		registered: string;
		updated: string;
		noPatientsFound: string;
		tryAdjusting: string;
		noRegistrations: string;
		totalPatients: string;
		completeProfiles: string;
		withBirthdate: string;
		withPhone: string;
	};
	
	// Visit timeline component
	visitTimeline: {
		addNewVisit: string;
		createNewRecord: string;
		visitTitlePlaceholder: string;
		addVisit: string;
		noVisitsYet: string;
		addFirstVisit: string;
		deleteConfirm: string;
		noPhotosYet: string;
		initialConsultPhoto: string;
		initialConsultPhotos: string;
		followUpPhoto: string;
		followUpPhotos: string;
		initialConsult: string;
		followUp: string;
		date: string;
		uploadInitialPhotos: string;
		uploadFollowUpPhotos: string;
	};
	
	// Photo upload component
	photoUpload: {
		uploading: string;
		doctorNote: string;
		photo: string;
		addNotesPlaceholder: string;
		addMorePhotos: string;
		dropPhotosHere: string;
		dropYourPhotos: string;
		fileFormats: string;
		selectMultiple: string;
		viewEnlargedPhoto: string;
		closeImageViewer: string;
		enlargedPhotoView: string;
	};
};

// Default language
const defaultLanguage: Language = 'en';

// Get initial language from localStorage or use default
function getInitialLanguage(): Language {
	if (!browser) return defaultLanguage;
	
	const stored = localStorage.getItem('language');
	if (stored && supportedLanguages.includes(stored as Language)) {
		return stored as Language;
	}
	
	// Try to detect from browser language
	const browserLang = navigator.language.slice(0, 2);
	if (supportedLanguages.includes(browserLang as Language)) {
		return browserLang as Language;
	}
	
	return defaultLanguage;
}

// Create language store
export const currentLanguage = writable<Language>(getInitialLanguage());

// Update localStorage when language changes
if (browser) {
	currentLanguage.subscribe((lang) => {
		localStorage.setItem('language', lang);
	});
}

// Switch language function
export function switchLanguage(lang: Language): void {
	currentLanguage.set(lang);
} 