import 'reflect-metadata'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { SearchProductUseCase } from './search-product.usecase'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'

describe('SearchProductUseCase Unit its', () => {
  let sut: SearchProductUseCase.UseCase
  let repository: ProductsInMemoryRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new SearchProductUseCase.UseCase(repository)
  })

  it('should return the products ordered by created_at', async () => {
    const created_at = new Date()
    const items = [
      { ...ProductsDataBuilder({}) },
      {
        ...ProductsDataBuilder({
          create_at: new Date(created_at.getTime() + 100),
        }),
      },
      {
        ...ProductsDataBuilder({
          create_at: new Date(created_at.getTime() + 200),
        }),
      },
    ]
    repository.items = items

    const result = await sut.execute({})

    expect(result).toStrictEqual({
      items: [...items].reverse(),
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    })
  })

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      { ...ProductsDataBuilder({ name: 'a' }) },
      { ...ProductsDataBuilder({ name: 'AA' }) },
      { ...ProductsDataBuilder({ name: 'Aa' }) },
      { ...ProductsDataBuilder({ name: 'b' }) },
      { ...ProductsDataBuilder({ name: 'c' }) },
    ]
    repository.items = items

    let output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[1], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })

    output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })
  })
})
