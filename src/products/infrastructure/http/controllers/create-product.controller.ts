import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductsTypeormRepository } from '../../typeorm/repositories/products-typeorm.repository'
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function createProductController(req: Request, res: Response) {
  const CreateProductBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })

  const { name, price, quantity } = dataValidation(CreateProductBodySchema, req.body)

  //const repository = new ProductsTypeormRepository()
  const repository: ProductsTypeormRepository =
    container.resolve('ProductRepository')
  //const createProductUseCase = new CreateProductUseCase.UseCase(repository)n
  const createProductUseCase: CreateProductUseCase.UseCase = container.resolve(
    'CreateProductUseCase',
  )

  const product = await createProductUseCase.execute({ name, price, quantity })

  return res.status(200).json(product)
}
