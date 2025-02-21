import { UserModel } from '@/users/domain/models/users.model'
import { faker } from '@faker-js/faker' // Import faker library
import { randomUUID } from 'node:crypto'

export function UsersDataBuilder(props: Partial<UserModel>): UserModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    avatar: props.avatar ?? faker.image.avatar(),
    created_at: props.created_at ?? new Date(),
    updated_at: props.created_at ?? new Date(),
  }
}
