import { container } from "tsyringe"
import { UsersTypeormRepository } from "../typeorm/repositories/users-typeorm.repository"
import { User } from "../typeorm/entities/users.entity"
import { dataSource } from "@/common/infrastructure/typeorm"
import { CreateUserUseCase } from "@/users/application/usecases/create-user.usecase"
import { BcryptjsHashProvider } from "@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider"
import { SearchUserUseCase } from "@/users/application/usecases/search-user.usecase"

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultTypeormRepository',
  dataSource.getRepository(User),
)
container.registerSingleton('HashProvider', BcryptjsHashProvider)

// UserCases

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
