import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { Examinee } from './Examinee'
import { Basics } from './basics'
import { Exam } from './Exam'

@Entity()
export class Token extends Basics {
    @Column({
        unique: true
    })
    value: string

    @OneToOne(type => Examinee, examinee => examinee.token)
    @JoinColumn()
    examinee: Examinee

    @ManyToOne(type => Exam, exam => exam.tokens)
    @JoinColumn()
    exam: Exam
}
