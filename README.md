# Cipher Vault Services Setup Guide

## Prerequisites

- Bun runtime installed
- PostgreSQL database server
- Node.js (for npm packages if needed)

## Installation

1. **Install dependencies:**
```bash
bun install
```

2. **Install additional PostgreSQL dependencies:**
```bash
bun add pg @types/pg
```

3. **Setup PostgreSQL Database:**

Create a new database:
```bash
createdb cipher_vault_db
```

Or using psql:
```sql
CREATE DATABASE cipher_vault_db;
```

4. **Configure Environment Variables:**

Copy the `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
# Server Configuration
PORT=3002

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cipher_vault_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# Blockchain Configuration
SCROLL_SEPOLIA_RPC_URL=https://sepolia-rpc.scroll.io/
```

## Running the Application

**Development mode (with hot reload):**
```bash
bun run dev
```

**Production mode:**
```bash
bun run start
```

The server will:
1. Connect to PostgreSQL
2. Create the necessary tables if they don't exist
3. Start the HTTP server on port 3002 (or the port specified in .env)

## Database Schema

The application will automatically create the following table:

```sql
CREATE TABLE vaults (
  id SERIAL PRIMARY KEY,
  vault_id INTEGER UNIQUE NOT NULL,
  vault_title VARCHAR(255) NOT NULL,
  commitment_message TEXT NOT NULL,
  owner_address VARCHAR(42) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT,
  tx_hash VARCHAR(66)
);
```

## Project Structure

```
cipher-services/
├── src/
│   ├── app.ts              # Main application setup
│   ├── index.ts            # Server entry point
│   ├── config/
│   │   ├── Database.ts     # Database connection & initialization
│   │   ├── Contracts.ts    # Smart contract configuration
│   │   └── ViemClient.ts   # Blockchain client
│   ├── types/
│   │   └── vault.types.ts  # TypeScript interfaces
│   ├── models/
│   │   └── vaults.model.ts # Database operations
│   ├── services/
│   │   └── vault.service.ts # Business logic
│   ├── routes/
│   │   └── vault.routes.ts # API endpoints
│   └── schema/
│       └── vault.schema.ts # Validation schemas
├── package.json
├── tsconfig.json
└── .env
```

## Testing the API

Once the server is running, you can test it:

**Health Check:**
```bash
curl http://localhost:3002/
```

**Create a Vault:**
```bash
curl -X POST http://localhost:3002/api/vaults \
  -H "Content-Type: application/json" \
  -d '{
    "vault_id": 1,
    "vault_title": "My First Vault",
    "commitment_message": "I am committing to hold this vault for the long term",
    "owner_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f6E123",
    "metadata": {
      "aiAgentAdvice": "Based on market analysis, this is a good time to lock.",
      "userNote": "Long-term hold"
    },
    "tx_hash": "0x123abc..."
  }'
```

**Get All Vaults:**
```bash
curl http://localhost:3002/api/vaults
```

**Get Vault by ID:**
```bash
curl http://localhost:3002/api/vaults/1
```

**Get Vaults by Owner:**
```bash
curl http://localhost:3002/api/vaults/user/0x742d35Cc6634C0532925a3b844Bc9e7595f6E123
```

**Update a Vault:**
```bash
curl -X PUT http://localhost:3002/api/vaults/1 \
  -H "Content-Type: application/json" \
  -d '{
    "vault_title": "Updated Vault Title",
    "commitment_message": "Updated commitment message"
  }'
```

**Delete a Vault:**
```bash
curl -X DELETE http://localhost:3002/api/vaults/1
```

**Get Vault Statistics:**
```bash
curl http://localhost:3002/api/vaults/stats
```

## Features

- ✅ PostgreSQL database integration
- ✅ RESTful API endpoints
- ✅ Input validation with Zod
- ✅ Error handling
- ✅ Pagination support
- ✅ Metadata storage for AI agent insights
- ✅ Automatic timestamp tracking (created_at, updated_at)
- ✅ CRUD operations for vaults
- ✅ Vault statistics endpoint
- ✅ Case-insensitive address storage

## Next Steps

1. **Frontend Integration:** Update your frontend to call these API endpoints when creating vaults
2. **Blockchain Event Listener:** Consider adding a service to listen to blockchain events and automatically update vault data
3. **Background Jobs:** Add a cron job to periodically check and update vault information
4. **Monitoring:** Add logging and monitoring for production deployment
5. **API Rate Limiting:** Consider adding rate limiting for production use