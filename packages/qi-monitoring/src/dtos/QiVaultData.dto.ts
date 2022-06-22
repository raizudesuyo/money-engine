import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QiVault } from "./QiVault.dto";

export class QiVaultData {
    @ApiPropertyOptional()
    uuid?: string

    @ApiProperty()
    collateralRatio: number;

    @ApiProperty()
    collateralAmount: string;

    @ApiProperty()
    totalCollateralValue: string;

    @ApiProperty()
    vaultNumber: number

    @ApiProperty()
    maiDebt: string;

    @ApiProperty()
    owner: string;

    @ApiProperty()
    vault?: QiVault

    @ApiPropertyOptional()
    vaultUuid?: string
}
