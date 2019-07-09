import Koa from 'koa'

export default async function Logger(ctx: Koa.Context, next: () => Promise<any>) {
    const res = ctx.res

    console.log(`<-- ${ctx.method} ${ctx.url}`)
    await next()

    res.on('finish', () => {
        console.log(`--> ${ctx.method} ${ctx.url}`)
    })
}
