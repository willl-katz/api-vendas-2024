import 'reflect-metadata'

import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { ConflictError } from '@/common/domain/errors/conflict-error'
import { HashProvider } from '@/common/domain/providers/hash.provider'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { UsersDataBuilder } from '@/users/infrastructure/test/helpers/users-data-builder'

import { CreateUserUseCase } from './create-user.usecase'

describe('CreateUser', () => {
  let sut: CreateUserUseCase.UseCase
  let repository: UsersRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new CreateUserUseCase.UseCase(repository, hashProvider)
  })

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UsersDataBuilder({})

    const result = await sut.execute(props)

    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not be possible to register a user with the name of another user', async () => {
    const props = UsersDataBuilder({ name: 'SameName' })

    await sut.execute(props)
    expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('should encrypt the users password when registering', async () => {
    const props = UsersDataBuilder({ password: 'testPass123' })
    const result = await sut.execute(props)

    const isPasswordCorrectlyHashed = await hashProvider.compareHash(
      'testPass123',
      result.password,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should throws error when name not provided', async () => {
    const props = UsersDataBuilder({ name: null })

    expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throws error when email not provided', async () => {
    const props = UsersDataBuilder({ email: null })

    expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throws error when password not provided', () => {
    const props = UsersDataBuilder({ password: null })

    expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
})
