import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(1, "Required"),
  access: z.string().min(1, "Required"),
});

export type UserFormValues = z.infer<typeof schema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

const UserFormDialog = ({ open, onOpenChange, initialValues, onSubmit }: UserFormDialogProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: initialValues?.full_name ?? "",
      email: initialValues?.email ?? "",
      department: initialValues?.department ?? "",
      access: initialValues?.access ?? "Admin",
    },
  });

  const submit = async (values: UserFormValues) => {
    await onSubmit(values);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialValues ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" {...register("full_name")} aria-invalid={!!errors.full_name} />
            {errors.full_name && <span className="text-sm text-destructive">{errors.full_name.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" {...register("department")} aria-invalid={!!errors.department} />
            {errors.department && <span className="text-sm text-destructive">{errors.department.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="access">Access</Label>
            <Input id="access" placeholder="Admin | User | Viewer" {...register("access")} aria-invalid={!!errors.access} />
            {errors.access && <span className="text-sm text-destructive">{errors.access.message}</span>}
          </div>
          <DialogFooter>
            <Button type="submit" variant="hero" disabled={isSubmitting}>{initialValues ? "Save Changes" : "Add User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;