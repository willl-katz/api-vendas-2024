import { ProductModel } from '@/products/domain/models/products.model'
import { faker } from '@faker-js/faker' // Import faker library
import { randomUUID } from 'node:crypto'

export function ProductsDataBuilder(props: Partial<ProductModel>): ProductModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.commerce.productName(),
    price:
      props.price ??
      Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
    quantity: props.quantity ?? 10,
    create_at: props.create_at ?? new Date(),
    update_at: props.update_at ?? new Date(),
  }
}
