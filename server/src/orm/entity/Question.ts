import { Entity, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm'
import { Select } from './Select'
import { Basics } from './basics'
import { Code } from './Code'
import { Answer } from './Answer'

export enum QuestionEnums {
    TEXT = 'TEXT',
    SELECT = 'SELECT',
    MULTIPLE_SELECT = 'MULTIPLE_SELECT',
    CODE = 'CODE'
}

@Entity()
export class Question extends Basics {
    @Column({ type: 'enum', enum: QuestionEnums, default: QuestionEnums.TEXT })
    type: string

    @Column({ unique: true, type: 'varchar', length: 255 })
    question: string

    @Column({ type: 'text' })
    questionCode: string

    @OneToMany(type => Select, select => select.question)
    selects: Select[]

    @OneToOne(type => Code)
    @JoinColumn()
    code: Code

    @OneToMany(type => Answer, answer => answer.question)
    answer: Answer

    @Column({
        default: 1
    })
    difficulty: number
}
