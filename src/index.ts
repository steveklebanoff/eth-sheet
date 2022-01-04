import { EvmNetwork } from "./constants";
import {
  getHaveSeenTransaction,
  getIsRunning,
  getLastBlockFetched,
  setHaveSeenTransaction,
  setIsNotRunning,
  setIsRunning,
  setLastBlockFetched,
} from "./storage";
import { config } from "./config";
import { txnToRow } from "./transformer";
import { addRow, addRows } from "./spreadsheet";
import {
  getAllTransactions,
  getLastBlockHeight,
  getTransactions,
} from "./covalent/covalent_fetchers";

const fetchTransactions = async (
  addresses: string[],
  lastKnownBlockFetched: number,
  curBlock: number,
  network: EvmNetwork
) => {
  let count = 0;
  for (const forAddress of addresses) {
    count += 1;
    console.log(
      `====== Fetching for ${forAddress} ${count}/${config.ethereumAddresses.length} from block ${lastKnownBlockFetched} to block ${curBlock}. network: ${network} =====`
    );
    const txns = await getAllTransactions(
      forAddress,
      lastKnownBlockFetched,
      network
    );
    console.log("Got", txns.length, `transactions for ${forAddress}`);
    const rows: (string | number)[][] = [];
    for (const t of txns) {
      const haveSeen = await getHaveSeenTransaction(t.tx_hash);
      if (haveSeen) {
        console.warn(`already seen`, t.tx_hash, "skipping...");
      } else {
        const row = await txnToRow(forAddress, network, t);
        rows.push(row);
        console.log("Created row:", JSON.stringify(row));
      }
      await setHaveSeenTransaction(t.tx_hash);
    }
    await addRows(rows);
    console.log("Added", rows.length, "rows to spreadsheet");
  }
};

const goFn = async () => {
  // TODO: diff last block per network
  const isRunning = await getIsRunning();
  if (isRunning) {
    console.log("Skipping because already running");
    return;
  }

  await setIsRunning();
  try {
    const networConfigs: [string, EvmNetwork, string[]][] = [
      ["ethereum", EvmNetwork.Ethereum, config.ethereumAddresses],
      ["arbitrum", EvmNetwork.Arbitrum, config.arbitrumAddresses],
      ["avalanche", EvmNetwork.Avalanche, config.avalancheAddresses],
      ["polygon", EvmNetwork.Polygon, config.polygonAddresses],
    ];
    for (const networkConfig of networConfigs) {
      const [networkName, networkId, addresses] = networkConfig;
      const lastKnownBlockFetched = (await getLastBlockFetched(networkId)) - 50;
      const curLastBlockHeight = await getLastBlockHeight(networkId);

      console.log(
        `Fetching ${networkName} (${networkId}) for addresses ${addresses}`
      );
      try {
        await fetchTransactions(
          addresses,
          lastKnownBlockFetched,
          curLastBlockHeight,
          networkId
        );
      } catch (e) {
        throw e;
      } finally {
        await setLastBlockFetched(networkId, curLastBlockHeight);
      }
    }
  } catch (e) {
    throw e;
  } finally {
    await setIsNotRunning();
  }
};

goFn().then(() => {
  process.exit();
});
