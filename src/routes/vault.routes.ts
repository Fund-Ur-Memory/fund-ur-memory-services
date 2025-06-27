import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { VaultService } from '../services/vault.service'
import { 
  createVaultSchema, 
  updateVaultSchema, 
  paginationSchema,
  vaultIdSchema,
  ownerAddressSchema
} from '../schema/vault.schema'

const vaultRoutes = new Hono()

vaultRoutes.post('/', 
  zValidator('json', createVaultSchema),
  async (c) => {
    const vaultData = c.req.valid('json')
    const vault = await VaultService.createVault(vaultData)
    return c.json({
      success: true,
      data: vault,
      message: 'Vault created successfully'
    }, 201)
  }
)

vaultRoutes.get('/', 
  zValidator('query', paginationSchema),
  async (c) => {
    const { page = 1, limit = 50 } = c.req.valid('query') || {}
    const result = await VaultService.getAllVaults(page, limit)
    return c.json({
      success: true,
      data: result.vaults,
      pagination: result.pagination
    })
  }
)

vaultRoutes.get('/stats', async (c) => {
  const stats = await VaultService.getVaultStats()
  return c.json({
    success: true,
    data: stats
  })
})

vaultRoutes.get('/:id', 
  zValidator('param', vaultIdSchema),
  async (c) => {
    const { id } = c.req.valid('param')
    const vault = await VaultService.getVaultById(id)
    return c.json({
      success: true,
      data: vault
    })
  }
)

vaultRoutes.get('/user/:address', 
  zValidator('param', ownerAddressSchema),
  async (c) => {
    const { address } = c.req.valid('param')
    const vaults = await VaultService.getVaultsByOwner(address)
    return c.json({
      success: true,
      data: vaults,
      count: vaults.length
    })
  }
)

vaultRoutes.put('/:id', 
  zValidator('param', vaultIdSchema),
  zValidator('json', updateVaultSchema),
  async (c) => {
    const { id } = c.req.valid('param')
    const updateData = c.req.valid('json')
    const vault = await VaultService.updateVault(id, updateData)
    return c.json({
      success: true,
      data: vault,
      message: 'Vault updated successfully'
    })
  }
)

vaultRoutes.delete('/:id', 
  zValidator('param', vaultIdSchema),
  async (c) => {
    const { id } = c.req.valid('param')
    await VaultService.deleteVault(id)
    return c.json({
      success: true,
      message: 'Vault deleted successfully'
    })
  }
)

export default vaultRoutes