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
export class Channel extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ type: 'text' })
  name!: string

  @Field()
  @Column()
  owner!: User

  @Field()
  @Column()
  admins?: User[]

  @Field()
  @Column()
  posts?: Post[]

  @Field()
  @Column()
  members!: User[]

  @Field()
  @Column()
  upVotes?: User[]

  @Field()
  @Column()
  downVotes?: User[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date = new Date()
}
