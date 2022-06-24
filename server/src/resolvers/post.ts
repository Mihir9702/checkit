import {
  Arg,
  Ctx,
  Field,
  Resolver,
  Mutation,
  InputType,
  UseMiddleware,
  Query
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
  // * Get one post by id
  @Query(() => Post)
  async getPost(@Arg('id') id: number): Promise<Post> {
    const post = await Post.findOne({ where: { id } })

    if (!post) {
      throw new Error('Post not found')
    }

    return post
  }

  // * Get all users posts
  @Query(() => [Post])
  async getUsersPosts(@Arg('userId') userId: number): Promise<Post[]> {
    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
      throw new Error('User not found')
    }

    const posts = await Post.find({ where: { owner: userId } })

    if (!posts) {
      throw new Error('User has no posts')
    }

    return posts
  }

  // * Create a new post
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('params') params: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (req.session.userId) {
      const post = Post.create({
        ...params,
        owner: req.session.userId
      }).save()

      return post
    } else throw new Error('User not found')
  }

  // * Delete a post
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const post = await Post.findOne({ where: { id } })

    if (post) {
      if (post.owner === req.session.userId) {
        await Post.delete({ id })
        return true
      } else throw new Error('You are not the owner of this post')
    } else throw new Error('Post not found')
  }
}
