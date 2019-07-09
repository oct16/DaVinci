const NODE_ENV = process.env.NODE_ENV
const SERVER_PATH = 'http://148.70.114.23:5000'

const isProd = NODE_ENV === 'production'

const API_BASE_RUL = isProd ? SERVER_PATH : '/api'

export const ENV = {
    API_BASE_RUL
}
