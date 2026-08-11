import { Download, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { Button } from "./Button";
import { Dropdown, DropdownItem } from "./Dropdown";

export interface ExportMenuProps {
  onExcel: () => void;
  onCsv: () => void;
  onPdfSummary: () => void;
  onDetailedPdf: () => void;
  label?: string;
}

export function ExportMenu({ onExcel, onCsv, onPdfSummary, onDetailedPdf, label = "Export" }: ExportMenuProps) {
  return (
    <Dropdown trigger={({ onClick, open }) => <Button type="button" variant="secondary" size="sm" onClick={onClick} aria-expanded={open}><Download size={14} /> {label}</Button>}>
      <DropdownItem onClick={onExcel}><FileSpreadsheet size={14} /> Excel</DropdownItem>
      <DropdownItem onClick={onCsv}><Sheet size={14} /> CSV</DropdownItem>
      <DropdownItem onClick={onPdfSummary}><FileText size={14} /> PDF Summary</DropdownItem>
      <DropdownItem onClick={onDetailedPdf}><FileText size={14} /> Detailed PDF</DropdownItem>
    </Dropdown>
  );
}
