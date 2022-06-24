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
import { generateNumber, validate } from '../utils'
import {
  adjectives,
  colors,
  Config,
  uniqueNamesGenerator
} from 'unique-names-generator'
import { isAuth } from '../middleware/isAuth'

@InputType()
class UserInput {
  @Field()
  username!: string

  @Field()
  email!: string

  @Field()
  password!: string
}

@Resolver()
export class UserResolver {
  // * signup
  @Mutation(() => User)
  async signup(
    @Arg('params') params: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const foundUser = await User.findOne({
      where: { username: params.username.toLowerCase() }
    })

    if (foundUser) throw new Error('Username already taken')

    const {
      username: usernameValidation,
      email: emailValidation,
      password: passwordValidation
    } = validate

    usernameValidation(params.username)
    emailValidation(params.email)
    passwordValidation(params.password)

    const hashedPassword = await hash(params.password, await genSalt(11))

    const randomId = generateNumber(4)

    const config: Config = {
      dictionaries: [adjectives, colors],
      separator: '_',
      length: 2
    }

    const randomName = uniqueNamesGenerator(config)

    const user = await User.create({
      username: params.username.toLowerCase(),
      password: hashedPassword,
      userId: randomId,
      displayName: randomName
    }).save()

    req.session.userId = user.id

    return user
  }

  // * login
  @Mutation(() => User)
  async login(
    @Arg('params') params: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    if (!params.username) throw new Error('Username not provided')
    if (!params.password) throw new Error('Password not provided')

    const user = await User.findOne({ where: { username: params.username } })

    if (!user) throw new Error('User not found')

    const valid = await compare(params.password, user!.password)

    if (!valid) throw new Error('Invalid username or password')

    req.session.userId = user.id

    return user
  }

  // * logout
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async logout(@Ctx() { req }: MyContext): Promise<boolean> {
    if (!req.session.userId) {
      throw new Error('Not authenticated')
    }

    const handleError = (err: Error) => {
      if (err) throw new Error('Error logging out')
      return false
    }

    req.session.destroy(handleError)

    return true
  }

  // * display name
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateDisplayName(
    @Arg('displayName') displayName: string,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const user = await User.findOne({ where: { id: req.session.userId } })

    if (!user) throw new Error('User not found')

    user.displayName = displayName

    await user.save()

    return user
  }

  // * bio
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateBio(
    @Arg('bio') bio: string,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const user = await User.findOne({ where: { id: req.session.userId } })

    if (!user) throw new Error('User not found')

    user.bio = bio

    await user.save()

    return user
  }
}
