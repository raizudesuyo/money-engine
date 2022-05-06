import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { UpdatePriceEvent, LoggerSingleton } from "@money-engine/common";
import { getManager } from "typeorm";
import { QiVault } from 'qi-db/src/entity/QiVault.entity';

@Controller()
export class CryptoPriceUpdateController {
  @EventPattern("price-updated")
  async updatePrice(data: UpdatePriceEvent) {
    // Get vault from data address + chain + price source
    // Update ratios based from pricing, only update ratios with only a few percentage above liquidation price

    const {
      crypto: { chain, symbol, address },
      priceSourceData: { priceSourceType, price, decimals },
    } = data;
  
    const vault = await getManager().findOne(QiVault, {
      where: {
        tokenSymbol: symbol,
        tokenAddress: address,
        vaultChain: chain,
      }
    })

    vault.dollarValue = price;

    await getManager().save(vault)

    LoggerSingleton.getInstance().info(`Updated ${symbol} to price ${price}`)
  }
}
