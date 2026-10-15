import { Metadata } from "next";
import React from "react";
import Navbar from "./(components)/Navbar";

export const metadata: Metadata = {
  title: "Bazaario Admin",
  description: "Store Operations Console",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-neutral-50 text-neutral-900">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}