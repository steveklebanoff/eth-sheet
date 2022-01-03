import { fetchUsdPrice } from "./prices";
import { Erc20__factory } from "./contracts/factories/Erc20__factory";
import { Erc721__factory } from "./contracts/factories/Erc721__factory";
import { ethersProvider } from "./config";

const cachedErc20TokenInfo: {
  [address: string]: ERC20TokenInfo;
} = {};

interface ERC20TokenInfo {
  type: "erc20";
  name: string;
  decimals: number;
  pricePerToken?: number;
}
interface ERC721TokenInfo {
  type: "erc721";
  name: string;
}

export const getErc20Info = async (
  address: string
): Promise<ERC20TokenInfo> => {
  const tokenContract = Erc20__factory.connect(address, ethersProvider);

  const [name, decimals] = await Promise.all([
    tokenContract.symbol(),
    tokenContract.decimals(),
  ]);

  const result: ERC20TokenInfo = {
    type: "erc20",
    name,
    decimals,
  };

  try {
    const price = await fetchUsdPrice(address);
    result.pricePerToken = price;
  } catch (e) {
    console.error(e);
    console.error(`cant find price for ${address}`);
  }

  cachedErc20TokenInfo[address] = result;
  return result;
};

export const getErc721Info = async (
  address: string
): Promise<ERC721TokenInfo> => {
  const tokenContract = Erc721__factory.connect(address, ethersProvider);

  const name = await tokenContract.name();
  return { type: "erc721", name };
};

export const getTokenInfo = async (
  address: string
): Promise<ERC20TokenInfo | ERC721TokenInfo> => {
  if (cachedErc20TokenInfo[address]) {
    return { type: "erc20", ...cachedErc20TokenInfo[address] };
  }

  try {
    const erc20Info = await getErc20Info(address);
    return erc20Info;
  } catch (e) {
    try {
      const erc721Info = await getErc721Info(address);
      return erc721Info;
    } catch (e) {
      console.error(`Cant find token info for ${address}`);
      // console.error(e);
      return undefined;
    }
  }
};
