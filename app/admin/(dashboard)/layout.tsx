import { Metadata } from "next";
import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { ensureTablesExist } from "@/app/lib/actions/admin";
import { isCanonicalAdmin } from "@/app/lib/security";
import Navbar from "./(components)/Navbar";

export const metadata: Metadata = {
  title: "Bazaario Admin",
  description: "Store Operations Console",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bazaario Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureTablesExist();

  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Strict Canonical Admin & Role Verification:
  // Under NO circumstances can any account other than 'admin@kamran.com' with 'admin' role access this console.
  // Any attempted privilege escalation or injection results in the 'user' role and immediate denial.
  const isAuthorized = isCanonicalAdmin(session.user as any);
  if (!isAuthorized) {
    redirect("/admin/login?error=restricted_user_role");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-neutral-50 text-neutral-900">
      <Navbar user={session.user as any} />
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}