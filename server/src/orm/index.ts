import 'reflect-metadata'
import { createConnection, getConnectionOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export const databaseInitializer = async () => {
    const connectionOption = await getConnectionOptions()

    return createConnection(Object.assign(connectionOption, { namingStrategy: new SnakeNamingStrategy() }))
        .then(async connection => {
            console.info('connect: ', connectionOption['host'])
        })
        .catch(error => console.log(error))
}
