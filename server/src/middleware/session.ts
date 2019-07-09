import session from 'koa-session'
import Koa from 'koa'

import compose from 'koa-compose'
import { sessionConfig } from '../configs/session'

export default function(app: Koa) {
    app.keys = ['daVinci']
    return compose([session(sessionConfig, app)])
}
