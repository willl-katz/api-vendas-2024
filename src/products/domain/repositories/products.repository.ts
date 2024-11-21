import { ProductModel } from './../models/products.model';
import { RepositoryInterface } from './../../../common/domain/repositories/repository.interface';

export type ProductId = {
  id: string;
}

export type CreateProductProps = {
  id: string
  name: string
  price: number
  quantity: number
  create_at: Date
  update_at: Date
}

export interface ProductsRepository
  extends RepositoryInterface<ProductModel, CreateProductProps> {
  findByName(name: string): Promise<ProductModel>
  findAllByIds(productsIds: ProductId[]): Promise<ProductModel[]>
  conflictingName(name: string): Promise<void>
}
