import { Inject, Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UpdatePriceEvent } from "@money-engine/common";
import { TQiVaultRepository } from '../database/repositories/QiVault.repository';
import { QI_VAULT_REPOSITORY } from '../database/database.provider';

@Injectable()
export class CryptoPriceUpdateService {
  constructor(
    @InjectPinoLogger(CryptoPriceUpdateService.name) private readonly logger: PinoLogger,
    @Inject(QI_VAULT_REPOSITORY) private readonly vaultRepository: TQiVaultRepository
  ) {}

  async updatePrice(data: UpdatePriceEvent) {
    // Get vault from data address + chain + price source
    // Update ratios based from pricing, only update ratios with only a few percentage above liquidation price

    const {
      crypto: { chain, symbol, address },
      priceSourceData: { priceSourceType, price, decimals },
    } = data;

    const vault = await this.vaultRepository.findOne({
      where: {
        tokenSymbol: symbol,
        tokenAddress: address,
        vaultChain: chain,
      },
    });

    vault.dollarValue = price;

    await this.vaultRepository.save(vault);

    this.logger.info(`Updated ${symbol} to price ${price}`);
  }
}