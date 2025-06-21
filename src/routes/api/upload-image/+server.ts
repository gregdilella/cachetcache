import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadFile } from '$lib/r2-storage';
import { nanoid } from 'nanoid';

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
  try {
    // Check authentication
    const { session, user } = await safeGetSession();
    if (!session || !user) {
      throw error(401, 'Unauthorized');
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const description = formData.get('description') as string || '';

    if (!file) {
      throw error(400, 'No image file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw error(400, 'Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw error(400, 'File too large. Maximum size is 10MB.');
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/${nanoid()}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    await uploadFile(fileName, buffer, file.type);

    // Save image metadata to database with RLS
    const { data: imageRecord, error: dbError } = await supabase
      .from('user_images')
      .insert({
        user_id: user.id,
        filename: fileName,
        original_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        description: description,
        r2_key: fileName,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw error(500, 'Failed to save image metadata');
    }

    return json({
      success: true,
      image: {
        id: imageRecord.id,
        filename: fileName,
        url: `https://cachetcache.3c687933a8de78d69da8abaa15b32629.r2.cloudflarestorage.com/${fileName}`,
        description: description
      }
    });

  } catch (err) {
    console.error('Upload error:', err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, 'Upload failed');
  }
}; 