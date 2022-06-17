import 'reflect-metadata'
import express from 'express'
import db from './connect'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { MyContext } from './types'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import path from 'path'

const main = async () => {
  // Connect to Database
  await db.initialize()
  await db.runMigrations()

  const app = express()

  app.set('trust proxy', process.env.NODE_ENV === 'production')

  app.use(
    cors({
      origin: 'http://localhost:8888',
      credentials: true
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
