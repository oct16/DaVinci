import { BaseService } from './base-service'
import { ExamAPIConstant } from '../constant/exam'
import { Observable } from 'rxjs'
import { Question } from '../model/exam-model'

export class ExamService extends BaseService {
    protected examConstant: ExamAPIConstant
    constructor() {
        super()
        this.examConstant = new ExamAPIConstant()
    }

    answer(answers: { [key: number]: string }): Observable<any> {
        return this.request(this.examConstant.answer(answers))
    }

    examineeAnswer(examId: number): Observable<any> {
        return this.request(this.examConstant.examineeAnswer(examId))
    }

    register(name: string, token: string): Observable<any> {
        return this.request(this.examConstant.register(name, token))
    }

    validToken(token: string): Observable<any> {
        return this.request(this.examConstant.validToken(token))
    }

    questions(): Observable<any> {
        return this.request(this.examConstant.questions())
    }

    putQuestion(questionId: number, data: any): Observable<any> {
        return this.request(this.examConstant.putQuestion(questionId, data))
    }

    createQuestion(form: Question): Observable<any> {
        return this.request(this.examConstant.createQuestion(form))
    }

    selections(): Observable<any> {
        return this.request(this.examConstant.selections())
    }

    questionSelects(questionId: number): Observable<any> {
        return this.request(this.examConstant.questionSelects(questionId))
    }

    addSelection(questionId: number, value: string): Observable<any> {
        return this.request(this.examConstant.addSelection(questionId, value))
    }

    putSelection(id: number, data: any): Observable<any> {
        return this.request(this.examConstant.putSelection(id, data))
    }
    exams(): Observable<any> {
        return this.request(this.examConstant.exams())
    }
    getExam(examId: number): Observable<any> {
        return this.request(this.examConstant.getExam(examId))
    }
    validExam(examId: number, code: string): Observable<any> {
        return this.request(this.examConstant.validExam(examId, code))
    }
    examPreview(examId: number): Observable<any> {
        return this.request(this.examConstant.examPreview(examId))
    }
    putExam(examId: number, data: { name: string; ids: number[] }): Observable<any> {
        return this.request(this.examConstant.putExam(examId, data))
    }
    createExam(data: { name: string; questions: string[] }): Observable<any> {
        return this.request(this.examConstant.createExam(data))
    }
    tokens(): Observable<any> {
        return this.request(this.examConstant.tokens())
    }
    createToken(examId: number): Observable<any> {
        return this.request(this.examConstant.createToken(examId))
    }
    putToken(tokenId: number, data: { examId: number }): Observable<any> {
        return this.request(this.examConstant.putToken(tokenId, data))
    }
    examinees(): Observable<any> {
        return this.request(this.examConstant.examinees())
    }

    progress(): Observable<any> {
        return this.request(this.examConstant.progress())
    }

    switchEvent(): Observable<{ lives: number; count: number }> {
        return this.request(this.examConstant.switchEvent())
    }
}
