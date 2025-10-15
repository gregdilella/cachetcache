// src/lib/r2-storage.ts
// Cloudflare R2 storage - supports both development (AWS SDK) and production (native bindings)

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

const BUCKET_NAME = 'cachetcache';

// AWS SDK client for development
let s3Client: S3Client | null = null;

// Initialize AWS SDK client for development
if (dev) {
  const R2_ACCESS_KEY_ID = env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
  const R2_SECRET_ACCESS_KEY = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
  const R2_ENDPOINT = env.CLOUDFLARE_R2_ENDPOINT || '';

  if (R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_ENDPOINT) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
    console.log('✅ R2 AWS SDK client initialized for development');
  } else {
    console.warn('⚠️ R2 credentials missing - photos will not work in development');
  }
}

/**
 * Get the R2 bucket from the platform bindings (production only)
 */
function getR2Bucket(platform?: App.Platform): R2Bucket | null {
  if (platform?.env?.R2_BUCKET) {
    return platform.env.R2_BUCKET;
  }
  return null;
}

/**
 * Upload a file to R2 storage
 * @param key - The file path/key in the bucket
 * @param body - The file content as Uint8Array, Buffer, or string
 * @param contentType - MIME type of the file
 * @param platform - The platform object containing R2 bindings (production only)
 */
export async function uploadFile(
  key: string, 
  body: Uint8Array | ArrayBuffer | string, 
  contentType?: string,
  platform?: App.Platform
) {
  // In production, use native R2 bindings
  if (!dev) {
    const bucket = getR2Bucket(platform);
    
    if (!bucket) {
      throw new Error('R2 storage is not configured. Please ensure R2 bindings are set up in wrangler.json');
    }
    
    await bucket.put(key, body, {
      httpMetadata: {
        contentType: contentType
      }
    });
    
    console.log('✅ Uploaded to R2 (native):', key);
    return;
  }
  
  // In development, use AWS SDK
  if (!s3Client) {
    throw new Error('R2 storage is not configured for development. Please set R2 environment variables.');
  }
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  
  await s3Client.send(command);
  console.log('✅ Uploaded to R2 (AWS SDK):', key);
}

/**
 * Get a file from R2 storage
 * @param key - The file path/key in the bucket
 * @param platform - The platform object containing R2 bindings (production only)
 */
export async function getFile(key: string, platform?: App.Platform) {
  // In production, use native R2 bindings
  if (!dev) {
    const bucket = getR2Bucket(platform);
    
    if (!bucket) {
      throw new Error('R2 storage is not configured. Please ensure R2 bindings are set up in wrangler.json');
    }
    
    const object = await bucket.get(key);
    
    if (!object) {
      throw new Error(`File not found: ${key}`);
    }
    
    return object;
  }
  
  // In development, use AWS SDK
  if (!s3Client) {
    throw new Error('R2 storage is not configured for development. Please set R2 environment variables.');
  }
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  return await s3Client.send(command);
}

/**
 * Delete a file from R2 storage
 * @param key - The file path/key in the bucket
 * @param platform - The platform object containing R2 bindings (production only)
 */
export async function deleteFile(key: string, platform?: App.Platform) {
  // In production, use native R2 bindings
  if (!dev) {
    const bucket = getR2Bucket(platform);
    
    if (!bucket) {
      throw new Error('R2 storage is not configured. Please ensure R2 bindings are set up in wrangler.json');
    }
    
    await bucket.delete(key);
    console.log('🗑️ Deleted from R2 (native):', key);
    return;
  }
  
  // In development, use AWS SDK
  if (!s3Client) {
    throw new Error('R2 storage is not configured for development. Please set R2 environment variables.');
  }
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  await s3Client.send(command);
  console.log('🗑️ Deleted from R2 (AWS SDK):', key);
}

/**
 * Get a signed URL for downloading a file from R2
 * 
 * @param key - The file path/key in the bucket
 * @param expiresIn - Time in seconds until the URL expires
 * @param platform - The platform object containing R2 bindings (production only)
 */
export async function getSignedDownloadUrl(
  key: string, 
  expiresIn: number = 3600,
  platform?: App.Platform
): Promise<string> {
  // In production, proxy through our API endpoint
  if (!dev) {
    const signedUrl = `/api/r2-proxy/${encodeURIComponent(key)}`;
    console.log('🔗 Generated R2 proxy URL (production):', signedUrl);
    return signedUrl;
  }
  
  // In development, use AWS SDK to generate signed URLs
  if (!s3Client) {
    throw new Error('R2 storage is not configured for development. Please set R2 environment variables.');
  }
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  console.log('🔗 Generated R2 signed URL (development):', signedUrl);
  return signedUrl;
}