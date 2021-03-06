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
  const sheet = doc.sheetsByIndex[0];
  return sheet;
};

export const addRow = async (values: (string | number)[]) => {
  const sheet = await getSheet();
  await sheet.addRow(values);
};

export const addRows = async (values: (string | number)[][]) => {
  const sheet = await getSheet();
  await sheet.addRows(values);
};
