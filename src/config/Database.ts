import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fum_vault_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const testConnection = async () => {
  try {
    const client = await pool.connect()
    console.log('Database connected successfully')
    client.release()
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vaults (
        id SERIAL PRIMARY KEY,
        vault_id INTEGER UNIQUE NOT NULL,
        vault_title VARCHAR(255) NOT NULL,
        commitment_message TEXT NOT NULL,
        owner_address VARCHAR(42) NOT NULL,
        tx_hash VARCHAR(66),
        metadata TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_owner_address ON vaults(owner_address);
      CREATE INDEX IF NOT EXISTS idx_vault_id ON vaults(vault_id);
    `)
    console.log('Database tables initialized')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}