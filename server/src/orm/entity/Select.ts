import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm'
import { Question } from './Question'
import { Basics } from './basics'

@Entity()
export class Select extends Basics {
    @Column({ type: 'text' })
    value: string

    @Column({ type: 'int', nullable: true })
    questionId: number

    @ManyToOne(type => Question, question => question.selects)
    @JoinColumn({ name: 'question_id' })
    question: Question
}
