import { inject, injectable } from 'tsyringe'
import { ILike, In, Repository } from 'typeorm'

import { ConflictError } from '@/common/domain/errors/conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { ProductModel } from '@/products/domain/models/products.model'
import {
  CreateProductProps,
  ProductId,
  ProductsRepository,
} from '@/products/domain/repositories/products.repository'

import { Product } from '../entities/products.entities'

@injectable()
export class ProductsTypeormRepository implements ProductsRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(
    @inject('ProductsDefaultTypeormRepository')
    private productsRepository: Repository<Product>,
  ) {}
  async findByName(name: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ name })
    if (!product) {
      throw new NotFoundError(`Product not found using NAME ${name}`)
    }
    return product
  }
  async findAllByIds(productsIds: ProductId[]): Promise<ProductModel[]> {
    const ids = productsIds.map(productsId => productsId.id)
    // A função In() tem como objetivo retornar todos os registros onde o id seja igual os ids dos produtos registrados
    const productsFound = await this.productsRepository.find({
      where: { id: In(ids) },
    })
    return productsFound
  }
  async conflictingName(name: string): Promise<void> {
    const product = await this.productsRepository.findOneBy({ name })
    if (product) {
      throw new ConflictError(`Name already used by another product`)
    }
  }
  create(props: CreateProductProps): ProductModel {
    return this.productsRepository.create(props)
  }
  insert(model: ProductModel): Promise<ProductModel> {
    return this.productsRepository.save(model)
  }
  findById(id: string): Promise<ProductModel> {
    return this._get(id)
  }
  async update(model: ProductModel): Promise<ProductModel> {
    await this._get(model.id)
    await this.productsRepository.update({ id: model.id }, model)
    return model
  }
  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.productsRepository.delete({ id })
  }
  async search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    const dirOps = ['asc', 'desc']
    const validSort = this.sortableFields.includes(props.sort) || false
    const validSortDir = dirOps.includes(props.sort_dir?.toLowerCase()) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [products, total] = await this.productsRepository.findAndCount({
      // Caso o filter não seja nulo, aplicara um where, onde o nome do produto seja de acordo com o nome passado no filtro, igual ou parecido.
      ...(props.filter && { where: { name: ILike(`%${props.filter}%`) } }),
      order: { [orderByField]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: products,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundError(`Product not found using ID ${id}`)
    }
    return product
  }
}
