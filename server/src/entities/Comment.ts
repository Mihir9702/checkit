/* eslint-disable no-use-before-define */
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
import { Post } from './Post'

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ type: 'text' })
  text!: string

  @Field()
  @Column()
  owner!: User

  @Field()
  @Column()
  post!: Post

  @Field()
  @Column()
  upVotes!: User[]

  @Field()
  @Column()
  downVotes!: User[]

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
