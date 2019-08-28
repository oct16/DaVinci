import { FindManyOptions, Repository } from 'typeorm'
import Koa from 'koa'
export interface PaginationOptions<Entity> extends FindManyOptions<Entity> {
    /**
     * Specify the offset starting from 0
     */
    page?: number

    /**
     * size (paginated) - max number of entities should be shown
     */
    size?: number
}

export interface Pager<Entity> {
    size: number
    page: number
    pages: number
    total: number
    data: Entity[]
}

export async function findByPagination<Entity>(
    repository: Repository<Entity>,
    options: PaginationOptions<Entity>
): Promise<Pager<Entity>> {
    const ctx = this as Koa.Context
    const { page, size } = ctx.query
    return await Pagination(repository, { ...options, page, size })
}

export async function Pagination<Entity>(
    repository: Repository<Entity>,
    options: PaginationOptions<Entity>
): Promise<Pager<Entity>> {
    const page = options.page || 1
    const size = options.size || 10
    const findOpt = {
        ...options,
        skip: (page - 1) * size,
        take: size
    }

    const [data, total] = await repository.findAndCount(findOpt)

    return {
        data,
        total,
        page,
        pages: Math.ceil(total / size),
        size: data.length
    }
}
