import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Upload,
  Download,
  Filter,
  Search,
  CircleUserRound,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface HeaderBarProps {
  query: string;
  onQueryChange: (v: string) => void;
  onAdd: () => void;
  onDownloadTemplate: () => void;
  onBulkUpload: () => void;
  onExport: () => void;
  onFilterChange?: (department: string, subDepartment?: string) => void;
}

const HeaderBar = ({
  query,
  onQueryChange,
  onAdd,
  onDownloadTemplate,
  onBulkUpload,
  onExport,
  onFilterChange,
}: HeaderBarProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [showTeacherOptions, setShowTeacherOptions] = useState(false);

  const handleMainFilter = (dept: string) => {
    setSelectedDepartment(dept);
    setShowTeacherOptions(dept === "Teacher");
    onFilterChange?.(dept);
  };

  const handleTeacherSubFilter = (subDept: string) => {
    onFilterChange?.("Teacher", subDept);
  };

  return (
    <header className="w-full">
      {/* Title & User */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">RCC TRACS</p>
          <h1 className="text-3xl md:text-4xl font-bold">User Management</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--ring))]/60 bg-secondary px-3 py-1.5">
          <CircleUserRound className="opacity-80" />
          <span className="text-sm font-medium">Gerwin</span>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[240px] flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search"
              className="rounded-full pl-12 h-11 bg-white border-2 border-sidebar focus:border-sidebar focus:ring-2 focus:ring-sidebar"
              aria-label="Search users"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="pill"
              size="pill"
              onClick={onAdd}
              className="border-2 border-sidebar text-sidebar font-bold"
            >
              <Plus /> Add
            </Button>
            <Button
              variant="pill"
              size="pill"
              onClick={onDownloadTemplate}
              className="border-2 border-sidebar text-sidebar font-bold"
            >
              <Download /> Download Template
            </Button>
            <Button
              variant="pill"
              size="pill"
              onClick={onBulkUpload}
              className="border-2 border-sidebar text-sidebar font-bold"
            >
              <Upload /> Bulk Upload
            </Button>
            <Button
              variant="pill"
              size="pill"
              onClick={onExport}
              className="border-2 border-sidebar text-sidebar font-bold"
            >
              <Download /> Export
            </Button>

            {/* Filter Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="pill"
                  size="pill"
                  className="border-2 border-sidebar text-sidebar font-bold"
                >
                  <Filter /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 space-y-3">
                <Label className="font-bold">Filter by Department</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedDepartment === "ITS" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMainFilter("ITS")}
                  >
                    ITS
                  </Button>
                  <Button
                    variant={selectedDepartment === "Teacher" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMainFilter("Teacher")}
                  >
                    Teacher
                  </Button>
                </div>

                {/* Show Teacher Sub-options */}
                {showTeacherOptions && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTeacherSubFilter("College")}
                    >
                      College
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTeacherSubFilter("Highschool")}
                    >
                      Highschool
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
