import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import Step from '@/components/resume/Step';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Saya | JatimBissa",
  description: "Kelola data resume dan profil disabilitas Anda di JatimBissa",
};

export default function ResumePage() {
  return (
    <div>

      <PageBreadcrumb pageTitle="Resume"/>
      <div className="space-y-6">
        <Step/>
      </div>
    </div>
  )
}
