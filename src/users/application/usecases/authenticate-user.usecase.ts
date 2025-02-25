import { inject, injectable } from 'tsyringe'

import { InvalidCredentialsError } from '@/common/domain/errors/invalid-credentials-error'
import { HashProvider } from '@/common/domain/providers/hash.provider'
import { UsersRepository } from '@/users/domain/repositories/users.repository'

import { UserOutput } from '../dto/user-output.dto'

export namespace AuthenticateUserUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
      @inject('HashProvider')
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.email || !input.password) {
        throw new InvalidCredentialsError('Invalid credentials')
      }

      const user = await this.usersRepository.findByEmail(input.email)

      const passwordMatch = await this.hashProvider.compareHash(
        input.password,
        user.password,
      )

      if (!passwordMatch) {
        throw new InvalidCredentialsError('Invalid credentials')
      }

      return user
    }
  }
}
