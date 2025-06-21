import type { RequestHandler } from './$types';
import { uploadFile } from '$lib/r2-storage';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  try {
    // Test upload a simple text file
    const testContent = `Test upload at ${new Date().toISOString()}`;
    const key = `test/${Date.now()}.txt`;
    
    await uploadFile(key, testContent, 'text/plain');
    
    return json({ 
      success: true, 
      message: 'R2 storage is working!',
      key,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('R2 test error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 