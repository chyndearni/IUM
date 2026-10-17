"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import {
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  Heart,
  Building,
  Users,
  Globe,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Star,
  Shield,
  Accessibility,
  User,
  Share2,
  Bookmark,
  Eye,
  Award,
  Clock3,
  MapPinned,
  Building2,
  Sparkles,
  Check,
  Send,
  Loader2,
  FileText,
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
  no_telp?: string;
  link_website?: string;
  alamat_lengkap: string;
  visi: string;
  misi: string;
  nilai_nilai?: string;
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
  accessibility_features?: string;
  work_accommodations?: string;
  skills: string[];
  perusahaan_profile: PerusahaanProfile;
  disabilitas?: DisabilitasType[];
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: JobVacancy;
}

interface ApplyStatusResponse {
  success: boolean;
  message?: string;
  applied: boolean;
  data?: any;
}

interface UserProfileResponse {
  success: boolean;
  message?: string;
  userProfileDataExist?: boolean;
  data?: any;
}

// Profile Warning Modal
const ProfileWarningModal = ({
  isOpen,
  onClose,
  jobTitle,
  companyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-4">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profil Belum Lengkap
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Diperlukan untuk melamar pekerjaan
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Untuk melamar posisi <strong>{jobTitle}</strong> di{" "}
              <strong>{companyName}</strong>, Anda perlu melengkapi profil dan
              resume terlebih dahulu.
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                Yang perlu dilengkapi:
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Informasi pribadi lengkap
                </li>
                <li className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Resume/CV terbaru
                </li>
                <li className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Informasi disabilitas (jika ada)
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Link
              href="/resume"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
              onClick={onClose}
            >
              Lengkapi Profil
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<JobVacancy | null>(null);
  useDocumentTitle(
    job?.job_title ? `${job.job_title} | JatimBissa` : "Detail Lowongan | JatimBissa"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Apply status states
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [checkingApplyStatus, setCheckingApplyStatus] =
    useState<boolean>(false);

  // User profile states
  const [userProfileExists, setUserProfileExists] = useState<boolean>(false);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

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

  // Check user profile
  const checkUserProfile = async (): Promise<boolean> => {
    try {
      setCheckingProfile(true);

      const response = await apiBissaKerja.get<UserProfileResponse>(
        "/check-user-profile"
      );

      // Hanya cek userProfileDataExist
      if (response.data.userProfileDataExist === true) {
        setUserProfileExists(true);
        return true;
      } else {
        setUserProfileExists(false);
        return false;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("Anda perlu login untuk mengakses fitur ini.");
      }
      setUserProfileExists(false);
      return false;
    } finally {
      setCheckingProfile(false);
    }
  };

  // Check apply status for this job
  const checkApplyStatus = async (jobId: string): Promise<void> => {
    try {
      setCheckingApplyStatus(true);
      const response = await apiBissaKerja.get<ApplyStatusResponse>(
        `/check-apply-status/${jobId}`
      );

      if (response.data.success) {
        setIsApplied(response.data.applied === true);
      } else {
        setIsApplied(false);
      }
    } catch (error: any) {
      setIsApplied(false);
    } finally {
      setCheckingApplyStatus(false);
    }
  };

  // Handle apply click with profile check
  const handleApplyClick = async (): Promise<void> => {
    // Don't allow if already applied
    if (isApplied || !job) {
      return;
    }

    // Check profile first
    const hasProfile = await checkUserProfile();

    if (!hasProfile) {
      // Show modal if profile incomplete
      setShowProfileModal(true);
      return;
    }

    // Proceed with application
    await handleApply();
  };

  // Handle job application
  const handleApply = async (): Promise<void> => {
    if (!job) return;

    try {
      setIsApplying(true);

      const response = await apiBissaKerja.post(`apply-job/${job.id}`, {
        lowongan_id: job.id,
      });

      if (response.data.success) {
        setIsApplied(true);
      } else {
        setError(response.data.message || "Gagal mengirim lamaran.");
      }
    } catch (error: any) {
      setError("Gagal mengirim lamaran. Silakan coba lagi.");
    } finally {
      setIsApplying(false);
    }
  };

  // Fetch job detail from API
  useEffect(() => {
    const fetchJobDetail = async (): Promise<void> => {
      if (!jobId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiBissaKerja.get<ApiResponse>(`/jobs/${jobId}`);

        if (response.data.success) {
          setJob(response.data.data);
          // Check apply status after job data is loaded
          await checkApplyStatus(jobId);
        } else {
          setError("Gagal mengambil detail lowongan pekerjaan");
        }
      } catch (err) {
        console.error("Error fetching job detail:", err);
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          if (axiosError.response?.status === 404) {
            setError("Lowongan pekerjaan tidak ditemukan");
          } else if (axiosError.response?.status === 500) {
            setError("Terjadi kesalahan pada server");
          } else {
            setError("Terjadi kesalahan saat mengambil data");
          }
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
    checkUserProfile(); // Check profile on page load
  }, [jobId]);

  // Helper functions
  const calculateDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const parseJsonField = (jsonString: string | null | undefined): string[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getDeadlineStatus = (days: number) => {
    if (days <= 0) {
      return {
        text: "Berakhir",
        color:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30",
        icon: AlertCircle,
        pulse: "",
      };
    } else if (days <= 3) {
      return {
        text: `${days} hari lagi`,
        color:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30",
        icon: AlertCircle,
        pulse: "animate-pulse",
      };
    } else if (days <= 7) {
      return {
        text: `${days} hari lagi`,
        color:
          "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30",
        icon: Clock3,
        pulse: "",
      };
    } else {
      return {
        text: `${days} hari lagi`,
        color:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30",
        icon: CheckCircle,
        pulse: "",
      };
    }
  };

  // Get apply button configuration based on status
  const getApplyButtonConfig = () => {
    if (isApplied) {
      return {
        text: "Sudah Dilamar",
        className:
          "flex items-center px-4 sm:px-6 py-3 bg-green-600 text-white rounded-xl font-medium cursor-not-allowed opacity-75 shadow-lg",
        icon: Check,
        disabled: true,
      };
    } else if (isApplying) {
      return {
        text: "Mengirim...",
        className:
          "flex items-center px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-xl font-medium cursor-not-allowed opacity-75 shadow-lg",
        icon: Loader2,
        disabled: true,
      };
    } else {
      return {
        text: "Lamar Sekarang",
        className:
          "flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25",
        icon: Send,
        disabled: false,
      };
    }
  };

  const handleShare = async (): Promise<void> => {
    if (navigator.share && job) {
      try {
        await navigator.share({
          title: job.job_title,
          text: `Lowongan: ${job.job_title} di ${job.perusahaan_profile.nama_perusahaan}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen">
        <PageBreadcrumb pageTitle="Detail Lowongan" />
        <div className="w-full mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
                  <div className="flex space-x-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                  >
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <PageBreadcrumb pageTitle="Detail Lowongan" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Oops! Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error || "Lowongan tidak ditemukan"}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Kembali
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(job.application_deadline);
  const deadlineStatus = getDeadlineStatus(daysRemaining);
  const DeadlineIcon = deadlineStatus.icon;
  const buttonConfig = getApplyButtonConfig();
  const ButtonIcon = buttonConfig.icon;

  return (
    <div className="min-h-screen ">
      <PageBreadcrumb pageTitle={job.job_title} />

      {/* Profile Warning Modal */}
      <ProfileWarningModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        jobTitle={job?.job_title || ""}
        companyName={job?.perusahaan_profile.nama_perusahaan || ""}
      />

      <div className="w-full mx-auto">
        {/* Profile Status Banner */}
        {!checkingProfile && !userProfileExists && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Profil belum lengkap:</strong> Untuk dapat melamar
                  pekerjaan, silakan lengkapi profil dan resume Anda terlebih
                  dahulu.
                </p>
              </div>
              <Link
                href="/resume"
                className="ml-3 text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md transition-colors"
              >
                Lengkapi Profil
              </Link>
            </div>
          </div>
        )}

        {/* Modern Job Header with Glass Effect */}
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-500/10 dark:to-purple-500/10"></div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -translate-y-32 sm:-translate-y-48 translate-x-32 sm:translate-x-48"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8">
              {/* Company Info & Job Title */}
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 gap-4">
                <div className="mx-auto sm:mx-0 relative">
                  <img
                    src={getCompanyLogoUrl(
                      job.perusahaan_profile.logo,
                      job.perusahaan_profile.nama_perusahaan
                    )}
                    alt={`Logo ${job.perusahaan_profile.nama_perusahaan}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl object-cover border-2 sm:border-4 border-white dark:border-gray-700 shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const encodedName = encodeURIComponent(
                        job.perusahaan_profile.nama_perusahaan
                      );
                      target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
                    }}
                  />
                  {job.perusahaan_profile.status_verifikasi ===
                    "terverifikasi" && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {job.job_title}
                    </h1>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-semibold">
                      {job.perusahaan_profile.nama_perusahaan}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
                    <div className="flex items-center px-3 sm:px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                      <MapPinned className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center px-3 sm:px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {job.job_type}
                      </span>
                    </div>
                    <div className="flex items-center px-3 sm:px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {job.experience}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadline & Actions */}
              <div className="flex flex-col items-center lg:items-end space-y-4 sm:space-y-6 w-full lg:w-auto">
                <div
                  className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl ${deadlineStatus.color} ${deadlineStatus.pulse}`}
                >
                  <DeadlineIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="font-bold text-sm sm:text-base">
                    {deadlineStatus.text}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center lg:text-right">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                  Deadline: {formatDate(job.application_deadline)}
                </div>

                {/* Apply Status Indicator */}
                {checkingApplyStatus && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 text-center">
                    Memeriksa status lamaran...
                  </div>
                )}
                {checkingProfile && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 text-center">
                    Memeriksa profil pengguna...
                  </div>
                )}

                <div className="flex flex-wrap justify-center lg:justify-end gap-2 sm:gap-3 w-full lg:w-auto">
                  {/* Apply Button */}
                  <button
                    onClick={handleApplyClick}
                    disabled={buttonConfig.disabled}
                    className={buttonConfig.className}
                    title={buttonConfig.text}
                  >
                    <ButtonIcon
                      className={`w-4 h-4 mr-2 ${
                        isApplying ? "animate-spin" : ""
                      }`}
                    />
                    <span>{buttonConfig.text}</span>
                  </button>

                  {/* Share & Bookmark */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                      title="Bagikan"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-3 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        isBookmarked
                          ? "bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-800"
                          : "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                      title={
                        isBookmarked
                          ? "Hapus dari Favorit"
                          : "Tambah ke Favorit"
                      }
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isBookmarked ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Job Description */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700/20 overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-500" />
                  Deskripsi Pekerjaan
                </h2>
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Content Cards */}
            {[
              {
                title: "Tanggung Jawab",
                content: job.responsibilities,
                icon: Shield,
                color: "blue",
              },
              {
                title: "Persyaratan",
                content: job.requirements,
                icon: CheckCircle,
                color: "green",
              },
            ].map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700/20 overflow-hidden"
              >
                <div className="p-8">
                  <h2
                    className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center`}
                  >
                    <section.icon
                      className={`w-6 h-6 mr-3 text-${section.color}-500`}
                    />
                    {section.title}
                  </h2>
                  <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700/20 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Star className="w-6 h-6 mr-3 text-yellow-500" />
                    Keahlian yang Dibutuhkan
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Benefits */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700/20 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-green-500" />
                  Benefit & Fasilitas
                </h2>
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {job.benefits}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Accessibility Features */}
            {(job.accessibility_features ||
              job.work_accommodations ||
              (job.disabilitas && job.disabilitas.length > 0)) && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-xl rounded-xl border border-green-200/50 dark:border-green-700/20 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Accessibility className="w-6 h-6 mr-3 text-green-500" />
                    Fasilitas Aksesibilitas
                  </h2>
                  <div className="space-y-6">
                    {job.accessibility_features && (
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center text-lg">
                          <Building className="w-5 h-5 mr-2 text-blue-500" />
                          Fasilitas Fisik
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {job.accessibility_features}
                        </p>
                      </div>
                    )}
                    {job.work_accommodations && (
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center text-lg">
                          <Shield className="w-5 h-5 mr-2 text-purple-500" />
                          Akomodasi Kerja
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {job.work_accommodations}
                        </p>
                      </div>
                    )}
                    {job.disabilitas && job.disabilitas.length > 0 && (
                      <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                          <Heart className="w-5 h-5 mr-2 text-red-500" />
                          Jenis Disabilitas yang Didukung
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {job.disabilitas.map(
                            (disability: DisabilitasType) => (
                              <span
                                key={disability.id}
                                className="px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 text-sm rounded-xl font-semibold"
                              >
                                {disability.kategori_disabilitas} -{" "}
                                {disability.tingkat_disabilitas}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Job Summary in Sidebar */}
            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100/50 dark:border-blue-800/30 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Ringkasan Lowongan
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Salary */}
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Gaji
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {job.salary_range || "Nego"}
                    </div>
                  </div>
                  {/* Job Type */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Jenis
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {job.job_type}
                    </div>
                  </div>
                  {/* Education */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                        <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pendidikan
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {job.education}
                    </div>
                  </div>
                  {/* Experience */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                        <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pengalaman
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {job.experience}
                    </div>
                  </div>
                  {/* Location */}
                  <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                        <MapPinned className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Lokasi
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {job.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Company Info */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-blue-500" />
                  Tentang Perusahaan
                </h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {job.perusahaan_profile.nama_perusahaan}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {job.perusahaan_profile.deskripsi}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Industri
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {job.perusahaan_profile.industri}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Tahun Berdiri
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {job.perusahaan_profile.tahun_berdiri}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Karyawan
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {job.perusahaan_profile.jumlah_karyawan}
                      </span>
                    </div>
                  </div>
                  {/* Enhanced Company Contact */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                    {job.perusahaan_profile.link_website && (
                      <a
                        href={job.perusahaan_profile.link_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Globe className="w-5 h-5 mr-3" />
                        Website Perusahaan
                      </a>
                    )}
                    {job.perusahaan_profile.no_telp && (
                      <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <Phone className="w-5 h-5 mr-3 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {job.perusahaan_profile.no_telp}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Enhanced Company Values */}
                  {job.perusahaan_profile.nilai_nilai &&
                    parseJsonField(job.perusahaan_profile.nilai_nilai).length >
                      0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Star className="w-5 h-5 mr-2 text-yellow-500" />
                          Nilai Perusahaan
                        </h5>
                        <div className="space-y-3">
                          {parseJsonField(
                            job.perusahaan_profile.nilai_nilai
                          ).map((value: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
                            >
                              <CheckCircle className="w-4 h-4 mr-3 text-yellow-500 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
