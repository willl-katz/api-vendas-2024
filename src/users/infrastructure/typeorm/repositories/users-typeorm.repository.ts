import { inject, injectable } from 'tsyringe'
import { ILike, Repository } from 'typeorm'

import { ConflictError } from '@/common/domain/errors/conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { UserModel } from '@/users/domain/models/users.model'
import {
  CreateUserProps,
  UsersRepository,
} from '@/users/domain/repositories/users.repository'

import { User } from '../entities/users.entity'

@injectable()
export class UsersTypeormRepository implements UsersRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(
    @inject('UsersDefaultTypeormRepository')
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ email })
    if (!user) {
      throw new NotFoundError(`User not found using EMAIL ${email}`)
    }
    return user
  }
  async findByName(name: string): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ name })
    if (!user) {
      throw new NotFoundError(`User not found using NAME ${name}`)
    }
    return user
  }
  async conflictEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email })
    if (user) {
      throw new ConflictError(`Email already used on another user`)
    }
  }
  create(props: CreateUserProps): UserModel {
    return this.usersRepository.create(props)
  }
  async insert(model: UserModel): Promise<UserModel> {
    return await this.usersRepository.save(model)
  }
  async findById(id: string): Promise<UserModel> {
    return await this._get(id)
  }
  async update(model: UserModel): Promise<UserModel> {
    await this._get(model.id)
    await this.usersRepository.update({ id: model.id }, model)
    return model
  }
  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.usersRepository.delete({ id })
  }
  async search(props: SearchInput): Promise<SearchOutput<UserModel>> {
    const dirOps = ['asc', 'desc']

    const validSort = this.sortableFields.includes(props.sort) || false
    const validSortDir = dirOps.includes(props.sort_dir?.toLowerCase()) || false

    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [users, total] = await this.usersRepository.findAndCount({
      // Caso o filter não seja nulo, aplicara um where, onde o nome do user seja de acordo com o nome passado no filtro, igual ou parecido.
      ...(props.filter && { where: { name: ILike(`%${props.filter}%`) } }),
      order: { [orderByField]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: users,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundError(`User not found using ID ${id}`)
    }
    return user
  }
}
