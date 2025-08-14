import { PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AppUser = {
  id: string;
  full_name: string;
  email: string;
  department: string;
  access: string;
  created_at?: string;
};

interface UserTableProps {
  users: AppUser[];
  onEdit: (u: AppUser) => void;
  onDelete: (u: AppUser) => void;
}

const colClasses = "px-4 text-sm font-medium";

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  return (
    <section
      aria-label="Users"
      className="mt-5 rounded-2xl border-2 border-sidebar p-4 md:p-5"
    >
      <div className="grid grid-cols-[1.4fr_1.6fr_1fr_1fr_84px] gap-2 px-2 pb-3">
        <div className="text-sm font-semibold text-black">Name</div>
        <div className="text-sm font-semibold text-black">Email</div>
        <div className="text-sm font-semibold text-black">Department</div>
        <div className="text-sm font-semibold text-black">Access</div>
      </div>

      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[1.4fr_1.6fr_1fr_1fr_84px] items-center gap-2 bg-muted rounded-full py-2.5"
          >
            <div className={colClasses}>{u.full_name}</div>
            <div className={colClasses}>{u.email}</div>
            <div className={colClasses}>{u.department}</div>
            <div className={colClasses}>{u.access}</div>
            <div className="flex items-center justify-end gap-1 pr-2">
              <Button
                variant="pill"
                size="icon"
                aria-label={`Edit ${u.full_name}`}
                onClick={() => onEdit(u)}
                className="border-2 border-sidebar text-sidebar"
              >
                <PencilLine />
              </Button>
              <Button
                variant="pill"
                size="icon"
                aria-label={`Delete ${u.full_name}`}
                onClick={() => onDelete(u)}
                className="border-2 border-sidebar text-sidebar"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="rounded-xl bg-muted px-4 py-6 text-center text-muted-foreground">
            No users found.
          </div>
        )}
      </div>
    </section>
  );
};

export default UserTable;
