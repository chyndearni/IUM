"use client";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Profile() {
  const [isPerusahaan, setIsPerusahaan] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const role = Cookies.get("role");
      console.log("Role from cookie:", role);

      // Check if role exists and equals "perusahaan"
      const isCompany = role === "superadmin" || role === "admin";
      setIsPerusahaan(isCompany);
    } catch (error) {
      console.error("Error reading cookie:", error);
      setIsPerusahaan(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show loading state while checking cookies
  if (isLoading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 bg-gray-300 rounded-full dark:bg-gray-700" />
            <div className="space-y-2 w-full xl:w-auto">
              <div className="h-4 bg-gray-300 rounded w-48 dark:bg-gray-700" />
              <div className="flex gap-3">
                <div className="h-3 bg-gray-300 rounded w-40 dark:bg-gray-700" />
                <div className="h-3 bg-gray-300 rounded w-24 dark:bg-gray-700" />
              </div>
            </div>
          </div>
          <div className="h-10 bg-gray-300 rounded-full w-32 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {isPerusahaan ? (
            // Company profile layout
            <UserMetaCard />
          ) : (
            // Individual user profile layout
            <>
              <UserMetaCard />
              <UserInfoCard />
              <UserAddressCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
