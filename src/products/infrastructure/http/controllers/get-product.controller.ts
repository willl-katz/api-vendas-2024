import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { AppError } from '@/common/domain/errors/app-error'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { GetProductUseCase } from '@/products/application/usecases/get-product.usecase'

import { ProductsTypeormRepository } from '../../typeorm/repositories/products-typeorm.repository'

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
