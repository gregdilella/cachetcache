import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { deleteFile, getSignedDownloadUrl, uploadFile } from '$lib/r2-storage';
import type { Database } from '$lib/types/supabase.types';

type Visit = Database['public']['Tables']['visits']['Row'];
type VisitPhoto = Database['public']['Tables']['visit_photos']['Row'];

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }, params }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/signin');
	}

	// Get the user profile from the database (using the authenticated user's ID, not the slug)
	let { data: userProfile, error: profileError } = await supabase
		.from('user_profile')
		.select('*')
		.eq('id', user.id)
		.single();

	// If user profile doesn't exist, create it
	if (profileError && profileError.code === 'PGRST116') { // PGRST116 is "not found"
		console.log('User profile not found, creating new profile for user:', user.id);
		
		const { data: newProfile, error: createError } = await supabase
			.from('user_profile')
			.insert({
				id: user.id,
				email: user.email,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.select()
			.single();

		if (createError) {
			console.error('Error creating user profile:', createError);
			throw error(500, 'Failed to create user profile');
		}

		userProfile = newProfile;
	} else if (profileError) {
		console.error('Error loading user profile:', profileError);
		throw error(500, 'Failed to load user profile');
	}

	// Make sure email is up to date if it's missing
	if (userProfile && !userProfile.email && user.email) {
		const { error: updateError } = await supabase
			.from('user_profile')
			.update({ email: user.email, updated_at: new Date().toISOString() })
			.eq('id', user.id);

		if (!updateError) {
			userProfile.email = user.email;
		}
	}

	// Load user's images with RLS
	const { data: userImages, error: imagesError } = await supabase
		.from('user_images')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (imagesError) {
		console.error('Error loading user images:', imagesError);
		// Don't throw error, just return empty array
	}

	// Load user's visits with photos
	const { data: visits, error: visitsError } = await supabase
		.from('visits')
		.select(`
			*,
			visit_photos (*)
		`)
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (visitsError) {
		console.error('Error loading visits:', visitsError);
		// Don't throw error, just return empty array
	}

	// Generate signed URLs for each image
	let imagesWithUrls: Array<any> = [];
	if (userImages && userImages.length > 0) {
		imagesWithUrls = await Promise.all(
			userImages.map(async (image) => {
				try {
					const signedUrl = await getSignedDownloadUrl(image.r2_key, 3600); // 1 hour expiry
					return {
						...image,
						signedUrl
					};
				} catch (err) {
					console.error('Error generating signed URL for image:', image.id, err);
					return {
						...image,
						signedUrl: null
					};
				}
			})
		);
	}

	// Process visits data and generate signed URLs for photos
	let visitsWithPhotos: Array<any> = [];
	if (visits && visits.length > 0) {
		visitsWithPhotos = await Promise.all(
			visits.map(async (visit: Visit & { visit_photos: VisitPhoto[] }) => {
				// Group photos by type
				const initialConsultPhotos = [];
				const followUpPhotos = [];

				if (visit.visit_photos && visit.visit_photos.length > 0) {
					for (const photo of visit.visit_photos) {
						try {
							const signedUrl = await getSignedDownloadUrl(photo.r2_key, 3600);
							const photoWithUrl = {
								id: photo.id,
								url: signedUrl,
								doctorNote: photo.doctor_note || '',
								uploading: false
							};

							if (photo.photo_type === 'initial_consult') {
								initialConsultPhotos.push(photoWithUrl);
							} else if (photo.photo_type === 'follow_up') {
								followUpPhotos.push(photoWithUrl);
							}
						} catch (err) {
							console.error('Error generating signed URL for photo:', photo.id, err);
						}
					}
				}

				return {
					id: visit.id,
					title: visit.title,
					expanded: visit.expanded || false,
					initialConsultDate: visit.initial_consult_date,
					followUpDate: visit.follow_up_date,
					initialConsultPhotos,
					followUpPhotos
				};
			})
		);
	}

	return {
		userProfile: userProfile || null,
		userImages: imagesWithUrls || [],
		visits: visitsWithPhotos || [],
		user_slug: params.user_slug
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const phoneNumber = formData.get('phone_number') as string;
		const sex = formData.get('sex') as string;
		const dateOfBirth = formData.get('date_of_birth') as string;

		// Calculate age from date of birth if provided
		let age: number | null = null;
		if (dateOfBirth) {
			const birthDate = new Date(dateOfBirth);
			const today = new Date();
			age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
		}

		// Also allow direct age input for backward compatibility
		if (!age && formData.get('age')) {
			age = parseInt(formData.get('age') as string);
		}

		// Validate required fields
		if (!name?.trim()) {
			return fail(400, { error: 'Name is required' });
		}

		// Validate sex selection
		if (sex && !['Male', 'Female', 'Other'].includes(sex)) {
			return fail(400, { error: 'Invalid sex selection' });
		}

		// Validate age
		if (age !== null && (age < 0 || age > 150)) {
			return fail(400, { error: 'Invalid age or date of birth' });
		}

		// Update the user profile
		const updateData: any = {
			name: name.trim(),
			phone_number: phoneNumber?.trim() || null,
			sex: sex || null,
			age: age,
			updated_at: new Date().toISOString()
		};

		const { error: updateError } = await supabase
			.from('user_profile')
			.update(updateData)
			.eq('id', user.id);

		if (updateError) {
			console.error('Error updating user profile:', updateError);
			return fail(500, { error: 'Failed to update profile. Please try again.' });
		}

		return { success: true };
	},

	createVisit: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;

		if (!title?.trim()) {
			return fail(400, { error: 'Visit title is required' });
		}

		const { data: visit, error: insertError } = await supabase
			.from('visits')
			.insert({
				user_id: user.id,
				title: title.trim(),
				expanded: true
			})
			.select()
			.single();

		if (insertError) {
			console.error('Error creating visit:', insertError);
			return fail(500, { error: 'Failed to create visit' });
		}

		return { success: true, visit };
	},

	updateVisit: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const visitId = formData.get('visitId') as string;
		const initialConsultDate = formData.get('initialConsultDate') as string;
		const followUpDate = formData.get('followUpDate') as string;
		const expanded = formData.get('expanded') === 'true';

		if (!visitId) {
			return fail(400, { error: 'Visit ID is required' });
		}

		const updateData: any = { expanded };
		if (initialConsultDate) updateData.initial_consult_date = initialConsultDate;
		if (followUpDate) updateData.follow_up_date = followUpDate;

		const { error: updateError } = await supabase
			.from('visits')
			.update(updateData)
			.eq('id', visitId)
			.eq('user_id', user.id);

		if (updateError) {
			console.error('Error updating visit:', updateError);
			return fail(500, { error: 'Failed to update visit' });
		}

		return { success: true };
	},

	deleteVisit: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const visitId = formData.get('visitId') as string;

		if (!visitId) {
			return fail(400, { error: 'Visit ID is required' });
		}

		// Delete visit (photos will be deleted via CASCADE)
		const { error: deleteError } = await supabase
			.from('visits')
			.delete()
			.eq('id', visitId)
			.eq('user_id', user.id);

		if (deleteError) {
			console.error('Error deleting visit:', deleteError);
			return fail(500, { error: 'Failed to delete visit' });
		}

		return { success: true };
	},

	updatePhotoNote: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const photoId = formData.get('photoId') as string;
		const note = formData.get('note') as string;

		if (!photoId) {
			return fail(400, { error: 'Photo ID is required' });
		}

		const { error: updateError } = await supabase
			.from('visit_photos')
			.update({ doctor_note: note || null })
			.eq('id', photoId)
			.eq('user_id', user.id);

		if (updateError) {
			console.error('Error updating photo note:', updateError);
			return fail(500, { error: 'Failed to update note' });
		}

		return { success: true };
	},

	deleteImage: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const imageId = formData.get('imageId') as string;

		if (!imageId) {
			return fail(400, { error: 'Image ID is required' });
		}

		// Get image details first (RLS will ensure user can only access their own images)
		const { data: image, error: fetchError } = await supabase
			.from('user_images')
			.select('*')
			.eq('id', imageId)
			.eq('user_id', user.id)
			.single();

		if (fetchError || !image) {
			return fail(404, { error: 'Image not found or access denied' });
		}

		try {
			// Delete from R2
			await deleteFile(image.r2_key);

			// Delete from database (RLS will ensure user can only delete their own images)
			const { error: deleteError } = await supabase
				.from('user_images')
				.delete()
				.eq('id', imageId)
				.eq('user_id', user.id);

			if (deleteError) {
				console.error('Error deleting image from database:', deleteError);
				return fail(500, { error: 'Failed to delete image' });
			}

			return { success: true, message: 'Image deleted successfully' };
		} catch (err) {
			console.error('Error deleting image from R2:', err);
			return fail(500, { error: 'Failed to delete image from storage' });
		}
	},

	uploadPhoto: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const photo = formData.get('photo') as File;
		const visitId = formData.get('visitId') as string;
		const photoType = formData.get('photoType') as string;

		if (!photo) {
			return fail(400, { error: 'Photo is required' });
		}

		if (!visitId) {
			return fail(400, { error: 'Visit ID is required' });
		}

		if (!photoType || !['initial_consult', 'follow_up'].includes(photoType)) {
			return fail(400, { error: 'Invalid photo type' });
		}

		try {
			// Generate unique filename
			const fileExtension = photo.name.split('.').pop() || 'jpg';
			const uniqueKey = `visits/${visitId}/${photoType}/${crypto.randomUUID()}.${fileExtension}`;
			
			// Convert File to Buffer
			const arrayBuffer = await photo.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			// Upload photo to R2 storage
			await uploadFile(uniqueKey, buffer, photo.type);

			// Save photo details to database
			const { data: photoData, error: insertError } = await supabase
				.from('visit_photos')
				.insert({
					user_id: user.id,
					visit_id: visitId,
					r2_key: uniqueKey,
					filename: uniqueKey,
					original_name: photo.name,
					file_size: photo.size,
					mime_type: photo.type,
					photo_type: photoType,
					doctor_note: null
				})
				.select()
				.single();

			if (insertError) {
				console.error('Error saving photo to database:', insertError);
				return fail(500, { error: 'Failed to save photo to database' });
			}

			return { success: true, photo: photoData };
		} catch (err) {
			console.error('Error uploading photo:', err);
			return fail(500, { error: 'Failed to upload photo' });
		}
	},

	deletePhoto: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			return fail(403, { error: 'Admin privileges required' });
		}

		const formData = await request.formData();
		const photoId = formData.get('photoId') as string;

		if (!photoId) {
			return fail(400, { error: 'Photo ID is required' });
		}

		// Get photo details first (RLS will ensure user can only access their own photos)
		const { data: photo, error: fetchError } = await supabase
			.from('visit_photos')
			.select('*')
			.eq('id', photoId)
			.eq('user_id', user.id)
			.single();

		if (fetchError || !photo) {
			return fail(404, { error: 'Photo not found or access denied' });
		}

		try {
			// Delete from R2
			await deleteFile(photo.r2_key);

			// Delete from database (RLS will ensure user can only delete their own photos)
			const { error: deleteError } = await supabase
				.from('visit_photos')
				.delete()
				.eq('id', photoId)
				.eq('user_id', user.id);

			if (deleteError) {
				console.error('Error deleting photo from database:', deleteError);
				return fail(500, { error: 'Failed to delete photo' });
			}

			return { success: true, message: 'Photo deleted successfully' };
		} catch (err) {
			console.error('Error deleting photo from R2:', err);
			return fail(500, { error: 'Failed to delete photo from storage' });
		}
	}
}; 