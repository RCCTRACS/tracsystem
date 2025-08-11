export type AppUser = {
  id: string;
  full_name: string;
  email: string;
  department: string;
  access: string;
  created_at?: string;
};

const LS_KEY = "app_users";

function readLocal(): AppUser[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AppUser[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(users: AppUser[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(users)); } catch {}
}

export async function listUsers(): Promise<AppUser[]> {
  return readLocal();
}

export async function addUser(input: Omit<AppUser, "id" | "created_at">): Promise<AppUser> {
  const local = readLocal();
  const user: AppUser = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...input };
  local.unshift(user);
  writeLocal(local);
  return user;
}

export async function updateUser(id: string, patch: Partial<Omit<AppUser, "id" | "created_at">>): Promise<AppUser> {
  const local = readLocal();
  const idx = local.findIndex((u) => u.id === id);
  if (idx >= 0) {
    local[idx] = { ...local[idx], ...patch };
    writeLocal(local);
    return local[idx];
  }
  throw new Error("User not found");
}

export async function deleteUser(id: string): Promise<void> {
  const local = readLocal().filter((u) => u.id !== id);
  writeLocal(local);
}

export async function bulkInsert(rows: Array<Omit<AppUser, "id" | "created_at">>): Promise<void> {
  const withIds = rows.map((r) => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...r }));
  const local = [...withIds, ...readLocal()];
  writeLocal(local);
}

export function getCsvTemplate() {
  return "full_name,email,department,access\n";
}

export function toCsv(users: AppUser[]) {
  const header = "full_name,email,department,access\n";
  const body = users.map((u) => [u.full_name, u.email, u.department, u.access].join(",")).join("\n");
  return header + body + "\n";
}
