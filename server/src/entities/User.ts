import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Post } from './Post'
import { Comment } from './Comment'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ type: 'text' })
  username?: string

  @Column({ type: 'text' })
  password!: string

  @Field()
  @Column({ type: 'text' })
  email?: string

  @Field()
  @Column({ type: 'number' })
  userId!: number

  @Field()
  @Column({ type: 'text' })
  displayName!: string

  @Field()
  @Column({ type: 'text' })
  bio?: string

  @Field()
  @Column({ type: 'number' })
  points!: number

  @Field()
  @Column({ type: 'text' })
  profilePic!: string

  @Field()
  @Column()
  posts?: Post[]

  @Field()
  @Column()
  comments?: Comment[]

  @Field()
  @Column()
  upVotes?: User[]

  @Field()
  @Column()
  downVotes?: User[]

  @Field()
  @Column()
  followers?: User[]

  @Field()
  @Column()
  following?: User[]

  @Field()
  @Column()
  savedPosts?: Post[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date = new Date()
}
