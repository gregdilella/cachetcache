import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadFile } from '$lib/r2-storage';
import { nanoid } from 'nanoid';

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
  console.log('🎯 Image upload API called');
  
  try {
    // Check authentication
    const { session, user } = await safeGetSession();
    if (!session || !user) {
      console.error('❌ Image upload failed: User not authenticated');
      throw error(401, 'Unauthorized');
    }

    console.log('👤 User authenticated:', { userId: user.id, email: user.email });

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const description = formData.get('description') as string || '';

    console.log('📋 Form data received:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      description
    });

    if (!file) {
      console.error('❌ Image upload failed: No image file provided');
      throw error(400, 'No image file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Image upload failed: Invalid file type:', file.type);
      throw error(400, 'Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ Image upload failed: File too large:', file.size);
      throw error(400, 'File too large. Maximum size is 10MB.');
    }

    console.log('✅ File validation passed');

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/${nanoid()}.${fileExtension}`;

    console.log('🔑 Generated filename:', fileName);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('🔄 File converted to buffer, size:', buffer.length);

    // Upload to R2
    console.log('☁️ Uploading to R2 storage...');
    await uploadFile(fileName, buffer, file.type);
    console.log('✅ R2 upload successful');

    // Save image metadata to database with RLS
    console.log('💾 Saving image metadata to database...');
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
      console.error('❌ Database save failed:', {
        error: dbError.message,
        code: dbError.code,
        details: dbError.details,
        hint: dbError.hint
      });
      throw error(500, 'Failed to save image metadata');
    }

    console.log('✅ Image upload completed successfully!', {
      imageId: imageRecord.id,
      filename: fileName
    });

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
    console.error('💥 IMAGE UPLOAD ERROR - FULL DETAILS:');
    console.error('Error type:', typeof err);
    console.error('Error message:', err instanceof Error ? err.message : String(err));
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    
    // Check if it's an R2 storage error
    if (err instanceof Error && err.message.includes('R2 storage is not configured')) {
      console.error('❌ R2 CONFIGURATION ERROR: Missing environment variables');
      throw error(500, 'R2 storage is not configured. Please set CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY environment variables.');
    }
    
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, 'Upload failed');
  }
}; 