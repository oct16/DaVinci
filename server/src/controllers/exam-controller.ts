import { Token } from '../orm/entity/Token'
import { getConnection } from 'typeorm'
import crypto from 'crypto'
import { OK } from 'http-status-codes'
import Koa from 'koa'
import { Examinee } from '../orm/entity/Examinee'
import { Question, QuestionEnums } from '../orm/entity/Question'
import { Select } from '../orm/entity/Select'
import { Exam } from '../orm/entity/Exam'
import { Code, CodeEnumTypes } from '../orm/entity/Code'
import { Answer } from '../orm/entity/Answer'
import _ from 'lodash'
import compose from 'koa-compose'

type ContextMethod = (ctx: Koa.Context & any, next: Function) => Promise<void>

export interface ExamControllerMethods {
    register: ContextMethod
    validToken: ContextMethod

    examinees: ContextMethod
    variables: ContextMethod

    createToken: ContextMethod
    checkTokenForExam: ContextMethod
    checkTokenIfExpired: ContextMethod
    progress: ContextMethod
    tokens: ContextMethod
    putToken: ContextMethod

    getQuestions: ContextMethod
    createQuestion: ContextMethod
    putQuestion: ContextMethod

    getSelections: ContextMethod
    getSelectsByQuestionId: ContextMethod
    putSelection: ContextMethod
    createSelection: ContextMethod

    switchEvent: compose.Middleware<any>
    getExam: compose.Middleware<any>
    validExam: compose.Middleware<any>
    createExam: ContextMethod
    allExam: ContextMethod
    putExam: ContextMethod
    examPreview: ContextMethod

    answer: ContextMethod
    examineeAnswer: ContextMethod
}

class ExamController implements ExamControllerMethods {
    constructor() {}

    variables = async (ctx: Koa.Context, next: Function) => {
        ctx.success({
            session: ctx.session
        })

        await next()
    }

    examineeAnswer = async (ctx: Koa.Context, next: Function) => {
        const { examineeId } = ctx.params
        const exam = await getConnection()
            .getRepository(Exam)
            .findOne({
                where: {
                    token: {
                        examinee: {
                            id: examineeId
                        }
                    }
                }
            })
        const examinee = await getConnection()
            .getRepository(Examinee)
            .findOne({
                where: {
                    id: examineeId
                }
            })
        const answers = await getConnection()
            .getRepository(Answer)
            .createQueryBuilder('answer')
            .where('examinee.id = :examineeId', { examineeId })
            .leftJoinAndSelect('answer.question', 'question')
            .leftJoinAndSelect('question.selects', 'selects')
            .leftJoinAndSelect('answer.examinee', 'examinee')
            .getMany()

        ctx.success({ exam, examinee, answers })
        await next()
    }

    answer = async (ctx: Koa.Context, next: Function) => {
        const { answers } = ctx.request.body

        const token = ctx.session.token

        if (!token || !token.exam.id) {
            ctx.forbidden('Token Invalid')
            return
        }

        const findAnswer = await getConnection()
            .getRepository(Answer)
            .find({
                where: {
                    examinee: {
                        id: token.examinee.id
                    }
                }
            })

        if (findAnswer && findAnswer.length) {
            ctx.forbidden('Answers had submitted')
            return
        }

        if (answers && Object.keys(answers).length) {
            const examinee = await getConnection()
                .getRepository(Examinee)
                .findOne(token.examinee.id)

            const exam = await getConnection()
                .getRepository(Exam)
                .findOne(token.exam.id, {
                    relations: ['questions']
                })
            await getConnection()
                .getRepository(Examinee)
                .save(examinee!)

            Object.keys(answers).forEach(async key => {
                const value = answers[key]

                if (value) {
                    const question = await getConnection()
                        .getRepository(Question)
                        .findOne(key)
                    const answer = new Answer()
                    answer.value = Array.isArray(value) ? value.join('|*_*|') : value.toString()
                    answer.examinee = examinee!
                    answer.question = question!

                    await getConnection()
                        .getRepository(Answer)
                        .save(answer)
                }
            })
            ctx.session.token = null
            ctx.success()
            return
        }

        ctx.forbidden('No Answers')

        await next()
    }

