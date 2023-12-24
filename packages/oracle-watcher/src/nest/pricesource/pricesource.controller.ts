import { Body, Controller, Post, Put } from '@nestjs/common';
import { PricesourceService } from './pricesource.service';
import { ORACLE_WATCHER_REGISTER_PRICE_SOURCE, ORACLE_WATCHER_UPDATE_PRICE_SOURCE } from '@money-engine/common';
import { RegisterPricesourceRequest, RegisterPricesourceResponse, UpdatePriceSourceRequest } from '@money-engine/common-nest';
import { MessagePattern } from '@nestjs/microservices';

@Controller('price-source')
export class PricesourceController {
    constructor(
        private readonly priceSourceService: PricesourceService
    ) {
        
    }

    @Post()
    @MessagePattern(ORACLE_WATCHER_REGISTER_PRICE_SOURCE)
    async registerPriceSource(
        @Body() registerPriceSourceDto: RegisterPricesourceRequest[]
    ): Promise<RegisterPricesourceResponse[]> {
        return this.priceSourceService.registerPriceSource(registerPriceSourceDto);
    }

    @Put()
    @MessagePattern(ORACLE_WATCHER_UPDATE_PRICE_SOURCE)
    async updatePriceSource(
        @Body() updatePriceSourceRequest: UpdatePriceSourceRequest[]
    ) {
        return this.priceSourceService.updatePriceSource(updatePriceSourceRequest);
    }
}
