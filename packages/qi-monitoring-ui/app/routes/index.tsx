import * as React from 'react';
import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import { Link } from 'remix';
import Typography from '@mui/material/Typography';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getLiquidationVaultData, VaultDataOnlyResult } from '~/services/monitoring';
import { BigNumber, utils } from 'ethers'
import { VaultDataTable } from '~/src/VaultDataTable';
import { getAllVaults, VaultsResult } from '../services/monitoring';
import { getDollarValueFromChainlink } from '~/services/utils';
import { StringifyOptions } from 'querystring';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'QiDAO Monitoring UI',
    description: 'Time to make that cash',
  };
};

export interface LoaderResult {
  vaultData: VaultDataOnlyResult
  vaults: VaultsResult
}

export const loader: LoaderFunction = async () => {
  const vaultData = await getLiquidationVaultData();
  const vaults = await getAllVaults();

  return {
    vaultData,
    vaults
  }
}

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const data: LoaderResult = useLoaderData();
  return (
    <React.Fragment>
      <Typography variant="h1" component="h1" gutterBottom align='center'>
        QiDAO Monitoring UI
      </Typography>
      <Typography variant="h4" gutterBottom align='left'>
        Vault Types
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableCell>
              Contract Name
            </TableCell>
            <TableCell>
              Current Price
            </TableCell>
            <TableCell>
              Price Last Update
            </TableCell>
          </TableHead>
          <TableBody>
            {data.vaults.vaults.map((vault) => (
              <TableRow>
                <TableCell>
                  <Link to={`/vaults/${vault.id}`} prefetch='render'>{vault.vaultName}</Link>
                </TableCell>
                <TableCell>
                  $ {getDollarValueFromChainlink(vault.dollarValue)}
                </TableCell>
                <TableCell>
                  {vault.updatedTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h4" gutterBottom align='left'>
        Top 20 Vaults
      </Typography>
      <VaultDataTable data={data.vaultData.vaultData} vault={data.vaults.vaults} />
      <Typography variant="h4" gutterBottom align='left'>
        Last 20 Events
      </Typography>
    </React.Fragment>
  );
}
