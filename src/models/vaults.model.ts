import { pool } from '../config/Database'
import { Vault, CreateVaultDto, UpdateVaultStatusDto, VaultStatus, ConditionType, VaultStats } from '../types/vault.types'

export class VaultModel {
  static async create(vaultData: CreateVaultDto): Promise<Vault> {
    const {
      vault_id,
      owner_address,
      token_address,
      amount,
      unlock_time,
      target_price,
      condition_type,
      status = VaultStatus.ACTIVE,
      metadata,
      tx_hash,
      block_number
    } = vaultData

    const metadataString = typeof metadata === 'string' 
      ? metadata 
      : metadata ? JSON.stringify(metadata) : null

    const query = `
      INSERT INTO vaults (
        vault_id, owner_address, token_address, amount, 
        unlock_time, target_price, condition_type, status, 
        metadata, tx_hash, block_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `

    const values = [
      vault_id,
      owner_address.toLowerCase(),
      token_address.toLowerCase(),
      amount,
      unlock_time,
      target_price,
      condition_type,
      status,
      metadataString,
      tx_hash,
      block_number
    ]

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async getById(vaultId: number): Promise<Vault | null> {
    const query = 'SELECT * FROM vaults WHERE vault_id = $1'
    const result = await pool.query(query, [vaultId])
    return result.rows[0] || null
  }

  static async getByOwner(ownerAddress: string): Promise<Vault[]> {
    const query = 'SELECT * FROM vaults WHERE owner_address = $1 ORDER BY created_at DESC'
    const result = await pool.query(query, [ownerAddress.toLowerCase()])
    return result.rows
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<{vaults: Vault[], total: number}> {
    const countQuery = 'SELECT COUNT(*) FROM vaults'
    const countResult = await pool.query(countQuery)
    const total = parseInt(countResult.rows[0].count)

    const query = 'SELECT * FROM vaults ORDER BY created_at DESC LIMIT $1 OFFSET $2'
    const result = await pool.query(query, [limit, offset])
    
    return {
      vaults: result.rows,
      total
    }
  }

  static async updateStatus(vaultId: number, updateData: UpdateVaultStatusDto): Promise<Vault | null> {
    const { status, emergency_initiated_at } = updateData
    
    let query = 'UPDATE vaults SET status = $1, updated_at = CURRENT_TIMESTAMP'
    const values: any[] = [status]
    let paramCount = 1

    if (emergency_initiated_at !== undefined) {
      paramCount++
      query += `, emergency_initiated_at = $${paramCount}`
      values.push(emergency_initiated_at)
    }

    paramCount++
    query += ` WHERE vault_id = $${paramCount} RETURNING *`
    values.push(vaultId)

    const result = await pool.query(query, values)
    return result.rows[0] || null
  }

  static async getByStatus(status: VaultStatus): Promise<Vault[]> {
    const query = 'SELECT * FROM vaults WHERE status = $1 ORDER BY created_at DESC'
    const result = await pool.query(query, [status])
    return result.rows
  }

  static async getByToken(tokenAddress: string): Promise<Vault[]> {
    const query = 'SELECT * FROM vaults WHERE token_address = $1 ORDER BY created_at DESC'
    const result = await pool.query(query, [tokenAddress.toLowerCase()])
    return result.rows
  }

  static async getStats(): Promise<VaultStats> {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_vaults,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_vaults,
        SUM(CASE WHEN status = 'ACTIVE' THEN amount::DECIMAL ELSE 0 END) as total_value_locked
      FROM vaults
    `
    
    const statusQuery = `
      SELECT status, COUNT(*) as count 
      FROM vaults 
      GROUP BY status
    `
    
    const conditionQuery = `
      SELECT condition_type, COUNT(*) as count 
      FROM vaults 
      GROUP BY condition_type
    `

    const [statsResult, statusResult, conditionResult] = await Promise.all([
      pool.query(statsQuery),
      pool.query(statusQuery),
      pool.query(conditionQuery)
    ])

    const vaultsByStatus = statusResult.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count)
      return acc
    }, {} as Record<VaultStatus, number>)

    const vaultsByCondition = conditionResult.rows.reduce((acc, row) => {
      acc[row.condition_type] = parseInt(row.count)
      return acc
    }, {} as Record<ConditionType, number>)

    return {
      total_vaults: parseInt(statsResult.rows[0].total_vaults),
      active_vaults: parseInt(statsResult.rows[0].active_vaults),
      total_value_locked: statsResult.rows[0].total_value_locked || '0',
      vaults_by_status: vaultsByStatus,
      vaults_by_condition: vaultsByCondition
    }
  }

  static async exists(vaultId: number): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM vaults WHERE vault_id = $1)'
    const result = await pool.query(query, [vaultId])
    return result.rows[0].exists
  }
}