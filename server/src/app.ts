//
//   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
// ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
// ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
// ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
// ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
//  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
//  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
//  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
//           ░     ░ ░      ░  ░
//                 ░

import 'reflect-metadata'
import Koa from 'koa'
import CatchError from './middleware/catch-error'
import Logger from './middleware/logger'
import routers from './routers'
import views from 'koa-views'
import session from './middleware/session'
import bodyParser from 'koa-bodyparser'
import { databaseInitializer } from './orm'
import { contextExtend } from './utils/context-extends'
import productionEnv from './utils/production.env'

const bootstrap = async () => {
    await databaseInitializer()
    const app: Koa = new Koa()
    contextExtend(app)
    productionEnv(app)
    app.use(Logger)
    app.use(views(__dirname + '/views', { extension: 'pug' }))
    app.use(bodyParser())
    app.use(session(app))
    app.use(routers)
    app.use(CatchError)
    return app
}

export default bootstrap()
