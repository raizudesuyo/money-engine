import { Body, Controller, Post, Put } from '@nestjs/common';
import { DeltaService } from './delta.service';
import { MessagePattern } from '@nestjs/microservices';
import { ORACLE_WATCHER_CREATE_DELTA_ALERT, ORACLE_WATCHER_UPDATE_DELTA_ALERT } from '@money-engine/common';
import { CreateDeltaRequest, UpdateDeltaRequest } from '@money-engine/common-nest';

@Controller('delta-alert')
export class DeltaController {

    constructor(
        private readonly deltaService: DeltaService
    ) {
    }

    @Post()
    @MessagePattern(ORACLE_WATCHER_CREATE_DELTA_ALERT)
    async createDeltaAlert(
        @Body() createDeltaAlertRequest: CreateDeltaRequest
    ): Promise<string> {
        return this.deltaService.create(createDeltaAlertRequest)
    }

    @Put()
    @MessagePattern(ORACLE_WATCHER_UPDATE_DELTA_ALERT)
    async updateDataAlert(
        @Body() updateDeltaAlertRequest: UpdateDeltaRequest
    ) {
        return this.deltaService.update(updateDeltaAlertRequest);
    }
}
