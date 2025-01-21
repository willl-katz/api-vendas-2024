import { testDataSource } from '@/common/infrastructure/typeorm/test/data-source'
import { ProductsTypeormRepository } from './products-typeorm.repository'
import { Product } from '../entities/products.entities'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'
import { ProductsDataBuilder } from '../../testing/helpers/products-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { ProductModel } from '@/products/domain/models/products.model'

describe('ProductsTypeormRepository integration tests', () => {
  let ormRepository: ProductsTypeormRepository
  let typeormEntityManager: any

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })
  afterAll(async () => {
    await testDataSource.destroy()
  })
  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM products')
    ormRepository = new ProductsTypeormRepository(
      typeormEntityManager.getRepository(Product),
    )
  })

  describe('findById', () => {
    it('should generate an error when the product is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${id}`),
      )
    })

    it('should finds a product by id', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      const result = await ormRepository.findById(product.id)
      expect(result.id).toEqual(product.id)
      expect(result.name).toEqual(product.name)
    })
  })

  describe('create', () => {
    it('should create a new product object', () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const result = ormRepository.create(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('insert', () => {
    it('should insert a new product', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const result = await ormRepository.insert(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('update', () => {
    it('should generate an error when the product is not found', async () => {
      const data = ProductsDataBuilder({})
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${data.id}`),
      )
    })

    it('should update a product', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      product.name = 'nome atualizado'

      const result = await ormRepository.update(product)
      expect(result.name).toEqual('nome atualizado')
    })
  })

  describe('delete', () => {
    it('should generate an error when the product is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${id}`),
      )
    })

    it('should delete a product', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      product.name = 'nome atualizado'
      await ormRepository.delete(product.id)

      const result = await testDataSource.manager.findOneBy(Product, {
        id: data.id,
      })
      expect(result).toBeNull()
    })
  })

  describe('findByName', () => {
    it('should generate an error when the product is not found', async () => {
      const name = 'Product Name'
      await expect(ormRepository.findByName(name)).rejects.toThrow(
        new NotFoundError(`Product not found using NAME ${name}`),
      )
    })

    it('should finds a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findByName(product.name)
      expect(result.name).toEqual('Product 1')
    })
  })

  describe('conflictingName', () => {
    it('should generate an error when the product found', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      await expect(ormRepository.conflictingName(data.name)).rejects.toThrow(
        new ConflictError(`Name already used by another product`),
      )
    })
  })

  describe('search', () => {
    it('should apply only pagination when the other params are null', async () => {
      const arrange = Array(16).fill(ProductsDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(Product, arrange)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: 'fake',
        sort_dir: null,
        filter: null,
      })

      expect(result.total).toEqual(16)
      expect(result.items.length).toEqual(15)
      expect(result.sort).toEqual('create_at')
    })

    it('should order by create_at DESC when search params are null', async () => {
      const create_at = new Date()
      const models: ProductModel[] = []
      const arrange = Array(16).fill(ProductsDataBuilder({}))
      // Alterando os dados de modo a excluir os ids criados e atualizar as datas de criação para poder ordenadas no teste
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          name: `Product ${index}`,
          create_at: new Date(create_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: 'asc',
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].name).toEqual('Product 15')
      expect(result.items[14].name).toEqual('Product 1')
    })

    it('should apply pagination and sort', async () => {
      const create_at = new Date()
      const models: ProductModel[] = []
      // Definindo a lista de teste, com o detalhe para os nomes que vão servir para a ordenação.
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...ProductsDataBuilder({}),
          name: element,
          create_at: new Date(create_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'ASC',
        filter: null,
      })

      expect(result.items[0].name).toEqual('a')
      expect(result.items[1].name).toEqual('b')
      expect(result.items.length).toEqual(2)

      result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'DESC',
        filter: null,
      })

      expect(result.items[0].name).toEqual('e')
      expect(result.items[1].name).toEqual('d')
      expect(result.items.length).toEqual(2)
    })

    it('should search using filter, sort and paginate', async () => {
      const create_at = new Date()
      const models: ProductModel[] = []
      const values = ['test', 'a', 'TEST', 'd', 'TeSt']
      // Definindo a lista de teste, com o detalhe para os nomes que vão servir para a ordenação.
      values.forEach((element, index) => {
        models.push({
          ...ProductsDataBuilder({}),
          name: element,
          create_at: new Date(create_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Product, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].name).toEqual('test')
      expect(result.items[1].name).toEqual('TeSt')
      expect(result.items.length).toEqual(2)
      expect(result.total).toEqual(3)
    })
  })
})
