"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Briefcase,
  Building2,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Eye,
  Send,
  Star,
  Award,
  Shield,
  Heart,
  Target,
  Accessibility,
  MessageSquare,
  XCircle,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Search,
} from "lucide-react";
import Link from "next/link";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import axios, { AxiosError } from "axios";

// Type definitions (same as in MyApplyJobPage)
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

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
  status_verifikasi: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface Lowongan {
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
  perusahaan_profile_id: number;
  perusahaan_profile: PerusahaanProfile;
  disabilitas?: DisabilitasType[];
  created_at: string;
  updated_at: string;
}

interface Application {
  id: number;
  lowongan_id: number;
  user_id: number;
  status: "pending" | "reviewed" | "interview" | "accepted" | "rejected";
  feedback?: string | null;
  applied_at: string;
  reviewed_at?: string | null;
  interview_at?: string | null;
  accepted_at?: string | null;
  rejected_at?: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  lowongan: Lowongan;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Application[];
}

export default function DashboardUser() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch applications from API
  const fetchApplications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiBissaKerja.get<ApiResponse>("/my-apply-jobs");

      if (response.data.success === true) {
        setApplications(response.data.data || []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;

        if (axiosError.response?.status === 404) {
          setApplications([]);
        } else if (axiosError.response?.status === 500) {
          setError(
            "Terjadi gangguan pada sistem. Silakan coba lagi dalam beberapa saat."
          );
        } else if (axiosError.response?.status === 401) {
          setError("Anda perlu login untuk melihat data lamaran.");
        } else if (axiosError.response?.status === 403) {
          setError("Anda tidak memiliki akses untuk melihat data ini.");
        } else if (!axiosError.response) {
          setError(
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
          );
        } else {
          setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Calculate statistics from real data
  const calculateStats = () => {
    const totalApplications = applications.length;
    const interviewScheduled = applications.filter(
      (app) => app.status === "interview"
    ).length;
    const acceptedApplications = applications.filter(
      (app) => app.status === "accepted"
    ).length;
    const pendingApplications = applications.filter(
      (app) => app.status === "pending"
    ).length;

    // Calculate recent applications (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentApplications = applications.filter(
      (app) => new Date(app.applied_at) >= oneWeekAgo
    ).length;

    return {
      totalApplications,
      interviewScheduled,
      acceptedApplications,
      pendingApplications,
      recentApplications,
    };
  };

  const stats = calculateStats();

  // Get recent applications (last 3)
  const getRecentApplications = () => {
    return applications
      .sort(
        (a, b) =>
          new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
      )
      .slice(0, 3);
  };

  const recentApplications = getRecentApplications();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "interview":
        return "Interview";
      case "reviewed":
        return "Ditinjau";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      case "accepted":
        return "Diterima";
      default:
        return "Unknown";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-8">
          {/* Welcome Section Skeleton */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
          </div>

          {/* Statistics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gagal Memuat Data Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchApplications}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Selamat Datang di JATIM BISSA!
              </h1>
              <p className="text-blue-100 mb-4">
                Platform pencarian kerja yang ramah dan inklusif untuk semua
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Accessibility className="w-4 h-4" />
                  Ramah Disabilitas
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Inklusi untuk Semua
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Lamaran
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalApplications}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-700 dark:text-green-400">
                +{stats.recentApplications}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">
                minggu ini
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interview Terjadwal
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.interviewScheduled}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <MessageSquare className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">
                Siap untuk interview
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Menunggu
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingApplications}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">
                Dalam proses
              </span>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              Lamaran Terbaru
            </h3>
            {applications.length > 3 && (
              <Link
                href="/dashboard/my-apply-jobs"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Lihat Semua →
              </Link>
            )}
          </div>

          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((application) => {
                const hasDisabilitySupport =
                  application.lowongan.disabilitas &&
                  application.lowongan.disabilitas.length > 0;

                return (
                  <div
                    key={application.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <img
                          src={getCompanyLogoUrl(
                            application.lowongan.perusahaan_profile.logo,
                            application.lowongan.perusahaan_profile
                              .nama_perusahaan
                          )}
                          alt={`Logo ${application.lowongan.perusahaan_profile.nama_perusahaan}`}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const encodedName = encodeURIComponent(
                              application.lowongan.perusahaan_profile
                                .nama_perusahaan
                            );
                            target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {application.lowongan.job_title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {
                              application.lowongan.perusahaan_profile
                                .nama_perusahaan
                            }
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {hasDisabilitySupport && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Ramah Disabilitas
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(application.applied_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Send className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Belum ada lamaran yang dikirim
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Search className="w-4 h-4" />
                Cari Lowongan
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        {/* Resume Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Status CV/Resume
            </h3>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-2">
                  Profil Belum Lengkap
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                  Lengkapi profil Anda untuk meningkatkan peluang mendapatkan
                  pekerjaan yang sesuai.
                </p>
                <Link
                  href="/resume"
                  className="block w-full text-center bg-amber-700 hover:bg-amber-800 text-white text-sm py-2 px-4 rounded-lg transition-colors"
                >
                  Lengkapi Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Aksi Cepat
          </h3>

          <div className="space-y-3">
            <Link
              href="/jobs"
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Cari Lowongan
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Temukan pekerjaan impian
                </p>
              </div>
            </Link>

            <Link
              href="/my-apply-jobs"
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Lamaran Saya
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Lihat status semua lamaran ({stats.totalApplications})
                </p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Edit Profil
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Perbarui informasi profil
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Summary */}
        {stats.interviewScheduled > 0 || stats.acceptedApplications > 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Aktivitas Penting
            </h3>

            <div className="space-y-3">
              {stats.acceptedApplications > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      {stats.acceptedApplications} lamaran diterima
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    Selamat! Periksa email untuk detail lebih lanjut.
                  </p>
                </div>
              )}

              {stats.interviewScheduled > 0 && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      {stats.interviewScheduled} interview terjadwal
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                    Persiapkan diri dengan baik untuk interview.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
