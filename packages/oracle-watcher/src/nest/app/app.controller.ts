import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import {
  IS_ORACLE_WATCHER_INITIALIZED,
} from "@money-engine/common";
import { 
  IsOracleWatcherInitializeResponse
} from '@money-engine/common-nest';

@Controller()
export class AppController {
  @Get('/')
  @MessagePattern(IS_ORACLE_WATCHER_INITIALIZED)
  isOracleWatcherInitialized(): IsOracleWatcherInitializeResponse {
    return {
      isInitialized: true
    }
  }
}
