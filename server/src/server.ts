import App from './app'
import Koa from 'koa'

// Process.env will always be comprised of strings, so we typecast the port to a
// number.
const PORT: number = Number(process.env.PORT) || 5000
const HOST: string = process.env.HOST || 'http://127.0.0.1'

App.then((app: Koa<any, {}>) => {
    app.listen(PORT)

    // tslint:disable-next-line: no-console
    console.info(`server start at ${HOST}:${PORT}`)
}).catch(error => {
    console.log(error)
})
