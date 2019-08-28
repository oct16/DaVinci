export interface Basics {
    id: number
    createdAt: Date
    updatedAt: Date
}

export interface Pager<Entity> {
    size: number
    page: number
    pages: number
    total: number
    data: Entity[]
}
