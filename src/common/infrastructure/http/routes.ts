import { productsRouter } from '@/products/infrastructure/http/routes/products.routes'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Olha o Macaco' })
})

routes.use('/products', productsRouter)

export { routes }
