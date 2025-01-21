import { AppError } from '@/common/domain/errors/app-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteProductUseCase } from '@/products/application/usecases/delete-product.usecase'

export async function deleteProductController(req: Request, res: Response) {
  const DeleteProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(DeleteProductParamSchema, req.params)

  //const createProductUseCase = new CreateProductUseCase.UseCase(repository)n
  const deleteProductUseCase: DeleteProductUseCase.UseCase =
    container.resolve('DeleteProductUseCase')

  await deleteProductUseCase.execute({ id })

  return res.status(204).send()
}
