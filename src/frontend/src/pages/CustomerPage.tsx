import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Loader2, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { StampCard } from "../components/StampCard";
import { VoucherCard } from "../components/VoucherCard";
import {
  useCallerProfile,
  useSaveProfile,
  useUserLoyalty,
} from "../hooks/useQueries";

export function CustomerPage() {
  const { data: loyalty, isLoading: loyaltyLoading } = useUserLoyalty();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const saveProfile = useSaveProfile();
  const [nameInput, setNameInput] = useState("");
  const [editingName, setEditingName] = useState(false);

  const stampCount = loyalty ? Number(loyalty.stampCount) : 0;
  const vouchers = loyalty?.vouchers ?? [];
  const activeVouchers = vouchers.filter((v) => !v.redeemed);
  const usedVouchers = vouchers.filter((v) => v.redeemed);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    try {
      await saveProfile.mutateAsync(nameInput.trim());
      setEditingName(false);
      toast.success("Profile saved! Welcome to Dakasi. 🧋");
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  const hasProfile = profile?.name;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <AnimatePresence>
        {!profileLoading && !hasProfile && !editingName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "oklch(0.55 0.12 190 / 0.1)",
              border: "1.5px solid oklch(0.55 0.12 190 / 0.25)",
            }}
          >
            <User
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "oklch(0.45 0.12 190)" }}
            />
            <p
              className="text-sm flex-1"
              style={{ color: "oklch(0.35 0.1 190)" }}
            >
              Set your name to personalise your card
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingName(true)}
              className="flex-shrink-0 rounded-xl border-accent/40"
              data-ocid="profile.edit_button"
            >
              Set name
            </Button>
          </motion.div>
        )}

        {editingName && (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: "oklch(0.99 0.012 75)",
              boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.08)",
            }}
            data-ocid="profile.card"
          >
            <Label htmlFor="name-input" className="font-semibold">
              Your name
            </Label>
            <Input
              id="name-input"
              placeholder="e.g. Sarah"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              className="rounded-xl"
              data-ocid="profile.input"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSaveName}
                disabled={saveProfile.isPending || !nameInput.trim()}
                className="rounded-xl flex-1"
                style={{ background: "oklch(0.42 0.09 55)" }}
                data-ocid="profile.submit_button"
              >
                {saveProfile.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingName(false)}
                className="rounded-xl"
                data-ocid="profile.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasProfile && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-display font-semibold"
          style={{ color: "oklch(0.30 0.08 55)" }}
        >
          Hey, {profile?.name}! 👋
        </motion.p>
      )}

      {loyaltyLoading ? (
        <Skeleton
          className="h-56 rounded-2xl"
          data-ocid="stamp.loading_state"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StampCard stampCount={stampCount} />
        </motion.div>
      )}

      {activeVouchers.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className="font-display font-bold text-xl mb-3"
            style={{ color: "oklch(0.30 0.08 55)" }}
          >
            🎟️ Active Vouchers
          </h2>
          <div className="space-y-3">
            {activeVouchers.map((v, i) => (
              <VoucherCard key={v.id} voucher={v} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {!loyaltyLoading && vouchers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 text-center"
          style={{
            background: "oklch(0.99 0.012 75)",
            boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.06)",
          }}
          data-ocid="voucher.empty_state"
        >
          <p className="text-3xl mb-2">🎯</p>
          <p className="font-semibold" style={{ color: "oklch(0.30 0.08 55)" }}>
            No vouchers yet
          </p>
        </motion.div>
      )}

      {usedVouchers.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-base text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Used Vouchers
          </h2>
          <div className="space-y-2">
            {usedVouchers.map((v, i) => (
              <VoucherCard key={v.id} voucher={v} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
