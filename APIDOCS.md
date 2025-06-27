# FUM Vault Indexer API Documentation

## Base URL
```
http://localhost:3002/api
```

## Endpoints

### 1. Create Vault
**POST** `/vaults`

Creates a new vault record in the indexer.

**Request Body:**
```json
{
  "vault_id": 1,
  "vault_title": "My First Vault",
  "commitment_message": "I am committing to hold this vault for the long term",
  "owner_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f6E123",
  "metadata": {
    "aiAgentAdvice": "Based on market analysis, this is a good time to lock.",
    "aiAgentInsights": {
      "marketTrend": "bullish",
      "volatility": "medium",
      "recommendation": "hold"
    },
    "userNote": "Long-term investment strategy"
  },
  "tx_hash": "0x123abc..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vault_id": 1,
    "vault_title": "My First Vault",
    "commitment_message": "I am committing to hold this vault for the long term",
    "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
    "tx_hash": "0x123abc..."
  },
  "message": "Vault created successfully"
}
```

### 2. Get All Vaults
**GET** `/vaults?page=1&limit=50`

Retrieves all vaults with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vault_id": 1,
      "vault_title": "My First Vault",
      "commitment_message": "I am committing to hold this vault for the long term",
      "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
      "tx_hash": "0x123abc..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

### 3. Get Vault by ID
**GET** `/vaults/:id`

Retrieves a specific vault by its vault_id.

**URL Parameters:**
- `id`: The vault_id (not the database id)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vault_id": 1,
    "vault_title": "My First Vault",
    "commitment_message": "I am committing to hold this vault for the long term",
    "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
    "tx_hash": "0x123abc..."
  }
}
```

### 4. Get Vaults by User
**GET** `/vaults/user/:address`

Retrieves all vaults owned by a specific address.

**URL Parameters:**
- `address`: Ethereum address of the vault owner

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vault_id": 1,
      "vault_title": "My First Vault",
      "commitment_message": "I am committing to hold this vault for the long term",
      "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
      "tx_hash": "0x123abc..."
    }
  ],
  "count": 1
}
```

### 5. Update Vault
**PUT** `/vaults/:id`

Updates a vault's information.

**URL Parameters:**
- `id`: The vault_id

**Request Body:**
```json
{
  "vault_title": "Updated Vault Title",
  "commitment_message": "Updated commitment message",
  "metadata": {
    "aiAgentAdvice": "Updated advice based on new market conditions",
    "userNote": "Updated notes"
  },
  "tx_hash": "0x456def..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vault_id": 1,
    "vault_title": "Updated Vault Title",
    "commitment_message": "Updated commitment message",
    "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:30:00Z",
    "metadata": "{\"aiAgentAdvice\":\"Updated advice based on new market conditions\"}",
    "tx_hash": "0x456def..."
  },
  "message": "Vault updated successfully"
}
```

### 6. Delete Vault
**DELETE** `/vaults/:id`

Deletes a vault from the indexer.

**URL Parameters:**
- `id`: The vault_id

**Response:**
```json
{
  "success": true,
  "message": "Vault deleted successfully"
}
```

### 7. Get Vault Statistics
**GET** `/vaults/stats`

Retrieves overall statistics about all vaults.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_vaults": 150
  }
}
```

## Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": [...],
  "statusCode": 400
}
```

## Required Fields

### Create Vault
- `vault_id` (number): Unique identifier for the vault
- `vault_title` (string): Title/name of the vault
- `commitment_message` (string): User's commitment message
- `owner_address` (string): Ethereum address of the vault owner

### Optional Fields
- `metadata` (object/string): Additional data including AI agent insights
- `tx_hash` (string): Transaction hash from blockchain

### Update Vault
All fields are optional for updates:
- `vault_title` (string)
- `commitment_message` (string)
- `metadata` (object/string)
- `tx_hash` (string)