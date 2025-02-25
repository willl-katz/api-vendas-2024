import 'reflect-metadata'
import { AuthenticateUserUseCase } from './authenticate-user.usecase'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { HashProvider } from '@/common/domain/providers/hash.provider'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UsersDataBuilder } from '@/users/infrastructure/test/helpers/users-data-builder'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { InvalidCredentialsError } from '@/common/domain/errors/invalid-credentials-error'

describe('AuthenticateUserUseCase', () => {
  let sut: AuthenticateUserUseCase.UseCase
  let repository: UsersInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new AuthenticateUserUseCase.UseCase(repository, hashProvider)
  })

  it('should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail')
    const props = UsersDataBuilder({})
    await repository.insert({
      ...props,
      password: await hashProvider.generateHash(props.password),
    })

    const result = await sut.execute({
      email: props.email,
      password: props.password,
    })

    expect(result.email).toEqual(props.email)
    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'wrong-email@example.com',
        password: 'password123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const props = UsersDataBuilder({})
    await repository.insert({
      ...props,
      password: await hashProvider.generateHash(props.password),
    })
    await expect(
      sut.execute({
        email: props.email,
        password: 'wrong password',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
