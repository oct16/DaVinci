const NODE_ENV = process.env.NODE_ENV
const SERVER_PATH = 'https://fetest.online'

const isProd = NODE_ENV === 'production'

const API_BASE_RUL = isProd ? `${SERVER_PATH}/api` : '/api'

export const ENV = {
    API_BASE_RUL
}
