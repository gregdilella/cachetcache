import type { Translations } from '../index.js';

export const fr: Translations = {
	// Navigation
	home: 'Accueil',
	services: 'Services',
	about: 'À propos',
	contact: 'Contact',
	signin: 'Se connecter',
	signup: 'S\'inscrire',
	profile: 'Profil',
	blog: 'Blog',
	timeline: 'Chronologie',
	patients: 'Patients',
	signOut: 'Se déconnecter',
	
	// General UI
	welcome: 'Bienvenue',
	english: 'English',
	french: 'Français',
	language: 'Langue',
	
	// Common actions
	save: 'Enregistrer',
	cancel: 'Annuler',
	delete: 'Supprimer',
	edit: 'Modifier',
	add: 'Ajouter',
	remove: 'Retirer',
	close: 'Fermer',
	confirm: 'Confirmer',
	send: 'Envoyer',
	
	// Form labels
	name: 'Nom',
	email: 'Courriel',
	emailAddress: 'Adresse courriel',
	password: 'Mot de passe',
	confirmPassword: 'Confirmer le mot de passe',
	phoneNumber: 'Numéro de téléphone',
	message: 'Message',
	subject: 'Sujet',
	
	// Messages
	loading: 'Chargement...',
	error: 'Erreur',
	success: 'Succès',
	noData: 'Aucune donnée disponible',
	sending: 'Envoi en cours...',
	signingIn: 'Connexion en cours...',
	creatingAccount: 'Création du compte...',
	
	// Page titles
	pageTitle: {
		home: 'Accueil',
		services: 'Nos Services',
		about: 'À propos de nous',
		contact: 'Contactez-nous',
		signin: 'Se connecter',
		signup: 'Créer un compte',
		profile: 'Mon Profil',
		blog: 'Blog',
		dashboard: 'Tableau de bord',
		admin: 'Panneau d\'administration'
	},

	// Blog page
	blogPage: {
		title: 'Blog',
		description: 'Lisez nos dernières actualités et réflexions',
		heroTitle: 'Blog Cachet Caché',
		createPost: 'Créer un nouveau post',
		postTitle: 'Titre du post',
		postContent: 'Partagez vos pensées...',
		publish: 'Publier le post',
		noPosts: 'Aucun post de blog pour le moment. Revenez bientôt!',
		comments: 'Commentaires',
		addComment: 'Ajouter un commentaire',
		reply: 'Répondre',
		like: 'J\'aime',
		dislike: 'Je n\'aime pas',
		likedBy: 'Aimé par',
		dislikedBy: 'N\'aimé pas par',
		postedBy: 'Publié par',
		commentsCount: 'commentaire(s)',
		repliesCount: 'réponse(s)',
		writeComment: 'Écrivez un commentaire...',
		writeReply: 'Écrivez une réponse...',
		posting: 'Publication...',
		commenting: 'Ajout du commentaire...',
		replying: 'Ajout de la réponse...',
		deletePost: 'Supprimer le post',
		editPost: 'Modifier le post',
		deleteComment: 'Supprimer le commentaire',
		editComment: 'Modifier le commentaire',
		confirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci?',
		adminOnly: 'Admin seulement'
	},
	
	// Welcome page
	welcomePage: {
		title: 'Bienvenue | Cachet Caché',
		description: 'Bienvenue chez Cachet Caché - Clinique d\'Esthétique Médicale',
		heroTitle: 'Cachet Caché',
		heroSubtitle: 'Clinique d\'Esthétique Médicale',
		heroTagline: 'Le speakeasy des cliniques d\'esthétique médicale',
		whatInNameTitle: 'Que signifie notre nom?',
		definition: 'Définition:',
		cachetDef: '<strong>cachet:</strong> marque ou sceau distinctif, prestige',
		cacheDef: '<strong>caché:</strong> caché',
		philosophy1: 'Si vous cherchez l\'endroit pour obtenir un look naturellement jeune, sans que personne ne le sache – ne cherchez plus.',
		philosophy2: 'Nous croyons que moins c\'est plus.',
		philosophy3: 'Notre objectif est de minimiser les signes du vieillissement tout en préservant votre look unique, laissant les autres deviner si vous avez touché le gros lot génétique.',
		philosophy4: 'Nous nous efforçons de développer notre entreprise par le bouche-à-oreille plutôt que par la publicité axée sur le marketing bruyant.'
	},
	
	// About page
	aboutPage: {
		title: 'À propos | Cachet Caché',
		description: 'À propos de Dr. Lisa Henriques et Cachet Caché',
		heroTitle: 'À propos',
		doctorName: 'Dr. Lisa Henriques',
		meetDrLisa: 'Rencontrez Dr. Lisa Henriques',
		aboutParagraph1: 'Dr. Lisa Henriques est une médecin de famille dévouée qui a élargi sa pratique pour inclure la médecine esthétique.',
		aboutParagraph2: 'Depuis 2017, elle fournit des soins de santé complets tout en maintenant les plus hauts standards de soins aux patients et de confidentialité.',
		aboutParagraph3: 'Son approche combine l\'expertise médicale avec un œil artistique pour des résultats d\'apparence naturelle.',
		educationTitle: 'Éducation et Formation',
		medicalDegree: 'Diplôme de Médecine - Université de Montréal (2015)',
		residency: 'Résidence en Médecine Familiale - Hôpital Ste-Mary\'s McGill (2017)',
		aestheticTraining: 'Formation en Médecine Esthétique - Certifié CMQ (2024)'
	},
	
	// Services page
	servicesPage: {
		title: 'Services | Cachet Caché',
		description: 'Nos services d\'esthétique médicale',
		heroTitle: 'Services',
		freeConsultations: 'Consultations - 100$',
		consultationDeduction: '*déduit du prix du traitement',
		neuromodulatorTreatments: 'Traitements Neuromodulateurs (Exemple Botox)',
		neuromodulatorPricing: {
			tier1: '0-10 unités - 12 $/unité',
			tier2: '11-50 unités - 11 $/unité',
			tier3: '> 50 unités - 10 $/unité'
		},
		fillers: 'Agents de comblement à l\'acide hyaluronique',
		fillerPricing: {
			full: 'Seringue complète 750 $',
			half: 'Demi-seringue 400 $'
		},
		freeFollowUp: 'Suivi et retouches gratuits',
		bookNow: 'Réserver maintenant'
	},
	
	// Contact page
	contactPage: {
		title: 'Contact | Cachet Caché',
		description: 'Contactez la clinique Cachet Caché',
		heroTitle: 'Contact',
		address: 'Adresse:',
		addressValue: 'Clinique VIP, suite 400, 529 rue Jarry est, Montréal, Qc',
		bookingInstructions: 'Pour prendre rendez-vous, veuillez remplir le formulaire ci-dessous:',
		getInTouch: 'Nous contacter',
		or: 'Ou',
		bookAtJaneApp: 'Réserver sur Jane App'
	},
	
	// Sign in page
	signinPage: {
		title: 'Se connecter | Cachet Caché',
		description: 'Connectez-vous à votre compte Cachet Caché',
		heroTitle: 'Se connecter',
		accessAccount: 'Accédez à votre compte ci-dessous:',
		dontHaveAccount: 'Vous n\'avez pas de compte?',
		signUpLink: 'S\'inscrire'
	},
	
	// Sign up page
	signupPage: {
		title: 'S\'inscrire | Cachet Caché',
		description: 'Créez votre compte Cachet Caché',
		heroTitle: 'S\'inscrire',
		createAccount: 'Créez votre compte ci-dessous:',
		alreadyHaveAccount: 'Vous avez déjà un compte?',
		signInLink: 'Se connecter'
	},
	
	// User profile page
	userProfile: {
		title: 'Paramètres de profil | Cachet Caché',
		heading: 'Informations de profil',
		subtitle: 'Mettez à jour vos informations personnelles',
		fullName: 'Nom complet',
		fullNameRequired: 'Nom complet *',
		phoneNumber: 'Numéro de téléphone',
		sex: 'Sexe',
		selectSex: 'Sélectionner...',
		male: 'Homme',
		female: 'Femme',
		other: 'Autre',
		dateOfBirth: 'Date de naissance',
		age: 'Âge',
		yearsOld: 'ans',
		updateProfile: 'Mettre à jour le profil',
		updating: 'Mise à jour...',
		profileUpdated: 'Profil mis à jour avec succès !',
		enterFullName: 'Entrez votre nom complet',
		enterPhone: 'Entrez votre numéro de téléphone'
	},
	
	// Dashboard/Timeline page
	dashboard: {
		title: 'Chronologie | Cachet Caché',
		welcome: 'Bienvenue',
		completeProfile: 'Complétez votre profil',
		visits: 'Visites',
		privateAccount: 'Privé',
		account: 'Compte',
		visitTimeline: 'Chronologie des visites',
		trackProgress: 'Suivez vos progrès de traitement'
	},
	
	// Admin patient search page
	patientSearch: {
		title: 'Recherche de patients - Admin',
		heading: 'Recherche de patients',
		subtitle: 'Recherchez et gérez tous les dossiers de patients',
		searchPlaceholder: 'Rechercher par nom, téléphone, sexe ou ID...',
		showingResults: 'Affichage de',
		ofResults: 'sur',
		patients: 'patients',
		patientInfo: 'Info patient',
		contact: 'Contact',
		demographics: 'Démographie',
		registration: 'Inscription',
		noName: 'Aucun nom',
		noPhone: 'Aucun téléphone',
		age: 'Âge',
		born: 'Né(e)',
		registered: 'Inscrit',
		updated: 'Mis à jour',
		noPatientsFound: 'Aucun patient trouvé',
		tryAdjusting: 'Essayez d\'ajuster vos termes de recherche.',
		noRegistrations: 'Aucun patient n\'a encore été enregistré.',
		totalPatients: 'Total des patients',
		completeProfiles: 'Avec profils complets',
		withBirthdate: 'Avec date de naissance',
		withPhone: 'Avec téléphone'
	},
	
	// Visit timeline component
	visitTimeline: {
		addNewVisit: 'Ajouter une nouvelle visite',
		createNewRecord: 'Créer un nouveau dossier de visite patient',
		visitTitlePlaceholder: 'Titre de la visite (ex: \'Traitement Botox\', \'Consultation de suivi\')',
		addVisit: 'Ajouter visite',
		noVisitsYet: 'Aucune visite enregistrée',
		addFirstVisit: 'Ajoutez votre première visite ci-dessus pour commencer',
		deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette visite et toutes ses photos?',
		noPhotosYet: 'Aucune photo pour l\'instant',
		initialConsultPhoto: 'photo de consultation initiale',
		initialConsultPhotos: 'photos de consultation initiale',
		followUpPhoto: 'photo de suivi',
		followUpPhotos: 'photos de suivi',
		initialConsult: 'Consultation initiale',
		followUp: 'Suivi',
		date: 'Date',
		uploadInitialPhotos: 'Télécharger photos de consultation initiale',
		uploadFollowUpPhotos: 'Télécharger photos de suivi'
	},
	
	// Photo upload component
	photoUpload: {
		uploading: 'Téléchargement...',
		doctorNote: 'Note du médecin',
		photo: 'Photo',
		addNotesPlaceholder: 'Ajouter des notes sur cette visite...',
		addMorePhotos: 'Ajouter plus de photos',
		dropPhotosHere: 'Déposer les photos ici',
		dropYourPhotos: 'Déposez vos photos ici',
		fileFormats: 'JPEG, PNG, WebP jusqu\'à 10MB chacun',
		selectMultiple: 'Sélectionnez plusieurs fichiers ou glissez-déposez',
		viewEnlargedPhoto: 'Voir la photo agrandie',
		closeImageViewer: 'Fermer la visionneuse d\'images',
		enlargedPhotoView: 'Vue de photo agrandie'
	}
}; 