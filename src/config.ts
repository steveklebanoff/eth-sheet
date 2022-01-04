require("dotenv").config({ path: ".env.local" });
import * as ethers from "ethers";

const envStringOrThrow = (val: string | undefined, name: string) => {
  if (!val) {
    throw new Error(`Please specify ${name} in ENV`);
  } else {
    return val;
  }
};

const ethereumAddresssesRaw = envStringOrThrow(
  process.env.ETHEREUM_ADDRESSES,
  "ETHEREUM_ADDRESSES"
);
const ethereumAddresses = ethereumAddresssesRaw.split(",");

export const config = {
  ethereumAddresses,
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
