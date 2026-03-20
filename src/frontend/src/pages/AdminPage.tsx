import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { Gift, Loader2, Stamp, UserCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import {
  useAddStamp,
  useAllUsersLoyalty,
  useAssignRole,
  usePendingUsers,
  useRedeemVoucher,
  useRegisterUser,
} from "../hooks/useQueries";

function shortPrincipal(p: Principal) {
  const str = p.toString();
  return str.length > 16 ? `${str.slice(0, 8)}…${str.slice(-6)}` : str;
}

export function AdminPage() {
  const { data: allUsers, isLoading } = useAllUsersLoyalty();
  const { data: pendingUsers, isLoading: pendingLoading } = usePendingUsers();
  const addStamp = useAddStamp();
  const redeemVoucher = useRedeemVoucher();
  const assignRole = useAssignRole();
  const registerUser = useRegisterUser();
  const [pendingStamp, setPendingStamp] = useState<string | null>(null);
  const [pendingRedeem, setPendingRedeem] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [pendingRegister, setPendingRegister] = useState<string | null>(null);

  const handleAddStamp = async (user: Principal) => {
    const key = user.toString();
    setPendingStamp(key);
    try {
      await addStamp.mutateAsync(user);
      toast.success("Stamp added! 🧋");
    } catch {
      toast.error("Failed to add stamp.");
    } finally {
      setPendingStamp(null);
    }
  };

  const handleRedeem = async (user: Principal, voucherId: string) => {
    const key = user.toString();
    setPendingRedeem(key);
    try {
      await redeemVoucher.mutateAsync({ user, voucherId });
      toast.success("Voucher redeemed! 🎉");
    } catch {
      toast.error("Failed to redeem voucher.");
    } finally {
      setPendingRedeem(null);
    }
  };

  const handleRoleChange = async (user: Principal, role: UserRole) => {
    const key = user.toString();
    setPendingRole(key);
    try {
      await assignRole.mutateAsync({ user, role });
      toast.success("Role updated.");
    } catch {
      toast.error("Failed to update role.");
    } finally {
      setPendingRole(null);
    }
  };

  const handleRegister = async (user: Principal) => {
    const key = user.toString();
    setPendingRegister(key);
    try {
      await registerUser.mutateAsync(user);
      toast.success("User registered! 🎉");
    } catch {
      toast.error("Failed to register user.");
    } finally {
      setPendingRegister(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "oklch(0.42 0.09 55 / 0.12)" }}
        >
          <Users className="w-5 h-5" style={{ color: "oklch(0.42 0.09 55)" }} />
        </div>
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.30 0.08 55)" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {allUsers?.length ?? 0} customer{allUsers?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Pending Registrations */}
      {(pendingLoading || (pendingUsers && pendingUsers.length > 0)) && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <UserCheck
              className="w-4 h-4"
              style={{ color: "oklch(0.42 0.09 55)" }}
            />
            <h2
              className="font-display font-semibold text-base"
              style={{ color: "oklch(0.30 0.08 55)" }}
            >
              Pending Registrations
            </h2>
            {pendingUsers && pendingUsers.length > 0 && (
              <Badge
                className="text-xs px-1.5"
                style={{
                  background: "oklch(0.42 0.09 55 / 0.15)",
                  color: "oklch(0.30 0.08 55)",
                  border: "none",
                }}
              >
                {pendingUsers.length}
              </Badge>
            )}
          </div>

          {pendingLoading ? (
            <div className="space-y-2" data-ocid="admin.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2" data-ocid="admin.list">
              {pendingUsers?.map((principal, idx) => {
                const key = principal.toString();
                const isRegistering = pendingRegister === key;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
                    style={{
                      background: "oklch(0.97 0.025 75)",
                      border: "1px solid oklch(0.88 0.06 75)",
                    }}
                    data-ocid={`admin.item.${idx + 1}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">👤</span>
                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: "oklch(0.30 0.08 55)" }}
                      >
                        {shortPrincipal(principal)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRegister(principal)}
                      disabled={isRegistering}
                      className="rounded-xl flex items-center gap-1.5 text-xs h-8 shrink-0"
                      style={{ background: "oklch(0.42 0.09 55)" }}
                      data-ocid="admin.primary_button"
                    >
                      {isRegistering ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <UserCheck className="w-3 h-3" />
                      )}
                      Register
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Customers */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : allUsers?.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "oklch(0.99 0.012 75)",
            boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.06)",
          }}
          data-ocid="admin.empty_state"
        >
          <p className="text-3xl mb-2">🧋</p>
          <p className="font-semibold" style={{ color: "oklch(0.30 0.08 55)" }}>
            No customers yet
          </p>
          <p className="text-sm text-muted-foreground">
            Users will appear here once they sign in.
          </p>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="admin.table">
          {allUsers?.map(([principal, loyalty], idx) => {
            const key = principal.toString();
            const stamps = Number(loyalty.stampCount);
            const activeVouchers = loyalty.vouchers.filter((v) => !v.redeemed);
            const isStamping = pendingStamp === key;
            const isRedeeming = pendingRedeem === key;
            const isRoling = pendingRole === key;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl p-5 space-y-4"
                style={{
                  background: "oklch(0.99 0.012 75)",
                  boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.08)",
                }}
                data-ocid={`admin.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: "oklch(0.30 0.08 55)" }}
                    >
                      {shortPrincipal(principal)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-sm font-display font-bold"
                        style={{ color: "oklch(0.42 0.09 55)" }}
                      >
                        {stamps} / 12
                      </span>
                      <span className="text-xs text-muted-foreground">
                        stamps
                      </span>
                      {activeVouchers.length > 0 && (
                        <Badge
                          className="text-xs px-1.5"
                          style={{
                            background: "oklch(0.55 0.12 190 / 0.15)",
                            color: "oklch(0.35 0.12 190)",
                            border: "none",
                          }}
                        >
                          {activeVouchers.length} voucher
                          {activeVouchers.length !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Select
                    onValueChange={(val) =>
                      handleRoleChange(principal, val as UserRole)
                    }
                    disabled={isRoling}
                  >
                    <SelectTrigger
                      className="w-28 h-8 text-xs rounded-xl"
                      data-ocid="admin.select"
                    >
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.user}>User</SelectItem>
                      <SelectItem value={UserRole.admin}>Admin</SelectItem>
                      <SelectItem value={UserRole.guest}>Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {[
                    "s1",
                    "s2",
                    "s3",
                    "s4",
                    "s5",
                    "s6",
                    "s7",
                    "s8",
                    "s9",
                    "s10",
                    "s11",
                    "s12",
                  ].map((k, i) => (
                    <span
                      key={k}
                      className="text-sm"
                      title={i < stamps ? "Stamped" : "Empty"}
                    >
                      {i < stamps ? "🧋" : "○"}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => handleAddStamp(principal)}
                    disabled={isStamping}
                    className="rounded-xl flex items-center gap-1.5 text-xs h-8"
                    style={{ background: "oklch(0.42 0.09 55)" }}
                    data-ocid="admin.button"
                  >
                    {isStamping ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Stamp className="w-3 h-3" />
                    )}
                    Add Stamp
                  </Button>

                  {activeVouchers.map((v) => (
                    <Button
                      key={v.id}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRedeem(principal, v.id)}
                      disabled={isRedeeming}
                      className="rounded-xl flex items-center gap-1.5 text-xs h-8"
                      style={{
                        borderColor: "oklch(0.55 0.12 190 / 0.4)",
                        color: "oklch(0.35 0.12 190)",
                      }}
                      data-ocid="admin.secondary_button"
                    >
                      {isRedeeming ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Gift className="w-3 h-3" />
                      )}
                      Redeem Voucher
                    </Button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
