import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { dataValidation } from '@/common/infrastructure/validation/zod'
import { SearchProductUseCase } from '@/products/application/usecases/search-product.usecase'

export async function searchProductController(req: Request, res: Response) {
  const SearchProductParamSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    per_page: z.coerce.number().int().positive().optional(),
    sort: z.string().optional(),
    sort_dir: z.string().optional(),
    filter: z.string().optional(),
  })

  const { page, per_page, sort, sort_dir, filter } = dataValidation(
    SearchProductParamSchema,
    req.query,
  )

  const searchProductUseCase: SearchProductUseCase.UseCase = container.resolve(
    'SearchProductUseCase',
  )

  const products = await searchProductUseCase.execute({
    page: page ?? 1,
    per_page: per_page ?? 15,
    sort: sort ?? null,
    sort_dir: sort_dir ?? null,
    filter: filter ?? null,
  })

  return res.status(200).json(products)
}