    examinees = async (ctx: Koa.Context, next: Function) => {
        const examinees = await getConnection()
            .getRepository(Examinee)
            .find({
                relations: ['token', 'token.exam', 'answers']
                // order: {
                //     id: 'DESC'
                // }
            })
        ctx.success(examinees)
        await next()
    }
    tokens = async (ctx: Koa.Context, next: Function) => {
        const repo = await getConnection().getRepository(Token)
        const res = await ctx.findByPagination(repo, {
            relations: ['examinee', 'exam'],
            order: {
                id: 'DESC'
            }
        })
        ctx.success(res)
        await next()
    }

    progress = async (ctx: Koa.Context, next: Function) => {
        const token = ctx.session.token
        if (token) {
            const remainTime = this.isExpired(ctx)

            if (remainTime <= 0) {
                ctx.success({ inProgress: false })
                return
            }

            const answers = await getConnection()
                .getRepository(Answer)
                .find({
                    where: {
                        examinee: {
                            id: token.examinee.id
                        }
                    }
                })

            const resp = {
                inProgress: !answers.length,
                examId: token.exam.id,
                remainTime
            }

            ctx.success(resp)
            return
        }

        ctx.success()

        await next()
    }
    // findToken = async (ctx: Koa.Context, next: Function) => {
    //     const { token } = ctx.request.query
    //     const respToken = await getConnection()
    //         .getRepository(Token)
    //         .findOne({
    //             where: {
    //                 value: token
    //             }
    //         })

    //     ctx.success(respToken)
    //     await next()
    // }

    putToken = async (ctx: Koa.Context, next: Function) => {
        const { examId } = ctx.request.body
        const { tokenId } = ctx.params
        const token = await getConnection()
            .getRepository(Token)
            .findOne({
                where: {
                    id: tokenId
                },
                relations: ['exam']
            })

        if (!token) {
            ctx.paramsError('TokenId Error')
            return
        }
        const exam = await getConnection()
            .getRepository(Exam)
            .findOne(examId)

        if (!exam) {
            ctx.paramsError('ExamId Error')
            return
        }

        token.exam.id = examId
        await getConnection()
            .getRepository(Token)
            .save(token)

        ctx.success()
        await next()
    }

    checkTokenForExam = async (ctx: Koa.Context, next: Function) => {
        const token = ctx.session.token
        const { examId } = ctx.params

        if (!token) {
            ctx.paramsError('Token Error')
            return
        }

        if (token.exam.id !== Number(examId)) {
            ctx.forbidden('Invalid Token for this exam')
            return
        }
        await next()
    }

    isExpired = (ctx: Koa.Context) => {
        const token = ctx.session.token!
        const exam = token.exam
        const expireTime = Number(new Date(token.updatedAt)) + Number(exam.time)
        const now = Number(new Date())
        const remainTime = expireTime - now
        return remainTime
    }

    checkTokenIfExpired = async (ctx: Koa.Context, next: Function) => {
        const remainTime = this.isExpired(ctx)

        if (remainTime <= 0) {
            ctx.forbidden('Token is expired')
            return
        }
        await next()
    }

    createExam = async (ctx: Koa.Context, next: Function) => {
        const { questions, name } = ctx.request.body

        if (!questions && !name) {
            ctx.paramsError(`questions and name is required`)
            return
        }
        const records = await getConnection()
            .getRepository(Question)
            .findByIds(questions)

        const recordIds = records.map(r => r.id)

        const noMatches = (questions as number[]).filter(qid => {
            return !recordIds.includes(qid)
        })

        if (noMatches.length) {
            ctx.paramsError(`Questions ids error for: [${noMatches.toString()}]`)
            return
        }

        const exam = new Exam()
        exam.questions = records
        exam.name = name
        await getConnection()
            .getRepository(Exam)
            .save(exam)

        ctx.success()
        await next()
    }

    findExam = async (ctx: Koa.Context, next: Function) => {
        const { examId } = ctx.params
        const exam = await getConnection()
            .getRepository(Exam)
            .findOne({
                where: {
                    id: examId
                },
                relations: ['questions', 'questions.code', 'questions.selects']
            })

        if (!exam) {
            ctx.paramsError('Exam not found')
            return
        }

        ctx.state.exam = exam
        await next()
    }

    validExam: compose.Middleware<Koa.ParameterizedContext<any, Koa.Context>> = compose([
        this.findExam,
        async (ctx: Koa.Context, next: Function) => {
            const { code } = ctx.request.body
            if (!code) {
                ctx.paramsError('Code is required')
                return
            }
            const token = await getConnection()
                .getRepository(Token)
                .findOne({
                    where: {
                        value: code
                    }
                })

            if (!token) {
                ctx.paramsError('Code error')
                return
            }
            const exam: Exam = ctx.state.exam
            if (!exam) {
                ctx.paramsError('Exam not found')
                return
            }
            ctx.success({ name: exam.name, questionCount: exam.questions.length, time: exam.time })
        }
    ])

