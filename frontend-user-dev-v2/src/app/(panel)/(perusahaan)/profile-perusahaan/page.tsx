"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import {
  Edit2,
  Building,
  MapPin,
  Globe,
  Phone,
  Mail,
  Users,
  Calendar,
  Award,
  Target,
  Eye,
  CheckCircle,
  ExternalLink,
  Share2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";

// Loading Skeleton Components
const Skeleton = ({
  className = "",
  variant = "rectangular",
}: {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 animate-pulse";
  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

const SkeletonText = ({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={`h-4 ${
          index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
        }`}
        variant="text"
      />
    ))}
  </div>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-2 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
      <Skeleton className="w-48 h-8" />
    </div>

    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <Skeleton className="w-56 h-6 mb-2" />
          <Skeleton className="w-80 h-4" />
        </div>

        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <Skeleton variant="circular" className="w-32 h-32 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div>
                  <Skeleton className="w-80 h-8 mb-2" />
                  <SkeletonText lines={3} />
                </div>
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="w-32 h-8 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="w-10 h-10" />
                  <Skeleton className="w-32 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Sections Skeleton */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-6">
                <Skeleton variant="circular" className="w-5 h-5" />
                <Skeleton className="w-48 h-6" />
              </div>
              <SkeletonText lines={4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Interfaces
interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
  province_id: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface CompanyData {
  id?: number;
  nama_perusahaan?: string;
  logo?: string;
  deskripsi?: string;
  industri?: string;
  tahun_berdiri?: string;
  jumlah_karyawan?: string;
  province_id?: string;
  regencie_id?: string;
  no_telp?: string;
  link_website?: string;
  alamat_lengkap?: string;
  visi?: string;
  misi?: string;
  nilai_nilai?: string[];
  sertifikat?: string[];
  nib?: string;
  status_verifikasi: string;
  province?: Province;
  regency?: Regency;
  // Social Media
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export default function ProfilePerusahaan() {
  useDocumentTitle("Profil Perusahaan | JatimBissa");
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasCompanyProfile, setHasCompanyProfile] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, []);

  // Auto redirect when no company profile is detected
  useEffect(() => {
    if (hasCompanyProfile === false && !isLoading && !error) {
      router.push("/profile-perusahaan/form");
    }
  }, [hasCompanyProfile, isLoading, error, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, load user data
      const userResponse = await apiBissaKerja.get("/user");

      if (userResponse.data?.user) {
        setUserData(userResponse.data.user);
      }

      // Then, try to load company profile with better error handling
      try {
        const companyResponse = await apiBissaKerja.get<
          ApiResponse<CompanyData>
        >("perusahaan/profile");

        if (companyResponse.data?.success && companyResponse.data?.data) {
          setCompanyData(companyResponse.data.data);
          setHasCompanyProfile(true);
        } else {
          setCompanyData(null);
          setHasCompanyProfile(false);
        }
      } catch (companyError: any) {
        console.log("Company profile error:", companyError);

        // Handle different types of errors
        if (companyError.response?.status === 404) {
          // Profile doesn't exist - this is normal, redirect to form
          setCompanyData(null);
          setHasCompanyProfile(false);
        } else if (companyError.response?.status === 401) {
          // Unauthorized - token might be expired
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
        } else if (
          companyError.code === "ERR_NETWORK" ||
          !companyError.response
        ) {
          // Network error or CORS
          setError(
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
          );
        } else {
          // Other errors
          setError(
            companyError.response?.data?.message ||
              "Terjadi kesalahan saat memuat profile perusahaan."
          );
        }
      }
    } catch (error: any) {
      console.error("Error loading user data:", error);

      if (error.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else if (error.code === "ERR_NETWORK" || !error.response) {
        setError(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        setError(
          error.response?.data?.message || "Terjadi kesalahan saat memuat data."
        );
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await loadData();
  };

  const handleEdit = () => {
    router.push("/profile-perusahaan/form");
  };

  const getDisplayLogo = () => {
    if (companyData?.logo)
      return process.env.NEXT_PUBLIC_BASE_URL + "/storage/" + companyData.logo;
    if (userData?.avatar) return userData.avatar;
    return null;
  };

  const getDisplayName = () => {
    return companyData?.nama_perusahaan || userData?.name || "Nama Perusahaan";
  };

  // Utility functions
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "terverifikasi":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "belum":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "proses":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "terverifikasi":
        return "Terverifikasi";
      case "belum":
        return "Tidak Aktif";
      case "proses":
        return "Belum Verifikasi";
      default:
        return "Tidak Diketahui";
    }
  };

  const formatLocation = () => {
    const parts = [];
    if (companyData?.regency?.name) parts.push(companyData.regency.name);
    if (companyData?.province?.name) parts.push(companyData.province.name);
    return parts.join(", ") || "Lokasi tidak tersedia";
  };

  const getSocialMediaLinks = () => {
    const socialMedia = [];
    if (companyData?.linkedin)
      socialMedia.push({
        name: "LinkedIn",
        url: companyData.linkedin,
        icon: "linkedin",
      });
    if (companyData?.instagram)
      socialMedia.push({
        name: "Instagram",
        url: companyData.instagram,
        icon: "instagram",
      });
    if (companyData?.facebook)
      socialMedia.push({
        name: "Facebook",
        url: companyData.facebook,
        icon: "facebook",
      });
    if (companyData?.twitter)
      socialMedia.push({
        name: "Twitter",
        url: companyData.twitter,
        icon: "twitter",
      });
    if (companyData?.youtube)
      socialMedia.push({
        name: "YouTube",
        url: companyData.youtube,
        icon: "youtube",
      });
    if (companyData?.tiktok)
      socialMedia.push({
        name: "TikTok",
        url: companyData.tiktok,
        icon: "tiktok",
      });
    return socialMedia;
  };

  const getSafeArray = (data: any): string[] => {
    if (!data) return [];

    // If it's a JSON string, parse it first
    if (typeof data === "string") {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => typeof item === "string" && item.trim() !== ""
          );
        }
        // If it's just a regular string (not JSON), return as single item
        else if (data.trim() !== "") {
          return [data.trim()];
        }
      } catch (e) {
        // If JSON parse fails, treat it as regular string
        if (data.trim() !== "") {
          return [data.trim()];
        }
      }
    }

    // If it's already an array
    if (Array.isArray(data)) {
      return data.filter(
        (item) => typeof item === "string" && item.trim() !== ""
      );
    }

    return [];
  };

  const getAchievements = () => {
    const achievements = [];

    // Get safe sertifikat array (parse JSON string if needed)
    const sertifikatArray = getSafeArray(companyData?.sertifikat);
    achievements.push(...sertifikatArray);

    return achievements;
  };

  const getCompanyValues = () => {
    // Parse JSON string format: ["value1","value2","value3"]
    return getSafeArray(companyData?.nilai_nilai);
  };

  // Show loading skeleton
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Show error state (only for critical errors, not for missing profile)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageBreadcrumb pageTitle="Profile Perusahaan" />
        <div className="space-y-6">
          <ComponentCard title="Profile Perusahaan">
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gagal Memuat Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {error}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                  <RefreshCw
                    size={16}
                    className={isRetrying ? "animate-spin" : ""}
                  />
                  {isRetrying ? "Memuat..." : "Coba Lagi"}
                </button>
                {error.includes("login") && (
                  <button
                    onClick={() => router.push("/login")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Login Ulang
                  </button>
                )}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  // Show redirecting message when no company profile exists
  // This will be briefly shown before redirect happens
  if (hasCompanyProfile === false || !companyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageBreadcrumb pageTitle="Profile Perusahaan" />
        <div className="space-y-6">
          <ComponentCard title="Profile Perusahaan">
            <div className="text-center py-12">
              <Building size={48} className="mx-auto text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Mengalihkan ke Form Profile...
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Profile perusahaan belum lengkap. Anda akan dialihkan ke halaman
                pengisian form.
              </p>
              <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  const socialMediaLinks = getSocialMediaLinks();
  const achievements = getAchievements();
  const companyValues = getCompanyValues();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Profile Perusahaan" />

      <div className="space-y-6">
        <ComponentCard
          title="Profile Perusahaan"
          desc="Informasi lengkap tentang perusahaan dan budaya kerja"
          titleButton="Edit Profile"
          urlButton="/profile-perusahaan/form"
        >
          <div className="space-y-8">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    {getDisplayLogo() ? (
                      <img
                        src={getDisplayLogo()!}
                        alt="Company Logo"
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-white/20 border-4 border-white/20 shadow-2xl flex items-center justify-center">
                        <Building size={48} className="text-white/60" />
                      </div>
                    )}
                    {/* <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div> */}
                    <div className="absolute -bottom-2 -right-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span
                        className={getStatusBadge(
                          companyData?.status_verifikasi
                        )}
                      >
                        {getStatusLabel(companyData?.status_verifikasi)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      {getDisplayName()}
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {companyData.deskripsi ||
                        "Deskripsi perusahaan belum tersedia."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {companyData.industri && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                        <Building size={16} />
                        <span className="text-sm font-medium">
                          {companyData.industri}
                        </span>
                      </div>
                    )}
                    {companyData.tahun_berdiri && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">
                          Est. {companyData.tahun_berdiri}
                        </span>
                      </div>
                    )}
                    {companyData.jumlah_karyawan && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                        <Users size={16} />
                        <span className="text-sm font-medium">
                          {companyData.jumlah_karyawan} karyawan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards - Sertifikat & Pencapaian */}
            {achievements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Award
                    size={20}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                  Sertifikat & Pencapaian
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Award
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {achievement}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Phone size={20} className="text-blue-600 dark:text-blue-400" />
                Informasi Kontak
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {companyData.alamat_lengkap && (
                  <div className="flex items-start gap-4 p-4 col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <MapPin
                      size={20}
                      className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Alamat
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {companyData.alamat_lengkap}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatLocation()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {companyData.nib && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Building
                        size={20}
                        className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          NIB (Nomor Induk Berusaha)
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {companyData.nib}
                        </p>
                      </div>
                    </div>
                  )}

                  {companyData.no_telp && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Phone
                        size={20}
                        className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Telepon
                        </p>
                        <a
                          href={`tel:${companyData.no_telp}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {companyData.no_telp}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Mail
                      size={20}
                      className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${userData?.email || ""}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {userData?.email || "Email tidak tersedia"}
                      </a>
                    </div>
                  </div>

                  {companyData.link_website && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Globe
                        size={20}
                        className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Website
                        </p>
                        <a
                          href={companyData.link_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {companyData.link_website}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media */}
            {socialMediaLinks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Share2
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  Media Sosial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {socialMediaLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ExternalLink
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {social.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {social.url}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Vision & Mission */}
            {(companyData.visi || companyData.misi) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {companyData.visi && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Eye
                        size={20}
                        className="text-purple-600 dark:text-purple-400"
                      />
                      Visi
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {companyData.visi}
                    </p>
                  </div>
                )}

                {companyData.misi && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Target
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                      Misi
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {companyData.misi}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Company Values */}
            {companyValues.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Award
                    size={20}
                    className="text-orange-600 dark:text-orange-400"
                  />
                  Nilai-Nilai Perusahaan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyValues.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
