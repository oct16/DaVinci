import Router from 'koa-router'
import controllers from '../controllers'
import { checkUserToken } from '../middleware/authenticated'

const { exam } = controllers
const router = new Router()
router.prefix('/exam')

router.get('/variables', exam.variables)

router.post('/register', exam.register)
router.get('/examinees', exam.examinees)
router.get('/:examId(\\d+)', exam.checkTokenForExam, exam.checkTokenIfExpired, exam.exam)
router.get('/progress', exam.progress)
router.post('/answer', exam.answer)
router.get('/examinee/:examineeId(\\d+)/answer', exam.examineeAnswer)

router.put('/:examId(\\d+)', checkUserToken, exam.putExam)
router.get('/all', checkUserToken, exam.allExam)
router.get('/preview/:examId(\\d+)', checkUserToken, exam.examPreview)
router.post('/create', checkUserToken, exam.createExam)

router.post('/create-question', checkUserToken, exam.createQuestion)
router.get('/questions', checkUserToken, exam.getQuestions)
router.put('/question/:questionId', exam.putQuestion)

router.get('/selections', checkUserToken, exam.getSelections)
router.get('/selects/:questionId(\\d+)', checkUserToken, exam.getSelectsByQuestionId)
router.put('/selection/:selectionId', checkUserToken, exam.putSelection)
router.post('/selection', checkUserToken, exam.createSelection)

router.post('/create-token', checkUserToken, exam.createToken)
router.get('/tokens', checkUserToken, exam.tokens)
router.put('/token/:tokenId(\\d+)', checkUserToken, exam.putToken)

export default router
