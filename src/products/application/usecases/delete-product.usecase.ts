import { inject, injectable } from 'tsyringe'

import { ProductsRepository } from '@/products/domain/repositories/products.repository'

export namespace DeleteProductUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.productsRepository.delete(input.id)
    }
  }
}
