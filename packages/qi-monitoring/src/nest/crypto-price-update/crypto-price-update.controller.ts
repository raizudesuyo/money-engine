import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { UpdatePriceEvent, LoggerSingleton } from "@money-engine/common";
import { QiVault } from '../../entity';
import { dataSource } from '../../data-source'

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
  
    const vault = await dataSource.manager.findOne(QiVault, {
      where: {
        tokenSymbol: symbol,
        tokenAddress: address,
        vaultChain: chain,
      }
    })

    vault.dollarValue = price;

    await dataSource.manager.save(vault)

    LoggerSingleton.getInstance().info(`Updated ${symbol} to price ${price}`)
  }
}
