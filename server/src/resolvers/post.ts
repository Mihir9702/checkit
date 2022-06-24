import {
  Arg,
  Ctx,
  Field,
  Resolver,
  Mutation,
  InputType,
  UseMiddleware
} from 'type-graphql'
import { MyContext } from '../types'
import { User } from '../entities/User'
import { isAuth } from '../middleware/isAuth'
import { Post } from '../entities/Post'

@InputType()
class PostInput {
  @Field()
  owner!: User

  @Field()
  title!: string

  @Field()
  content!: string

  @Field()
  tags?: string[]
}

@Resolver()
export class PostResolver {
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('params') params: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const user = await User.findOne({ where: { id: req.session.userId } })

    if (user) {
      const post = Post.create({
        ...params,
        owner: user
      }).save()

      return post
    } else throw new Error('User not found')
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const post = await Post.findOne({ where: { id } })

    if (post) {
      if (post.owner.id === req.session.userId) {
        await Post.delete({ id })
        return true
      } else throw new Error('You are not the owner of this post')
    } else throw new Error('Post not found')
  }
}
