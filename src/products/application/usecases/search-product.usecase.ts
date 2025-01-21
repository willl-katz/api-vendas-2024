import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { inject, injectable } from 'tsyringe'
import { SearchInputDto } from '../dtos/search-input.dto'
import { ProductModel } from '@/products/domain/models/products.model'
import { PaginationOutputDto, PaginationOutputMapper } from '../dtos/pagination-output.dto'

export namespace SearchProductUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<ProductModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.productsRepository.search(input)

      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
