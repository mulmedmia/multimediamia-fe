import ExcelJS from "exceljs";

/**
 * Helper untuk styling border tipis pada semua sisi sel
 */
const THIN_BORDER = {
  top: { style: "thin", color: { argb: "FF000000" } },
  left: { style: "thin", color: { argb: "FF000000" } },
  bottom: { style: "thin", color: { argb: "FF000000" } },
  right: { style: "thin", color: { argb: "FF000000" } },
};

/**
 * Format tanggal sekarang untuk display Timestamp
 */
const getFormattedTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const d = pad(now.getDate());
  const m = pad(now.getMonth() + 1);
  const y = now.getFullYear();
  const h = pad(now.getHours());
  const min = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  return `${d}/${m}/${y} ${h}:${min}:${s} WIB`;
};

/**
 * Helper mengonversi index 1-based ke huruf kolom Excel (1 -> A, 27 -> AA)
 */
const getColumnLetter = (colIndex) => {
  let letter = "";
  let temp = colIndex;
  while (temp > 0) {
    let rem = (temp - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    temp = Math.floor((temp - 1) / 26);
  }
  return letter;
};

/**
 * Export data array ke file Excel (.xlsx) dengan template MIA
 * 
 * @param {Object} options
 * @param {string} options.pageTitle - Judul halaman (tanpa kata "Halaman"), misal "PENDAFTARAN"
 * @param {string} options.accountName - Nama akun admin (misal "Admin MIA")
 * @param {string} options.fileName - Nama file output tanpa ekstensi
 * @param {Array<{header: string, key: string, width?: number, align?: string}>} options.columns
 * @param {Array<Object>} options.data - Data baris yang akan diekspor
 */
export async function exportToExcel({
  pageTitle = "DATA",
  accountName = "Admin",
  fileName = "export_data",
  columns = [],
  data = [],
}) {
  if (!columns || columns.length === 0) {
    throw new Error("Columns definition is required for exportToExcel.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "MIA 2026 Admin Dashboard";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(pageTitle.slice(0, 31) || "Sheet1", {
    views: [{ showGridLines: true }],
  });

  const totalCols = columns.length;
  const lastColLetter = getColumnLetter(totalCols);

  // Row 1 & 2 Kosong (buffer sesuai template)
  worksheet.getRow(1).height = 10;
  worksheet.getRow(2).height = 10;

  // --- BARIS 3: JUDUL HALAMAN (Merged Col 1..totalCols) ---
  worksheet.mergeCells(`A3:${lastColLetter}3`);
  const titleCell = worksheet.getCell("A3");
  titleCell.value = pageTitle.toUpperCase();
  titleCell.font = { name: "Times New Roman", size: 12, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(3).height = 24;

  // Terapkan border ke semua sel yang dimerge di Baris 3
  for (let c = 1; c <= totalCols; c++) {
    worksheet.getCell(3, c).border = THIN_BORDER;
  }

  // --- BARIS 4: ACCOUNT NAME & TIMESTAMP ---
  // Bagi kolom menjadi 2 bagian (kiri dan kanan)
  const midCol = Math.max(1, Math.floor(totalCols / 2));
  const midColLetter = getColumnLetter(midCol);
  const midPlusOneColLetter = getColumnLetter(midCol + 1);

  // Sisi Kiri (Account Name)
  if (midCol > 1) {
    worksheet.mergeCells(`A4:${midColLetter}4`);
  }
  const accountCell = worksheet.getCell("A4");
  accountCell.value = `Account Name : ${accountName || "Admin"}`;
  accountCell.font = { name: "Times New Roman", size: 12, bold: false };
  accountCell.alignment = { horizontal: "center", vertical: "middle" };

  // Sisi Kanan (Timestamp)
  if (totalCols > midCol) {
    worksheet.mergeCells(`${midPlusOneColLetter}4:${lastColLetter}4`);
    const timeCell = worksheet.getCell(4, midCol + 1);
    timeCell.value = `Waktu Export : ${getFormattedTimestamp()}`;
    timeCell.font = { name: "Times New Roman", size: 12, bold: false };
    timeCell.alignment = { horizontal: "center", vertical: "middle" };
  }
  worksheet.getRow(4).height = 22;

  // Terapkan border ke semua sel di Baris 4
  for (let c = 1; c <= totalCols; c++) {
    worksheet.getCell(4, c).border = THIN_BORDER;
  }

  // --- BARIS 5: HEADER TABEL (NAMA KOLOM) ---
  const headerRow = worksheet.getRow(5);
  headerRow.height = 24;

  columns.forEach((col, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = col.header;
    cell.font = { name: "Times New Roman", size: 12, bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = THIN_BORDER;
  });

  // --- BARIS 6+: DATA ROWS ---
  let currentRowIndex = 6;
  data.forEach((item, rowIdx) => {
    const row = worksheet.getRow(currentRowIndex);
    row.height = 20;

    columns.forEach((col, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      let val = item[col.key];

      if (val === undefined || val === null) {
        val = "-";
      }

      cell.value = val;
      cell.font = { name: "Times New Roman", size: 12, bold: false };
      cell.alignment = {
        horizontal: col.align || "left",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = THIN_BORDER;
    });

    currentRowIndex++;
  });

  // --- AUTO COLUMN WIDTHS DENGAN PADDING & MIN/MAX ---
  columns.forEach((col, colIdx) => {
    let maxLength = (col.header || "").toString().length;

    data.forEach((item) => {
      const val = item[col.key];
      if (val !== undefined && val !== null) {
        const strVal = String(val);
        // Jika teks ada newline, ambil baris terpanjang
        const lines = strVal.split("\n");
        lines.forEach((l) => {
          if (l.length > maxLength) {
            maxLength = l.length;
          }
        });
      }
    });

    // Sesuaikan padding, minimum 12, maksimum 55 agar tidak terlalu lebar
    const calculatedWidth = Math.min(55, Math.max(col.width || 12, maxLength + 4));
    worksheet.getColumn(colIdx + 1).width = calculatedWidth;
  });

  // --- GENERATE BUFFER & DOWNLOAD FILE DI BROWSER ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${fileName}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
