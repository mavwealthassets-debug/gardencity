export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadTextPdf(filename: string, title: string, sourceLines: Array<string | number>) {
  const clean = (value: string | number) => String(value).replace(/₹/g, "INR ").normalize("NFKD").replace(/[^\x20-\x7E]/g, " ").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").slice(0, 78);
  const entries = sourceLines.map((line) => {
    const [label, ...rest] = String(line).split(":");
    return { label: clean(label), value: clean(rest.length ? rest.join(":").trim() : line) };
  });
  const status = entries.find((entry) => entry.label.toLowerCase() === "status")?.value ?? "Generated";
  const reference = filename.replace(/\.pdf$/i, "").replace(/[^a-z0-9]+/gi, "-").toUpperCase().slice(0, 28);
  const isReceipt = /receipt|payment/i.test(title);
  const isPlot = /plot/i.test(title) && !isReceipt;
  const documentType = isReceipt ? "PAYMENT RECEIPT" : isPlot ? "PLOT INFORMATION" : "REGISTRATION DOCUMENT";
  const leftEntries = entries.slice(0, Math.ceil(entries.length / 2));
  const rightEntries = entries.slice(Math.ceil(entries.length / 2));
  const text = (value: string, x: number, y: number, size = 10, font = "F1", color = "0.12 0.16 0.14") => `BT /${font} ${size} Tf ${color} rg ${x} ${y} Td (${clean(value)}) Tj ET`;
  const infoColumn = (heading: string, items: typeof entries, x: number) => [
    text(heading, x, 604, 9, "F2", "0.03 0.48 0.18"),
    ...items.flatMap((item, index) => {
      const y = 574 - index * 28;
      return [text(item.label.toUpperCase(), x, y, 7, "F2", "0.48 0.53 0.50"), text(item.value, x, y - 15, 10, "F1")];
    }),
  ];
  const commands = [
    "1 1 1 rg 0 0 595 842 re f",
    "0.03 0.48 0.18 rg 0 682 595 160 re f",
    text("GARDEN CITY", 38, 802, 16, "F2", "1 1 1"),
    text("NAUGAON  |  PREMIUM RESIDENTIAL TOWNSHIP", 38, 783, 7, "F1", "0.82 0.95 0.86"),
    text(documentType, 38, 743, 9, "F2", "0.82 0.95 0.86"),
    text(title, 38, 715, 19, "F2", "1 1 1"),
    "0.98 0.99 0.98 rg 28 466 539 176 re f",
    "0.86 0.90 0.87 RG 28 466 539 176 re S",
    "0.86 0.90 0.87 RG 297 482 m 297 626 l S",
    ...infoColumn(isReceipt ? "BUYER & PAYMENT" : "BUYER INFORMATION", leftEntries, 48),
    ...infoColumn(isReceipt ? "TRANSACTION DETAILS" : "DOCUMENT INFORMATION", rightEntries, 320),
    text("VERIFICATION STATUS", 38, 420, 9, "F2", "0.03 0.48 0.18"),
    "0.93 0.98 0.94 rg 28 302 539 96 re f",
    "0.59 0.82 0.66 RG 28 302 539 96 re S",
    "0.03 0.48 0.18 rg 48 357 7 7 re f",
    text(status, 64, 354, 12, "F2", "0.03 0.48 0.18"),
    text(isReceipt ? "Payment recorded successfully. This receipt confirms the transaction." : "This document is available in your secure Garden City buyer account.", 48, 330, 9, "F1", "0.28 0.34 0.30"),
    text(`REFERENCE: ${reference}`, 38, 260, 8, "F2", "0.48 0.53 0.50"),
    text(`GENERATED: ${new Date().toLocaleDateString("en-IN")}`, 38, 244, 8, "F1", "0.48 0.53 0.50"),
    "0.86 0.90 0.87 RG 38 72 m 557 72 l S",
    text("Garden City Naugaon  |  support@gardencity.com  |  +91 1800 123 4567", 38, 50, 8, "F1", "0.48 0.53 0.50"),
    text("Computer-generated document. No signature is required.", 38, 34, 7, "F1", "0.58 0.62 0.60"),
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  downloadBlob(new Blob([pdf], { type: "application/pdf" }), filename);
}
