import { getLastBlockHeight } from "./covalent/covalent_fetchers";
import { EvmNetwork } from "./constants";
import * as Redis from "ioredis";

const redisClient = process.env.REDIS_URI
  ? new Redis(process.env.REDIS_URI)
  : new Redis(6379, "localhost");
console.log("REDIS_URI", process.env.REDIS_URI);

const KEY_PREFIX = "eth_sheet";
const IS_RUNNING_REDIS_KEY = `${KEY_PREFIX}:is_running`;
const SEEN_TXN_KEY = (txnHash: string) => {
  return `${KEY_PREFIX}:txn:${txnHash.toLowerCase()}`;
};
const lastBlockFetchedKey = (network: EvmNetwork) => {
  return `${KEY_PREFIX}:last_block:${network}`;
};

export const setHaveSeenTransaction = async (txHash: string) => {
  return redisClient.set(SEEN_TXN_KEY(txHash), "seen");
};

export const getHaveSeenTransaction = async (txHash: string) => {
  return (await redisClient.get(SEEN_TXN_KEY(txHash))) === "seen";
};

export const setIsRunning = async () => {
  return redisClient.set(IS_RUNNING_REDIS_KEY, "yes");
};

export const setIsNotRunning = async () => {
  return redisClient.set(IS_RUNNING_REDIS_KEY, "no");
};

export const getIsRunning = async () => {
  return (await redisClient.get(IS_RUNNING_REDIS_KEY)) === "yes";
};

export const getLastBlockFetched = async (network: EvmNetwork) => {
  const resp = await redisClient.get(lastBlockFetchedKey(network));
  if (resp) {
    console.info("Got last block fetched", resp);
    return parseInt(resp);
  } else {
    console.warn("WARNING: using default last block");
    if (network == EvmNetwork.Ethereum) {
      return 13907728;
    } else if (network == EvmNetwork.Arbitrum) {
      return 4149880;
    } else if (network == EvmNetwork.Polygon) {
      return 23129666;
    } else if (network == EvmNetwork.Avalanche) {
      return 1;
    } else {
      throw new Error(`no default block found`);
    }
  }
};

export const setLastBlockFetched = async (
  network: EvmNetwork,
  aNum: number
) => {
  console.log("Setting last block fetched", aNum, "for network", network);
  return redisClient.set(lastBlockFetchedKey(network), aNum);
};
