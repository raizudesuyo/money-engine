
/**
 * @type require('typeorm').ConnectionOptions
 */
module.exports = {
   synchronize: false,
   logging: false,
   entities: ['node_modules/qi-db/src/entity/*.entity.{js,ts}'],
   migrations: [
      "src/migration/*.ts"
   ],
   // subscribers: [
   //    "src/subscriber/**/*.ts"
   // ],
   cli: {
      "entitiesDir": "node_modules/qi-db/src/entity",
      "migrationsDir": "node_modules/qi-db/src/migration",
      "subscribersDir": "node_modules/qi-db/src/subscriber"
   },
   type: process.env.db_type || 'postgres',
   host: process.env.db_host || 'localhost',
   port: process.env.db_port || 5432,
   username: process.env.db_user || 'postgres',
   password: process.env.db_pass || 'mysecretpassword',
   database: process.env.db_name || 'qidao-monitoring-engine-db',
   name: 'default'
}