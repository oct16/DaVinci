import { UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export abstract class Basics {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn({ nullable: true, default: null })
    updatedAt: Date
}
