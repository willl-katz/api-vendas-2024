import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase'

export async function updateProductController(req: Request, res: Response) {
  const UpdateProductBodySchema = z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
  })

  const UpdateProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  const { name, price, quantity } = dataValidation(
    UpdateProductBodySchema,
    req.body,
  )

  const { id } = dataValidation(UpdateProductParamSchema, req.params)

  const updateProductUseCase: UpdateProductUseCase.UseCase = container.resolve(
    'UpdateProductUseCase',
  )

  const product = await updateProductUseCase.execute({
    id,
    name,
    price,
    quantity,
  })

  return res.status(200).json(product)
}
