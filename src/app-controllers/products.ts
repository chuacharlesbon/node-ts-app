import { Request, Response } from 'express';
import pool from '../config/db';
import { OkPacket, QueryResult, ResultSetHeader } from 'mysql2';
import crypto from 'crypto';

export const getAllProducts = async (req: Request, res: Response) => {
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

        const [rows] = await pool.query('SELECT * FROM products WHERE is_deleted IS NULL OR is_deleted != 1');

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

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [currentProduct]: any[] = await pool.query(
            'SELECT name, description, sku, price FROM products WHERE id = ? AND (is_deleted IS NOT NULL AND is_deleted != 1)',
            [id]
        );

        if (currentProduct.length === 0) {
            res.status(404).json({ error: 'Product not found.' });
            return;
        }

        res.json({
            data: currentProduct,
        });
    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            errorData: err
        });
    }
};

export const createNewProduct = async (req: Request, res: Response) => {
    const { name, description, sku, price } = req.body ?? {};

    if (!name || !description || !sku || !price) {
        res.status(400).json({ error: 'Name, description, sku and price are required.' });
        return;
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, sku, price) VALUES (?, ?, ?, ?)',
            [name, description, sku, price]
        );

        res.status(201).json({
            message: 'Product created successfully.',
            productId: (result as any).insertId, // Type-cast if using TypeScript
        });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to create product.',
            errorData: err,
        });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, sku, price } = req.body ?? {};

    try {
        const [currentProduct]: any[] = await pool.query(
            'SELECT name, description, sku FROM products WHERE id = ?',
            [id]
        );

        if (currentProduct.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        const updatedName = name ?? currentProduct[0].name;
        const updatedDescription = description ?? currentProduct[0].description;
        const updatedSku = sku ?? currentProduct[0].sku;
        const updatedPrice = price ?? currentProduct[0].price ?? 0;

        const [result]: [OkPacket | ResultSetHeader, any[]] = await pool.query(
            'UPDATE products SET name = ?, description = ?, sku = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [updatedName, updatedDescription, updatedSku, updatedPrice, id]
        );

        if ('affectedRows' in result) {
            if (result.affectedRows === 0) {
                res.status(400).json({ error: 'Failed to update product' });
                return;
            } else {
                res.status(200).json({
                    message: 'Product updated successfully',
                    updatedProduct: {
                        id,
                        name: updatedName,
                        description: updatedDescription,
                        sku: updatedSku,
                        price:updatedPrice
                    },
                });
            }
        } else {
            console.error('Unexpected query result:', result);
            res.status(500).json({
                error: 'Server error',
                errorData: result,
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            errorData: err,
        });
    }
};

export const deleteProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [result]: [OkPacket | ResultSetHeader, any[]] = await pool.query(
            'DELETE FROM products WHERE id = ?',
            [id]
        );

        if ('affectedRows' in result) {
            if (result.affectedRows === 0) {
                res.status(400).json({ error: 'Failed to delete product' });
            } else {
                res.status(200).json({
                    message: 'Product deleted successfully'
                });
            }
        } else {
            res.status(500).json({
                error: 'Server error',
                errorData: result,
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            errorData: err
        });
    }
};

export const markAsDeleteProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { is_deleted } = req.query;

    try {
        const [currentProduct]: any[] = await pool.query(
            'SELECT sku FROM products WHERE id = ?',
            [id]
        );

        if (currentProduct.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        const [result]: [OkPacket | ResultSetHeader, any[]] = await pool.query(
            'UPDATE products SET is_deleted = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [is_deleted, id]
        );

        if ('affectedRows' in result) {
            if (result.affectedRows === 0) {
                res.status(400).json({ error: 'Failed to update product' });
                return;
            } else {
                res.status(200).json({
                    message: is_deleted === '0'
                        ? 'Product unmarked.'
                        : 'Product marked as deleted.'
                });
            }
        } else {
            console.error('Unexpected query result:', result);
            res.status(500).json({
                error: 'Server error',
                errorData: result,
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Server error',
            errorData: err,
        });
    }
};