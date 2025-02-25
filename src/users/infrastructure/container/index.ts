import { container } from 'tsyringe'

import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { dataSource } from '@/common/infrastructure/typeorm'
import { AuthenticateUserUseCase } from '@/users/application/usecases/authenticate-user.usecase'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { SearchUserUseCase } from '@/users/application/usecases/search-user.usecase'

import { User } from '../typeorm/entities/users.entity'
import { UsersTypeormRepository } from '../typeorm/repositories/users-typeorm.repository'

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultTypeormRepository',
  dataSource.getRepository(User),
)
container.registerSingleton('HashProvider', BcryptjsHashProvider)

// UserCases

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
container.registerSingleton(
  'AuthenticateUserUseCase',
  AuthenticateUserUseCase.UseCase,
)
