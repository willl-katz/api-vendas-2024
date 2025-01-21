import 'reflect-metadata'
import { UpdateProductUseCase } from './update-product.usecase'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { ProductsDataBuilder } from '@/products/infrastructure/testing/helpers/products-data-builder'

describe('UpdateProductUseCase Unit Tests', () => {
  let sut: UpdateProductUseCase.UseCase
  let repository: ProductsInMemoryRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new UpdateProductUseCase.UseCase(repository)
  })

  it('should throws error when product not found', async () => {
    await expect(sut.execute({ id: 'fake-id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('should be able to get a product', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 5,
    }

    const model = repository.create(props)
    await repository.insert(model)

    const newData = {
      id: model.id,
      name: 'new name',
      price: 500,
      quantity: 20,
    }
    const result = await sut.execute(newData)

    expect(result.name).toEqual(newData.name)
    expect(result.price).toEqual(newData.price)
    expect(result.quantity).toEqual(newData.quantity)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })

  it('should throws error when product is found and he have this name equal', async () => {
    const otherProduct = repository.create(
      ProductsDataBuilder({ name: 'equal name 2' }),
    )
    await repository.insert(otherProduct)

    const props = {
      name: 'equal name',
      price: 10,
      quantity: 5,
    }

    const model = repository.create(props)
    await repository.insert(model)

    const newDataEqualNameSameProduct = {
      id: model.id,
      name: 'equal name',
      price: 500,
      quantity: 20,
    }

    const newDataEqualNameOtherProduct = {
      id: model.id,
      name: 'equal name 2',
      price: 500,
      quantity: 20,
    }

    await expect(
      sut.execute(newDataEqualNameSameProduct),
    ).rejects.toBeInstanceOf(ConflictError)
    await expect(
      sut.execute(newDataEqualNameOtherProduct),
    ).rejects.toBeInstanceOf(ConflictError)
  })
})
