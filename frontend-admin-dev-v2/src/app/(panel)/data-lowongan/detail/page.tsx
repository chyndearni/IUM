"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Building2,
  Mail,
  Phone,
  Globe,
  Heart,
  Eye,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Target,
  Award,
  FileText,
  ExternalLink,
  Loader2,
  RefreshCw,
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
  data: JobVacancy;
}

// Skeleton Component
const JobDetailSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-24 h-24 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-3/4 rounded"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-1/2 rounded"></div>
          <div className="flex gap-2">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-20 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-16 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-1/3 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-full rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-5/6 rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-4/6 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 w-full rounded mb-4"></div>
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-full rounded"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<JobVacancy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // Helper function to get company logo URL
  const getCompanyLogoUrl = (logo: string | null, companyName: string): string => {
    if (logo && logo.trim() !== "") {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${logo}`;
    }
    const encodedName = encodeURIComponent(companyName);
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  };

  // Fetch job detail from API
  const fetchJobDetail = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get the specific job by ID
      const possibleEndpoints = [
        `/job-vacancies/${jobId}`,
        `/lowongan-pekerjaan/${jobId}`,
        `/public/job-vacancies/${jobId}`,
        `/api/job-vacancies/${jobId}`,
        `/jobs/${jobId}`
      ];

      let response;
      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await apiBissaKerja.get<ApiResponse>(endpoint);
          console.log(`Success with endpoint: ${endpoint}`, response.data);
          break;
        } catch (err) {
          console.log(`Failed endpoint: ${endpoint}`, err);
          lastError = err;
          continue;
        }
      }

      // If direct endpoints failed, try to get all jobs and find the specific one
      if (!response) {
        console.log("Direct job endpoints failed, trying to get all jobs and filter...");
        
        const allJobsEndpoints = [
          "/job-vacancies",
          "/lowongan-pekerjaan", 
          "/public/job-vacancies",
          "/admin/job-vacancies",
          "/company/job-vacancies/all",
          "/api/job-vacancies",
          "/jobs",
          "/job-vacancies/all"
        ];

        for (const endpoint of allJobsEndpoints) {
          try {
            console.log(`Trying all jobs endpoint: ${endpoint}`);
            const allJobsResponse = await apiBissaKerja.get(endpoint);
            console.log(`Success with all jobs endpoint: ${endpoint}`);
            
            let allJobs = [];
            if (allJobsResponse.data.success === true && Array.isArray(allJobsResponse.data.data)) {
              allJobs = allJobsResponse.data.data;
            } else if (Array.isArray(allJobsResponse.data)) {
              allJobs = allJobsResponse.data;
            }

            // Find the specific job by ID
            const foundJob = allJobs.find((job: any) => job.id === parseInt(jobId));
            if (foundJob) {
              console.log("Found job in all jobs list:", foundJob);
              setJob(foundJob);
              return;
            }
            
            break; // Exit loop if we successfully got all jobs (even if job not found)
          } catch (err) {
            console.log(`Failed all jobs endpoint: ${endpoint}`, err);
            continue;
          }
        }

        // If we reach here, job was not found in any list
        setError("Lowongan pekerjaan tidak ditemukan.");
        return;
      }

      // Handle direct job detail response
      if (response.data.success === true && response.data.data) {
        setJob(response.data.data);
      } else if (response.data && !response.data.success) {
        setError("Data lowongan tidak ditemukan.");
      } else {
        setError("Data lowongan tidak ditemukan.");
      }
    } catch (err) {
      console.error("Error fetching job detail:", err);
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        
        if (axiosError.response?.status === 404) {
          setError("Lowongan pekerjaan tidak ditemukan.");
        } else if (axiosError.response?.status === 500) {
          setError("Server sedang mengalami gangguan. Silakan coba lagi dalam beberapa menit.");
        } else if (axiosError.response?.status === 401) {
          setError("Anda perlu login untuk melihat detail lowongan ini.");
        } else if (axiosError.response?.status === 403) {
          setError("Anda tidak memiliki akses untuk melihat lowongan ini.");
        } else if (!axiosError.response) {
          setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          setError("Terjadi kesalahan saat mengambil detail lowongan.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle job application
  const handleApply = async (): Promise<void> => {
    if (!job) return;

    try {
      setIsApplying(true);

      // Try to apply for the job
      const response = await apiBissaKerja.post(`/job-applications`, {
        job_vacancy_id: job.id
      });

      if (response.data.success) {
        alert("Lamaran Anda berhasil dikirim! Kami akan menghubungi Anda segera.");
        // Could redirect to applications page
        // router.push("/applications");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        
        if (axiosError.response?.status === 409) {
          alert("Anda sudah melamar untuk posisi ini sebelumnya.");
        } else if (axiosError.response?.status === 401) {
          alert("Anda perlu login untuk melamar pekerjaan.");
          // Could redirect to login
          // router.push("/login");
        } else {
          alert("Gagal mengirim lamaran. Silakan coba lagi.");
        }
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmark = async (): Promise<void> => {
    if (!job) return;

    try {
      if (isBookmarked) {
        await apiBissaKerja.delete(`/bookmarks/${job.id}`);
        setIsBookmarked(false);
        alert("Bookmark dihapus.");
      } else {
        await apiBissaKerja.post("/bookmarks", { job_vacancy_id: job.id });
        setIsBookmarked(true);
        alert("Lowongan berhasil di-bookmark!");
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      alert("Gagal memproses bookmark.");
    }
  };

  // Helper functions
  const calculateDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDeadlineColorClass = (days: number): string => {
    if (days <= 0) {
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    } else if (days <= 3) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    } else if (days <= 7) {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    } else {
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  const handleShare = (): void => {
    if (navigator.share && job) {
      navigator.share({
        title: `Lowongan ${job.job_title} di ${job.perusahaan_profile.nama_perusahaan}`,
        text: `Cek lowongan ${job.job_title} di ${job.perusahaan_profile.nama_perusahaan}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin ke clipboard!");
    }
  };

  const handleRetry = (): void => {
    fetchJobDetail();
  };

  useEffect(() => {
    if (jobId) {
      fetchJobDetail();
    }
  }, [jobId]);

  // Loading state
  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Detail Lowongan Pekerjaan" />
        <div className="space-y-6">
          <JobDetailSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Detail Lowongan Pekerjaan" />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </button>
              <Link
                href="/data-lowongan"
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Lowongan
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No job found
  if (!job) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Detail Lowongan Pekerjaan" />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <Eye className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Lowongan Tidak Ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              Lowongan pekerjaan yang Anda cari tidak dapat ditemukan atau mungkin sudah tidak tersedia.
            </p>
            <Link
              href="/data-lowongan"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Lowongan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(job.application_deadline);
  const isExpired = daysRemaining <= 0;

  return (
    <div>
      <PageBreadcrumb pageTitle={`Detail Lowongan - ${job.job_title}`} />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/data-lowongan"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Lowongan
        </Link>
      </div>

      <div className="space-y-6">
        {/* Job Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <img
                src={getCompanyLogoUrl(
                  job.perusahaan_profile.logo,
                  job.perusahaan_profile.nama_perusahaan
                )}
                alt={`Logo ${job.perusahaan_profile.nama_perusahaan}`}
                className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const encodedName = encodeURIComponent(
                    job.perusahaan_profile.nama_perusahaan
                  );
                  target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
                }}
              />
            </div>

            {/* Job Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.job_title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                    {job.perusahaan_profile.nama_perusahaan}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                      {job.job_type}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                      {job.perusahaan_profile.industri}
                    </span>
                    {job.perusahaan_profile.status_verifikasi === "verified" && (
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Terverifikasi
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDeadlineColorClass(daysRemaining)}`}
                    >
                      {isExpired ? "Berakhir" : `${daysRemaining} hari lagi`}
                    </span>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                      {job.salary_range || "Kompetitif"}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      {job.experience}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      Deadline: {formatDate(job.application_deadline)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan
                  </button>
                  <button
                    onClick={handleBookmark}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Tersimpan' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Disability Support */}
          {job.disabilitas.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Ramah Disabilitas
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                    Lowongan ini terbuka untuk kandidat dengan kategori disabilitas berikut:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.disabilitas.map((d) => (
                      <span
                        key={d.id}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                      >
                        {d.kategori_disabilitas} ({d.tingkat_disabilitas})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            {job.description && (
              <ComponentCard title="Deskripsi Pekerjaan">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </ComponentCard>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <ComponentCard title="Tanggung Jawab">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.responsibilities}
                  </div>
                </div>
              </ComponentCard>
            )}

            {/* Requirements */}
            {job.requirements && (
              <ComponentCard title="Persyaratan">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </div>
                </div>
              </ComponentCard>
            )}

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <ComponentCard title="Keahlian yang Dibutuhkan">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </ComponentCard>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.trim() !== "" && (
              <ComponentCard title="Benefits & Fasilitas">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.benefits}
                  </div>
                </div>
              </ComponentCard>
            )}

            {/* Accessibility Features */}
            {job.accessibility_features && job.accessibility_features.trim() !== "" && (
              <ComponentCard title="Fasilitas Aksesibilitas">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {job.accessibility_features}
                  </p>
                </div>
              </ComponentCard>
            )}

            {/* Work Accommodations */}
            {job.work_accommodations && job.work_accommodations.trim() !== "" && (
              <ComponentCard title="Akomodasi Kerja">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {job.work_accommodations}
                  </p>
                </div>
              </ComponentCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="space-y-4">
                <button
                  onClick={handleApply}
                  disabled={isApplying || isExpired}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                    isExpired
                      ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                      : isApplying
                      ? 'bg-blue-400 dark:bg-blue-500 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                  }`}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim Lamaran...
                    </>
                  ) : isExpired ? (
                    'Lowongan Berakhir'
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Lamar Sekarang
                    </>
                  )}
                </button>

                {!isExpired && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Dengan melamar, Anda menyetujui syarat dan ketentuan yang berlaku
                  </p>
                )}
              </div>
            </div>

            {/* Job Summary */}
            <ComponentCard title="Ringkasan Lowongan">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Posisi:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.job_title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tipe:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.job_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lokasi:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gaji:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {job.salary_range || "Kompetitif"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pengalaman:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pendidikan:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.education}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                  <span className={`font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {formatDate(job.application_deadline)}
                  </span>
                </div>
              </div>
            </ComponentCard>

            {/* Company Information */}
            <ComponentCard title="Tentang Perusahaan">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getCompanyLogoUrl(
                      job.perusahaan_profile.logo,
                      job.perusahaan_profile.nama_perusahaan
                    )}
                    alt={`Logo ${job.perusahaan_profile.nama_perusahaan}`}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const encodedName = encodeURIComponent(
                        job.perusahaan_profile.nama_perusahaan
                      );
                      target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {job.perusahaan_profile.nama_perusahaan}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.perusahaan_profile.industri}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {job.perusahaan_profile.deskripsi}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tahun Berdiri:</span>
                    <span className="text-gray-900 dark:text-white">{job.perusahaan_profile.tahun_berdiri}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Jumlah Karyawan:</span>
                    <span className="text-gray-900 dark:text-white">{job.perusahaan_profile.jumlah_karyawan}</span>
                  </div>
                </div>

                {/* Company Links */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {job.perusahaan_profile.link_website && (
                      <a
                        href={job.perusahaan_profile.link_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        Website Perusahaan
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <Phone className="w-4 h-4" />
                      {job.perusahaan_profile.no_telp}
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{job.perusahaan_profile.alamat_lengkap}</span>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                {(job.perusahaan_profile.linkedin || 
                  job.perusahaan_profile.instagram || 
                  job.perusahaan_profile.facebook) && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Media Sosial:
                    </p>
                    <div className="flex gap-3">
                      {job.perusahaan_profile.linkedin && (
                        <a
                          href={job.perusahaan_profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          LinkedIn
                        </a>
                      )}
                      {job.perusahaan_profile.instagram && (
                        <a
                          href={job.perusahaan_profile.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          Instagram
                        </a>
                      )}
                      {job.perusahaan_profile.facebook && (
                        <a
                          href={job.perusahaan_profile.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ComponentCard>
          </div>
        </div>
      </div>
    </div>
  );
}
