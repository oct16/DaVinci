import HttpStatus, { getStatusText } from 'http-status-codes'
import Koa from 'koa'
import { Token } from '../orm/entity/Token'
import { commonMessage } from './common'
import { User } from '../orm/entity/User'
import { Connection, Repository } from 'typeorm'
import { findByPagination, PaginationOptions } from './pagination'

declare module 'koa' {
    interface Context {
        session: {
            user?: User
            token?: Token | null
            // [key: string]: any
        }
        success: (data?: any) => void
        error: (error?: any) => void
        forbidden: (data?: any) => void
        unauthorized: (data: any) => void
        paramsError: (error?: any) => void
        findByPagination: <Entity>(repository: Repository<Entity>, options: PaginationOptions<Entity>) => Promise<void>
        connection: Connection
    }
}

export const contextExtend = async function(app: Koa) {
    const { context } = app

    context.findByPagination = findByPagination

    context.paramsError = function(error: any) {
        this.status = HttpStatus.BAD_REQUEST
        this.body = commonMessage({
            url: this.URL.href,
            status: this.status,
            message: error || getStatusText(this.status)
        })
    }

    context.error = function(error: any) {
        this.status = HttpStatus.BAD_REQUEST
        this.body = commonMessage({
            url: this.URL.href,
            status: this.status,
            message: error || getStatusText(this.status)
        })
    }

    context.success = function(data?: any) {
        this.status = HttpStatus.OK
        this.body = data || null
    }

    context.forbidden = function(data: any) {
        this.status = HttpStatus.FORBIDDEN
        this.body = commonMessage({
            url: this.URL.href,
            status: this.status,
            message: data
        })
    }

    context.unauthorized = function(data: any) {
        this.status = HttpStatus.UNAUTHORIZED
        this.body = commonMessage({
            url: this.URL.href,
            status: this.status,
            message: data
        })
    }
}
