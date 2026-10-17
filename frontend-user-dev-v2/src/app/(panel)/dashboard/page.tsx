"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DashboardCompany from "@/components/dashboard/DashboardCompany";
import DashboardUser from "@/components/dashboard/DashboardUser";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function Dashboard() {
  useDocumentTitle("Dashboard | JatimBissa");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = Cookies.get("role");
    setRole(userRole ?? "user"); // default fallback ke "user"
  }, []);

  if (!role) {
    return <p>Loading dashboard...</p>;
  }

  if (role === "perusahaan") {
    return <DashboardCompany />;
  }

  return <DashboardUser />;
}
