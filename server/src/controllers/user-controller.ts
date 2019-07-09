import { getConnection } from 'typeorm'
import Koa from 'koa'
import { User } from '../orm/entity/User'
import { aesDecrypt } from '../utils/crypto'

type ContextMethod = (ctx: any, next: Function) => Promise<void>

export interface UserControllerMethods {
    createUser: ContextMethod
    getUser: ContextMethod
    getUsers: ContextMethod
    login: ContextMethod
    logout: ContextMethod
    putUser: ContextMethod
}

class UserController implements UserControllerMethods {
    constructor() {}
    login = async (ctx: Koa.Context, next: Function) => {
        const { name, password }: any = ctx.request.body
        if (!name || !password) {
            ctx.paramsError('Name And Password Is Required')
            return
        }

        const record = await getConnection()
            .getRepository(User)
            .createQueryBuilder('user')
            .where('user.name = :name', { name })
            .addSelect('user.password')
            .getOne()

        if (record) {
            if (aesDecrypt(record.password) !== password) {
                ctx.paramsError('User Password Error')
                return
            } else {
                record.lastLoginAt = new Date()
                ctx.session.user = record
                await getConnection()
                    .getRepository(User)
                    .update(record.id, record)

                delete record.password
                ctx.success(record)
                return
            }
        }
        ctx.paramsError('Not User')
        await next()
    }

    logout = async (ctx: Koa.Context, next: Function) => {
        ;(ctx.session as any).user = null
        ctx.success()
        await next()
    }

    createUser = async (ctx: Koa.Context, next: Function) => {
        const { name, password, role }: any = ctx.request.body
        if (!name || !password) {
            ctx.paramsError('Name and password ss required')
            return
        }
        const user = new User()
        user.name = name
        user.password = password
        user.role = role

        await getConnection().manager.save(user)
        ctx.success()

        await next()
    }

    getUser = async (ctx: Koa.Context, next: Function) => {
        const user = ctx.session.user
        if (!user) {
            ctx.success()
            return
        }

        const userRecord = await getConnection()
            .getRepository(User)
            .findOne(user.id)

        const { id, name, role } = userRecord as User
        ctx.success({ id, name, role })
        await next()
    }

    getUsers = async (ctx: Koa.Context, next: Function) => {
        const record = await getConnection()
            .getRepository(User)
            .createQueryBuilder('user')
            .getMany()

        ctx.success(record)

        await next()
    }

    putUser = async (ctx: Koa.Context, next: Function) => {
        const { name, role }: any = ctx.request.body
        const { userId } = ctx.params
        const user = new User()
        user.role = role
        user.name = name
        await getConnection()
            .getRepository(User)
            .update(userId, user)

        ctx.success()
        await next()
    }
}

export default <UserControllerMethods>new UserController()
