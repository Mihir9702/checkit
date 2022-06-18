import { DataSource } from 'typeorm'
import path from 'path'

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'checkit',
  // synchronize: true,
  logging: true,
  entities: [path.join(__dirname, 'entities/**/*.ts')]
})
