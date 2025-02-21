import { ConflictError } from '@/common/domain/errors/conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory/in-memory.repository'
import { UserModel } from '@/users/domain/models/users.model'
import { UsersRepository } from '@/users/domain/repositories/users.repository'

export class UsersInMemoryRepository
  extends InMemoryRepository<UserModel>
  implements UsersRepository
{
  sortableFields: string[] = ['name', 'email', 'created_at']

  async findByEmail(email: string): Promise<UserModel> {
    const model = await this.items.find(item => item.email === email)
    if (!model) {
      throw new NotFoundError(`User not found using email ${email}`)
    }
    return model
  }
  async findByName(name: string): Promise<UserModel> {
    const model = await this.items.find(item => item.name === name)
    if (!model) {
      throw new NotFoundError(`User not found using name ${name}`)
    }
    return model
  }
  async conflictEmail(email: string): Promise<void> {
    const user = await this.items.find(item => item.email === email)
    if (user) {
      throw new ConflictError(`Email already used on another user`)
    }
  }

  protected async applyFilter(
    items: UserModel[],
    filter: string | null,
  ): Promise<UserModel[]> {
    if (!filter) return items
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: UserModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<UserModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }
}
