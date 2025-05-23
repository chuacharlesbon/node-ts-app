import { Request, Response } from 'express';
import pool from '../config/db';
import crypto from 'crypto';
import { Readable } from 'stream';

export const getAllImages = async (req: Request, res: Response) => {
    try {
        console.log("This is the token", req.cookies);

        // Set cookie
        const sampleCookie = 'sample_cookie';
        res.cookie('_sampleCookie', sampleCookie, {
            httpOnly: true,      // prevent access from JS (XSS protection)
            secure: false,        // HTTPS only
            sameSite: 'lax',     // CSRF protection (can be 'Strict', 'None' too)
            maxAge: 3600000      // 1 hour in milliseconds
        });
        // res.clearCookie('_sampleCookie');

        const [rows] = await pool.query('SELECT * FROM images WHERE is_deleted IS NULL OR is_deleted != 1');

        // Create ETag from the response body
        const dataString = JSON.stringify(rows);
        const etag = crypto.createHash('md5').update(dataString).digest('hex');

        const clientETag = req.headers['if-none-match'];

        if (clientETag === `"${etag}"`) {
            res.status(304).end(); // Not Modified
            return;
        }

        // Set headers for caching
        res.setHeader('ETag', `"${etag}"`);
        res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute cache

        res.status(200).json({
            fromCache: false,
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            errorData: err
        });
    }
};

export const getImageById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const imageUrl = 'https://chuacharlesbon.github.io/html-my-assets/assets/id.jpg'; // `https://xxxxxxxxxx.r2.cloudflarestorage.com/my-bucket/${id}.jpg`;

    try {
        const response = await fetch(imageUrl);

        if (!response.ok || !response.body) {
            res.status(500).send('Failed to fetch image');
            return;
        }

        // Read full body to generate ETag
        const buffer = Buffer.from(await response.arrayBuffer());
        const etag = crypto.createHash('md5').update(buffer).digest('hex');
        const clientETag = req.headers['if-none-match'];

        if (clientETag === `"${etag}"`) {
            res.status(304).end(); // Not Modified
            return;
        }

        // Set headers
        res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
        res.setHeader('ETag', `"${etag}"`);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache

        // Stream the image buffer
        Readable.from(buffer).pipe(res);
    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            errorData: err instanceof Error ? err.message : String(err),
        });
    }
};

// My Cloudflare worker R2 Image Caching

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


// export default {
//     async fetch(request, env, ctx) {
//       try {
//         const url = new URL(request.url);
//         const imageId = url.pathname.split("/").pop();
  
//         // Get object from R2
//         const object = await env.IMG_BUCKET.get(imageId);
  
//         if (!object || !object.body) {
//           return new Response("Image not found", { status: 404 });
//         }
  
//         const etag = `"${object.httpEtag}"`;
//         const clientETag = request.headers.get("If-None-Match");
  
//         if (clientETag === etag) {
//           return new Response(null, { status: 304 });
//         }
  
//         return new Response(object.body, {
//           headers: {
//             "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
//             "Cache-Control": "public, max-age=604800", // Cache for 1 day
//             "ETag": etag,
//           },
//         });
//       } catch (e) {
//         return new Response("Image not found", { status: 404 });
//       }
//     },
//   };
  