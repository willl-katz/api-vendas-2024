import { inject, injectable } from 'tsyringe'

import { UsersRepository } from '@/users/domain/repositories/users.repository'

import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '../dto/pagination-output.dto'
import { SearchInputDto } from '../dto/search-input.dto'
import { UserOutput } from '../dto/user-output.dto'

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