    switchEvent = async (ctx: Koa.Context, next: Function) => {
        const lives = 5
        const examinee = await getConnection()
            .getRepository(Examinee)
            .findOne(ctx.session.token!.examinee.id)

        if (examinee) {
            const switchCount = examinee.switchCount
            examinee.switchCount = switchCount + 1
            if (examinee.switchCount > lives) {
                ctx.error('switchCount exceed than limit')
                ctx.session.token = null
                return
            }
            await getConnection()
                .getRepository(Examinee)
                .save(examinee)
            ctx.success({ lives, count: examinee.switchCount })
            return
        }
        ctx.error('switchEvent error')
    }

    getExam: compose.Middleware<Koa.ParameterizedContext<any, Koa.Context>> = compose([
        this.findExam,
        async (ctx: Koa.Context, next: Function) => {
            const exam: Exam = ctx.state.exam
            if (!exam) {
                ctx.paramsError('Exam not found')
                return
            }
            // TODO sort by orm

            const token = await getConnection()
                .getRepository(Token)
                .findOne(ctx.session.token!.id, {
                    relations: ['examinee']
                })
            exam.questions = exam.questions.sort((a, b) => a.id - b.id)
            ctx.success({ exam, token })
            await next()
        }
    ])

    examPreview = async (ctx: Koa.Context, next: Function) => {
        const { examId } = ctx.params
        const exam = await getConnection()
            .getRepository(Exam)
            .findOne({
                where: {
                    id: examId
                },
                relations: ['questions', 'questions.code', 'questions.selects']
            })

        if (!exam) {
            ctx.paramsError('Exam not found')
            return
        }

        exam.questions = exam.questions.sort((a, b) => a.id - b.id)
        ctx.success({ exam })
        await next()
    }

    putExam = async (ctx: Koa.Context, next: Function) => {
        const { examId } = ctx.params
        const { ids, name } = ctx.request.body

        const exam = await getConnection()
            .getRepository(Exam)
            .findOne(examId)

        if (exam) {
            const questions = await getConnection()
                .getRepository(Question)
                .findByIds(ids)
            exam.name = name
            exam.questions = questions
            await getConnection()
                .getRepository(Exam)
                .save(exam)
        }

        ctx.success()
        await next()
    }

    allExam = async (ctx: Koa.Context, next: Function) => {
        const exam = await getConnection()
            .getRepository(Exam)
            .find({
                relations: ['questions']
            })

        ctx.success(exam)
        await next()
    }

    putSelection = async (ctx: Koa.Context, next: Function) => {
        const { value, questionId }: any = ctx.request.body
        const { selectionId } = ctx.params
        const select = new Select()
        select.value = value
        select.questionId = questionId
        await getConnection()
            .getRepository(Select)
            .update(selectionId, select)

        ctx.success()
        await next()
    }

    getSelections = async (ctx: Koa.Context, next: Function) => {
        const repo = await getConnection().getRepository(Select)
        const res = await ctx.findByPagination(repo, {
            order: {
                questionId: 'DESC',
                id: 'DESC'
            },
            relations: ['question']
        })
        ctx.success(res)
        await next()
    }

    putQuestion = async (ctx: Koa.Context, next: Function) => {
        const { question, questionCode, difficulty }: any = ctx.request.body
        const { questionId } = ctx.params
        const q = new Question()
        q.question = question
        q.questionCode = questionCode
        q.difficulty = difficulty
        await getConnection()
            .getRepository(Question)
            .update(questionId, q)

        ctx.success()
        await next()
    }

    getQuestions = async (ctx: Koa.Context, next: Function) => {
        const questionsRecord = await getConnection()
            .getRepository(Question)
            .find({
                relations: ['selects'],
                order: {
                    id: 'DESC'
                }
            })

        ctx.success(questionsRecord)

        await next()
    }

    createToken = async (ctx: Koa.Context, next: Function) => {
        const { examId } = ctx.request.body

        if (!examId) {
            ctx.paramsError('ExamId is required')
            return
        }

        const exam = await getConnection()
            .getRepository(Exam)
            .findOne(examId)

        if (!exam) {
            ctx.paramsError('ExamId Error')
            return
        }
        const buf = crypto.randomBytes(2)
        const hex = buf.toString('hex').toUpperCase()
        const token = new Token()
        token.value = hex
        token.exam = exam
        await getConnection().manager.save(token)
        ctx.status = OK
        await next()
    }

