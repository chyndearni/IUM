import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CVTemplate from "@/components/resume/CVTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Saya | JatimBissa",
  description: "Tampilan CV/resume Anda di JatimBissa",
};

export default function CVPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CV" />
      <div className="space-y-6">
        <CVTemplate />
      </div>
    </div>
  );
}
