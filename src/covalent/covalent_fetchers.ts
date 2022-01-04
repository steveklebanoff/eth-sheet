import { EvmNetwork } from "./../constants";
import { config } from "../config";
import axios from "axios";
import {
  CovalentBlockResponse,
  PricesResponse,
  TransactionResponseItem,
  TransactionsResponse,
} from "./covalent_types";

const DEFAULT_URI_BASE = "https://api.covalenthq.com/v1/1/";

export const getCovalent = async (
  endpoint: string,
  uriBase: string = DEFAULT_URI_BASE
) => {
  const reqUrl = `${uriBase}${endpoint}`;
  const auth: any = { username: config.covalentApi };
  const res = await axios.get(reqUrl, {
    auth,
  });
  if (res.status !== 200) {
    throw new Error(`Unexpected API response ${res.status} for ${reqUrl}`);
  }
  return res.data;
};

export const getTransactions = async (
  address: string,
  network: EvmNetwork,
  paginationOptions: { pageNumber: number; pageSize: number }
) => {
  const urlSearch = `address/${address}/transactions_v2/?page-number=${paginationOptions.pageNumber}&page-size=${paginationOptions.pageSize}&block-signed-at-asc=false`;
  const resp = getCovalent(
    urlSearch,
    `https://api.covalenthq.com/v1/${network}/`
  );
  return resp as any as TransactionsResponse;
};

export const getAllTransactions = async (
  address: string,
  upToBlockHeight: number,
  network: EvmNetwork
) => {
  console.log(`Fetching all transactions ${address}, ${upToBlockHeight}`);

  let curPage: number = 0;
  const pageSize = 50;
  const result: TransactionResponseItem[] = [];
  let keepGoing = true;
  while (keepGoing) {
    console.info("Fetching page", curPage);
    const curTxns = await getTransactions(address, network, {
      pageNumber: curPage,
      pageSize: pageSize,
    });

    const items = curTxns.data.items;
    for (const i of items) {
      if (i.block_height >= upToBlockHeight) {
        result.push(i);
      } else {
        console.log("Done fetching because found block height", i.block_height);
        keepGoing = false;
        break;
      }
    }
    const pagination = curTxns.data.pagination;
    if (!pagination.has_more || items.length < pageSize) {
      console.log("Done fetching because no more pages");
      keepGoing = false;
    }
    curPage += 1;
  }

  return result;
};

export const getHistoricalPrices = async (
  quoteCurrency: string,
  contractAddresses: string
) => {
  const resp = await getCovalent(
    `pricing/historical_by_addresses_v2/1/${quoteCurrency}/${contractAddresses}/`,
    "https://api.covalenthq.com/v1/"
  );

  return resp as PricesResponse;
};

export const getLastBlockResponse = async () => {
  const resp = await getCovalent(
    `1/block_v2/latest/`,
    "https://api.covalenthq.com/v1/"
  );
  return resp as any as CovalentBlockResponse;
};

export const getLastBlockHeight = async () => {
  const resp = await getLastBlockResponse();
  return resp.data.items[0].height;
};
