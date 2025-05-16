// src/middleware/etagCache.ts
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const etagCache = (req: Request, res: Response, next: NextFunction) => {
    // Override res.send to hook the response body
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
        const bodyString = JSON.stringify(body);
        const etag = crypto.createHash('md5').update(bodyString).digest('hex');
        const clientETag = req.headers['if-none-match'];

        res.setHeader('ETag', `"${etag}"`);
        res.setHeader('Cache-Control', 'public, max-age=60'); // Optional: 1 minute

        if (clientETag === `"${etag}"`) {
            return res.status(304).end(); // Not Modified
        }

        return originalJson(body);
    };

    next();
};
