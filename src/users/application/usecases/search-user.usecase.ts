import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dto/user-output.dto'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { SearchInputDto } from '../dto/search-input.dto'
import { PaginationOutputDto, PaginationOutputMapper } from '../dto/pagination-output.dto'

export namespace SearchUserUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<UserOutput>

  @injectable()
  export class UseCase {
      constructor(
        @inject('UsersRepository')
        private usersRepository: UsersRepository,
      ) {}

      async execute(input: Input): Promise<Output> {
        const searchResult = await this.usersRepository.search(input)

        return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
      }
    }
}
