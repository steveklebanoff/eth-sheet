import { getHistoricalPrices } from "./covalent/covalent_fetchers";

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

let knownEthPrice: number | undefined = undefined;
export const fetchEthPrice = async () => {
  if (knownEthPrice) {
    return knownEthPrice;
  } else {
    const foundPrice = await fetchUsdPrice(WETH);
    knownEthPrice = foundPrice;
    return foundPrice;
  }
};

export const fetchUsdPrice = async (tokenAddress: string) => {
  const prices = await getHistoricalPrices("USD", tokenAddress);
  if (prices.error) {
    console.log(prices);
    throw new Error("Error fetching prices");
  }

  return prices.data[0].prices[0].price;
};
