import { HttpMethod, HttpOption } from '@/utils/rest'
import { Question } from '../model/exam-model'

export class ExamAPIConstant {
    answer = (answers: { [key: number]: string }): HttpOption => ({
        url: '/exam/answer',
        method: HttpMethod.POST,
        data: { answers }
    })
    examineeAnswer = (examId: number): HttpOption => ({
        url: `/exam/examinee/${examId}/answer`,
        method: HttpMethod.GET
    })
    register = (examineeName: string, token: string): HttpOption => ({
        url: '/exam/register',
        method: HttpMethod.POST,
        data: { examineeName, token }
    })

    createToken(examId: number): HttpOption {
        return {
            url: '/exam/create-token',
            method: HttpMethod.POST,
            data: { examId }
        }
    }
    putToken(tokenId: number, data: { examId: number }): HttpOption {
        return {
            url: `/exam/token/${tokenId}`,
            method: HttpMethod.PUT,
            data
        }
    }
    tokens(): HttpOption {
        return {
            url: '/exam/tokens',
            method: HttpMethod.GET
        }
    }

    getExamineeToken(): HttpOption {
        return {
            url: '/exam/token',
            method: HttpMethod.GET
        }
    }

    questions(): HttpOption {
        return {
            url: '/exam/questions',
            method: HttpMethod.GET
        }
    }

    exams(): HttpOption {
        return {
            url: '/exam/all',
            method: HttpMethod.GET
        }
    }
    getExam(examId: number): HttpOption {
        return {
            url: `/exam/${examId}`,
            method: HttpMethod.GET
        }
    }
    examPreview(examId: number): HttpOption {
        return {
            url: `/exam/preview/${examId}`,
            method: HttpMethod.GET
        }
    }
    putExam(examId: number, data: { name: string; ids: number[] }): HttpOption {
        return {
            url: `/exam/${examId}`,
            method: HttpMethod.PUT,
            data
        }
    }
    createExam(data: { questions: string[]; name: string }): HttpOption {
        return {
            url: `/exam/create`,
            method: HttpMethod.POST,
            data
        }
    }

    putQuestion(id: number, data: any): HttpOption {
        return {
            url: `/exam/question/${id}`,
            method: HttpMethod.PUT,
            data
        }
    }

    createQuestion(form: Question): HttpOption {
        return {
            url: `/exam/create-question`,
            method: HttpMethod.POST,
            data: form
        }
    }

    selections(): HttpOption {
        return {
            url: '/exam/selections',
            method: HttpMethod.GET
        }
    }
    questionSelects(questionId: number): HttpOption {
        return {
            url: `/exam/selects/${questionId}`,
            method: HttpMethod.GET
        }
    }
    putSelection(id: number, data: any): HttpOption {
        return {
            url: `/exam/selection/${id}`,
            method: HttpMethod.PUT,
            data
        }
    }
    addSelection(questionId: number, value: string): HttpOption {
        return {
            url: `/exam/selection`,
            method: HttpMethod.POST,
            data: { questionId, value }
        }
    }
    examinees(): HttpOption {
        return {
            url: `/exam/examinees`,
            method: HttpMethod.GET
        }
    }
    progress(): HttpOption {
        return {
            url: `/exam/progress`,
            method: HttpMethod.GET
        }
    }
}
