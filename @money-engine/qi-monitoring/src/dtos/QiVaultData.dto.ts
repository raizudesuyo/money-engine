import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QiVault } from "./QiVault.dto";

export class QiVaultData {
    @ApiPropertyOptional()
    id?: number

    @ApiProperty()
    collateralRatio: number;

    @ApiProperty()
    collateralAmount: string;

    @ApiProperty()
    totalCollateralValue: string;

    @ApiProperty()
    maiDebt: string;

    @ApiProperty()
    owner: string;

    @ApiProperty()
    vault?: QiVault

    @ApiPropertyOptional()
    vaultId?: number
}
