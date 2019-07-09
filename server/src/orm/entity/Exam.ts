import { Entity, OneToMany, ManyToMany, JoinTable, Column } from 'typeorm'
import { Question } from './Question'
import { Basics } from './basics'
import { Token } from './Token'

@Entity()
export class Exam extends Basics {
    @Column()
    name: string

    @Column({
        default: 30 * 60 * 1000
    })
    time: number

    @ManyToMany(type => Question)
    @JoinTable()
    questions: Question[]

    @OneToMany(type => Token, token => token.exam)
    tokens: Token[]
}
