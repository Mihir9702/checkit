import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { User } from './User'
import { Comment } from './Comment'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  owner!: number

  @Field()
  @Column({ type: 'text' })
  title!: string

  @Field()
  @Column({ type: 'text' })
  content!: string

  @Field()
  @Column()
  tags?: string[]

  @Field()
  @Column()
  upVotes?: User[]

  @Field()
  @Column()
  downVotes?: User[]

  @Field()
  @Column()
  comments?: Comment[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date = new Date()
}
