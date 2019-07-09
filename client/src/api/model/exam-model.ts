export interface Question {
    type: string
    question: string
    selects?: Select[]
    code?: Code
    difficulty: number
}
export interface Select {
    value: string
    questionId: number
    question?: Question
}

export interface Code {
    value: string
    language: string
}
