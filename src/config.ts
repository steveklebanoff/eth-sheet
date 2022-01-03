require("dotenv").config({ path: ".env.local" });
import * as ethers from "ethers";

const envStringOrThrow = (val: string | undefined, name: string) => {
  if (!val) {
    throw new Error(`Please specify ${name} in ENV`);
  } else {
    return val;
  }
};

export const config = {
  covalentApi: envStringOrThrow(
    process.env.COVALENT_API_KEY,
    "COVALENT_API_KEY"
  ),
  rpcUrl: envStringOrThrow(process.env.RPC_URL, "RPC_URL"),
  googleSheetsApikey: envStringOrThrow(
    process.env.GOOGLE_SHEETS_API_KEY,
    "GOOGLE_SHEETS_API_KEY"
  ),
};

export const ethersProvider = new ethers.providers.JsonRpcProvider(
  config.rpcUrl
);
