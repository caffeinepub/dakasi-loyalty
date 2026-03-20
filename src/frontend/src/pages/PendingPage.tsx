import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { motion } from "motion/react";

interface PendingPageProps {
  onLogout: () => void;
}

export function PendingPage({ onLogout }: PendingPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "oklch(0.975 0.018 75)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-sm w-full text-center space-y-6"
      >
        <img
          src="/assets/uploads/images-1.jpeg"
          alt="Dakasi logo"
          className="w-20 h-20 rounded-2xl object-cover mx-auto shadow-md"
        />

        <div className="space-y-2">
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.30 0.08 55)" }}
          >
            Account Pending
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.45 0.06 55)" }}
          >
            Thanks for signing up! Your account is awaiting approval by the
            Dakasi admin. You'll be able to start collecting stamps once
            approved. 🧋
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 space-y-1"
          style={{
            background: "oklch(0.96 0.04 80)",
            border: "1px solid oklch(0.88 0.06 75)",
          }}
          data-ocid="pending.card"
        >
          <p className="text-2xl">⏳</p>
          <p
            className="font-semibold text-sm"
            style={{ color: "oklch(0.42 0.09 55)" }}
          >
            Awaiting admin approval
          </p>
          <p className="text-xs" style={{ color: "oklch(0.55 0.06 55)" }}>
            Please check back soon.
          </p>
        </motion.div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="rounded-xl gap-1.5 text-xs"
          style={{ color: "oklch(0.42 0.09 55)" }}
          data-ocid="pending.secondary_button"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </Button>
      </motion.div>

      <footer className="mt-12 pb-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
