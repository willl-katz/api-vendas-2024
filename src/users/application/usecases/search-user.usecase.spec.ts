import 'reflect-metadata'

import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { UsersDataBuilder } from '@/users/infrastructure/test/helpers/users-data-builder'

import { SearchUserUseCase } from './search-user.usecase'

describe('SearchUserUseCase Unit its', () => {
  let sut: SearchUserUseCase.UseCase
  let repository: UsersInMemoryRepository

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    sut = new SearchUserUseCase.UseCase(repository)
  })

  it('should return the users ordered by created_at', async () => {
    const created_at = new Date()
    const items = [
      { ...UsersDataBuilder({}) },
      {
        ...UsersDataBuilder({
          created_at: new Date(created_at.getTime() + 100),
        }),
      },
      {
        ...UsersDataBuilder({
          created_at: new Date(created_at.getTime() + 200),
        }),
      },
    ]
    repository.items = items
    console.log(items)

    const result = await sut.execute({})

    expect(result).toStrictEqual({
      items: [...items].reverse(),
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    })
  })

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      { ...UsersDataBuilder({ name: 'a' }) },
      { ...UsersDataBuilder({ name: 'AA' }) },
      { ...UsersDataBuilder({ name: 'Aa' }) },
      { ...UsersDataBuilder({ name: 'b' }) },
      { ...UsersDataBuilder({ name: 'c' }) },
    ]
    repository.items = items

    let output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[1], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })

    output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })
  })
})
