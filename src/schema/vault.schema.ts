import { z } from 'zod'
const ethereumAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

export const createVaultSchema = z.object({
  vault_id: z.number().int().positive(),
  vault_title: z.string().min(1).max(255),
  commitment_message: z.string().min(1),
  owner_address: ethereumAddress,
  metadata: z.union([z.string(), z.object({}).passthrough()]).optional(),
  tx_hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash').optional(),
})

export const updateVaultSchema = z.object({
  vault_title: z.string().min(1).max(255).optional(),
  commitment_message: z.string().min(1).optional(),
  metadata: z.union([z.string(), z.object({}).passthrough()]).optional(),
  tx_hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash').optional(),
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