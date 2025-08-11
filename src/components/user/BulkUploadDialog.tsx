import Papa from "papaparse";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { getCsvTemplate } from "@/data/users";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (rows: Array<{ full_name: string; email: string; department: string; access: string }>) => Promise<void> | void;
}

const BulkUploadDialog = ({ open, onOpenChange, onComplete }: BulkUploadDialogProps) => {
  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: any[] = results.data as any[];
        const mapped = rows
          .map((r) => ({
            full_name: r.full_name ?? r.name ?? "",
            email: r.email ?? "",
            department: r.department ?? "",
            access: r.access ?? "",
          }))
          .filter((r) => r.full_name && r.email);
        onComplete(mapped);
        onOpenChange(false);
      },
    });
  };

  const downloadTemplate = () => {
    const blob = new Blob([getCsvTemplate()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Upload</DialogTitle>
          <DialogDescription>Upload a CSV file with columns: full_name, email, department, access.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input type="file" accept=".csv" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
          <Button variant="pill" size="pill" onClick={downloadTemplate}><Download /> Download Template</Button>
        </div>
        <DialogFooter>
          <Button variant="soft" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;