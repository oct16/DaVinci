import { Entity, OneToMany, OneToOne, Column, JoinColumn } from 'typeorm'
import { Basics } from './basics'
import { Answer } from './Answer'
import { Token } from './Token'

@Entity()
export class Examinee extends Basics {
    @Column()
    name: string

    @OneToMany(type => Answer, answer => answer.question)
    answers: Answer[]

    @OneToOne(type => Token, token => token.examinee)
    token: Token

    @Column({
        default: 0
    })
    switchCount: number
}
