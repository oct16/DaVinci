import Koa from 'koa'
import cors from '@koa/cors'
import { WHITE_LIST } from '../configs/white-list'

function checkOriginAgainstWhitelist(ctx) {
    const requestOrigin = ctx.accept.headers.origin
    if (!WHITE_LIST.includes(requestOrigin)) {
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
