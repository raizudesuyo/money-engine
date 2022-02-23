import * as React from 'react';
import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import Typography from '@mui/material/Typography';
import { VaultDataTable } from '~/src/VaultDataTable';
import { getAllVaults, getVault100 } from '~/services/monitoring';
import { LoaderResult } from '../index';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'QiDAO Monitoring UI',
    description: 'Time to make that cash',
  };
};

export const loader: LoaderFunction = async ({params}) => {
  console.log(params)

  const vaults = await getAllVaults();
  const vaultData = await getVault100(params.vaultId)
  return {
    vaults,
    vaultData
  };
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
        Top 100 Vaults
      </Typography>
      <VaultDataTable data={data.vaultData.vaultData} vault={data.vaults.vaults} />
    </React.Fragment>
  );
}
