import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(1, "Required"),
  access: z.string().min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserFormValues = z.infer<typeof schema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: any) => void; // para i-update sa table
  initialValues?: Partial<UserFormValues>;
}

const UserFormDialog = ({ open, onOpenChange, onUserAdded, initialValues }: UserFormDialogProps) => {
  const [mainDepartment, setMainDepartment] = useState(initialValues?.department ?? "");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: initialValues?.full_name ?? "",
      email: initialValues?.email ?? "",
      department: initialValues?.department ?? "",
      access: initialValues?.access ?? "",
      password: initialValues?.password ?? "",
    },
  });

  // Map department string to IDs
  const departmentMap: Record<string, number> = {
    "ITS": 1,
    "Teacher - College": 2,
    "Teacher - Highschool": 3,
  };

  const roleMap: Record<string, number> = {
    "Admin": 1,
    "Teacher": 2,
  };

  const submit = async (values: UserFormValues) => {
    try {
      const newUser = {
        name: values.full_name,
        email: values.email,
        password: values.password,
        role_id: roleMap[values.access] || 2,
        department_id: departmentMap[values.department] || 1,
      };

      const res = await fetch("http://localhost/rcc_tracs/backend/add_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (res.ok) {
        onUserAdded({
          id: data.user_id,
          full_name: values.full_name,
          email: values.email,
          department: values.department,
          access: values.access,
        });
        reset();
        onOpenChange(false);
      } else {
        alert(data.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialValues ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name" className="text-black font-bold">Full name</Label>
            <Input id="full_name" {...register("full_name")} aria-invalid={!!errors.full_name} />
            {errors.full_name && <span className="text-sm text-destructive">{errors.full_name.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-black font-bold">Email</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department" className="text-black font-bold">Department</Label>
            <Select onValueChange={(value) => { setMainDepartment(value); if(value!=="Teacher") setValue("department", value); }} defaultValue={mainDepartment}>
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="ITS">ITS</SelectItem>
              </SelectContent>
            </Select>
            {errors.department && <span className="text-sm text-destructive">{errors.department.message}</span>}
          </div>

          {mainDepartment === "Teacher" && (
            <div className="grid gap-2">
              <Label className="text-black font-bold">Teacher Level</Label>
              <Select onValueChange={(value) => setValue("department", `Teacher - ${value}`)}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="College">College</SelectItem>
                  <SelectItem value="Highschool">Highschool</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="access" className="text-black font-bold">Access</Label>
            <Select onValueChange={(value) => setValue("access", value)} defaultValue={initialValues?.access ?? ""}>
              <SelectTrigger><SelectValue placeholder="Select access level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
            {errors.access && <span className="text-sm text-destructive">{errors.access.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-black font-bold">Password</Label>
            <Input id="password" type="password" {...register("password")} aria-invalid={!!errors.password} />
            {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={isSubmitting}>{initialValues ? "Save Changes" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
