
import { z } from 'zod'
import { ConditionType, VaultStatus } from '../types/vault.types'
const ethereumAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

export const createVaultSchema = z.object({
  vault_id: z.number().int().positive(),
  owner_address: ethereumAddress,
  token_address: ethereumAddress,
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer string'),
  unlock_time: z.number().int().positive().optional(),
  target_price: z.string().regex(/^\d+$/, 'Target price must be a positive integer string').optional(),
  condition_type: z.nativeEnum(ConditionType),
  status: z.nativeEnum(VaultStatus).optional(),
  metadata: z.union([z.string(), z.object({}).passthrough()]).optional(),
  tx_hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash').optional(),
  block_number: z.number().int().positive().optional()
}).refine((data) => {
  switch (data.condition_type) {
    case ConditionType.TIME:
      return data.unlock_time !== undefined
    case ConditionType.PRICE:
      return data.target_price !== undefined
    case ConditionType.TIME_AND_PRICE:
    case ConditionType.TIME_OR_PRICE:
      return data.unlock_time !== undefined && data.target_price !== undefined
    default:
      return false
  }
}, {
  message: 'Invalid condition parameters for the specified condition type'
})

export const updateVaultStatusSchema = z.object({
  status: z.nativeEnum(VaultStatus),
  emergency_initiated_at: z.number().int().positive().optional()
})

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().max(100)).optional()
})

export const vaultIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive())
})

export const ownerAddressSchema = z.object({
  address: ethereumAddress
})