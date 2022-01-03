import { addRow } from "./spreadsheet";
import {
  getAllTransactions,
  getTransactions,
} from "./covalent/covalent_fetchers";

const goFn = async () => {
  console.log("row");
  await addRow(["hello", "world", 3]);

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
