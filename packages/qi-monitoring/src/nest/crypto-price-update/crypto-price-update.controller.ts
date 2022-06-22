import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { UpdatePriceEvent, ORACLE_WATCHER_DELTA_ALERT } from "@money-engine/common";
import { CryptoPriceUpdateService } from "./crypto-price-update.service";

@Controller()
export class CryptoPriceUpdateController {

  constructor(
    private readonly cryptoPriceUpdateService: CryptoPriceUpdateService
  ) { }

  @EventPattern(ORACLE_WATCHER_DELTA_ALERT)
  async updatePrice(data: UpdatePriceEvent) {
    this.cryptoPriceUpdateService.updatePrice(data);
  }
}
