import { motion } from "motion/react";

interface StampCardProps {
  stampCount: number;
  totalStamps?: number;
}

const TOTAL = 12;
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

export function StampCard({ stampCount, totalStamps = TOTAL }: StampCardProps) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.82 0.17 88), oklch(0.75 0.19 72))",
        boxShadow: "0 8px 32px oklch(0.75 0.19 72 / 0.35)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-20"
        style={{
          background: "oklch(0.99 0.02 95)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-20"
        style={{
          background: "oklch(0.99 0.02 95)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="flex items-center justify-between mb-5">
        <div>
          <p
            className="text-xs font-body font-semibold tracking-widest uppercase"
            style={{ color: "oklch(0.40 0.10 72)" }}
          >
            Loyalty Card
          </p>
          <h2
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.22 0.08 60)" }}
          >
            Dakasi 🧋
          </h2>
        </div>
        <div className="text-right">
          <p
            className="font-display text-3xl font-bold"
            style={{ color: "oklch(0.22 0.08 60)" }}
          >
            {stampCount}
            <span
              className="text-lg font-normal"
              style={{ color: "oklch(0.40 0.10 72)" }}
            >
              /{totalStamps}
            </span>
          </p>
          <p className="text-xs" style={{ color: "oklch(0.40 0.10 72)" }}>
            stamps earned
          </p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {MONTHS.slice(0, totalStamps).map((month, i) => {
          const filled = i < stampCount;
          return (
            <motion.div
              key={month}
              initial={filled ? { scale: 0.5, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="flex flex-col items-center justify-center rounded-xl py-1.5"
              style={{
                background: filled
                  ? "oklch(0.22 0.08 60 / 0.18)"
                  : "oklch(0.99 0.02 95 / 0.35)",
                border: filled
                  ? "2px solid oklch(0.22 0.08 60 / 0.45)"
                  : "2px dashed oklch(0.50 0.12 78 / 0.55)",
                boxShadow: filled
                  ? "0 2px 8px oklch(0.22 0.08 60 / 0.20)"
                  : "none",
              }}
              data-ocid={`stamp.item.${i + 1}`}
            >
              {filled ? (
                <span className="text-base select-none">🧋</span>
              ) : (
                <span
                  className="text-xs select-none"
                  style={{ color: "oklch(0.40 0.10 72)" }}
                >
                  ○
                </span>
              )}
              <span
                className="text-[9px] font-semibold mt-0.5 select-none"
                style={{
                  color: filled ? "oklch(0.22 0.08 60)" : "oklch(0.42 0.10 72)",
                }}
              >
                {month}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.60 0.14 78 / 0.35)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "oklch(0.22 0.08 60)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(stampCount / totalStamps) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p
          className="mt-2 text-xs text-center font-semibold"
          style={{ color: "oklch(0.28 0.08 60)" }}
        >
          {stampCount >= totalStamps
            ? "🎉 Voucher earned! Redeem at the counter."
            : "Remaining less 50% DRINK"}
        </p>
      </div>
    </div>
  );
}
