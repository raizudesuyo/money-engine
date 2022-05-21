import {
  config,
  IData,
  IQiDaoVaultContractAdapterFactoryParam,
  QiDaoVaultContractAdapterFactory,
  QiDaoVaultService,
  Web3Chain,
  Web3HttpFactory,
  IMaiVaultContractData,
} from "@money-engine/common";
import { readFileSync, writeFileSync } from "fs";
import _ = require("lodash");
import { setTimeout } from "timers/promises";
import axios from "axios";

const explorers = config.explorers;

export const updateConfig = async () => {
  // Get Config.json
  const vaultConfigs = JSON.parse(
    readFileSync("./config.json", "utf8")
  ) as IData;

  for (let index = 0; index < vaultConfigs.maiVaultContracts.length; index++) {
    const contract = vaultConfigs.maiVaultContracts[index];
    const web3Provider = Web3HttpFactory.getProvider(
      contract.chain as Web3Chain
    );

    if (!web3Provider) {
      continue;
    }

    const vaultAdapter = QiDaoVaultContractAdapterFactory.getProvider({
      contractAddress: contract.address,
      contractProvider: web3Provider,
      contractType: contract.type,
    });

    const oracleAddress = await vaultAdapter.ethPriceSource();
    const oracleName = await getPriceSourceName(oracleAddress, contract);
    contract.priceSourceType = convertOracleName(oracleName);
  }

  // Update config.json
  console.log(vaultConfigs)
  const configFile = JSON.stringify(vaultConfigs, null, 2);
  writeFileSync("../config.json", configFile);
};

const getPriceSourceName = async (
  ethPriceSourceAddress: string,
  contract: IMaiVaultContractData
) => {
  if (contract.chain == "polygon") {
    const response = (
      await axios.get<GetSourceCodeResponse>(
        `${explorers.polygon.url}?${new URLSearchParams({
            apiKey: explorers.polygon.apikey,
            module: "contract",
            action: "getsourcecode",
            address: ethPriceSourceAddress,
          })}`
      )
    );
    const contractName = response.data.result[0].ContractName;
    await setTimeout(333, true);
    return convertOracleName(contractName);
  }

  if (contract.chain == "fantom") {
    const response = (
      await axios.get<GetSourceCodeResponse>(
        `${explorers.fantom.url}?${new URLSearchParams({
            apiKey: explorers.fantom.apikey,
            module: "contract",
            action: "getsourcecode",
            address: ethPriceSourceAddress,
          })}`
      )
    );
    const contractName = response.data.result[0].ContractName;
    await setTimeout(333, true);
    return convertOracleName(contractName);
  }

  if (contract.chain == "avalanche") {
    const response = (
      await axios.get<GetSourceCodeResponse>(
        `${explorers.avalanche.url}?${new URLSearchParams({
            apiKey: explorers.avalanche.apikey,
            module: "contract",
            action: "getsourcecode",
            address: ethPriceSourceAddress,
          })}`
      )
    );
    const contractName = response.data.result[0].ContractName;
    await setTimeout(333, true);
    return convertOracleName(contractName);
  }
};

const convertOracleName = (onlineContractName: string) => {
  switch (onlineContractName.toLowerCase()) {
    case "shareoracle":
      return "qiShareOracle";
    case "doubleoracle":
      return "qiDoubleOracle";
    case "":
      return "IPriceSource" // probably
    default:
      return onlineContractName;
  }
};

interface GetSourceCodeResponse {
  status: "1" | string;
  message: "OK" | string;
  result: [{
    ContractName: string;
  }];
}
