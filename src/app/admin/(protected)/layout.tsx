import type { ReactNode } from "react";

import { requireAdministrator } from "@/lib/auth/admin";

import { AdminNavigation } from "./admin-navigation";

type ProtectedAdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  await requireAdministrator();

  return (
    <div className="min-h-screen">
      <AdminNavigation />
      {children}
    </div>
  );
}
