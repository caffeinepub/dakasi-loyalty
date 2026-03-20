import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { LogOut, Shield } from "lucide-react";
import { useEffect } from "react";
import { UserRole } from "./backend";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useCallerRole,
  useIsAdmin,
  useRegisterGuestVisit,
} from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";
import { CustomerPage } from "./pages/CustomerPage";
import { GuestPage } from "./pages/GuestPage";
import { PendingPage } from "./pages/PendingPage";

function Header({
  isAdmin,
  onLogout,
}: { isAdmin: boolean; onLogout: () => void }) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-sm"
      style={{ background: "oklch(0.975 0.018 75 / 0.92)" }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/uploads/images-1.jpeg"
            alt="Dakasi logo"
            className="h-9 w-9 rounded-xl object-cover"
          />
          <span
            className="font-display font-bold text-lg"
            style={{ color: "oklch(0.30 0.08 55)" }}
          >
            Dakasi
          </span>
          {isAdmin && (
            <span
              className="ml-1 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.42 0.09 55 / 0.12)",
                color: "oklch(0.42 0.09 55)",
              }}
            >
              <Shield className="w-3 h-3" /> Admin
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onLogout}
          className="rounded-xl h-8 text-xs gap-1.5"
          data-ocid="auth.secondary_button"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </Button>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="mt-12 pb-6 text-center text-xs text-muted-foreground">
      © {year}. Built with ❤️ using{" "}
      <a
        href={utm}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground transition-colors"
      >
        caffeine.ai
      </a>
    </footer>
  );
}

export default function App() {
  const { login, clear, isLoggingIn, identity, isInitializing } =
    useInternetIdentity();
  const { data: role, isLoading: roleLoading } = useCallerRole();
  const { data: isAdmin } = useIsAdmin();
  const { mutate: registerGuestVisit } = useRegisterGuestVisit();

  const isLoggedIn = !!identity;
  const loading = isInitializing || (isLoggedIn && roleLoading);

  useEffect(() => {
    document.title = "Dakasi · Milk Tea Loyalty";
  }, []);

  useEffect(() => {
    if (isLoggedIn && role === UserRole.guest) {
      registerGuestVisit();
    }
  }, [isLoggedIn, role, registerGuestVisit]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <img
            src="/assets/uploads/images-1.jpeg"
            alt="Dakasi logo"
            className="w-16 h-16 rounded-2xl object-cover mx-auto animate-bounce"
          />
          <Skeleton
            className="h-4 w-32 mx-auto"
            data-ocid="app.loading_state"
          />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <GuestPage onLogin={login} isLoggingIn={isLoggingIn} />
        <Toaster />
      </>
    );
  }

  if (role === UserRole.guest) {
    return (
      <>
        <PendingPage onLogout={clear} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin={!!isAdmin} onLogout={clear} />
      <main className="flex-1">
        {role === UserRole.admin ? <AdminPage /> : <CustomerPage />}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
