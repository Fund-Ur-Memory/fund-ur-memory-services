export enum ConditionType {
    TIME = 'TIME',
    PRICE = 'PRICE',
    TIME_AND_PRICE = 'TIME_AND_PRICE',
    TIME_OR_PRICE = 'TIME_OR_PRICE'
  }
  
  export enum VaultStatus {
    ACTIVE = 'ACTIVE',
    UNLOCKED = 'UNLOCKED',
    WITHDRAWN = 'WITHDRAWN',
    EMERGENCY_WITHDRAWN = 'EMERGENCY_WITHDRAWN'
  }
  
  export interface VaultMetadata {
    aiAgentAdvice?: string
    aiAgentInsights?: any
    userNote?: string
    [key: string]: any
  }
  
  export interface Vault {
    id: number
    vault_id: number
    owner_address: string
    token_address: string
    amount: string
    unlock_time?: number
    target_price?: string
    condition_type: ConditionType
    status: VaultStatus
    created_at: Date
    updated_at: Date
    metadata?: string
    tx_hash?: string
    block_number?: number
    emergency_initiated_at?: number
  }
  
  export interface CreateVaultDto {
    vault_id: number
    owner_address: string
    token_address: string
    amount: string
    unlock_time?: number
    target_price?: string
    condition_type: ConditionType
    status?: VaultStatus
    metadata?: VaultMetadata | string
    tx_hash?: string
    block_number?: number
  }
  
  export interface UpdateVaultStatusDto {
    status: VaultStatus
    emergency_initiated_at?: number
  }
  
  export interface VaultStats {
    total_vaults: number
    active_vaults: number
    total_value_locked: string
    vaults_by_status: Record<VaultStatus, number>
    vaults_by_condition: Record<ConditionType, number>
  }