import { DataSource } from 'typeorm'

const pgDatasource = new DataSource({
  synchronize: false,
  logging: false,
  entities: ['src/entity/*.entity.{js,ts}'],
  migrations: [
     "src/migration/*.ts"
  ],
  type: 'postgres',
  host: process.env.db_host || 'localhost',
  port: Number.parseInt(process.env.db_port || '5432'),
  username: process.env.db_user || 'postgres',
  password: process.env.db_pass || 'mysecretpassword',
  database: process.env.db_name || 'qidao-monitoring-engine-db',
})

export {
  pgDatasource
}

export default pgDatasource;