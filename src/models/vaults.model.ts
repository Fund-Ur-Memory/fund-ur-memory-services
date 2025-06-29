import { pool } from '../config/Database'
import { Vault, CreateVaultDto, UpdateVaultDto } from '../types/vault.types'

export class VaultModel {
  static async create(vaultData: CreateVaultDto): Promise<Vault> {
    const {
      vault_id,
      vault_title,
      commitment_message,
      owner_address,
      metadata,
      tx_hash,
    } = vaultData

    const metadataString = typeof metadata === 'string' 
      ? metadata 
      : metadata ? JSON.stringify(metadata) : null

    const query = `
      INSERT INTO vaults (
        vault_id, vault_title, commitment_message, owner_address, 
        metadata, tx_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    const values = [
      vault_id,
      vault_title,
      commitment_message,
      owner_address.toLowerCase(),
      metadataString,
      tx_hash
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

  static async update(vaultId: number, updateData: UpdateVaultDto): Promise<Vault | null> {
    const { vault_title, commitment_message, metadata, tx_hash } = updateData
    
    let query = 'UPDATE vaults SET updated_at = CURRENT_TIMESTAMP'
    const values: any[] = []
    let paramCount = 0

    if (vault_title !== undefined) {
      paramCount++
      query += `, vault_title = $${paramCount}`
      values.push(vault_title)
    }

    if (commitment_message !== undefined) {
      paramCount++
      query += `, commitment_message = $${paramCount}`
      values.push(commitment_message)
    }

    if (metadata !== undefined) {
      paramCount++
      const metadataString = typeof metadata === 'string' 
        ? metadata 
        : JSON.stringify(metadata)
      query += `, metadata = $${paramCount}`
      values.push(metadataString)
    }

    if (tx_hash !== undefined) {
      paramCount++
      query += `, tx_hash = $${paramCount}`
      values.push(tx_hash)
    }

    paramCount++
    query += ` WHERE vault_id = $${paramCount} RETURNING *`
    values.push(vaultId)

    const result = await pool.query(query, values)
    return result.rows[0] || null
  }

  static async delete(vaultId: number): Promise<boolean> {
    const query = 'DELETE FROM vaults WHERE vault_id = $1'
    const result = await pool.query(query, [vaultId])
    return (result.rowCount || 0) > 0
  }

  static async exists(vaultId: number): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM vaults WHERE vault_id = $1)'
    const result = await pool.query(query, [vaultId])
    return result.rows[0].exists
  }

  static async getStats(): Promise<{total_vaults: number}> {
    const statsQuery = 'SELECT COUNT(*) as total_vaults FROM vaults'
    const statsResult = await pool.query(statsQuery)

    return {
      total_vaults: parseInt(statsResult.rows[0].total_vaults)
    }
  }
}