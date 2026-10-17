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
import useDocumentTitle from "@/hooks/useDocumentTitle";
import {
  User,
  Mail,
  Phone,
  Edit3,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import TalentProfileModal from "../TalentProfileModal";

// Type definitions - Updated to match API response
interface Lokasi {
  id: number;
  kode_pos_ktp: string;
  alamat_lengkap_ktp: string;
  province_ktp_id: string;
  regencie_ktp_id: string;
  district_ktp_id: string;
  village_ktp_id: string;
  kode_pos_domisili: string;
  alamat_lengkap_domisili: string;
  province_domisili_id: string;
  regencie_domisili_id: string;
  district_domisili_id: string;
  village_domisili_id: string;
  user_profile_id: number;
  province_domisili: {
    id: string;
    name: string;
  };
  regency_domisili: {
    id: string;
    name: string;
  };
}

interface Disabilitas {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
}

interface Keterampilan {
  id: number;
  nama_keterampilan: string[];
  resume_id: number;
  created_at: string;
  updated_at: string;
}

interface Resume {
  id: number;
  user_profile_id: number;
  ringkasan_pribadi: string;
  created_at: string;
  updated_at: string;
  keterampilan: Keterampilan[];
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface UserProfile {
  id: number;
  nik: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  no_telp: string;
  latar_belakang: string;
  status_kawin: number;
  user_id: number;
  disabilitas_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  disabilitas: Disabilitas;
  lokasi: Lokasi;
  resume: Resume;
  user: User;
}

interface PostLowongan {
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
  is_active: number;
  perusahaan_profile_id: number;
  created_at: string;
  updated_at: string;
}

interface PerusahaanProfile {
  id: number;
  logo: string;
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
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  status_verifikasi: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface ApplicationData {
  id: number;
  user_profile_id: number;
  perusahaan_profile_id: number;
  status:
    | "Menunggu"
    | "Diterima"
    | "Ditolak"
    | "Wawancara"
    | "Dipekerjakan"
    | "Dibatalkan";
  post_lowongan_id: number;
  salary_min: number;
  salary_max: number;
  created_at: string;
  updated_at: string;
  user_profile: UserProfile;
  post_lowongan: PostLowongan;
  perusahaan_profile: PerusahaanProfile;
}

interface ApiResponse {
  status: boolean;
  data: ApplicationData[];
}

type StatusFilter =
  | "all"
  | "Menunggu"
  | "Diterima"
  | "Ditolak"
  | "Wawancara"
  | "Hired"
  | "Dibatalkan";

export default function TalentTrackingPage() {
  useDocumentTitle("Tracking Talent Pool | JatimBissa");
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Profile modal states - Fixed the variable names to match usage
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTalentProfile, setSelectedTalentProfile] = useState<any>(null);

  // Helper function to get user avatar URL
  const getUserAvatarUrl = (
    avatar: string | null,
    userName: string
  ): string => {
    if (avatar && avatar.trim() !== "") {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${avatar}`;
    }

    const encodedName = encodeURIComponent(userName);
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2&background=6366f1&color=ffffff`;
  };

  const fetchApplications = async (): Promise<void> => {
    try {
      const response = await apiBissaKerja.get("/talent-pool/my-talent");
      console.log("Data applications : ", response.data);
      if (response.data.status && response.data.data) {
        setApplications(response.data.data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (
    applicationId: number,
    newStatus: ApplicationData["status"]
  ): Promise<void> => {
    try {
      setUpdatingStatus(applicationId);

      // panggil endpoint Laravel
      const res = await apiBissaKerja.put(
        `/talent-pool/update-status/${applicationId}`,
        { status: newStatus }
      );

      if (!res?.data?.status) throw new Error("Gagal mengupdate status");

      // sukses → update state lokal
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Gagal mengupdate status. Silakan coba lagi.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Profile modal functions - Added these missing functions
  const openProfileModal = (application: ApplicationData) => {
    // Transform application data to match the expected format for TalentProfileModal
    const talentProfile = {
      id: application.user_profile.user.id,
      name: application.user_profile.user.name,
      avatar: getUserAvatarUrl(
        application.user_profile.user.avatar,
        application.user_profile.user.name
      ),
      location: application.user_profile.lokasi
        ? `${application.user_profile.lokasi.regency_domisili?.name}, ${application.user_profile.lokasi.province_domisili?.name}`
        : "Lokasi tidak tersedia",
      disabilityType:
        application.user_profile.disabilitas?.kategori_disabilitas || "Lainnya",
      disabilityLevel:
        application.user_profile.disabilitas?.tingkat_disabilitas ||
        "Tidak diketahui",
      skills:
        application.user_profile.resume?.keterampilan?.flatMap(
          (k) => k.nama_keterampilan
        ) || [],
      email: application.user_profile.user.email,
      nik: application.user_profile.nik,
      tanggalLahir: application.user_profile.tanggal_lahir,
      jenisKelamin: application.user_profile.jenis_kelamin,
      noTelp: application.user_profile.no_telp,
      ringkasanPribadi: application.user_profile.resume?.ringkasan_pribadi,
      userProfileId: application.user_profile.id,
    };

    setSelectedTalentProfile(talentProfile);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedTalentProfile(null);
  };

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Helper functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status configuration - Updated to match API response
  const statusConfig = {
    Menunggu: {
      label: "Menunggu Respon",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: Clock,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    Diterima: {
      label: "Diterima",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/10",
      borderColor: "border-green-200 dark:border-green-800",
    },
    Ditolak: {
      label: "Ditolak",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-900/10",
      borderColor: "border-red-200 dark:border-red-800",
    },
    Wawancara: {
      label: "Wawancara",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      icon: MessageSquare,
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    Dipekerjakan: {
      label: "Dipekerjakan",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      icon: UserCheck,
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    Dibatalkan: {
      label: "Dibatalkan",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300",
      icon: XCircle,
      bgColor: "bg-gray-50 dark:bg-gray-700/10",
      borderColor: "border-gray-200 dark:border-gray-600",
    },
  };

  // Count applications by status
  const statusCounts = useMemo(() => {
    const counts = {
      all: applications.length,
      Menunggu: 0,
      Diterima: 0,
      Ditolak: 0,
      Wawancara: 0,
      Dipekerjakan: 0,
      Dibatalkan: 0,
    };

    applications.forEach((application) => {
      counts[application.status]++;
    });

    return counts;
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (application) => application.status === statusFilter
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((application) => {
        const skills =
          application.user_profile.resume?.keterampilan?.flatMap(
            (k) => k.nama_keterampilan
          ) || [];
        const location =
          `${application.user_profile.lokasi?.regency_domisili?.name}, ${application.user_profile.lokasi?.province_domisili?.name}` ||
          "";

        return (
          // Search by NIK or user details
          application.user_profile.nik
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          application.post_lowongan.job_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          application.user_profile.disabilitas?.kategori_disabilitas
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
    }

    // Sort by created date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [applications, statusFilter, searchTerm]);

  // Application Card Component
  interface ApplicationCardProps {
    application: ApplicationData;
  }

  const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
    const { user_profile, post_lowongan } = application;
    const config = statusConfig[application.status];
    const StatusIcon = config.icon;

    // Extract skills from resume
    const skills =
      user_profile.resume?.keterampilan?.flatMap((k) => k.nama_keterampilan) ||
      [];

    // Format location
    const location = user_profile.lokasi
      ? `${user_profile.lokasi.regency_domisili?.name}, ${user_profile.lokasi.province_domisili?.name}`
      : "Lokasi tidak tersedia";

    // Calculate age from birth date
    const calculateAge = (birthDate: string): number => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age;
    };

    const age = calculateAge(user_profile.tanggal_lahir);

    // Format salary range
    const formatSalary = (min: number, max: number): string => {
      return `Rp ${min.toLocaleString("id-ID")} - Rp ${max.toLocaleString(
        "id-ID"
      )}`;
    };

    const canUpdateToInterview = application.status === "Diterima";
    const canUpdateToHired = application.status === "Wawancara";
    const canCancel = ["Menunggu", "Diterima", "Wawancara"].includes(
      application.status
    );

    return (
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${config.borderColor} p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full`}
      >
        {/* Status Header Bar */}
        <div
          className={`-mx-6 -mt-6 mb-4 px-6 py-3 ${config.bgColor} rounded-t-xl border-b ${config.borderColor}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-5 h-5 text-current text-black dark:text-gray-300" />
              <span className="font-semibold text-sm text-black dark:text-gray-300">
                {config.label}
              </span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ID: #{application.id}
            </span>
          </div>
        </div>

        <div className="flex-1">
          {/* Profile Header */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative flex-shrink-0">
              <img
                src={getUserAvatarUrl(
                  user_profile.user.avatar,
                  user_profile.user.name
                )}
                alt={`Avatar ${user_profile.user.name}`}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const encodedName = encodeURIComponent(
                    user_profile.user.name
                  );
                  target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
                }}
              />
              {/* Disability indicator */}
              {user_profile.disabilitas && (
                <div
                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5"
                  title="Penyandang disabilitas"
                >
                  <Heart className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {user_profile.user.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                Posisi: {post_lowongan.job_title}
              </p>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  {age} tahun
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {user_profile.jenis_kelamin === "L"
                    ? "Laki-laki"
                    : "Perempuan"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Location Info */}
          <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
            {user_profile.no_telp && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
                <span className="truncate">{user_profile.no_telp}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
              <span className="truncate">
                Penawaran:{" "}
                {formatSalary(application.salary_min, application.salary_max)}
              </span>
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keahlian:
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                    +{skills.length - 4} lagi
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Disability Information */}
          {user_profile.disabilitas && (
            <div className="mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-2">
                  <Heart className="w-4 h-4 text-blue-600 flex-shrink-0 mr-2" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Informasi Disabilitas:
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    {user_profile.disabilitas.kategori_disabilitas} -{" "}
                    {user_profile.disabilitas.tingkat_disabilitas}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Timeline Lamaran:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Dibuat</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(application.created_at)}
                  </p>
                </div>
              </div>

              {application.updated_at !== application.created_at && (
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      application.status === "Diterima"
                        ? "bg-green-500"
                        : application.status === "Ditolak"
                        ? "bg-red-500"
                        : application.status === "Wawancara"
                        ? "bg-purple-500"
                        : application.status === "Dipekerjakan"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Status: {application.status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(application.updated_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status-specific notifications */}
          {application.status === "Wawancara" && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Tahap Wawancara
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Kandidat sudah masuk tahap wawancara. Koordinasikan jadwal
                    dan proses selanjutnya.
                  </p>
                </div>
              </div>
            </div>
          )}

          {application.status === "Dipekerjakan" && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">
                    Kandidat Berhasil Dipekerjakan!
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-400">
                    Kandidat telah resmi bergabung sebagai{" "}
                    {post_lowongan.job_title}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => openProfileModal(application)}
            className="flex-1 text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Lihat Profile
          </button>

          {/* Status Update Buttons - No event handlers for now */}
          {canUpdateToInterview && (
            <button
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              onClick={() =>
                updateApplicationStatus(application.id, "Wawancara")
              }
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Wawancara
            </button>
          )}

          {canUpdateToHired && (
            <button
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              onClick={() =>
                updateApplicationStatus(application.id, "Dipekerjakan")
              }
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Pekerjakan
            </button>
          )}

          {application.status === "Menunggu" && (
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              onClick={() =>
                updateApplicationStatus(application.id, "Dibatalkan")
              }
            >
              <XCircle className="w-4 h-4 mr-2" />
              Batalkan
            </button>
          )}
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Tracking Talent Pool" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Memuat data lamaran...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Tracking Talent Pool" />
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tracking Talent Pool" />
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm  mb-5 rounded-2xl">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900  dark:text-white">
                Tracking Talent Pool
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Kelola dan pantau lamaran kerja untuk talenta disabilitas
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-300">
              <User className="w-4 h-4" />
              <span>Total: {applications.length} lamaran</span>
            </div>
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
                placeholder="Cari berdasarkan NIK, posisi, skills..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                  ? "Lamaran kerja akan muncul di sini setelah ada yang melamar"
                  : "Coba ubah filter atau cari dengan kata kunci lain"}
              </p>
              {statusFilter === "all" ? (
                <Link
                  href="/talent-pool"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Lihat Talent Pool
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

        {/* Profile Modal */}
        <TalentProfileModal
          isOpen={showProfileModal}
          onClose={closeProfileModal}
          talent={selectedTalentProfile}
        />
      </div>
    </div>
  );
}
