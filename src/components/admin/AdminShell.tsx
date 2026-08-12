import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type ReactNode } from "react";
import { adminMe, adminLogout } from "@/lib/admin.functions";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Images,
  Tags,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/blogs", label: "Blogs", icon: FileText },
  { to: "/admin/blog/new", label: "Create Blog", icon: PlusCircle },
  { to: "/admin/media", label: "Media", icon: Images },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function useAdminSession() {
  const me = useServerFn(adminMe);
  return useQuery({ queryKey: ["admin", "me"], queryFn: () => me(), retry: false });
}

export function AdminShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const navigate = useNavigate();
  const logout = useServerFn(adminLogout);
  const { data, isLoading } = useAdminSession();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoading && data && !data.authenticated) {
      void navigate({ to: "/admin/login" });
    }
  }, [data, isLoading, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (isLoading || !data?.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary text-sm text-muted-foreground">
        Checking your admin session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-primary-dark px-5 py-6 text-primary-foreground transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg leading-tight">HIMADRI CREATION</p>
            <p className="text-[0.65rem] tracking-[0.28em] text-accent uppercase">Admin Panel</p>
          </div>
          <button
            type="button"
            className="lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-primary-foreground/15 font-semibold"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={async () => {
              await logout();
              void navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-primary-foreground/80 transition hover:bg-primary-foreground/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>

        <div className="mt-10 rounded-2xl bg-primary-foreground/10 p-4 text-xs text-primary-foreground/80">
          Signed in as <span className="font-semibold">{data.username || "admin"}</span>
          <p className="mt-2">
            {data.storageReady
              ? "Content storage connected."
              : "Content storage not configured yet — add your settings to publish."}
          </p>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display truncate text-xl text-primary-dark sm:text-2xl">{title}</h1>
            {description && (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
            )}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>
        </header>
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}