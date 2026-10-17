"use client"
import JobDetail from "@/components/company/JobDetail";
import Navbar from "@/components/landing-page/Navbar";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default function DetailLowongan() {
  return (
    <div>
      {/* <Link
          href="/"
          className="inline-flex mb-5 items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Kembali
        </Link> */}
      <JobDetail/>
    </div>
  )
}
