import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate, AfterLoad, BeforeInsert } from 'typeorm'
import { aesEncrypt } from '../../utils/crypto'
import { Basics } from './basics'

export enum UserRoleEnumTypes {
    'ADMIN' = 'ADMIN',
    'SUPER_ADMIN' = 'SUPER_ADMIN'
}

@Entity()
export class User extends Basics {
    @Column({
        unique: true
    })
    name: string

    @Column({ select: false })
    password: string

    @BeforeInsert()
    private encryptPassword(): void {
        this.password = aesEncrypt(this.password)
    }

    @Column({
        type: 'enum',
        enum: UserRoleEnumTypes,
        default: UserRoleEnumTypes.ADMIN
    })
    role: string

    @Column({ nullable: true })
    lastLoginAt: Date
}
