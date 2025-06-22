import type { Translations } from '../index.js';

export const en: Translations = {
	// Navigation
	home: 'Home',
	services: 'Services',
	about: 'About',
	contact: 'Contact',
	signin: 'Sign In',
	signup: 'Sign Up',
	profile: 'Profile',
	timeline: 'Timeline',
	patients: 'Patients',
	signOut: 'Sign Out',
	
	// General UI
	welcome: 'Welcome',
	english: 'English',
	french: 'Français',
	language: 'Language',
	
	// Common actions
	save: 'Save',
	cancel: 'Cancel',
	delete: 'Delete',
	edit: 'Edit',
	add: 'Add',
	remove: 'Remove',
	close: 'Close',
	confirm: 'Confirm',
	send: 'Send',
	
	// Form labels
	name: 'Name',
	email: 'Email',
	emailAddress: 'Email address',
	password: 'Password',
	confirmPassword: 'Confirm Password',
	phoneNumber: 'Phone Number',
	message: 'Message',
	subject: 'Subject',
	
	// Messages
	loading: 'Loading...',
	error: 'Error',
	success: 'Success',
	noData: 'No data available',
	sending: 'Sending...',
	signingIn: 'Signing in...',
	creatingAccount: 'Creating account...',
	
	// Page titles
	pageTitle: {
		home: 'Home',
		services: 'Our Services',
		about: 'About Us',
		contact: 'Contact Us',
		signin: 'Sign In',
		signup: 'Create Account',
		profile: 'My Profile',
		dashboard: 'Dashboard',
		admin: 'Admin Panel'
	},
	
	// Welcome page
	welcomePage: {
		title: 'Welcome | Cachet Caché',
		description: 'Welcome to Cachet Caché - Medical Aesthetics Clinic',
		heroTitle: 'Cachet Caché',
		heroSubtitle: 'Medical Aesthetics Clinic',
		heroTagline: '✨ The speakeasy of esthetic medicine clinics ✨',
		whatInNameTitle: 'What\'s in a name?',
		cachetDef: 'distinguished mark or seal, prestige',
		cacheDef: 'hidden',
		philosophy1: 'If you are searching for the place to get a naturally youthful look, without anyone knowing – look no further.',
		philosophy2: 'Cachet Caché is the speakeasy of esthetic medicine clinics.',
		philosophy3: 'We value your privacy and your personal preferences while treating you.',
		philosophy4: 'We strive to bring business through word-of-mouth and less through traditional marketing.',
		philosophy5: 'We believe in less-is-more and organic expansion.'
	},
	
	// About page
	aboutPage: {
		title: 'About | Cachet Caché',
		description: 'About Dr. Lisa Henriques and Cachet Caché',
		heroTitle: 'About',
		doctorName: 'Dr. Lisa Henriques',
		meetDrLisa: 'Meet Dr. Lisa',
		aboutParagraph1: 'Dr. Lisa Henriques is a dedicated family physician who has expanded her practice to include aesthetic medicine.',
		aboutParagraph2: 'Since 2017, she has been providing comprehensive healthcare while maintaining the highest standards of patient care and privacy.',
		aboutParagraph3: 'Her approach combines medical expertise with an artistic eye for natural-looking results.',
		educationTitle: 'Education & Training',
		medicalDegree: 'Medical Degree - Université de Montréal (2015)',
		residency: 'Family Medicine Residency - McGill Ste-Mary\'s Hospital (2017)',
		aestheticTraining: 'Aesthetic Medicine Training - CMQ Certified (2024)'
	},
	
	// Services page
	servicesPage: {
		title: 'Services | Cachet Caché',
		description: 'Our medical aesthetic services',
		heroTitle: 'Services',
		freeConsultations: 'Free consultations',
		neuromodulatorTreatments: 'Neuromodulator Treatments - Botox',
		fillers: 'Fillers',
		freeFollowUp: 'Free follow-up and touch-ups',
		bookNow: 'Book now'
	},
	
	// Contact page
	contactPage: {
		title: 'Contact | Cachet Caché',
		description: 'Contact Cachet Caché clinic',
		heroTitle: 'Contact',
		address: 'Address:',
		addressValue: 'Clinique VIP, suite 400, 529 rue Jarry est, Montreal, Qc',
		bookingInstructions: 'To book an appointment, please fill out the form below:',
		or: 'Or',
		bookAtJaneApp: 'Book at Jane App'
	},
	
	// Sign in page
	signinPage: {
		title: 'Sign In | Cachet Caché',
		description: 'Sign in to your Cachet Caché account',
		heroTitle: 'Sign In',
		accessAccount: 'Access your account below:',
		dontHaveAccount: 'Don\'t have an account?',
		signUpLink: 'Sign up'
	},
	
	// Sign up page
	signupPage: {
		title: 'Sign Up | Cachet Caché',
		description: 'Create your Cachet Caché account',
		heroTitle: 'Sign Up',
		createAccount: 'Create your account below:',
		alreadyHaveAccount: 'Already have an account?',
		signInLink: 'Sign in'
	},
	
	// User profile page
	userProfile: {
		title: 'Profile Settings | Cachet Caché',
		heading: 'Profile Information',
		subtitle: 'Update your personal details',
		fullName: 'Full Name',
		fullNameRequired: 'Full Name *',
		phoneNumber: 'Phone Number',
		sex: 'Sex',
		selectSex: 'Select...',
		male: 'Male',
		female: 'Female',
		other: 'Other',
		dateOfBirth: 'Date of Birth',
		age: 'Age',
		yearsOld: 'years old',
		updateProfile: 'Update Profile',
		updating: 'Updating...',
		profileUpdated: 'Profile updated successfully!',
		enterFullName: 'Enter your full name',
		enterPhone: 'Enter your phone number'
	},
	
	// Dashboard/Timeline page
	dashboard: {
		title: 'Timeline | Cachet Caché',
		welcome: 'Welcome',
		completeProfile: 'Complete your profile',
		visits: 'Visits',
		privateAccount: 'Private',
		account: 'Account',
		visitTimeline: 'Visit Timeline',
		trackProgress: 'Track your treatment progress'
	},
	
	// Admin patient search page
	patientSearch: {
		title: 'Patient Search - Admin',
		heading: 'Patient Search',
		subtitle: 'Search and manage all patient records',
		searchPlaceholder: 'Search by name, phone, sex, or ID...',
		showingResults: 'Showing',
		ofResults: 'of',
		patients: 'patients',
		patientInfo: 'Patient Info',
		contact: 'Contact',
		demographics: 'Demographics',
		registration: 'Registration',
		noName: 'No name',
		noPhone: 'No phone',
		age: 'Age',
		born: 'Born',
		registered: 'Registered',
		updated: 'Updated',
		noPatientsFound: 'No patients found',
		tryAdjusting: 'Try adjusting your search terms.',
		noRegistrations: 'No patients have been registered yet.',
		totalPatients: 'Total Patients',
		completeProfiles: 'With Complete Profiles',
		withBirthdate: 'With Birthdate',
		withPhone: 'With Phone'
	},
	
	// Visit timeline component
	visitTimeline: {
		addNewVisit: 'Add New Visit',
		createNewRecord: 'Create a new patient visit record',
		visitTitlePlaceholder: 'Visit title (e.g., \'Botox Treatment\', \'Follow-up Consultation\')',
		addVisit: 'Add Visit',
		noVisitsYet: 'No visits recorded yet',
		addFirstVisit: 'Add your first visit above to get started',
		deleteConfirm: 'Are you sure you want to delete this visit and all its photos?',
		noPhotosYet: 'No photos yet',
		initialConsultPhoto: 'initial consult photo',
		initialConsultPhotos: 'initial consult photos',
		followUpPhoto: 'follow-up photo',
		followUpPhotos: 'follow-up photos',
		initialConsult: 'Initial Consult',
		followUp: 'Follow Up',
		date: 'Date',
		uploadInitialPhotos: 'Upload initial consult photos',
		uploadFollowUpPhotos: 'Upload follow-up photos'
	},
	
	// Photo upload component
	photoUpload: {
		uploading: 'Uploading...',
		doctorNote: 'Doctor\'s Note',
		photo: 'Photo',
		addNotesPlaceholder: 'Add notes about this visit...',
		addMorePhotos: 'Add More Photos',
		dropPhotosHere: 'Drop photos here',
		dropYourPhotos: 'Drop your photos here',
		fileFormats: 'JPEG, PNG, WebP up to 10MB each',
		selectMultiple: 'Select multiple files or drag & drop',
		viewEnlargedPhoto: 'View enlarged photo',
		closeImageViewer: 'Close image viewer',
		enlargedPhotoView: 'Enlarged photo view'
	}
}; 