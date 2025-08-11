import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import HeaderBar from "@/components/layout/HeaderBar";
import UserTable from "@/components/user/UserTable";
import UserFormDialog, { UserFormValues } from "@/components/user/UserFormDialog";
import BulkUploadDialog from "@/components/user/BulkUploadDialog";
import { listUsers, addUser, updateUser, deleteUser, bulkInsert, getCsvTemplate, toCsv } from "@/data/users";
import type { AppUser } from "@/components/user/UserTable";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  useEffect(() => {
    listUsers().then(setUsers);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => [u.full_name, u.email, u.department, u.access].some((v) => v?.toLowerCase().includes(q)));
  }, [query, users]);

  const handleAdd = async (values: UserFormValues) => {
    const created = await addUser(values as unknown as Omit<AppUser, "id" | "created_at">);
    setUsers((prev) => [created, ...prev]);
    toast({ title: "User added" });
  };
  const handleEdit = async (values: UserFormValues) => {
    if (!editing) return;
    const updated = await updateUser(editing.id, values);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    toast({ title: "User updated" });
  };

  const handleDelete = async (u: AppUser) => {
    await deleteUser(u.id);
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    toast({ title: "User deleted" });
  };

  const onDownloadTemplate = () => {
    const blob = new Blob([getCsvTemplate()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onExport = () => {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 px-6 md:px-10 py-8">
        <HeaderBar
          query={query}
          onQueryChange={setQuery}
          onAdd={() => { setEditing(null); setOpenForm(true); }}
          onDownloadTemplate={onDownloadTemplate}
          onBulkUpload={() => setBulkOpen(true)}
          onExport={onExport}
        />

        <UserTable
          users={filtered}
          onEdit={(u) => { setEditing(u); setOpenForm(true); }}
          onDelete={handleDelete}
        />
      </main>

      <UserFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initialValues={editing ?? undefined}
        onSubmit={editing ? handleEdit : handleAdd}
      />

      <BulkUploadDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        onComplete={async (rows) => {
          await bulkInsert(rows);
          setUsers(await listUsers());
          toast({ title: "Bulk upload complete" });
        }}
      />
    </div>
  );
};

export default Index;
