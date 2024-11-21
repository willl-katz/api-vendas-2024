import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ProductsInMemoryRepository } from './products-in-memory.repository'
import { ProductsDataBuilder } from '../../testing/helpers/products-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'

describe('ProductsInMemoryRepository unit tests', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
  })

  describe('findByName', () => {
    it('should throw error when product not found', async () => {
      await expect(() => sut.findByName('fake_name')).rejects.toThrow(
        new NotFoundError(`Product not found using name fake_name`),
      )
      await expect(() => sut.findByName('fake_name')).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('should find a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      const result = await sut.findByName('Curso nodejs')
      expect(result).toStrictEqual(data)
    })
  })

  describe('conflictingName', () => {
    it('should throw error when product found', async () => {
      const data = ProductsDataBuilder({ name: 'Curso nodejs' })
      sut.items.push(data)
      await expect(() => sut.conflictingName('Curso nodejs')).rejects.toThrow(
        new ConflictError(`Name already used on another product`),
      )
      await expect(() =>
        sut.conflictingName('Curso nodejs'),
      ).rejects.toBeInstanceOf(ConflictError)
    })

    it('should not find a product by name', async () => {
      expect.assertions(0)
      await sut.conflictingName('Curso nodejs')
    })
  })

  describe('applyFilter', () => {
    it('should no filter items when filter param is null', async () => {
      const data = ProductsDataBuilder({})
      sut.items.push(data)

      const spyFilterMethod = jest.spyOn(sut.items, 'filter')
      const result = await sut['applyFilter'](sut.items, null)
      expect(spyFilterMethod).not.toHaveBeenCalled()
      expect(result).toStrictEqual(sut.items)
      spyFilterMethod.mockRestore()
    })

    it('should filter the data using filter param', async () => {
      const items = [
        ProductsDataBuilder({ name: 'Test' }),
        ProductsDataBuilder({ name: 'TEST' }),
        ProductsDataBuilder({ name: 'fake' }),
      ]
      sut.items.push(...items)

      const spyFilterMethod = jest.spyOn(sut.items, 'filter')
      let result = await sut['applyFilter'](sut.items, 'TEST')

      expect(spyFilterMethod).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](sut.items, 'test')
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](sut.items, 'no-filter')
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
      expect(result).toHaveLength(0)
      spyFilterMethod.mockRestore()
    })
  })

  describe('applySort', () => {
    it('should sort items by created_at when sort param is null', async () => {
      const newCreateAt = new Date()
      const items = [
        ProductsDataBuilder({ name: 'c', create_at: newCreateAt }),
        ProductsDataBuilder({
          name: 'a',
          create_at: new Date(newCreateAt.getTime() + 100),
        }),
        ProductsDataBuilder({
          name: 'b',
          create_at: new Date(newCreateAt.getTime() + 200),
        }),
      ]
      sut.items.push(...items)

      let result = await sut['applySort'](sut.items, null, null)
      expect(result).toStrictEqual([items[2], items[1], items[0]])
    })

    it('should sort items by name field', async () => {
      const items = [
        ProductsDataBuilder({ name: 'c' }),
        ProductsDataBuilder({
          name: 'a',
        }),
        ProductsDataBuilder({
          name: 'b',
        }),
      ]
      sut.items.push(...items)

      let result = await sut['applySort'](items, 'name', 'desc')
      expect(result).toStrictEqual([items[0], items[2], items[1]])
      result = await sut['applySort'](items, 'name', 'asc')
      expect(result).toStrictEqual([items[1], items[2], items[0]])
    })
  })
})
