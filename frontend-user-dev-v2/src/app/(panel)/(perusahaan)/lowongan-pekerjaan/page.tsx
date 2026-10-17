"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useRouter } from "next/navigation";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import {
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Heart,
  FileX,
  RefreshCw,
  Building,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import apiBissaKerja from "@/lib/api-bissa-kerja";

// Type definitions
interface DisabilitasType {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
  pivot: {
    post_lowongan_id: number;
    disabilitas_id: number;
  };
}

interface PerusahaanProfile {
  id: number;
  logo: string | null;
  nama_perusahaan: string;
  industri: string;
  tahun_berdiri: string;
  jumlah_karyawan: string;
  province_id: string;
  regencie_id: string;
  deskripsi: string;
  no_telp: string;
  link_website: string;
  alamat_lengkap: string;
  visi: string;
  misi: string;
  nilai_nilai: string;
  sertifikat: string;
  bukti_wajib_lapor: string;
  nib: string;
  linkedin: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  status_verifikasi: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface JobVacancy {
  id: number;
  job_title: string;
  job_type: string;
  description: string;
  responsibilities: string;
  requirements: string;
  education: string;
  experience: string;
  salary_range: string;
  benefits: string;
  location: string;
  application_deadline: string;
  accessibility_features: string;
  work_accommodations: string;
  skills: string[];
  perusahaan_profile: PerusahaanProfile;
  disabilitas: DisabilitasType[];
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: JobVacancy[];
}

interface CompanyProfileResponse {
  success: boolean;
  message: string;
  data: PerusahaanProfile | null;
}

// Skeleton Components
const PulseEffect = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`} />
);

const StatsCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex items-center">
      <PulseEffect className="w-8 h-8 rounded mr-3" />
      <div className="space-y-2 flex-1">
        <PulseEffect className="h-6 rounded w-16" />
        <PulseEffect className="h-4 rounded w-24" />
      </div>
    </div>
  </div>
);

const JobCardSkeleton = () => (
  <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
    {/* Header */}
    <header className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3 flex-1">
        <PulseEffect className="w-12 h-12 rounded-lg" />
        <div className="flex-1 min-w-0 space-y-2">
          <PulseEffect className="h-5 rounded w-3/4" />
          <PulseEffect className="h-4 rounded w-1/2" />
        </div>
      </div>
    </header>

    {/* Job Details */}
    <section className="space-y-3 mb-4">
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-2/3" />
      </div>
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-1/2" />
      </div>
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-1/3" />
      </div>
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-2/5" />
      </div>
    </section>

    {/* Skills */}
    <section className="mb-4">
      <div className="flex flex-wrap gap-2">
        <PulseEffect className="h-6 rounded-full w-16" />
        <PulseEffect className="h-6 rounded-full w-20" />
        <PulseEffect className="h-6 rounded-full w-14" />
        <PulseEffect className="h-6 rounded-full w-18" />
      </div>
    </section>

    {/* Spacer */}
    <div className="flex-1"></div>

    {/* Deadline and Date */}
    <div className="flex items-center justify-between mb-4">
      <PulseEffect className="h-6 rounded-full w-20" />
      <PulseEffect className="h-4 rounded w-24" />
    </div>

    {/* Actions */}
    <footer className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
      <PulseEffect className="flex-1 h-10 rounded-lg" />
      <PulseEffect className="h-10 w-20 rounded-lg" />
    </footer>
  </article>
);

const JobListingSkeleton = ({ cardCount = 6 }: { cardCount?: number }) => (
  <div className="mx-auto">
    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>

    {/* Job Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cardCount }, (_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>

    {/* Load More Button Skeleton */}
    <div className="text-center mt-8">
      <PulseEffect className="inline-block h-12 w-40 rounded-lg" />
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center max-w-md">
      <FileX className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Tidak Ada Data Lowongan
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
        Saat ini tidak ada data lowongan pekerjaan yang tersedia di database.
        Silakan tambahkan lowongan pekerjaan baru atau muat ulang halaman.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Muat Ulang
        </button>
        <Link
          href="/lowongan-pekerjaan/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tambah Lowongan
        </Link>
      </div>
    </div>
  </div>
);

// Incomplete Profile Warning Component
const IncompleteProfileWarning = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center max-w-2xl">
      <div className="mx-auto mb-6 w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Profil Perusahaan Belum Lengkap
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
        Untuk dapat membuat dan mengelola lowongan pekerjaan, Anda perlu
        melengkapi profil perusahaan terlebih dahulu. Profil yang lengkap akan
        membantu kandidat mengenal perusahaan Anda dengan lebih baik.
      </p>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
          Informasi yang Diperlukan:
        </h4>
        <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 text-left">
          <li>• Nama perusahaan dan industri</li>
          <li>• Deskripsi, visi, dan misi perusahaan</li>
          <li>• Alamat lengkap dan informasi kontak</li>
          <li>• Dokumen legalitas (NIB, Wajib Lapor)</li>
          <li>• Logo dan informasi tambahan</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/profile-perusahaan/form"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Building className="w-4 h-4 mr-2" />
          Lengkapi Profil Perusahaan
        </Link>

        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Periksa Ulang
        </button>
      </div>
    </div>
  </div>
);

// Unverified Profile Warning Component
const UnverifiedProfileWarning = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center max-w-2xl">
      <div className="mx-auto mb-6 w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Akun Perusahaan Belum Terverifikasi
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
        Untuk dapat membuat dan mengelola lowongan pekerjaan, Akun Perusahaan Anda perlu
        diverifikasi oleh admin terlebih dahulu. Pastikan profil perusahaan Anda lengkap dan benar untuk
        mempermudah admin memverifikasi perusahaan Anda dengan lebih baik.
      </p>

      {/* <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
          Informasi yang Diperlukan:
        </h4>
        <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 text-left">
          <li>• Nama perusahaan dan industri</li>
          <li>• Deskripsi, visi, dan misi perusahaan</li>
          <li>• Alamat lengkap dan informasi kontak</li>
          <li>• Dokumen legalitas (NIB, Wajib Lapor)</li>
          <li>• Logo dan informasi tambahan</li>
        </ul>
      </div> */}

      {/* <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/profile-perusahaan/form"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Building className="w-4 h-4 mr-2" />
          Lengkapi Profil Perusahaan
        </Link>

        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Periksa Ulang
        </button>
      </div> */}
    </div>
  </div>
);

export default function LowonganPekerjaanPage() {
  useDocumentTitle("Lowongan Pekerjaan Saya | JatimBissa");
  const router = useRouter();
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [companyProfile, setCompanyProfile] =
    useState<PerusahaanProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  // Check if company profile is complete
  const isProfileComplete = (profile: PerusahaanProfile | null): boolean => {
    if (!profile) return false;

    const requiredFields = [
      "nama_perusahaan",
      "industri",
      "deskripsi",
      "alamat_lengkap",
      "no_telp",
      "visi",
      "misi",
      "nib",
      "bukti_wajib_lapor",
    ];

    return requiredFields.every((field) => {
      const value = profile[field as keyof PerusahaanProfile];
      return value && value.toString().trim() !== "";
    });
  };

  // Helper function to get company logo URL
  const getCompanyLogoUrl = (
    logo: string | null,
    companyName: string
  ): string => {
    if (logo && logo.trim() !== "") {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${logo}`;
    }

    const encodedName = encodeURIComponent(companyName);
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  };

  // Fetch company profile
  const fetchCompanyProfile = async (): Promise<void> => {
    try {
      setProfileLoading(true);
      setError(null);

      // Try both endpoints to ensure compatibility
      let response;
      try {
        response = await apiBissaKerja.get<CompanyProfileResponse>(
          "/company/profile"
        );
        console.log("gagal ngembil data profile");
      } catch (err) {
        // Fallback to alternative endpoint
        response = await apiBissaKerja.get<CompanyProfileResponse>(
          "perusahaan/profile"
        );
      }

      if (response.data.success && response.data.data) {
        setCompanyProfile(response.data.data);
      } else {
        setCompanyProfile(null);
      }
    } catch (err) {
      console.error("Error fetching company profile:", err);
      setCompanyProfile(null);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError("Anda perlu login untuk mengakses halaman ini.");
        } else if (axiosError.response?.status === 403) {
          setError("Anda tidak memiliki akses untuk melihat data ini.");
        }
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch jobs data from API
  const fetchJobs = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiBissaKerja.get<ApiResponse>(
        "/company/job-vacancies"
      );

      if (response.data.success === true) {
        setJobs(response.data.data || []);
      } else {
        // Handle unsuccessful response but don't show as system error
        setJobs([]);
        console.log(
          "API returned unsuccessful response:",
          response.data.message
        );
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;

        // Handle different status codes
        if (axiosError.response?.status === 404) {
          // 404 might mean no data found, not necessarily an error
          setJobs([]);
        } else if (axiosError.response?.status === 500) {
          setError(
            "Terjadi gangguan pada sistem. Silakan coba lagi dalam beberapa saat."
          );
        } else if (axiosError.response?.status === 401) {
          setError("Anda perlu login untuk melihat data lowongan pekerjaan.");
        } else if (axiosError.response?.status === 403) {
          setError("Anda tidak memiliki akses untuk melihat data ini.");
        } else if (!axiosError.response) {
          // Network error
          setError(
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
          );
        } else {
          // Other HTTP errors
          setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
        }
      } else {
        // Non-axios error
        setError("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  useEffect(() => {
    // Only fetch jobs if profile is complete
    if (!profileLoading && isProfileComplete(companyProfile)) {
      fetchJobs();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [profileLoading, companyProfile]);

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper function to handle retry
  const handleRetry = (): void => {
    fetchCompanyProfile();
    if (isProfileComplete(companyProfile)) {
      fetchJobs();
    }
  };

  // Calculate stats (only when not loading)
  const totalJobs: number = loading ? 0 : jobs.length;
  const uniqueCities: number = loading
    ? 0
    : [...new Set(jobs.map((job) => job.location.split(",")[0].trim()))].length;
  const todayJobs: number = loading
    ? 0
    : jobs.filter((job) => {
        const createdDate = new Date(
          job.created_at || job.application_deadline
        );
        const today = new Date();
        return createdDate.toDateString() === today.toDateString();
      }).length;

  // Error state (only for actual system errors)
  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lowongan Pekerjaan" />
        <div className="space-y-6">
          <ComponentCard
            title="Daftar Lowongan Pekerjaan"
            desc="Terjadi kesalahan saat memuat data"
          >
            <div className="flex flex-col justify-center items-center py-16 text-center">
              <div className="text-red-500 text-lg font-medium mb-4">
                {error}
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </button>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  // Show loading state while checking profile
  if (profileLoading || (loading && isProfileComplete(companyProfile))) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lowongan Pekerjaan" />
        <div className="space-y-6">
          <ComponentCard
            title="Daftar Lowongan Pekerjaan"
            desc="Memuat data lowongan pekerjaan..."
          >
            <JobListingSkeleton cardCount={6} />
          </ComponentCard>
        </div>
      </div>
    );
  }

  // Show incomplete profile warning
  if (!profileLoading && !isProfileComplete(companyProfile)) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lowongan Pekerjaan" />
        <div className="space-y-6">
          <ComponentCard
            title="Daftar Lowongan Pekerjaan"
            desc="Profil perusahaan perlu dilengkapi"
          >
            <IncompleteProfileWarning onRefresh={handleRetry} />
          </ComponentCard>
        </div>
      </div>
    );
  }

  // Show unverified profile
  if (!profileLoading && companyProfile?.status_verifikasi !== 'terverifikasi') {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lowongan Pekerjaan" />
        <div className="space-y-6">
          <ComponentCard
            title="Profil Perusahaan Belum Terverifikasi"
            desc="Profil perusahaan perlu diverifikasi oleh admin"
          >
            <UnverifiedProfileWarning onRefresh={handleRetry} />
          </ComponentCard>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Lowongan Pekerjaan" />
      <div className="space-y-6">
        <ComponentCard
          title="Daftar Lowongan Pekerjaan"
          desc={
            jobs.length > 0
              ? "Temukan peluang karir terbaik untuk Anda"
              : "Kelola lowongan pekerjaan perusahaan Anda"
          }
          titleButton="Tambah Pekerjaan"
          urlButton="/lowongan-pekerjaan/create"
        >
          {jobs.length === 0 ? (
            // Empty State - No jobs found
            <EmptyState onRefresh={handleRetry} />
          ) : (
            // Loaded State - Show Actual Content
            <div className="mx-auto">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalJobs}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Lowongan
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <MapPin className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {uniqueCities}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kota Tersedia
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {todayJobs}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Baru Hari Ini
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job: JobVacancy) => {
                  const daysRemaining: number = calculateDaysRemaining(
                    job.application_deadline
                  );
                  const skills: string[] = job.skills.slice(0, 4);
                  const accessibilityDescription: string = `Lowongan kerja ${
                    job.job_title
                  } di ${job.perusahaan_profile.nama_perusahaan}, lokasi ${
                    job.location
                  }, dengan deadline ${formatDate(job.application_deadline)}`;

                  // Determine deadline badge color
                  const getDeadlineColorClass = (days: number): string => {
                    if (days <= 3) {
                      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
                    } else if (days <= 7) {
                      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
                    } else {
                      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
                    }
                  };

                  return (
                    <article
                      key={job.id}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                      aria-label={`Kartu lowongan kerja: ${job.job_title} di ${job.perusahaan_profile.nama_perusahaan}`}
                      role="article"
                      tabIndex={0}
                    >
                      {/* Hidden accessibility description for screen readers */}
                      <div className="sr-only" aria-hidden="false">
                        {accessibilityDescription}
                      </div>

                      {/* Content Container */}
                      <div className="flex-1">
                        <header className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={getCompanyLogoUrl(
                                  job.perusahaan_profile.logo,
                                  job.perusahaan_profile.nama_perusahaan
                                )}
                                alt={`Logo perusahaan ${job.perusahaan_profile.nama_perusahaan}`}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                role="img"
                                aria-label={`Logo ${job.perusahaan_profile.nama_perusahaan}`}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const encodedName = encodeURIComponent(
                                    job.perusahaan_profile.nama_perusahaan
                                  );
                                  target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
                                }}
                              />
                              {/* Disability-friendly indicator */}
                              {job.disabilitas.length > 0 && (
                                <div
                                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1"
                                  title="Ramah disabilitas"
                                >
                                  <Heart
                                    className="w-3 h-3 text-white"
                                    aria-hidden="true"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                aria-label={`Posisi: ${job.job_title}`}
                                title={job.job_title}
                              >
                                {job.job_title}
                              </h3>
                              <p
                                className="text-sm text-gray-600 dark:text-gray-400 truncate"
                                aria-label={`Perusahaan: ${job.perusahaan_profile.nama_perusahaan}`}
                                title={job.perusahaan_profile.nama_perusahaan}
                              >
                                {job.perusahaan_profile.nama_perusahaan}
                              </p>
                            </div>
                          </div>
                        </header>

                        {/* Job Details */}
                        <section
                          aria-labelledby={`job-details-${job.id}`}
                          className="space-y-2 mb-4"
                        >
                          <h4 id={`job-details-${job.id}`} className="sr-only">
                            Detail Pekerjaan
                          </h4>

                          <div
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            aria-label={`Lokasi kerja: ${job.location}`}
                          >
                            <MapPin
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate" title={job.location}>
                              {job.location}
                            </span>
                          </div>

                          <div
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            aria-label={`Gaji atau kompensasi: ${
                              job.salary_range || "Tidak disebutkan"
                            }`}
                          >
                            <DollarSign
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate" title={job.salary_range}>
                              {job.salary_range || "Kompetitif"}
                            </span>
                          </div>

                          <div
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            aria-label={`Jenis pekerjaan: ${job.job_type}`}
                          >
                            <Clock
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span title={job.job_type}>{job.job_type}</span>
                          </div>

                          <div
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            aria-label={`Pengalaman: ${job.experience}`}
                          >
                            <Calendar
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate" title={job.experience}>
                              {job.experience}
                            </span>
                          </div>
                        </section>

                        {/* Skills */}
                        {skills.length > 0 && (
                          <section
                            aria-labelledby={`job-skills-${job.id}`}
                            className="mb-4"
                          >
                            <h4 id={`job-skills-${job.id}`} className="sr-only">
                              Keahlian yang Dibutuhkan
                            </h4>
                            <div
                              className="flex flex-wrap gap-2"
                              role="list"
                              aria-label={`Keahlian yang dibutuhkan: ${skills.join(
                                ", "
                              )}`}
                            >
                              {skills.map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                                  role="listitem"
                                  aria-label={`Keahlian: ${skill}`}
                                  title={skill}
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                  +{job.skills.length - 4} lagi
                                </span>
                              )}
                            </div>
                          </section>
                        )}

                        {/* Disability Support Info */}
                        {job.disabilitas.length > 0 && (
                          <section
                            aria-labelledby={`disability-support-${job.id}`}
                            className="mb-4"
                          >
                            <h4
                              id={`disability-support-${job.id}`}
                              className="sr-only"
                            >
                              Dukungan Disabilitas
                            </h4>
                            <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Heart
                                className="w-4 h-4 text-blue-600 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span className="text-xs text-blue-700 dark:text-blue-300">
                                Mendukung{" "}
                                {job.disabilitas
                                  .map(
                                    (d: DisabilitasType) =>
                                      d.kategori_disabilitas
                                  )
                                  .join(", ")}{" "}
                                disabilitas
                              </span>
                            </div>
                          </section>
                        )}
                      </div>

                      {/* Deadline Badge */}
                      {/* <div className="flex items-center justify-between">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDeadlineColorClass(
                            daysRemaining
                          )}`}
                        >
                          {daysRemaining > 0
                            ? `${daysRemaining} hari lagi`
                            : "Berakhir"}
                        </div>
                        <time
                          className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                          aria-label={`Deadline: ${formatDate(
                            job.application_deadline
                          )}`}
                          dateTime={job.application_deadline}
                        >
                          {formatDate(job.application_deadline)}
                        </time>
                      </div> */}

                      {/* Actions */}
                      <footer
                        className="flex space-x-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700"
                        role="group"
                        aria-label="Aksi untuk lowongan ini"
                      >
                        <Link
                          href={`/lowongan-pekerjaan/${job.id}/pelamar`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-center text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label={`Lihat pelamar untuk posisi ${job.job_title} di ${job.perusahaan_profile.nama_perusahaan}`}
                          role="button"
                        >
                          Lihat Pelamar
                        </Link>

                        <Link
                          href={`/lowongan-pekerjaan/${job.id}`}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          aria-label={`Lihat detail lengkap lowongan ${job.job_title} di ${job.perusahaan_profile.nama_perusahaan}`}
                          role="button"
                        >
                          Detail
                        </Link>
                      </footer>
                    </article>
                  );
                })}
              </div>

              {/* Load More Button */}
              {jobs.length > 0 && (
                <div className="text-center mt-8">
                  <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
                    Muat Lebih Banyak
                  </button>
                </div>
              )}
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
