import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm'
import { Question } from './Question'
import { Examinee } from './Examinee'
import { Basics } from './basics'

@Entity()
export class Answer extends Basics {
    @Column({ type: 'text' })
    value: string

    @Column()
    questionId: number

    @ManyToOne(type => Question, question => question.answer)
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question

    @ManyToOne(type => Examinee, e => e.answers)
    @JoinColumn()
    examinee: Examinee
}
