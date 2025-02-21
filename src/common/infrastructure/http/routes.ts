import { productsRouter } from '@/products/infrastructure/http/routes/products.routes'
import { usersRouter } from '@/users/infrastructure/http/routes/users.routes'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Bem-vindo a API Vendas 2024' })
})

routes.use('/products', productsRouter)
routes.use('/users', usersRouter)

export { routes }
