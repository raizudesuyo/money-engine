import { Logger, QueryRunner } from 'typeorm'

export class TypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    throw new Error('Method not implemented.');
  }
  logQueryError(error: string | Error, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    throw new Error('Method not implemented.');
  }
  logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    throw new Error('Method not implemented.');
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
    throw new Error('Method not implemented.');
  }
  logMigration(message: string, queryRunner?: QueryRunner | undefined) {
    throw new Error('Method not implemented.');
  }
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner | undefined) {
    throw new Error('Method not implemented.');
  }

}