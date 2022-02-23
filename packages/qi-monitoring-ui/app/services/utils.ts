import { BigNumber, utils } from "ethers";

export const toEtherFormatted = (value: string) => utils.commify(Number.parseFloat(utils.formatUnits(value, 'ether')).toFixed(2))

export const getDollarValueFromChainlink = (value: string) => (BigNumber.from(value).div(10 ** 5).toNumber() / 1000).toLocaleString()