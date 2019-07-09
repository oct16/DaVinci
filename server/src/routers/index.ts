import * as glob from 'glob'
import * as path from 'path'
import compose from 'koa-compose'

//  We need to convert list of separated route in to the one
//  The block below does dynamic import all routers inside current directory.
const routers: any = glob.sync(path.join(__dirname, '*-router.ts')).reduce((previousValue: any[], file: any) => {
    const r = require(path.resolve(file)).default
    return previousValue.concat(r)
}, [])

//  Then put them into one router. Magic here!
export default compose(
    routers.reduce((pre, router) => {
        return pre.concat(router.routes(), router.allowedMethods())
    }, [])
)
