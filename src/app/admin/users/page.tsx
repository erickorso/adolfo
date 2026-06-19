import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listUsers } from "@/services/admin/user-admin.service";
import { banUserAction, setRoleAction } from "@/app/admin/actions";

const ROLES = ["CUSTOMER", "ADMIN", "SUPERADMIN"] as const;

/** Gestión de usuarios: cambiar rol, banear / desbanear. */
export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Usuarios ({users.length})</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Nombre</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Rol</th>
              <th className="px-3 py-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const banned = u.status === "BANNED";
              return (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.name ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Badge variant={banned ? "destructive" : "secondary"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <form action={setRoleAction} className="flex items-center gap-1">
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" size="sm" variant="outline">
                        Guardar
                      </Button>
                    </form>
                  </td>
                  <td className="px-3 py-2">
                    <form action={banUserAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input
                        type="hidden"
                        name="banned"
                        value={banned ? "false" : "true"}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant={banned ? "outline" : "destructive"}
                      >
                        {banned ? "Desbanear" : "Banear"}
                      </Button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
