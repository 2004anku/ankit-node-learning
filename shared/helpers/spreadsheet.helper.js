const XLSX = require("xlsx");

/**
 * Read Spreadsheet File (.xlsx / .xls)
 * Returns JSON Array
 */
const readSpreadsheet = (filePath) => {
  const workbook = XLSX.readFile(filePath);

  const firstSheet = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[firstSheet];

  const data = XLSX.utils.sheet_to_json(worksheet, {
    defval: "", // Empty cells become ""
    raw: false,
    trim: true,
  });

  return data;
};

module.exports = {
  readSpreadsheet,
};
