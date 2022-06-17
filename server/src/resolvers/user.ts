/* eslint-disable space-before-function-paren */
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
import { hash, genSalt, compare } from 'bcryptjs'
import { User } from '../entities/User'
import { generateNumber } from '../helpers/rand'
import {
  adjectives,
  colors,
  Config,
  uniqueNamesGenerator
} from 'unique-names-generator'
import { isAuth } from '../middleware/isAuth'

@InputType()
class Input {
  @Field()
  username!: string

  @Field()
  password!: string
}

@Resolver()
export class UserResolver {
  // * signup
  @Mutation(() => User)
  async signup(
    @Arg('params') params: Input,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    // Find if user already exists
    const foundUser = await User.findOne({
      where: { username: params.username.toLowerCase() }
    })

    if (foundUser) throw new Error('Username already taken')

    if (params.username.length < 2) {
      throw new Error('Username must be at least 2 characters')
    }

    if (params.password.length < 4) {
      throw new Error('Password must be at least 4 characters')
    }

    const hashedPassword = await hash(params.password, await genSalt(10))

    const randomId = generateNumber(4)

    const config: Config = {
      dictionaries: [adjectives, colors],
      separator: '-',
      length: 2
    }

    const randomName = uniqueNamesGenerator(config)

    const user = await User.create({
      username: params.username.toLowerCase(),
      password: hashedPassword,
      userId: randomId,
      displayName: randomName
    }).save()

    return user
  }

  // * login
  @Mutation(() => User)
  async login(
    @Arg('params') params: Input,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    if (!params.username) throw new Error('Username not provided')
    if (!params.password) throw new Error('Password not provided')

    const user = await User.findOne({ where: { username: params.username } })

    if (!user) throw new Error('User not found')

    const valid = await compare(params.password, user!.password)

    if (!valid) throw new Error('Invalid username or password')

    return user
  }

  // * logout
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async logout(@Ctx() { req }: MyContext): Promise<boolean> {
    return true
  }
}
