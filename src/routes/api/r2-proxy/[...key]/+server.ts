/**
 * API endpoint to proxy R2 file downloads
 * This allows us to serve R2 files without exposing direct bucket access
 */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const key = params.key;

	if (!key) {
		error(400, 'File key is required');
	}

	// Get R2 bucket from platform bindings
	const bucket = platform?.env?.R2_BUCKET;

	if (!bucket) {
		console.error('❌ R2 bucket not available in platform.env');
		error(500, 'R2 storage is not configured');
	}

	try {
		// Fetch the file from R2
		const object = await bucket.get(key);

		if (!object) {
			console.error('❌ File not found in R2:', key);
			error(404, 'File not found');
		}

		// Stream the file back to the client
		return new Response(object.body, {
			headers: {
				'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
				'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
				'ETag': object.etag || '',
			}
		});
	} catch (err) {
		console.error('💥 Error fetching from R2:', err);
		error(500, 'Failed to fetch file from storage');
	}
};

