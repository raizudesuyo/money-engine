import { TableContainer, Paper, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';
import { BigNumber, utils } from 'ethers';
import { toEtherFormatted, getDollarValueFromChainlink } from '~/services/utils';
import { QiVaultData, QiVault } from '../services/monitoring';

export const VaultDataTable = (props: { data: QiVaultData[], vault: QiVault[] }) => {
  const { data, vault } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label='liquidation-table'>
        <TableHead>
          <TableCell>Vault</TableCell>
          <TableCell>Debt Ratio</TableCell>
          <TableCell>Debt Value</TableCell>
          <TableCell>Collateral Value</TableCell>
          <TableCell>Updated</TableCell>
        </TableHead>
        <TableBody>
          {data.map((vaultData) => (
            <TableRow key={vaultData.id}>
              <TableCell component="th" scope="row">
                {vault.find((v) => v.id == vaultData.qiVaultId)?.vaultName} #{vaultData.vaultId}
              </TableCell>
              <TableCell>
                {vaultData.predictedCollateralRatio}%
              </TableCell>
              <TableCell>
                ${toEtherFormatted(vaultData.maiDebt)}
              </TableCell>
              <TableCell>
                ${toEtherFormatted(vaultData.predictedTotalCollateralValue)}
              </TableCell>
              <TableCell>
                {vaultData.updateTime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}