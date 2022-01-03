import { txnToRow } from "./transformer";
import { addRow, addRows } from "./spreadsheet";
import {
  getAllTransactions,
  getTransactions,
} from "./covalent/covalent_fetchers";

const goFn = async () => {
  const forAddress = "0x8a333a18b924554d6e83ef9e9944de6260f61d3b";
  const txns = await getAllTransactions(forAddress, 13911289);

  console.log("got", txns.length, "transactions");
  const rows: (string | number)[][] = [];
  for (const t of txns) {
    const row = await txnToRow(forAddress, t);
    rows.push(row);
    console.log("Created row", JSON.stringify(row));
  }
  await addRows(rows);
  console.log("Added ", rows.length, "rows to spreadsheet");

  // console.log("row");
  // await addRow(["hello", "world", 3]);
  // console.log("fetching txns");
  // const txns = await getAllTransactions(
  //   "0x8a333a18b924554d6e83ef9e9944de6260f61d3b",
  //   13911289
  // );
  // console.log(JSON.stringify(txns.length, undefined, 2));
};

goFn().then(() => {
  process.exit();
});
