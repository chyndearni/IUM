"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Loader2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Send,
  AlertCircle,
  Award,
  MessageSquare,
  PartyPopper,
  Star,
} from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import { MyApplyJobLoadingSkeleton } from "@/skeleton/MyApplyJobLoadingSkeleton";
import useDocumentTitle from "@/hooks/useDocumentTitle";

// Type definitions
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
  type?: "online" | "offline" | null;
  location?: string | null;
  link_meeting?: string | null;
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

type StatusFilter =
  | "all"
  | "pending"
  | "reviewed"
  | "interview"
  | "accepted"
  | "rejected";

export default function MyApplyJobPage() {
  useDocumentTitle("Lamaran Saya | JatimBissa");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  // Helper functions
  // Remove formatDateTime function since we only need formatDate
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Status configuration
  const statusConfig = {
    pending: {
      label: "Menunggu",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: Clock,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
    },
    reviewed: {
      label: "Ditinjau",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      icon: Eye,
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
    },
    interview: {
      label: "Interview",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      icon: MessageSquare,
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
    },
    accepted: {
      label: "Diterima",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/10",
    },
    rejected: {
      label: "Ditolak",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-900/10",
    },
  };

  // Count applications by status
  const statusCounts = useMemo(() => {
    const counts = {
      all: applications.length,
      pending: 0,
      reviewed: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      counts[app.status]++;
    });

    return counts;
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.lowongan.job_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.lowongan.perusahaan_profile.nama_perusahaan
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.lowongan.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by applied date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
    );
  }, [applications, statusFilter, searchTerm]);

  // Application Card Component
  interface ApplicationCardProps {
    application: Application;
  }

  const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
    const { lowongan: job } = application;
    const config = statusConfig[application.status];
    const StatusIcon = config.icon;

    const calculateDaysRemaining = (deadline: string): number => {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const daysRemaining = calculateDaysRemaining(job.application_deadline);
    const isDeadlinePassed = daysRemaining <= 0;

    // Check if job supports disability
    const hasDisabilitySupport = job.disabilitas && job.disabilitas.length > 0;
    const hasAccessibilityFeatures =
      job.accessibility_features || job.work_accommodations;

    return (
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
          application.status === "accepted" ? "" : ""
        }`}
      >
        <div className="flex-1">
          {/* Header with Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
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
                {/* Disability indicator */}
                {(hasDisabilitySupport || hasAccessibilityFeatures) && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1"
                    title="Ramah disabilitas"
                  >
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {job.job_title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {job.perusahaan_profile.nama_perusahaan}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {job.perusahaan_profile.industri}
                </p>
              </div>
            </div>
            <div
              className={`flex items-center px-3 py-1 rounded-full shadow-lg ${config.color}`}
            >
              <StatusIcon className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">{config.label}</span>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {job.salary_range || "Tidak disebutkan"}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Award className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {job.job_type} • {job.experience}
              </span>
            </div>
            {/* <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span
                className={`truncate ${
                  isDeadlinePassed
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : ""
                }`}
              >
                Deadline: {formatDate(job.application_deadline)}
                {isDeadlinePassed && " (Berakhir)"}
                {!isDeadlinePassed && daysRemaining <= 3 && (
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    {" "}
                    ({daysRemaining} hari lagi)
                  </span>
                )}
              </span>
            </div> */}
          </div>

          {/* Skills Preview */}
          {job.skills && job.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
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
            </div>
          )}

          {/* Accessibility Features */}
          {hasAccessibilityFeatures && !hasDisabilitySupport && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Heart className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  Tersedia fasilitas aksesibilitas
                </span>
              </div>
            </div>
          )}

          {/* Disability Support */}
          {hasDisabilitySupport && (
            <div className="mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Heart className="w-4 h-4 text-blue-600 flex-shrink-0 mr-2" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Mendukung Disabilitas:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.disabilitas!.map(
                    (disability: DisabilitasType, index: number) => (
                      <span
                        key={disability.id}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {disability.kategori_disabilitas} (
                        {disability.tingkat_disabilitas})
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Application Status Timeline */}
          <div className={`p-3 ${config.bgColor} rounded-lg mb-4`}>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Lamaran:
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Dilamar pada: {formatDate(application.applied_at)}
              </div>
              {application.reviewed_at && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Ditinjau pada: {formatDate(application.reviewed_at)}
                </div>
              )}
              {application.interview_at && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Interview pada: {formatDate(application.interview_at)}
                </div>
              )}
              {application.accepted_at && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Diterima pada: {formatDate(application.accepted_at)}
                </div>
              )}
              {application.rejected_at && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Ditolak pada: {formatDate(application.rejected_at)}
                </div>
              )}
            </div>
            {application.feedback && (
              <div className="text-xs text-gray-700 dark:text-gray-300 mt-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <strong>Feedback:</strong> {application.feedback}
              </div>
            )}
          </div>

          {/* Interview Status Special Notification */}
          {application.status === "interview" && (
            <div>
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-purple-800 dark:text-purple-300 mb-1">
                      Selamat! Anda dipanggil interview
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-400">
                      Persiapkan diri Anda dengan baik.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div>
                    <p className="text-sm capitalize font-medium text-blue-800 dark:text-blue-300 mb-1">
                      {application.type}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      {application.type === "online" ? (
                        <a
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={application.link_meeting ?? undefined}
                        >
                          {application.link_meeting ?? "-"}
                        </a>
                      ) : (
                        application.location ?? "-"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accepted Status Special Notification */}
          {application.status === "accepted" && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <PartyPopper className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">
                    Selamat! Lamaran Anda Diterima!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 mb-2">
                    Anda telah resmi diterima bekerja di{" "}
                    <span className="font-semibold">
                      {job.perusahaan_profile.nama_perusahaan}
                    </span>{" "}
                    sebagai{" "}
                    <span className="font-semibold">{job.job_title}</span>.
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    Periksa email Anda untuk informasi lebih lanjut mengenai
                    kontrak kerja, tanggal mulai bekerja, dan proses onboarding.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Langkah selanjutnya: Tunggu email konfirmasi dari HRD
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            href={`/jobs/${job.id}`}
            className="flex-1 text-center px-4 py-3 bg-brand-600 text-white border border-gray-300 dark:border-gray-600  hover:bg-brand-700 dark:hover:bg-brand-700 rounded-lg text-sm font-medium transition-colors"
          >
            Lihat Detail
          </Link>
          {/* <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            Riwayat
          </button> */}
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lamaran Saya" />
        <MyApplyJobLoadingSkeleton />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Lamaran Saya" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Gagal Memuat Data
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
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Lamaran Saya" />
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lamaran Saya
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kelola dan pantau status lamaran pekerjaan Anda
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total:{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {applications.length}
              </span>{" "}
              lamaran
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Filter Status
              </h2>

              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari lamaran..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Status Filters */}
              <div className="space-y-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "all"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>Semua Status</span>
                  <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-xs">
                    {statusCounts.all}
                  </span>
                </button>

                {Object.entries(statusConfig).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as StatusFilter)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? config.color
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <config.icon className="w-4 h-4 mr-2" />
                      <span>{config.label}</span>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-xs">
                      {statusCounts[status as keyof typeof statusCounts]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {statusFilter === "all"
                    ? "Belum ada lamaran"
                    : `Belum ada lamaran dengan status ${statusConfig[
                        statusFilter as keyof typeof statusConfig
                      ]?.label.toLowerCase()}`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {statusFilter === "all"
                    ? "Mulai melamar pekerjaan untuk melihat status lamaran Anda di sini"
                    : "Coba ubah filter atau cari dengan kata kunci lain"}
                </p>
                {statusFilter === "all" ? (
                  <Link
                    href="/jobs"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Cari Lowongan
                  </Link>
                ) : (
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Lihat Semua Lamaran
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
