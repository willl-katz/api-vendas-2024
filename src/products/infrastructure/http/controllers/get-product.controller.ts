import { AppError } from '@/common/domain/errors/app-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductsTypeormRepository } from '../../typeorm/repositories/products-typeorm.repository'
import { container } from 'tsyringe'
import { GetProductUseCase } from '@/products/application/usecases/get-product.usecase'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function getProductController(req: Request, res: Response) {
  const GetProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(GetProductParamSchema, req.params)

  //const repository = new ProductsTypeormRepository()
  const repository: ProductsTypeormRepository =
    container.resolve('ProductRepository')
  //const createProductUseCase = new CreateProductUseCase.UseCase(repository)n
  const getProductUseCase: GetProductUseCase.UseCase =
    container.resolve('GetProductUseCase')

  const product = await getProductUseCase.execute({ id })

  return res.status(200).json(product)
}
