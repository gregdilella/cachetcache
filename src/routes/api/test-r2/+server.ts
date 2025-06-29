import type { RequestHandler } from './$types';
import { uploadFile, getSignedDownloadUrl, deleteFile } from '$lib/r2-storage';
import { json } from '@sveltejs/kit';
import { CLOUDFLARE_R2_ENDPOINT } from '$env/static/private';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: 'production',
    tests: [] as Array<{name: string, status: 'pass' | 'fail', message: string, details?: any}>
  };

  // Test 1: Environment Variables
  try {
    const hasAccessKey = !!(env.CLOUDFLARE_R2_ACCESS_KEY_ID);
    const hasSecretKey = !!(env.CLOUDFLARE_R2_SECRET_ACCESS_KEY);
    const hasEndpoint = !!CLOUDFLARE_R2_ENDPOINT;

    testResults.tests.push({
      name: 'Environment Variables',
      status: hasAccessKey && hasSecretKey && hasEndpoint ? 'pass' : 'fail',
      message: hasAccessKey && hasSecretKey && hasEndpoint 
        ? 'All R2 environment variables are configured' 
        : 'Missing R2 environment variables',
      details: {
        hasAccessKey,
        hasSecretKey,  
        hasEndpoint,
        endpoint: hasEndpoint ? CLOUDFLARE_R2_ENDPOINT : 'not set'
      }
    });

    if (!hasAccessKey || !hasSecretKey || !hasEndpoint) {
      return json({ 
        success: false, 
        ...testResults,
        error: 'R2 environment variables not properly configured'
      }, { status: 500 });
    }
  } catch (error) {
    testResults.tests.push({
      name: 'Environment Variables',
      status: 'fail',
      message: 'Error checking environment variables',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }

  // Test 2: R2 Upload
  const testKey = `test/deployment-test-${Date.now()}.txt`;
  try {
    const testContent = `Deployment test upload at ${new Date().toISOString()}`;
    await uploadFile(testKey, testContent, 'text/plain');
    
    testResults.tests.push({
      name: 'R2 Upload',
      status: 'pass',
      message: 'Successfully uploaded test file to R2',
      details: { key: testKey, contentLength: testContent.length }
    });
  } catch (error) {
    testResults.tests.push({
      name: 'R2 Upload',
      status: 'fail',
      message: 'Failed to upload to R2',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return json({ 
      success: false, 
      ...testResults,
      error: 'R2 upload failed'
    }, { status: 500 });
  }

  // Test 3: R2 Signed URL Generation
  try {
    const signedUrl = await getSignedDownloadUrl(testKey, 300); // 5 minutes
    const isValidUrl = signedUrl.startsWith('https://') && signedUrl.includes(testKey);
    
    testResults.tests.push({
      name: 'R2 Signed URL Generation',
      status: isValidUrl ? 'pass' : 'fail',
      message: isValidUrl ? 'Successfully generated signed URL' : 'Invalid signed URL generated',
      details: { 
        urlGenerated: !!signedUrl,
        urlLength: signedUrl.length,
        startsWithHttps: signedUrl.startsWith('https://'),
        containsKey: signedUrl.includes(testKey)
      }
    });
  } catch (error) {
    testResults.tests.push({
      name: 'R2 Signed URL Generation',
      status: 'fail',
      message: 'Failed to generate signed URL',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }

  // Test 4: R2 Delete (cleanup)
  try {
    await deleteFile(testKey);
    
    testResults.tests.push({
      name: 'R2 Delete (Cleanup)',
      status: 'pass',
      message: 'Successfully deleted test file from R2',
      details: { deletedKey: testKey }
    });
  } catch (error) {
    testResults.tests.push({
      name: 'R2 Delete (Cleanup)',
      status: 'fail',
      message: 'Failed to delete test file (cleanup failed)',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }

  // Test 5: Photo Upload Simulation
  try {
    // Simulate a photo upload scenario
    const photoTestKey = `visits/test-visit-${Date.now()}/initial_consult/test-photo-${crypto.randomUUID()}.jpg`;
    const dummyPhotoData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';
    
    // Convert base64 to Uint8Array (Cloudflare Workers compatible)
    const base64Data = dummyPhotoData.split(',')[1];
    const binaryString = atob(base64Data);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    await uploadFile(photoTestKey, uint8Array, 'image/jpeg');
    
    // Test signed URL for photo
    const photoSignedUrl = await getSignedDownloadUrl(photoTestKey, 3600);
    
    // Cleanup
    await deleteFile(photoTestKey);
    
    testResults.tests.push({
      name: 'Photo Upload Simulation',
      status: 'pass',
      message: 'Successfully simulated photo upload workflow',
      details: { 
        key: photoTestKey,
        bufferSize: uint8Array.length,
        signedUrlGenerated: !!photoSignedUrl,
        cleanupSuccessful: true
      }
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Photo Upload Simulation',
      status: 'fail',
      message: 'Photo upload simulation failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }

  const allTestsPassed = testResults.tests.every(test => test.status === 'pass');
  
  return json({ 
    success: allTestsPassed,
    message: allTestsPassed 
      ? '🎉 All R2 tests passed! Photo upload should work perfectly on Cloudflare.' 
      : '❌ Some R2 tests failed. Check the details below.',
    ...testResults
  }, { 
    status: allTestsPassed ? 200 : 500 
  });
}; 