"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateJob from "@/components/company/CreateJob";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function LowonganPekerjaanPage() {
  useDocumentTitle("Tambah Lowongan Pekerjaan | JatimBissa");
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Pekerjaan" />
      <div className="space-y-6">
        <CreateJob></CreateJob>
      </div>
    </div>
  );
}
