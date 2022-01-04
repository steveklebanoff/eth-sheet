import { getTransfers } from "./transfers";
import { TransactionResponseItem } from "./covalent/covalent_types";

export const txnToRow = async (
  forAddress: string,
  item: TransactionResponseItem
) => {
  // const tokenInfo = await getTokensInfo(forAddress, item);

  const url = `https://etherscan.io/tx/${item.tx_hash}`;
  return [
    forAddress,
    item.block_signed_at.toString(),
    url,
    item.to_address,
    "TODO",
    item.value_quote == 0 ? " " : `$${item.value_quote}`,
    // tokenInfo[0],
    // tokenInfo[1],
  ];
};

export const getTokensInfo = async (
  forAddress: string,
  item: TransactionResponseItem
): Promise<[string, number]> => {
  let resultString = "";
  let nums = [];

  const transfers = await getTransfers(item.log_events, item.tx_hash);

  const transferOut = transfers.find(
    (t) => t.fromAccount.toLowerCase() === forAddress.toLowerCase()
  );
  if (transferOut) {
    resultString += `OUT: ${transferOut.amount} ${transferOut.tokenName}`;
    if (transferOut.pricePerToken) {
      nums.push(transferOut.pricePerToken * transferOut.amount);
    }
  }

  const transferIn = transfers.find(
    (t) => t.toAccount.toLowerCase() === forAddress.toLowerCase()
  );
  if (transferIn) {
    resultString += `IN: ${transferIn.amount} ${transferIn.tokenName}`;
    if (transferIn.pricePerToken) {
      nums.push(transferIn.pricePerToken * transferIn.amount);
    }
  }
  return [resultString, nums.length > 0 ? Math.max(...nums) : 0];
};
