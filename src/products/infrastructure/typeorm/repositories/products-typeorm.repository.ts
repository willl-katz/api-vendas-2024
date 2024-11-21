import { SearchInput, SearchOutput } from "@/common/domain/repositories/repository.interface";
import { ProductModel } from "@/products/domain/models/products.model";
import { CreateProductProps, ProductId, ProductsRepository } from "@/products/domain/repositories/products.repository";
import { Repository } from "typeorm";
import { Product } from "../entities/products.entities";
import { dataSource } from "@/common/infrastructure/typeorm";

export class ProductsTypeormRepository implements ProductsRepository {
  sortableFields: string[] = ['name', 'create_at'];
  productsRepository: Repository<Product>

  constructor() {
    this.productsRepository = dataSource.getRepository(Product)
  }
  findByName(name: string): Promise<ProductModel> {
    throw new Error("Method not implemented.");
  }
  findAllByIds(productsIds: ProductId[]): Promise<ProductModel[]> {
    throw new Error("Method not implemented.");
  }
  conflictingName(name: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  create(props: CreateProductProps): ProductModel {
    throw new Error("Method not implemented.");
  }
  insert(model: ProductModel): Promise<ProductModel> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<ProductModel> {
    throw new Error("Method not implemented.");
  }
  update(model: ProductModel): Promise<ProductModel> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    throw new Error("Method not implemented.");
  }

}
