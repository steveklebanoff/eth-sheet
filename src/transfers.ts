import { getTokenInfo } from "./tokens";
import { TransactionResponseLogEvent } from "./covalent/covalent_types";

export const getTransfers = async (
  events: TransactionResponseLogEvent[],
  txHash: string
) => {
  const transferEvents = events.filter(
    (e) =>
      e.decoded &&
      e.decoded.signature ===
        "Transfer(indexed address from, indexed address to, uint256 value)"
  );

  if (transferEvents.length > 25) {
    console.info(`Skipping transfer events longer than max`, txHash);
    return [];
  }

  const result: {
    tokenName: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    pricePerToken?: number;
  }[] = [];

  for (let i = 0; i < transferEvents.length; ++i) {
    const e = transferEvents[i];
    const tokenAddress = e.sender_address;

    const tokenInfo = await getTokenInfo(tokenAddress);
    if (tokenInfo && tokenInfo.type === "erc20") {
      const amountWei = parseInt(
        e.decoded.params.find((e) => e.name === "value").value as string
      );
      const amount = amountWei / 10 ** tokenInfo.decimals;

      const item = {
        tokenName: tokenInfo.name,
        fromAccount: e.decoded.params.find((e) => e.name === "from")
          .value as string,
        toAccount: e.decoded.params.find((e) => e.name === "to")
          .value as string,
        amount,
        pricePerToken: tokenInfo.pricePerToken,
      };
      result.push(item);
    } else if (tokenInfo && tokenInfo.type === "erc721") {
      const item = {
        tokenName: tokenInfo.name,
        fromAccount: e.decoded.params.find((e) => e.name === "from")
          .value as string,
        toAccount: e.decoded.params.find((e) => e.name === "to")
          .value as string,
        amount: 1,
      };
      result.push(item);
    }
  }

  return result;
};
