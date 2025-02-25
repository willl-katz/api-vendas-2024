import { Schema } from 'zod'

import { AppError } from '@/common/domain/errors/app-error'

/**
 * @param schema Objeto com schema de validation para o zod
 * @param data Objeto com os dados a serem validados
 * @returns retorna os dados validados
 */

export function dataValidation(schema: Schema, data: any) {
  const validatedData = schema.safeParse(data)

  if (validatedData.success == false) {
    console.error('Invalid Data', validatedData.error.format())
    throw new AppError(
      `${validatedData.error.errors.map(err => `${err.path} -> ${err.message}`)}`,
    )
  }

  return validatedData.data
}
