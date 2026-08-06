const ExcelJS = require("exceljs");

const exportToExcel = async ({ data, sheetName, fileName, columns, res }) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns;

  data.forEach((item) => worksheet.addRow(item));

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);

  await workbook.xlsx.write(res);

  res.end();
};

module.exports = {
  exportToExcel,
};
