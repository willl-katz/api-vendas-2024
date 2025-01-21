import "reflect-metadata"
import { ProductsRepository } from '@/products/domain/repositories/products.repository'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { NotFoundError } from "@/common/domain/errors/not-found-error"
import { DeleteProductUseCase } from "./delete-product.usecase"

describe('GetProductUseCase Unit Test', () => {
  let sut: DeleteProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new DeleteProductUseCase.UseCase(repository)
  })

  it('should be able to delete a product', async () => {
    const spyDeleteById = jest.spyOn(repository, 'delete')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 5,
    }

    const model = repository.create(props)
    await repository.insert(model)

    expect((repository as ProductsInMemoryRepository).items.length).toBe(1)
    await sut.execute({ id: model.id })
    expect((repository as ProductsInMemoryRepository).items.length).toBe(0)
    expect(spyDeleteById).toHaveBeenCalledTimes(1)
  })

  it('should throws error when product not found', async () => {
    await expect(
      sut.execute({ id: 'fake-id' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

})
