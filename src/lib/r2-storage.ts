// src/lib/r2-storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { 
  CLOUDFLARE_R2_ENDPOINT 
} from '$env/static/private';
import { env } from '$env/dynamic/private';

const BUCKET_NAME = 'cachetcache';

// Use dynamic environment variables with fallbacks for optional R2 credentials
const R2_ACCESS_KEY_ID = env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';

// Check if R2 is properly configured
const isR2Configured = R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && CLOUDFLARE_R2_ENDPOINT;

const s3Client = isR2Configured ? new S3Client({
  region: 'auto',
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
}) : null;

export async function uploadFile(key: string, body: Buffer | Uint8Array | string, contentType?: string) {
  if (!s3Client) {
    throw new Error('R2 storage is not configured. Please set CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY environment variables.');
  }
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  
  return await s3Client.send(command);
}

export async function getFile(key: string) {
  if (!s3Client) {
    throw new Error('R2 storage is not configured. Please set CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY environment variables.');
  }
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  return await s3Client.send(command);
}

export async function deleteFile(key: string) {
  if (!s3Client) {
    throw new Error('R2 storage is not configured. Please set CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY environment variables.');
  }
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  return await s3Client.send(command);
}

export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600) {
  if (!s3Client) {
    throw new Error('R2 storage is not configured. Please set CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY environment variables.');
  }
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  
  return await getSignedUrl(s3Client, command, { expiresIn });
}