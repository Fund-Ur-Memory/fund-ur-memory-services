import { Hono } from 'hono'
import { ZodError } from 'zod'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import vaultRoutes from './routes/vault.routes'
import { testConnection, initializeDatabase } from './config/Database'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

const initializeApp = async () => {
  try {
    await testConnection()
    await initializeDatabase()
    console.log('Application initialized successfully')
  } catch (error) {
    console.error('Failed to initialize application:', error)
    process.exit(1)
  }
}

initializeApp()

app.get('/', (c) => {
  return c.json({
    message: 'FUM Vault Indexer Server Running On Hono!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.route('/api/vaults', vaultRoutes)

app.onError((error, c) => {
  console.error('Error:', error)

  if (error instanceof ZodError) {
    return c.json({ 
      success: false,
      error: 'Validation Error',
      details: error.errors,
      message: 'Invalid request data' 
    }, 400)
  }

  if (error instanceof HTTPException) {
    return c.json({
      success: false,
      error: error.message,
      statusCode: error.status
    }, error.status)
  }

  return c.json({
    success: false,
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred'
  }, 500)
})

app.notFound(c => {
  return c.json({
    success: false,
    error: 'Not Found',
    message: `Route ${c.req.url} not found`
  }, 404)
})

export default app