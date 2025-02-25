import { randomUUID } from 'crypto'

import { ConflictError } from '@/common/domain/errors/conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { testDataSource } from '@/common/infrastructure/typeorm/test/data-source'
import { UserModel } from '@/users/domain/models/users.model'

import { UsersDataBuilder } from '../../test/helpers/users-data-builder'
import { User } from '../entities/users.entity'
import { UsersTypeormRepository } from './users-typeorm.repository'

describe('UsersTypeormRepository integration tests', () => {
  let ormRepository: UsersTypeormRepository
  let typeormEntityManager: any

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })
  afterAll(async () => {
    await testDataSource.destroy()
  })
  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM users')
    ormRepository = new UsersTypeormRepository(
      typeormEntityManager.getRepository(User),
    )
  })

  describe('findById', () => {
    it('should generate an error when the user is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`User not found using ID ${id}`),
      )
    })

    it('should finds a user by id', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)
      const result = await ormRepository.findById(user.id)
      expect(result.id).toEqual(user.id)
      expect(result.name).toEqual(user.name)
    })
  })

  describe('created', () => {
    it('should created a new user object', () => {
      const data = UsersDataBuilder({ name: 'User 1' })
      const result = ormRepository.create(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('insert', () => {
    it('should insert a new user', async () => {
      const data = UsersDataBuilder({ name: 'User 1' })
      const result = await ormRepository.insert(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('update', () => {
    it('should generate an error when the user is not found', async () => {
      const data = UsersDataBuilder({})
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`User not found using ID ${data.id}`),
      )
    })

    it('should update a user', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)
      user.name = 'nome atualizado'

      const result = await ormRepository.update(user)
      expect(result.name).toEqual('nome atualizado')
    })
  })

  describe('delete', () => {
    it('should generate an error when the user is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`User not found using ID ${id}`),
      )
    })

    it('should delete a user', async () => {
      const data = UsersDataBuilder({})
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)
      user.name = 'nome atualizado'
      await ormRepository.delete(user.id)

      const result = await testDataSource.manager.findOneBy(User, {
        id: data.id,
      })
      expect(result).toBeNull()
    })
  })

  describe('findByName', () => {
    it('should generate an error when the user is not found', async () => {
      const name = 'User Name'
      await expect(ormRepository.findByName(name)).rejects.toThrow(
        new NotFoundError(`User not found using NAME ${name}`),
      )
    })

    it('should finds a user by name', async () => {
      const data = UsersDataBuilder({ name: 'user 1' })
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)

      const result = await ormRepository.findByName(user.name)
      expect(result.name).toEqual('user 1')
    })
  })

  describe('conflictingEmail', () => {
    it('should generate an error when the user found', async () => {
      const data = UsersDataBuilder({ email: 'conflict@email.com' })
      const user = testDataSource.manager.create(User, data)
      await testDataSource.manager.save(user)

      await expect(ormRepository.conflictEmail(data.email)).rejects.toThrow(
        new ConflictError(`Email already used on another user`),
      )
    })
  })

  describe('search', () => {
    it('should apply only pagination when the other params are null', async () => {
      const arrange = Array(16).fill(UsersDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(User, arrange)
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
      expect(result.sort).toEqual('created_at')
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const models: UserModel[] = []
      const arrange = Array(16).fill(UsersDataBuilder({}))
      // Alterando os dados de modo a excluir os ids criados e atualizar as datas de criação para poder ordenadas no teste
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          name: `user ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(User, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: 'asc',
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].name).toEqual('user 15')
      expect(result.items[14].name).toEqual('user 1')
    })

    it('should apply pagination and sort', async () => {
      const created_at = new Date()
      const models: UserModel[] = []
      // Definindo a lista de teste, com o detalhe para os nomes que vão servir para a ordenação.
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...UsersDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(User, models)
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
      const created_at = new Date()
      const models: UserModel[] = []
      const values = ['test', 'a', 'TEST', 'd', 'TeSt']
      // Definindo a lista de teste, com o detalhe para os nomes que vão servir para a ordenação.
      values.forEach((element, index) => {
        models.push({
          ...UsersDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(User, models)
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
