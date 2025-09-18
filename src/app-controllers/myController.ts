import { Request, Response } from 'express';
import pool from '../config/db';

export const myController1 = (req: Request, res: Response): void => {
    console.log("My controller req.method", req.method);
    res.status(200).json({ message: "Connected to my controller 1" });
    return;
};

export const myController2 = async (req: Request, res: Response) => {
    console.log("My controller req.method", req.method);

    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
        return;
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({
            error: 'Server error',
            errorData: err
        });
        return;
    }
};

export const myController3 = async (req: Request, res: Response) => {
    const { name, email } = req.body ?? {};

    if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required.' });
        return;
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );

        res.status(200).json({
            message: 'User created successfully.',
            userId: (result as any).insertId, // Type-cast if using TypeScript
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create user.',
            error: err,
        });
    }
};