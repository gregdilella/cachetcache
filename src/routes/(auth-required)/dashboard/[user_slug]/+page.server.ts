import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { deleteFile, getSignedDownloadUrl, uploadFile } from '$lib/r2-storage';
import { createSupabaseAdminClient } from '$lib/supabase.server';
import type { Database } from '$lib/types/supabase.types';

type Visit = Database['public']['Tables']['visits']['Row'];
type VisitPhoto = Database['public']['Tables']['visit_photos']['Row'];

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }, params, platform }) => {
	try {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			throw redirect(303, '/signin');
		}

		console.log('📍 Dashboard load - User:', user.id, 'Requesting:', params.user_slug);

		// Validate that user_slug is a valid UUID format
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(params.user_slug)) {
			console.error('❌ Invalid UUID format:', params.user_slug);
			throw error(404, 'Invalid user ID format');
		}

	// Check if current user is admin
	const { data: currentUserProfile, error: currentUserError } = await supabase
		.from('user_profile')
		.select('is_admin')
		.eq('id', user.id)
		.single();

	if (currentUserError) {
		console.error('Error loading current user profile:', currentUserError);
		throw error(500, 'Failed to load user profile');
	}

	// Determine which user's data to load
	const targetUserId = currentUserProfile?.is_admin ? params.user_slug : user.id;
	const isViewingOtherUser = currentUserProfile?.is_admin && targetUserId !== user.id;

	// Use admin client if viewing another user's data, otherwise use regular client
	const clientToUse = isViewingOtherUser ? createSupabaseAdminClient() : supabase;

	// Get the target user's profile
	let { data: userProfile, error: profileError } = await clientToUse
		.from('user_profile')
		.select('*')
		.eq('id', targetUserId)
		.single();

	// If user profile doesn't exist and we're viewing our own profile, create it
	if (profileError && profileError.code === 'PGRST116') { // PGRST116 is "not found"
		if (targetUserId === user.id) {
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
		} else {
			// Viewing another user's profile that doesn't exist
			throw error(404, 'User not found');
		}
	} else if (profileError) {
		console.error('Error loading user profile:', profileError);
		throw error(500, 'Failed to load user profile');
	}

	// Make sure email is up to date if it's missing (only for own profile)
	if (userProfile && !userProfile.email && user.email && targetUserId === user.id) {
		const { error: updateError } = await supabase
			.from('user_profile')
			.update({ email: user.email, updated_at: new Date().toISOString() })
			.eq('id', user.id);

		if (!updateError) {
			userProfile.email = user.email;
		}
	}

	// Load user's images with RLS
	const { data: userImages, error: imagesError } = await clientToUse
		.from('user_images')
		.select('*')
		.eq('user_id', targetUserId)
		.order('created_at', { ascending: false });

	if (imagesError) {
		console.error('Error loading user images:', imagesError);
		// Don't throw error, just return empty array
	}

	// Load user's visits with photos
	const { data: visits, error: visitsError } = await clientToUse
		.from('visits')
		.select(`
			*,
			visit_photos (*)
		`)
		.eq('user_id', targetUserId)
		.order('created_at', { ascending: false });

	if (visitsError) {
		console.error('Error loading visits:', visitsError);
		// Don't throw error, just return empty array
	}

	// Generate signed URLs for each image
	let imagesWithUrls: Array<any> = [];
	if (userImages && userImages.length > 0) {
		try {
			imagesWithUrls = await Promise.all(
				userImages.map(async (image) => {
					try {
						const signedUrl = await getSignedDownloadUrl(image.r2_key, 3600, platform); // 1 hour expiry
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
		} catch (err) {
			console.error('Error processing user images:', err);
			// Continue with empty array if image processing fails
			imagesWithUrls = [];
		}
	}

	// Process visits data and generate signed URLs for photos
	let visitsWithPhotos: Array<any> = [];
	if (visits && visits.length > 0) {
		try {
			visitsWithPhotos = await Promise.all(
				visits.map(async (visit: Visit & { visit_photos: VisitPhoto[] }) => {
					// Group photos by type
					const initialConsultPhotos = [];
					const followUpPhotos = [];

					if (visit.visit_photos && visit.visit_photos.length > 0) {
						for (const photo of visit.visit_photos) {
							try {
								const signedUrl = await getSignedDownloadUrl(photo.r2_key, 3600, platform);
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
								// Continue processing other photos even if one fails
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
		} catch (err) {
			console.error('Error processing visits:', err);
			// Continue with empty array if visit processing fails
			visitsWithPhotos = [];
		}
	}

		console.log('✅ Dashboard load successful:', {
			userProfileLoaded: !!userProfile,
			imagesCount: imagesWithUrls.length,
			visitsCount: visitsWithPhotos.length,
			isViewingOtherUser
		});

		return {
			userProfile: userProfile || null,
			userImages: imagesWithUrls || [],
			visits: visitsWithPhotos || [],
			user_slug: params.user_slug,
			isViewingOtherUser,
			currentUser: {
				id: user.id,
				is_admin: currentUserProfile?.is_admin || false
			}
		};
	} catch (err) {
		console.error('💥 Dashboard load error:', {
			error: err instanceof Error ? err.message : String(err),
			stack: err instanceof Error ? err.stack : undefined,
			params: params.user_slug
		});
		// Re-throw if it's already a SvelteKit error or redirect
		throw err;
	}
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

	createVisit: async ({ request, locals: { safeGetSession, supabase }, params }) => {
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
		const initialConsultDate = formData.get('initialConsultDate') as string;

		if (!title?.trim()) {
			return fail(400, { error: 'Visit title is required' });
		}

		// Determine target user ID (admin can create visits for other users)
		const targetUserId = params.user_slug;
		const isCreatingForOtherUser = targetUserId !== user.id;

		// Use admin client if creating for another user to bypass RLS
		const clientToUse = isCreatingForOtherUser ? createSupabaseAdminClient() : supabase;

		// Prepare the visit data
		const visitData: any = {
			user_id: targetUserId,
			title: title.trim(),
			expanded: true
		};

		// Add initial consult date if provided
		if (initialConsultDate) {
			visitData.initial_consult_date = initialConsultDate;
		}

		const { data: visit, error: insertError } = await clientToUse
			.from('visits')
			.insert(visitData)
			.select()
			.single();

		if (insertError) {
			console.error('Error creating visit:', insertError);
			return fail(500, { error: 'Failed to create visit' });
		}

		return { success: true, visit };
	},

	updateVisit: async ({ request, locals: { safeGetSession, supabase }, params }) => {
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

		// Determine target user ID (admin can update visits for other users)
		const targetUserId = params.user_slug;
		const isUpdatingForOtherUser = targetUserId !== user.id;

		// Use admin client if updating for another user to bypass RLS
		const clientToUse = isUpdatingForOtherUser ? createSupabaseAdminClient() : supabase;

		const { error: updateError } = await clientToUse
			.from('visits')
			.update(updateData)
			.eq('id', visitId)
			.eq('user_id', targetUserId);

		if (updateError) {
			console.error('Error updating visit:', updateError);
			return fail(500, { error: 'Failed to update visit' });
		}

		return { success: true };
	},

	deleteVisit: async ({ request, locals: { safeGetSession, supabase }, params }) => {
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

		// Determine target user ID (admin can delete visits for other users)
		const targetUserId = params.user_slug;
		const isDeletingForOtherUser = targetUserId !== user.id;

		// Use admin client if deleting for another user to bypass RLS
		const clientToUse = isDeletingForOtherUser ? createSupabaseAdminClient() : supabase;

		// Delete visit (photos will be deleted via CASCADE)
		const { error: deleteError } = await clientToUse
			.from('visits')
			.delete()
			.eq('id', visitId)
			.eq('user_id', targetUserId);

		if (deleteError) {
			console.error('Error deleting visit:', deleteError);
			return fail(500, { error: 'Failed to delete visit' });
		}

		return { success: true };
	},

	updatePhotoNote: async ({ request, locals: { safeGetSession, supabase }, params }) => {
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

		// Determine target user ID (admin can update photo notes for other users)
		const targetUserId = params.user_slug;
		const isUpdatingForOtherUser = targetUserId !== user.id;

		// Use admin client if updating for another user to bypass RLS
		const clientToUse = isUpdatingForOtherUser ? createSupabaseAdminClient() : supabase;

		const { error: updateError } = await clientToUse
			.from('visit_photos')
			.update({ doctor_note: note || null })
			.eq('id', photoId)
			.eq('user_id', targetUserId);

		if (updateError) {
			console.error('Error updating photo note:', updateError);
			return fail(500, { error: 'Failed to update note' });
		}

		return { success: true };
	},

	deleteImage: async ({ request, locals: { safeGetSession, supabase }, platform }) => {
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
			await deleteFile(image.r2_key, platform);

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

	uploadPhoto: async ({ request, locals: { safeGetSession, supabase }, params, platform }) => {
		console.log('🎯 Server uploadPhoto action called');
		
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			console.error('❌ Upload failed: User not authenticated');
			return fail(401, { error: 'Unauthorized' });
		}

		console.log('👤 User authenticated:', { userId: user.id, email: user.email });

		// Check if user is admin
		const { data: userProfile } = await supabase
			.from('user_profile')
			.select('is_admin')
			.eq('id', user.id)
			.single();

		if (!userProfile?.is_admin) {
			console.error('❌ Upload failed: User is not admin');
			return fail(403, { error: 'Admin privileges required' });
		}

		console.log('👨‍💼 Admin privileges confirmed');

		const formData = await request.formData();
		const photo = formData.get('photo') as File;
		const visitId = formData.get('visitId') as string;
		const photoType = formData.get('photoType') as string;

		console.log('📋 Form data received:', {
			photoName: photo?.name,
			photoSize: photo?.size,
			photoMimeType: photo?.type,
			visitId,
			photoType: photoType
		});

		if (!photo) {
			console.error('❌ Upload failed: No photo file provided');
			return fail(400, { error: 'Photo is required' });
		}

		if (!visitId) {
			console.error('❌ Upload failed: No visit ID provided');
			return fail(400, { error: 'Visit ID is required' });
		}

		if (!photoType || !['initial_consult', 'follow_up'].includes(photoType)) {
			console.error('❌ Upload failed: Invalid photo type:', photoType);
			return fail(400, { error: 'Invalid photo type' });
		}

		// Determine target user ID (admin can upload photos for other users)
		const targetUserId = params.user_slug;
		const isUploadingForOtherUser = targetUserId !== user.id;

		console.log('🎯 Target user info:', {
			targetUserId,
			isUploadingForOtherUser,
			currentUserId: user.id
		});

		// Use admin client if uploading for another user to bypass RLS
		const clientToUse = isUploadingForOtherUser ? createSupabaseAdminClient() : supabase;

		try {
			// Generate unique filename
			const fileExtension = photo.name.split('.').pop() || 'jpg';
			const uniqueKey = `visits/${visitId}/${photoType}/${crypto.randomUUID()}.${fileExtension}`;
			
			console.log('🔑 Generated unique key:', uniqueKey);
			
			// Convert File to Uint8Array (Cloudflare Workers compatible)
			console.log('🔄 Converting file to Uint8Array for Cloudflare Workers...');
			const arrayBuffer = await photo.arrayBuffer();
			const uint8Array = new Uint8Array(arrayBuffer);

			console.log('🔄 Converting file to buffer completed, size:', uint8Array.length);

			// Upload photo to R2 storage
			console.log('☁️ Uploading to R2 storage...');
			await uploadFile(uniqueKey, uint8Array, photo.type, platform);
			console.log('✅ R2 upload successful');

			// Save photo details to database
			console.log('💾 Saving photo metadata to database...');
			const { data: photoData, error: insertError } = await clientToUse
				.from('visit_photos')
				.insert({
					user_id: targetUserId,
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
				console.error('❌ Database save failed:', {
					error: insertError.message,
					code: insertError.code,
					details: insertError.details,
					hint: insertError.hint
				});
				return fail(500, { error: 'Failed to save photo to database' });
			}

			console.log('✅ Photo upload completed successfully!', {
				photoId: photoData.id,
				filename: uniqueKey
			});

			return { success: true, photo: photoData };
		} catch (err) {
			console.error('💥 PHOTO UPLOAD ERROR - FULL DETAILS:');
			console.error('Error type:', typeof err);
			console.error('Error message:', err instanceof Error ? err.message : String(err));
			console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
			console.error('Photo details:', {
				name: photo.name,
				size: photo.size,
				type: photo.type
			});
			console.error('Upload context:', {
				visitId,
				photoType,
				targetUserId,
				uniqueKey: `visits/${visitId}/${photoType}/${crypto.randomUUID()}.${photo.name.split('.').pop()}`
			});
			
			// Check if it's an R2 storage error
			if (err instanceof Error && err.message.includes('R2 storage is not configured')) {
				console.error('❌ R2 CONFIGURATION ERROR: Missing environment variables');
				return fail(500, { error: 'R2 storage is not configured. Please set CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY environment variables.' });
			}
			
			return fail(500, { error: 'Failed to upload photo: ' + (err instanceof Error ? err.message : String(err)) });
		}
	},

	deletePhoto: async ({ request, locals: { safeGetSession, supabase }, params, platform }) => {
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

		// Determine target user ID (admin can delete photos for other users)
		const targetUserId = params.user_slug;
		const isDeletingForOtherUser = targetUserId !== user.id;

		// Use admin client if deleting for another user to bypass RLS
		const clientToUse = isDeletingForOtherUser ? createSupabaseAdminClient() : supabase;

		// Get photo details first
		const { data: photo, error: fetchError } = await clientToUse
			.from('visit_photos')
			.select('*')
			.eq('id', photoId)
			.eq('user_id', targetUserId)
			.single();

		if (fetchError || !photo) {
			return fail(404, { error: 'Photo not found or access denied' });
		}

		try {
			// Delete from R2
			await deleteFile(photo.r2_key, platform);

			// Delete from database
			const { error: deleteError } = await clientToUse
				.from('visit_photos')
				.delete()
				.eq('id', photoId)
				.eq('user_id', targetUserId);

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