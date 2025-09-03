import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ?? 4000;
export const DB_HOST = process.env.DB_HOST ?? 'localhost';
export const DB_USER = process.env.DB_USER ?? 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD ?? 'password';
export const DB_DATABASE = process.env.DB_DATABASE ?? 'schema';
export const MONGODB_URI_S1 = process.env.MONGODB_URI_S1 ?? 'N/A';
export const DEV_MODE = process.env.DEV_MODE ?? 'N/A';
export const DEV_WEB_URL = process.env.DEV_WEB_URL ?? 'N/A';
export const PROD_WEB_URL = process.env.PROD_WEB_URL ?? 'N/A';