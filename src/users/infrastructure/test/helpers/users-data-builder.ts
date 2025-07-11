import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker' // Import faker library

import { UserModel } from '@/users/domain/models/users.model'

export function UsersDataBuilder(props: Partial<UserModel>): UserModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    avatar: props.avatar ?? faker.image.avatar(),
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
