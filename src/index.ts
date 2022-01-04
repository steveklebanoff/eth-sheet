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

const goFn = async () => {
  const lastKnownBlockFetched = await getLastBlockFetched();
  const curLastBlockHeight = await getLastBlockHeight();

  const isRunning = await getIsRunning();
  if (isRunning) {
    console.log("Skipping because already running");
    return;
  }

  await setIsRunning();
  try {
    let count = 0;
    for (const forAddress of config.ethereumAddresses) {
      count += 1;
      console.log(
        `====== Fetching for ${forAddress} ${count}/${config.ethereumAddresses.length} from block ${lastKnownBlockFetched} to block ${curLastBlockHeight} =====`
      );

      const txns = await getAllTransactions(forAddress, lastKnownBlockFetched);
      console.log("Got", txns.length, `transactions for ${forAddress}`);
      const rows: (string | number)[][] = [];
      for (const t of txns) {
        const haveSeen = await getHaveSeenTransaction(t.tx_hash);
        if (haveSeen) {
          console.warn(`already seen`, t.tx_hash, "skipping...");
        } else {
          const row = await txnToRow(forAddress, t);
          rows.push(row);
          console.log("Created row:", JSON.stringify(row));
        }
        await setHaveSeenTransaction(t.tx_hash);
      }
      await addRows(rows);
      console.log("Added", rows.length, "rows to spreadsheet");
    }
  } catch (e) {
    throw e;
  } finally {
    await setLastBlockFetched(curLastBlockHeight);
    await setIsNotRunning();
  }
};

goFn().then(() => {
  process.exit();
});
