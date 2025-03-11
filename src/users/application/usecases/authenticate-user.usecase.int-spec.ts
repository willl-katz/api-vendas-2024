import 'reflect-metadata'

import { InvalidCredentialsError } from '@/common/domain/errors/invalid-credentials-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { HashProvider } from '@/common/domain/providers/hash.provider'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { UsersDataBuilder } from '@/users/infrastructure/test/helpers/users-data-builder'

import { AuthenticateUserUseCase } from './authenticate-user.usecase'

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
    const props = UsersDataBuilder({})
    await repository.insert({
      ...props,
      password: await hashProvider.generateHash(props.password),
    })
    await expect(
      sut.execute({
        email: 'wrongemail@example.com',
        password: props.password,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
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
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
