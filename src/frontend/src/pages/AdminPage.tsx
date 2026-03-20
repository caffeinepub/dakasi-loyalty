import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import {
  Gift,
  Loader2,
  Search,
  Stamp,
  Star,
  TicketCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function shortPrincipal(p: Principal) {
  const str = p.toString();
  return str.length > 16 ? `${str.slice(0, 8)}…${str.slice(-6)}` : str;
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "oklch(0.99 0.012 75)",
        boxShadow: "0 2px 16px oklch(0.42 0.09 55 / 0.09)",
        border: "1px solid oklch(0.93 0.04 75)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: `${color} / 0.12)`
            .replace(" /", "")
            .replace(")", " / 0.12)"),
        }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-2xl font-bold font-display"
          style={{ color: "oklch(0.28 0.08 55)" }}
        >
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
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
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    if (!allUsers)
      return {
        customers: 0,
        stamps: 0,
        activeVouchers: 0,
        redeemedVouchers: 0,
      };
    let stamps = 0;
    let activeVouchers = 0;
    let redeemedVouchers = 0;
    for (const [, loyalty] of allUsers) {
      stamps += Number(loyalty.stampCount);
      for (const v of loyalty.vouchers) {
        if (v.redeemed) redeemedVouchers++;
        else activeVouchers++;
      }
    }
    return {
      customers: allUsers.length,
      stamps,
      activeVouchers,
      redeemedVouchers,
    };
  }, [allUsers]);

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    if (!search.trim()) return allUsers;
    const q = search.toLowerCase();
    return allUsers.filter(([principal]) =>
      principal.toString().toLowerCase().includes(q),
    );
  }, [allUsers, search]);

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

  const pendingCount = pendingUsers?.length ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: "oklch(0.42 0.09 55 / 0.14)" }}
        >
          <Users className="w-5 h-5" style={{ color: "oklch(0.42 0.09 55)" }} />
        </div>
        <div>
          <h1
            className="font-display text-2xl font-bold tracking-tight"
            style={{ color: "oklch(0.28 0.08 55)" }}
          >
            Admin Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Dakasi Milk Tea · Loyalty System
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList
          className="rounded-2xl h-11 p-1 w-full"
          style={{
            background: "oklch(0.96 0.025 75)",
            border: "1px solid oklch(0.90 0.045 75)",
          }}
          data-ocid="admin.tab"
        >
          <TabsTrigger
            value="overview"
            className="rounded-xl flex-1 text-sm font-medium data-[state=active]:shadow-sm transition-all"
            style={{ fontFamily: "var(--font-display)" }}
            data-ocid="admin.overview.tab"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="rounded-xl flex-1 text-sm font-medium data-[state=active]:shadow-sm transition-all"
            style={{ fontFamily: "var(--font-display)" }}
            data-ocid="admin.customers.tab"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-xl flex-1 text-sm font-medium data-[state=active]:shadow-sm transition-all relative"
            style={{ fontFamily: "var(--font-display)" }}
            data-ocid="admin.pending.tab"
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold leading-none"
                style={{
                  background: "oklch(0.55 0.18 28)",
                  color: "white",
                }}
              >
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW TAB ── */}
        <TabsContent value="overview" className="mt-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={
                <Users
                  className="w-4 h-4"
                  style={{ color: "oklch(0.42 0.09 55)" }}
                />
              }
              label="Total Customers"
              value={isLoading ? "—" : stats.customers}
              color="oklch(0.42 0.09 55"
            />
            <StatCard
              icon={
                <Stamp
                  className="w-4 h-4"
                  style={{ color: "oklch(0.50 0.14 165)" }}
                />
              }
              label="Total Stamps"
              value={isLoading ? "—" : stats.stamps}
              color="oklch(0.50 0.14 165"
            />
            <StatCard
              icon={
                <Star
                  className="w-4 h-4"
                  style={{ color: "oklch(0.58 0.18 55)" }}
                />
              }
              label="Active Vouchers"
              value={isLoading ? "—" : stats.activeVouchers}
              color="oklch(0.58 0.18 55"
            />
            <StatCard
              icon={
                <TicketCheck
                  className="w-4 h-4"
                  style={{ color: "oklch(0.50 0.13 240)" }}
                />
              }
              label="Redeemed Vouchers"
              value={isLoading ? "—" : stats.redeemedVouchers}
              color="oklch(0.50 0.13 240"
            />
          </div>

          {/* Quick snapshot table */}
          {isLoading ? (
            <div className="space-y-2" data-ocid="admin.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 rounded-xl" />
              ))}
            </div>
          ) : allUsers && allUsers.length > 0 ? (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid oklch(0.91 0.04 75)" }}
            >
              <div
                className="px-4 py-2.5 flex items-center gap-2"
                style={{ background: "oklch(0.95 0.03 75)" }}
              >
                <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Top customers by stamps
                </span>
              </div>
              {[...allUsers]
                .sort(
                  (a, b) => Number(b[1].stampCount) - Number(a[1].stampCount),
                )
                .slice(0, 5)
                .map(([principal, loyalty], idx) => (
                  <div
                    key={principal.toString()}
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                      background:
                        idx % 2 === 0
                          ? "oklch(0.99 0.012 75)"
                          : "oklch(0.97 0.02 75)",
                      borderTop:
                        idx === 0 ? "none" : "1px solid oklch(0.93 0.03 75)",
                    }}
                    data-ocid={`admin.row.${idx + 1}`}
                  >
                    <span
                      className="text-sm font-mono"
                      style={{ color: "oklch(0.42 0.07 55)" }}
                    >
                      {shortPrincipal(principal)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.42 0.09 55)" }}
                      >
                        {Number(loyalty.stampCount)} stamps
                      </span>
                      {loyalty.vouchers.filter((v) => !v.redeemed).length >
                        0 && (
                        <Badge
                          className="text-[10px] px-1.5 py-0"
                          style={{
                            background: "oklch(0.55 0.18 55 / 0.15)",
                            color: "oklch(0.40 0.10 55)",
                            border: "none",
                          }}
                        >
                          {loyalty.vouchers.filter((v) => !v.redeemed).length}{" "}
                          active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "oklch(0.99 0.012 75)",
                boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.06)",
              }}
              data-ocid="admin.empty_state"
            >
              <p className="text-3xl mb-2">🧋</p>
              <p
                className="font-semibold"
                style={{ color: "oklch(0.30 0.08 55)" }}
              >
                No customers yet
              </p>
              <p className="text-sm text-muted-foreground">
                Users will appear here once they sign in.
              </p>
            </div>
          )}
        </TabsContent>

        {/* ── CUSTOMERS TAB ── */}
        <TabsContent value="customers" className="mt-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by principal…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl h-10"
              style={{
                background: "oklch(0.98 0.015 75)",
                borderColor: "oklch(0.89 0.05 75)",
              }}
              data-ocid="admin.search_input"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3" data-ocid="admin.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "oklch(0.99 0.012 75)",
                boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.06)",
              }}
              data-ocid="admin.empty_state"
            >
              <p className="text-3xl mb-2">🔍</p>
              <p
                className="font-semibold"
                style={{ color: "oklch(0.30 0.08 55)" }}
              >
                {search ? "No matching customers" : "No customers yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "Users will appear here once they sign in."}
              </p>
            </div>
          ) : (
            <div className="space-y-4" data-ocid="admin.table">
              {filteredUsers.map(([principal, loyalty], idx) => {
                const key = principal.toString();
                const stamps = Number(loyalty.stampCount);
                const activeVouchers = loyalty.vouchers.filter(
                  (v) => !v.redeemed,
                );
                const isStamping = pendingStamp === key;
                const isRedeeming = pendingRedeem === key;
                const isRoling = pendingRole === key;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                    className="rounded-2xl p-5 space-y-4"
                    style={{
                      background: "oklch(0.99 0.012 75)",
                      boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.08)",
                      border: "1px solid oklch(0.93 0.04 75)",
                    }}
                    data-ocid={`admin.item.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p
                          className="font-semibold text-sm font-mono truncate"
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
                                background: "oklch(0.55 0.18 55 / 0.15)",
                                color: "oklch(0.38 0.10 55)",
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

                    {/* Stamp grid with month labels */}
                    <div className="grid grid-cols-6 gap-1.5">
                      {MONTHS.map((month, i) => (
                        <div
                          key={month}
                          className="flex flex-col items-center gap-0.5"
                        >
                          <span
                            className="text-[9px] font-semibold uppercase tracking-wide"
                            style={{
                              color:
                                i < stamps
                                  ? "oklch(0.42 0.09 55)"
                                  : "oklch(0.70 0.04 75)",
                            }}
                          >
                            {month}
                          </span>
                          <span
                            className="text-base leading-none"
                            title={i < stamps ? "Stamped" : "Empty"}
                          >
                            {i < stamps ? "🧋" : "○"}
                          </span>
                        </div>
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
                            borderColor: "oklch(0.42 0.09 55 / 0.4)",
                            color: "oklch(0.38 0.10 55)",
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
        </TabsContent>

        {/* ── PENDING TAB ── */}
        <TabsContent value="pending" className="mt-5 space-y-3">
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
            {pendingCount > 0 && (
              <Badge
                className="text-xs px-1.5"
                style={{
                  background: "oklch(0.42 0.09 55 / 0.15)",
                  color: "oklch(0.30 0.08 55)",
                  border: "none",
                }}
              >
                {pendingCount}
              </Badge>
            )}
          </div>

          {pendingLoading ? (
            <div className="space-y-2" data-ocid="admin.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 rounded-2xl" />
              ))}
            </div>
          ) : pendingCount === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "oklch(0.99 0.012 75)",
                boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.06)",
              }}
              data-ocid="admin.empty_state"
            >
              <p className="text-3xl mb-2">✅</p>
              <p
                className="font-semibold"
                style={{ color: "oklch(0.30 0.08 55)" }}
              >
                All caught up!
              </p>
              <p className="text-sm text-muted-foreground">
                No users are waiting for approval.
              </p>
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
                        className="text-sm font-medium font-mono truncate"
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
