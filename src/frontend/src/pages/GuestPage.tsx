import { Button } from "@/components/ui/button";
import { Gift, Stamp, Star } from "lucide-react";
import { motion } from "motion/react";

interface GuestPageProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

export function GuestPage({ onLogin, isLoggingIn }: GuestPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <img
            src="/assets/uploads/images-1.jpeg"
            alt="Dakasi logo"
            className="w-24 h-24 rounded-3xl object-cover shadow-stamp"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-4xl font-bold mb-2"
          style={{ color: "oklch(0.30 0.08 55)" }}
        >
          Dakasi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-lg text-muted-foreground mb-8"
        >
          Milk Tea Loyalty Program
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              icon: Stamp,
              label: "Collect Stamps",
              desc: "1 stamp per purchase",
            },
            { icon: Gift, label: "Earn Vouchers", desc: "50% off at 12" },
            { icon: Star, label: "Exclusive Perks", desc: "Member rewards" },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col items-center gap-2"
              style={{
                background: "oklch(0.99 0.012 75)",
                boxShadow: "0 2px 12px oklch(0.42 0.09 55 / 0.08)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.42 0.09 55 / 0.1)" }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: "oklch(0.42 0.09 55)" }}
                />
              </div>
              <p
                className="font-semibold text-xs text-center"
                style={{ color: "oklch(0.30 0.08 55)" }}
              >
                {label}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {desc}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            onClick={onLogin}
            disabled={isLoggingIn}
            className="w-full text-base font-semibold rounded-xl h-14 shadow-stamp"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.42 0.09 55), oklch(0.35 0.08 50))",
            }}
            data-ocid="auth.primary_button"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting…
              </span>
            ) : (
              "Sign in to start collecting"
            )}
          </Button>
        </motion.div>

        <p className="mt-4 text-xs text-muted-foreground">
          Secure login powered by Internet Identity
        </p>
      </motion.div>
    </div>
  );
}
