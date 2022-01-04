require("dotenv").config({ path: ".env.local" });
import * as ethers from "ethers";

const envStringOrThrow = (val: string | undefined, name: string) => {
  if (!val) {
    throw new Error(`Please specify ${name} in ENV`);
  } else {
    return val;
  }
};

const ethereumAddresses = envStringOrThrow(
  process.env.ETHEREUM_ADDRESSES,
  "ETHEREUM_ADDRESSES"
).split(",");
const arbitrumAddresses = process.env.ARBITRUM_ADDRESSES
  ? process.env.ARBITRUM_ADDRESSES.split(",")
  : [];
const avalancheAddresses = process.env.AVALANCHE_ADDRESSES
  ? process.env.AVALANCHE_ADDRESSES.split(",")
  : [];
const polygonAddresses = process.env.polygon_ADDRESSES
  ? process.env.polygon_ADDRESSES.split(",")
  : [];

export const config = {
  ethereumAddresses,
  arbitrumAddresses,
  avalancheAddresses,
  polygonAddresses,
  covalentApi: envStringOrThrow(
    process.env.COVALENT_API_KEY,
    "COVALENT_API_KEY"
  ),
  rpcUrl: envStringOrThrow(process.env.RPC_URL, "RPC_URL"),
  googleSheetsApikey: envStringOrThrow(
    process.env.GOOGLE_SHEETS_API_KEY,
    "GOOGLE_SHEETS_API_KEY"
  ),
  googleApiEmail: envStringOrThrow(
    process.env.GOOGLE_API_EMAIL,
    "GOOGLE_API_EMAIL"
  ),
  googleApiPK: envStringOrThrow(process.env.GOOGLE_API_PK, "GOOGLE_API_PK"),
  googleDocId: envStringOrThrow(process.env.GOOGLE_DOC_ID, "GOOGLE_DOC_ID"),
};

export const ethersProvider = new ethers.providers.JsonRpcProvider(
  config.rpcUrl
);
