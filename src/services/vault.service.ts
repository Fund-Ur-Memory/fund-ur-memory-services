import { VaultModel } from '../models/vaults.model'
import { CreateVaultDto, UpdateVaultDto, Vault } from '../types/vault.types'
import { HTTPException } from 'hono/http-exception'

export class VaultService {
  static async createVault(vaultData: CreateVaultDto): Promise<Vault> {
    try {
      const exists = await VaultModel.exists(vaultData.vault_id)
      if (exists) {
        throw new HTTPException(409, { message: 'Vault already exists' })
      }

      const vault = await VaultModel.create(vaultData)
      return vault
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to create vault' })
    }
  }

  static async getVaultById(vaultId: number): Promise<Vault> {
    try {
      const vault = await VaultModel.getById(vaultId)
      if (!vault) {
        throw new HTTPException(404, { message: 'Vault not found' })
      }
      return vault
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to fetch vault' })
    }
  }

  static async getVaultsByOwner(ownerAddress: string): Promise<Vault[]> {
    try {
      const vaults = await VaultModel.getByOwner(ownerAddress)
      return vaults
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to fetch user vaults' })
    }
  }

  static async getAllVaults(page: number = 1, limit: number = 50): Promise<{
    vaults: Vault[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const offset = (page - 1) * limit
      const { vaults, total } = await VaultModel.getAll(limit, offset)
      
      return {
        vaults,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to fetch vaults' })
    }
  }

  static async updateVault(
    vaultId: number, 
    updateData: UpdateVaultDto
  ): Promise<Vault> {
    try {
      const vault = await VaultModel.update(vaultId, updateData)
      if (!vault) {
        throw new HTTPException(404, { message: 'Vault not found' })
      }
      return vault
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to update vault' })
    }
  }

  static async deleteVault(vaultId: number): Promise<boolean> {
    try {
      const deleted = await VaultModel.delete(vaultId)
      if (!deleted) {
        throw new HTTPException(404, { message: 'Vault not found' })
      }
      return deleted
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to delete vault' })
    }
  }

  static async getVaultStats(): Promise<{total_vaults: number}> {
    try {
      const stats = await VaultModel.getStats()
      return stats
    } catch (error) {
      throw new HTTPException(500, { message: 'Failed to fetch vault statistics' })
    }
  }

  static parseMetadata(metadata: any): string | null {
    if (!metadata) return null
    
    try {
      if (typeof metadata === 'string') {
        JSON.parse(metadata)
        return metadata
      }
      return JSON.stringify(metadata)
    } catch (error) {
      throw new HTTPException(400, { message: 'Invalid metadata format' })
    }
  }
}