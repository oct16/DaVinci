import Koa from 'koa'
import cors from '@koa/cors'

const whitelist = ['http://localhost:4000', 'http://localhost:3999', 'http://148.70.114.23:8080']

function checkOriginAgainstWhitelist(ctx) {
    const requestOrigin = ctx.accept.headers.origin
    if (!whitelist.includes(requestOrigin)) {
        return ctx.throw(`🙈 ${requestOrigin} is not a valid origin`)
    }
    return requestOrigin
}

export default function productionEnv(app: Koa) {
    const isProduction = process.env.NODE_ENV === 'production'
    if (isProduction) {
        app.use(cors({ credentials: true, origin: checkOriginAgainstWhitelist }))
    }
}
