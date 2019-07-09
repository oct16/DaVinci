import { Entity, Column } from 'typeorm'
import { Basics } from './basics'

export enum CodeEnumTypes {
    'JAVASCRIPT' = 'JAVASCRIPT',
    'TYPESCRIPT' = 'TYPESCRIPT'
}

@Entity()
export class Code extends Basics {
    @Column()
    value: string

    @Column({
        default: CodeEnumTypes.TYPESCRIPT,
        type: 'enum',
        enum: CodeEnumTypes
    })
    language: string
}
