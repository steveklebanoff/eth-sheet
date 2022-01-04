import * as Redis from "ioredis";

const redisClient = process.env.REDIS_URI
  ? new Redis(process.env.REDIS_URI)
  : new Redis(6379, "localhost");
console.log("REDIS_URI", process.env.REDIS_URI);

const KEY_PREFIX = "eth_sheet";
const IS_RUNNING_REDIS_KEY = `${KEY_PREFIX}:is_running`;
const LAST_BLOCK_FETCHED_KEY = `${KEY_PREFIX}:last_block`;
const SEEN_TXN_KEY = (txnHash: string) => {
  return `${KEY_PREFIX}:txn:${txnHash.toLowerCase()}`;
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

export const getLastBlockFetched = async () => {
  const resp = await redisClient.get(LAST_BLOCK_FETCHED_KEY);
  if (resp) {
    console.info("Got last block fetched", resp);
    return parseInt(resp);
  } else {
    console.warn("WARNING: using default last block");
    return 13907728;
  }
};

export const setLastBlockFetched = async (aNum: number) => {
  console.log("Setting last block fetched", aNum);
  return redisClient.set(LAST_BLOCK_FETCHED_KEY, aNum);
};
