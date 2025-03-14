import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker' // Import faker library

import { ProductModel } from '@/products/domain/models/products.model'

export function ProductsDataBuilder(
  props: Partial<ProductModel>,
): ProductModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.commerce.productName(),
    price:
      props.price ??
      Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
    quantity: props.quantity ?? 10,
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
