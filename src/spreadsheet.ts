import { config } from "./config";
import { GoogleSpreadsheet } from "google-spreadsheet";

export const addRow = async () => {
  console.log("adding row...");
  const creds = require("/Users/stevenklebanoff/dev/eth-sheet/keys/dm.json");
  const doc = new GoogleSpreadsheet(
    "1xBAQ-Vbyd2I3knf7tcj_HBmmwM5pLzglnD_DGiSCgh0"
  );
  doc.useApiKey(config.googleSheetsApikey);
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo();
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);

  await sheet.addRow(["this", "is", "from", "api"]);
  console.log("added!");
};
