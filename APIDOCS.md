# FUM Vault Indexer API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Create Vault
**POST** `/vaults`

Creates a new vault record in the indexer.

**Request Body:**
```json
{
  "vault_id": 1,
  "owner_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f6E123",
  "token_address": "0x5274A2153cF842E3bD1D4996E01d567750d0e739",
  "amount": "1000000000000000000",
  "unlock_time": 1735257600,
  "target_price": "2000000000",
  "condition_type": "TIME_AND_PRICE",
  "metadata": {
    "aiAgentAdvice": "Based on market analysis, locking until Q4 2024 with a $2000 price target provides optimal risk-reward ratio.",
    "aiAgentInsights": {
      "marketTrend": "bullish",
      "volatility": "medium",
      "recommendation": "hold"
    },
    "userNote": "Long-term investment strategy"
  },
  "tx_hash": "0x123abc...",
  "block_number": 1234567
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vault_id": 1,
    "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
    "token_address": "0x5274a2153cf842e3bd1d4996e01d567750d0e739",
    "amount": "1000000000000000000",
    "unlock_time": 1735257600,
    "target_price": "2000000000",
    "condition_type": "TIME_AND_PRICE",
    "status": "ACTIVE",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
    "tx_hash": "0x123abc...",
    "block_number": 1234567
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
      "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
      "token_address": "0x5274a2153cf842e3bd1d4996e01d567750d0e739",
      "amount": "1000000000000000000",
      "unlock_time": 1735257600,
      "target_price": "2000000000",
      "condition_type": "TIME_AND_PRICE",
      "status": "ACTIVE",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
      "tx_hash": "0x123abc...",
      "block_number": 1234567
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
    "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
    "token_address": "0x5274a2153cf842e3bd1d4996e01d567750d0e739",
    "amount": "1000000000000000000",
    "unlock_time": 1735257600,
    "target_price": "2000000000",
    "condition_type": "TIME_AND_PRICE",
    "status": "ACTIVE",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
    "tx_hash": "0x123abc...",
    "block_number": 1234567
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
      "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
      "token_address": "0x5274a2153cf842e3bd1d4996e01d567750d0e739",
      "amount": "1000000000000000000",
      "unlock_time": 1735257600,
      "target_price": "2000000000",
      "condition_type": "TIME_AND_PRICE",
      "status": "ACTIVE",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
      "tx_hash": "0x123abc...",
      "block_number": 1234567
    }
  ],
  "count": 1
}
```

### 5. Update Vault Status
**PUT** `/vaults/:id/status`

Updates the status of a vault (e.g., when unlocked, withdrawn, or emergency withdrawn).

**URL Parameters:**
- `id`: The vault_id

**Request Body:**
```json
{
  "status": "UNLOCKED",
  "emergency_initiated_at": 1735257600
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vault_id": 1,
    "owner_address": "0x742d35cc6634c0532925a3b844bc9e7595f6e123",
    "token_address": "0x5274a2153cf842e3bd1d4996e01d567750d0e739",
    "amount": "1000000000000000000",
    "unlock_time": 1735257600,
    "target_price": "2000000000",
    "condition_type": "TIME_AND_PRICE",
    "status": "UNLOCKED",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:30:00Z",
    "metadata": "{\"aiAgentAdvice\":\"Based on market analysis...\"}",
    "tx_hash": "0x123abc...",
    "block_number": 1234567,
    "emergency_initiated_at": null
  },
  "message": "Vault status updated successfully"
}
```

### 6. Get Vault Statistics
**GET** `/vaults/stats`

Retrieves overall statistics about all vaults.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_vaults": 150,
    "active_vaults": 75,
    "total_value_locked": "75000000000000000000000",
    "vaults_by_status": {
      "ACTIVE": 75,
      "UNLOCKED": 30,
      "WITHDRAWN": 40,
      "EMERGENCY_WITHDRAWN": 5
    },
    "vaults_by_condition": {
      "TIME": 50,
      "PRICE": 30,
      "TIME_AND_PRICE": 40,
      "TIME_OR_PRICE": 30
    }
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

## Condition Types

- `TIME`: Vault unlocks at specific time
- `PRICE`: Vault unlocks at target price
- `TIME_AND_PRICE`: Both conditions must be met
- `TIME_OR_PRICE`: Either condition triggers unlock

## Vault Statuses

- `ACTIVE`: Vault is locked and active
- `UNLOCKED`: Conditions met, ready for withdrawal
- `WITHDRAWN`: Funds have been withdrawn
- `EMERGENCY_WITHDRAWN`: Emergency withdrawal executed (with penalty)