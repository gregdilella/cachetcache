import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { uploadFile, getSignedDownloadUrl, deleteFile } from '$lib/r2-storage';
import { createSupabaseAdminClient } from '$lib/supabase.server';

export const GET: RequestHandler = async ({ locals }) => {
  const { safeGetSession, supabase } = locals;
  const testResults = {
    timestamp: new Date().toISOString(),
    testType: 'Photo Upload Workflow',
    tests: [] as Array<{name: string, status: 'pass' | 'fail', message: string, details?: any}>
  };

  // Test 1: Authentication Check
  try {
    const { session, user } = await safeGetSession();
    
    testResults.tests.push({
      name: 'Authentication',
      status: session && user ? 'pass' : 'fail',
      message: session && user ? 'User is authenticated' : 'User not authenticated',
      details: { 
        hasSession: !!session,
        hasUser: !!user,
        userId: user?.id || 'none'
      }
    });

    if (!session || !user) {
      return json({ 
        success: false, 
        ...testResults,
        note: 'Please log in to test photo upload functionality'
      }, { status: 401 });
    }

    // Test 2: Admin Check
    const { data: userProfile } = await supabase
      .from('user_profile')
      .select('is_admin, name, email')
      .eq('id', user.id)
      .single();

    testResults.tests.push({
      name: 'Admin Privileges',
      status: userProfile?.is_admin ? 'pass' : 'fail',
      message: userProfile?.is_admin ? 'User has admin privileges' : 'User does not have admin privileges',
      details: { 
        userProfile: userProfile ? {
          name: userProfile.name,
          email: userProfile.email,
          is_admin: userProfile.is_admin
        } : null
      }
    });

    if (!userProfile?.is_admin) {
      return json({ 
        success: false, 
        ...testResults,
        note: 'Admin privileges required to test photo upload'
      }, { status: 403 });
    }

    // Test 3: Create Test Visit (for photo upload)
    const adminClient = createSupabaseAdminClient();
    const testVisitTitle = `Test Visit ${Date.now()}`;
    
    const { data: testVisit, error: visitError } = await adminClient
      .from('visits')
      .insert({
        user_id: user.id,
        title: testVisitTitle,
        expanded: true
      })
      .select()
      .single();

    if (visitError || !testVisit) {
      testResults.tests.push({
        name: 'Test Visit Creation',
        status: 'fail',
        message: 'Failed to create test visit',
        details: { error: visitError }
      });
      return json({ success: false, ...testResults }, { status: 500 });
    }

    testResults.tests.push({
      name: 'Test Visit Creation',
      status: 'pass',
      message: 'Successfully created test visit',
      details: { visitId: testVisit.id, title: testVisit.title }
    });

    // Test 4: Photo Upload to R2
    const photoType = 'initial_consult';
    const uniqueKey = `visits/${testVisit.id}/${photoType}/test-photo-${crypto.randomUUID()}.jpg`;
    
    // Create a small test image buffer
    const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';
    const imageBuffer = Buffer.from(testImageData.split(',')[1], 'base64');
    
    try {
      await uploadFile(uniqueKey, imageBuffer, 'image/jpeg');
      
      testResults.tests.push({
        name: 'R2 Photo Upload',
        status: 'pass',
        message: 'Successfully uploaded photo to R2',
        details: { key: uniqueKey, size: imageBuffer.length }
      });
    } catch (r2Error) {
      testResults.tests.push({
        name: 'R2 Photo Upload',
        status: 'fail',
        message: 'Failed to upload photo to R2',
        details: { error: r2Error instanceof Error ? r2Error.message : 'Unknown error' }
      });
      return json({ success: false, ...testResults }, { status: 500 });
    }

    // Test 5: Database Photo Record
    try {
      const { data: photoData, error: photoInsertError } = await adminClient
        .from('visit_photos')
        .insert({
          user_id: user.id,
          visit_id: testVisit.id,
          r2_key: uniqueKey,
          filename: uniqueKey,
          original_name: 'test-photo.jpg',
          file_size: imageBuffer.length,
          mime_type: 'image/jpeg',
          photo_type: photoType,
          doctor_note: null
        })
        .select()
        .single();

      if (photoInsertError) {
        testResults.tests.push({
          name: 'Database Photo Record',
          status: 'fail',
          message: 'Failed to save photo record to database',
          details: { error: photoInsertError }
        });
      } else {
        testResults.tests.push({
          name: 'Database Photo Record',
          status: 'pass',
          message: 'Successfully saved photo record to database',
          details: { photoId: photoData.id, userId: photoData.user_id, visitId: photoData.visit_id }
        });
      }
    } catch (dbError) {
      testResults.tests.push({
        name: 'Database Photo Record',
        status: 'fail',
        message: 'Database operation failed',
        details: { error: dbError instanceof Error ? dbError.message : 'Unknown error' }
      });
    }

    // Test 6: Signed URL Generation
    try {
      const signedUrl = await getSignedDownloadUrl(uniqueKey, 3600);
      const isValidUrl = signedUrl.startsWith('https://') && signedUrl.includes(uniqueKey);
      
      testResults.tests.push({
        name: 'Photo Signed URL',
        status: isValidUrl ? 'pass' : 'fail',
        message: isValidUrl ? 'Successfully generated signed URL for photo' : 'Invalid signed URL',
        details: { 
          urlGenerated: !!signedUrl,
          isValid: isValidUrl,
          urlLength: signedUrl.length
        }
      });
    } catch (urlError) {
      testResults.tests.push({
        name: 'Photo Signed URL',
        status: 'fail',
        message: 'Failed to generate signed URL',
        details: { error: urlError instanceof Error ? urlError.message : 'Unknown error' }
      });
    }

    // Test 7: Data Loading (simulate page load)
    try {
      const { data: visits } = await adminClient
        .from('visits')
        .select(`
          *,
          visit_photos (*)
        `)
        .eq('user_id', user.id)
        .eq('id', testVisit.id);

             const hasPhotos = (visits?.[0]?.visit_photos?.length || 0) > 0;
      
      testResults.tests.push({
        name: 'Photo Data Loading',
        status: hasPhotos ? 'pass' : 'fail',
        message: hasPhotos ? 'Photo data loads correctly from database' : 'Photo data not found in query',
        details: { 
          visitFound: !!visits?.[0],
          photosCount: visits?.[0]?.visit_photos?.length || 0,
          photoIds: visits?.[0]?.visit_photos?.map(p => p.id) ?? []
        }
      });
    } catch (loadError) {
      testResults.tests.push({
        name: 'Photo Data Loading',
        status: 'fail',
        message: 'Failed to load photo data',
        details: { error: loadError instanceof Error ? loadError.message : 'Unknown error' }
      });
    }

    // Cleanup: Delete test data
    try {
      // Delete from R2
      await deleteFile(uniqueKey);
      
      // Delete photos from database
      await adminClient
        .from('visit_photos')
        .delete()
        .eq('visit_id', testVisit.id);
      
      // Delete test visit
      await adminClient
        .from('visits')
        .delete()
        .eq('id', testVisit.id);

      testResults.tests.push({
        name: 'Cleanup',
        status: 'pass',
        message: 'Successfully cleaned up test data',
        details: { deletedVisitId: testVisit.id, deletedPhotoKey: uniqueKey }
      });
    } catch (cleanupError) {
      testResults.tests.push({
        name: 'Cleanup',
        status: 'fail',
        message: 'Failed to cleanup test data',
        details: { error: cleanupError instanceof Error ? cleanupError.message : 'Unknown error' }
      });
    }

  } catch (mainError) {
    testResults.tests.push({
      name: 'Overall Test Execution',
      status: 'fail',
      message: 'Test execution failed',
      details: { error: mainError instanceof Error ? mainError.message : 'Unknown error' }
    });
  }

  const allTestsPassed = testResults.tests.every(test => test.status === 'pass');
  
  return json({ 
    success: allTestsPassed,
    message: allTestsPassed 
      ? '🎉 All photo upload tests passed! Lisa should be able to upload photos successfully.' 
      : '❌ Some photo upload tests failed. Check the details below.',
    ...testResults
  }, { 
    status: allTestsPassed ? 200 : 500 
  });
}; 