    createQuestion = async (ctx: Koa.Context, next: Function) => {
        const { question, type, questionCode, code, difficulty, selects }: any = ctx.request.body
        if (!question || !type || !difficulty) {
            ctx.paramsError()
            return
        }

        const repeatQuestion = await getConnection()
            .getRepository(Question)
            .createQueryBuilder('question')
            .where('question.question = :question', { question })
            .getOne()

        if (repeatQuestion) {
            ctx.paramsError('Question Is Repeat')
            return
        }

        const createQuestionEntity = async function() {
            const questionEntity = new Question()
            questionEntity.difficulty = difficulty
            questionEntity.type = type
            questionEntity.question = question
            questionEntity.questionCode = questionCode

            return await getConnection()
                .getRepository(Question)
                .save(questionEntity)
        }

        const crateSelects = async function() {
            const questionEntity = await createQuestionEntity()
            selects.forEach(async (selectItem: string) => {
                const select = new Select()
                select.value = selectItem
                select.question = questionEntity

                await getConnection()
                    .getRepository(Select)
                    .save(select)
            })
        }

        const createCode = async function() {
            const questionEntity = await createQuestionEntity()
            const codeEntity = new Code()

            questionEntity.code = await getConnection()
                .getRepository(Code)
                .save(codeEntity)

            await getConnection()
                .getRepository(Question)
                .update(questionEntity.id, questionEntity)
        }
        const createDefault = async function() {
            await createQuestionEntity()
        }

        switch (type) {
            case QuestionEnums.SELECT:
            case QuestionEnums.MULTIPLE_SELECT:
                // if (selects && selects.length) {
                // crateSelects()
                // }
                await createDefault()
                break
            case QuestionEnums.CODE:
                if (questionCode) {
                    createCode()
                } else {
                    ctx.paramsError('questionCode is required')
                    return
                }
                break
            default:
                await createDefault()
                break
        }

        ctx.success()
        await next()
    }

    validToken = async (ctx: Koa.Context, next: Function) => {
        const { token: tokenCode } = ctx.request.body
        if (!tokenCode) {
            ctx.forbidden('Invalid Code')
        }
        const token = await getConnection()
            .getRepository(Token)
            .createQueryBuilder('token')
            .where('token.value = :value AND token.examinee IS NULL', { value: tokenCode })
            .leftJoinAndSelect('token.exam', 'exam')
            .getOne()

        if (token) {
            ctx.success({ examId: token.exam.id })
            return
        }
        ctx.forbidden('Invalid Code')
        return
    }

    register = async (ctx: Koa.Context, next: Function) => {
        const { token: tokenCode, name: examineeName } = ctx.request.body

        if (!tokenCode || !examineeName) {
            ctx.forbidden('Invalid Data')
        }

        const token = await getConnection()
            .getRepository(Token)
            .createQueryBuilder('token')
            .where('token.value = :value AND token.examinee IS NULL', { value: tokenCode })
            .getOne()

        if (!token) {
            ctx.forbidden('Invalid Code')
            return
        }

        const examinee = new Examinee()
        examinee.name = examineeName
        await getConnection().manager.save(examinee)

        token.examinee = examinee
        await getConnection()
            .getRepository(Token)
            .update(token.id, token)

        await getConnection()
            .getRepository(Token)
            .findOne(token.id, {
                relations: ['exam', 'examinee']
            })
            .then(_token => {
                ctx.session = { token: _token }
            })

        ctx.success(ctx.session.token)

        await next()
    }

    getSelectsByQuestionId = async (ctx: Koa.Context, next: Function) => {
        const { questionId } = ctx.params

        const selects = await getConnection()
            .getRepository(Select)
            .createQueryBuilder('select')
            .where('select.question_id = :questionId', { questionId })
            .getMany()

        ctx.success(selects)

        await next()
    }

    createSelection = async (ctx: Koa.Context, next: Function) => {
        const { questionId, value } = ctx.request.body

        const select = new Select()
        select.value = value
        select.questionId = questionId
        await getConnection()
            .getRepository(Select)
            .save(select)

        ctx.success()
        await next()
    }
}

export default <ExamControllerMethods>new ExamController()
