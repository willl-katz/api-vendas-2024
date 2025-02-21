export type PaginationOutputDto<Item> = {
  items: Item[]
  per_page: number
  total: number
  current_page: number
  last_page: number
}

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: any,
  ): PaginationOutputDto<Item> {
    return {
      items,
      per_page: result.per_page,
      total: result.total,
      current_page: result.current_page,
      last_page: Math.ceil(result.total / result.per_page),
    }
  }
}
