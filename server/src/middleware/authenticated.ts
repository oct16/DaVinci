import Koa from 'koa'

export const checkExamineeToken = async function(ctx: Koa.Context, next: Function) {
    const { token } = ctx.session!

    if (!token) {
        ctx.forbidden('No Token')
        return
    }

    // const expireTime = 1 * 60 * 60 * 1e3 // 1hour
    const expireTime = 30000 // 1hour

    const isExpire = +new Date() - +new Date(token.updatedAt) > expireTime
    if (isExpire) {
        ctx.forbidden({ error: 'Token Expired' })
        ;(ctx.session as any).token = null
        return
    }
    await next()
}

export const checkUserToken = async function(ctx: Koa.Context, next: Function) {
    const { user } = ctx.session

    if (!user) {
        ctx.unauthorized('User No Login')
        return
    }

    const expireTime = 10 * 24 * 60 * 60 * 1e3 // 10days
    const isExpire = +new Date() - +new Date(user.lastLoginAt) > expireTime
    if (isExpire) {
        ctx.unauthorized({ error: 'User Token is Expired, You Need to log back in' })
        ;(ctx.session as any).user = null
        return
    }

    await next()
}
