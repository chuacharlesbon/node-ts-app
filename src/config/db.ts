import mysql from 'mysql2/promise';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from './config';

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;