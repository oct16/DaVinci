import Router from 'koa-router'
import controllers from '../controllers'
import { checkUserToken } from '../middleware/authenticated'

const router = new Router()
router.prefix('/user')
router.post('/login', controllers.user.login)
router.post('/logout', checkUserToken, controllers.user.logout)

router.get('/', controllers.user.getUser)
router.post('/', controllers.user.createUser)
router.get('/all', checkUserToken, controllers.user.getUsers)
router.put('/:userId', checkUserToken, controllers.user.putUser)

export default router
