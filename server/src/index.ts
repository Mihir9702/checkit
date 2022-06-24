import 'reflect-metadata'
import 'dotenv-safe/config'
import path from 'path'
import express from 'express'
import db from './connect'
import cors from 'cors'
import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import { __prod__, COOKIE } from './utils'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { MyContext } from './types'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

const main = async () => {
  // Connect to Database
  await db.initialize()
  await db.runMigrations()

  const app = express()

  const RedisStore = connectRedis(session)
  const RedisClient = createClient()

  await RedisClient.connect()

  app.set('trust proxy', __prod__)

  app.use(
    cors({
      origin: 'http://localhost:8888',
      credentials: true
    })
  )

  app.use(
    session({
      name: COOKIE,
      store: new RedisStore({
        client: RedisClient,
        disableTouch: true,
        disableTTL: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.join(__dirname, '/resolvers/*.ts')],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(3000, () =>
    console.log('🚀 Server started on http://localhost:3000')
  )
}

main()
