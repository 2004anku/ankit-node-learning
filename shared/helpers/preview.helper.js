const fs = require("fs");
const { readSpreadsheet } = require("./spreadsheet.helper");

const previewExcelData = (filePath, validator) => {
  const rows = readSpreadsheet(filePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const data = rows.map((row, index) => {
    const errors = validator(row);

    return {
      rowNumber: index + 2,
      data: row,
      errors,
      valid: errors.length === 0,
    };
  });

  return {
    totalRows: rows.length,
    validRows: data.filter((item) => item.valid).length,
    invalidRows: data.filter((item) => !item.valid).length,
    data,
  };
};

module.exports = {
  previewExcelData,
};
