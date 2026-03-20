import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Gift } from "lucide-react";
import { motion } from "motion/react";
import type { Voucher } from "../backend";

interface VoucherCardProps {
  voucher: Voucher;
  index: number;
}

function formatDate(time: bigint) {
  const ms = Number(time / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function VoucherCard({ voucher, index }: VoucherCardProps) {
  const active = !voucher.redeemed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl"
      data-ocid={`voucher.item.${index + 1}`}
      style={{
        opacity: active ? 1 : 0.6,
        background: active
          ? "linear-gradient(135deg, oklch(0.96 0.10 88 / 0.6), oklch(0.92 0.14 80 / 0.4))"
          : "oklch(0.93 0.02 75)",
        border: active
          ? "2px dashed oklch(0.70 0.16 78 / 0.7)"
          : "2px dashed oklch(0.75 0.03 72)",
      }}
    >
      {/* Notch left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-background" />
      {/* Notch right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-background" />

      <div className="px-8 py-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          {active ? (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.82 0.17 88 / 0.4)" }}
            >
              <Gift
                className="w-6 h-6"
                style={{ color: "oklch(0.50 0.16 72)" }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted">
              <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className="font-display font-bold text-lg"
              style={{ color: active ? "oklch(0.28 0.08 60)" : undefined }}
            >
              50% DRINK
            </p>
            {active ? (
              <Badge
                className="text-xs"
                style={{
                  background: "oklch(0.82 0.17 88 / 0.4)",
                  color: "oklch(0.38 0.12 68)",
                  border: "none",
                }}
              >
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Used
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {active
              ? "Present this at the counter"
              : `Redeemed · Earned ${formatDate(voucher.created)}`}
          </p>
          {active && (
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.50 0.12 72)" }}
            >
              ID: {voucher.id.slice(0, 8)}…
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
