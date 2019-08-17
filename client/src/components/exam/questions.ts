export interface QuestionType {
    question: string
    value?: any
    type?: 'CODE' | 'SELECT' | 'MULTIPLE_SELECT'
    code?: string
    selects?: string[]
    multiple?: boolean
}
