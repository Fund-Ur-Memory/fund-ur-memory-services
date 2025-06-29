export interface VaultMetadata {
  aiAgentAdvice?: string
  aiAgentInsights?: any
  userNote?: string
  [key: string]: any
}

export interface Vault {
  id: number
  vault_id: number
  vault_title: string
  commitment_message: string
  owner_address: string
  created_at: Date
  updated_at: Date
  metadata?: string
  tx_hash?: string
}

export interface CreateVaultDto {
  vault_id: number
  vault_title: string
  commitment_message: string
  owner_address: string
  metadata?: VaultMetadata | string
  tx_hash?: string
}

export interface UpdateVaultDto {
  vault_title?: string
  commitment_message?: string
  metadata?: VaultMetadata | string
  tx_hash?: string
}