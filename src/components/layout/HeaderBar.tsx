import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Download, Filter, Search, CircleUserRound } from "lucide-react";

interface HeaderBarProps {
  query: string;
  onQueryChange: (v: string) => void;
  onAdd: () => void;
  onDownloadTemplate: () => void;
  onBulkUpload: () => void;
  onExport: () => void;
}

const HeaderBar = ({ query, onQueryChange, onAdd, onDownloadTemplate, onBulkUpload, onExport }: HeaderBarProps) => {
  return (
    <header className="w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">SMART System</p>
          <h1 className="text-3xl md:text-4xl font-bold">User Management</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--ring))]/60 bg-secondary px-3 py-1.5">
          <CircleUserRound className="opacity-80" />
          <span className="text-sm font-medium">Gerwin</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search"
              className="rounded-full pl-12 h-11 bg-secondary border border-[hsl(var(--ring))]/60"
              aria-label="Search users"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="pill" size="pill" onClick={onAdd}><Plus /> Add</Button>
            <Button variant="pill" size="pill" onClick={onDownloadTemplate}><Download /> Download Template</Button>
            <Button variant="pill" size="pill" onClick={onBulkUpload}><Upload /> Bulk Upload</Button>
            <Button variant="pill" size="pill" onClick={onExport}><Download /> Export</Button>
            <Button variant="pill" size="pill"><Filter /> Filter</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;