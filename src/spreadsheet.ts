import { config } from "./config";
import { GoogleSpreadsheet } from "google-spreadsheet";

export const getSheet = async () => {
  const doc = new GoogleSpreadsheet(config.googleDocId);
  doc.useApiKey(config.googleSheetsApikey);
  await doc.useServiceAccountAuth({
    client_email: config.googleApiEmail,
    private_key: config.googleApiPK.replace(/\\n/g, "\n"),
  });

  await doc.loadInfo();
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  return sheet;
};

export const addRow = async (values: (string | number)[]) => {
  console.log("adding row...");
  const sheet = await getSheet();
  await sheet.addRow(values);
  console.log("added!");
};
