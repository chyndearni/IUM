"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Eye,
  Accessibility,
  PlusCircle,
  Settings,
  BarChart3,
  Loader2,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import Link from "next/link";

// Type Definitions
interface Lamaran {
  id: number;
  lowongan_id: number;
  user_id: number;
  status: string;
  feedback: string | null;
  type: string | null;
  location: string | null;
  link_meeting: string | null;
  applied_at: string;
  reviewed_at: string | null;
  interview_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Lowongan {
  id: number;
  job_title: string;
  salary_range: string;
  job_type: string;
  location: string;
  application_deadline: string;
  accessibility_features?: string;
  is_active: number;
  lamaran?: Lamaran[];
}

interface PerusahaanProfile {
  id: number;
  nama_perusahaan: string;
  logo?: string;
  status_verifikasi: string;
  lowongan?: Lowongan[];
}

interface CompanyData {
  id: number;
  name: string;
  email: string;
  avatar: string;
  perusahaan_profile?: PerusahaanProfile;
}

interface Stats {
  totalJobs: number;
  totalApplicants: number;
  activeJobs: number;
  newApplicants: number;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: CompanyData;
}

export default function DashboardCompany() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0,
    newApplicants: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiBissaKerja.get<ApiResponse>(
        "/dashboard-company/get-all-data"
      );
      console.log("API Response:", response.data);

      const result = response.data;

      if (result.status && result.data) {
        setCompanyData(result.data);

        const lowongan = result.data.perusahaan_profile?.lowongan || [];
        const activeJobs = lowongan.filter((job) => job.is_active === 1).length;

        // Hitung total lamaran dari semua lowongan
        const totalApplicants = lowongan.reduce((total, job) => {
          return total + (job.lamaran?.length || 0);
        }, 0);

        // Hitung lamaran baru (status pending)
        const newApplicants = lowongan.reduce((total, job) => {
          const pendingCount =
            job.lamaran?.filter((lamaran) => lamaran.status === "pending")
              .length || 0;
          return total + pendingCount;
        }, 0);

        setStats({
          totalJobs: lowongan.length,
          totalApplicants: totalApplicants,
          activeJobs: activeJobs,
          newApplicants: newApplicants,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getJobStatusColor = (isActive: number): string => {
    return isActive === 1
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  const getJobStatusText = (isActive: number): string => {
    return isActive === 1 ? "Aktif" : "Tidak Aktif";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Memuat data dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">
                Gagal Memuat Data
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                {error}
              </p>
              <button
                onClick={fetchDashboardData}
                className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profile = companyData?.perusahaan_profile;
  const recentJobs = profile?.lowongan?.slice(0, 3) || [];

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Dashboard Perusahaan
              </h1>
              <p className="text-blue-100 mb-4">
                Kelola lowongan kerja dan temukan talent terbaik yang inklusif
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {profile?.nama_perusahaan || companyData?.name || "Perusahaan"}
                </span>
                {profile?.status_verifikasi === "terverifikasi" && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Terverifikasi
                  </span>
                )}
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
                  Total Lowongan
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalJobs}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Eye className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">
                Semua lowongan
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lowongan Aktif
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeJobs}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">
                Sedang berjalan
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Pelamar
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalApplicants}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Users className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">
                Semua pelamar
              </span>
            </div>
          </div>
        </div>

        {/* Recent Job Postings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Lowongan Terbaru
            </h3>
            <Link href={'/lowongan-pekerjaan'} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              Lihat Semua →
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Belum ada lowongan pekerjaan
              </p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                Tambah Lowongan Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <Link href={`/lowongan-pekerjaan/${job.id}`}
                  key={job.id}
                  
                >
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {job.job_title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getJobStatusColor(
                            job.is_active
                          )}`}
                        >
                          {getJobStatusText(job.is_active)}
                        </span>
                        {job.lamaran && job.lamaran.length > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {job.lamaran.length} Pelamar
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {job.salary_range} • {job.job_type}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Deadline: {formatDate(job.application_deadline)}
                        </span>
                        {job.accessibility_features && (
                          <span className="flex items-center gap-1">
                            <Accessibility className="w-3 h-3" />
                            Inklusif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        {/* Company Profile Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Profil Perusahaan
            </h3>
          </div>

          {profile?.status_verifikasi === "terverifikasi" ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">
                    Profil Terverifikasi
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Profil perusahaan Anda sudah terverifikasi dan siap menarik
                    kandidat terbaik.
                  </p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                    Edit Profil
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                    Menunggu Verifikasi
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    Profil perusahaan Anda sedang dalam proses verifikasi.
                  </p>
                  <button className="w-full bg-yellow-700 hover:bg-yellow-800 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                    Lihat Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Aksi Cepat
          </h3>

          <div className="space-y-3">
            <Link href={'/lowongan-pekerjaan/create'} className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Tambah Lowongan
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Buat lowongan kerja baru
                </p>
              </div>
            </Link>

            <Link href={'/talent-pool'} className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Talent Pool
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Kelola kandidat potensial
                </p>
              </div>
            </Link>

            {/* <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Laporan & Analitik
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Lihat performa rekrutmen
                </p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Pengaturan
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Kelola akun perusahaan
                </p>
              </div>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}