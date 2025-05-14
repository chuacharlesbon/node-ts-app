import { Request, Response } from 'express';
import pool from '../config/db';

export const myController1 = (req: Request, res: Response): void => {
    console.log("My controller req.method", req.method);
    res.status(200).json({ message: "Connected to my controller 1" });
};

export const myController2 = async (req: Request, res: Response) => {
    console.log("My controller req.method", req.method);

    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({
            error: 'Server error',
            errorData: err
        });
    }
};