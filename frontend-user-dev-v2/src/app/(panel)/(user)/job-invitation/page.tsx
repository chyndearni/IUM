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
  User,
  Mail,
  Phone,
  Edit3,
  ChevronRight,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import Link from "next/link";
import CompanyProfileModal from "./CompanyProfileModal"; // Import modal component

// Updated type definitions based on API response
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

interface JobInvitation {
  id: number;
  user_profile_id: number;
  perusahaan_profile_id: number;
  post_lowongan_id: number;
  status: string;
  salary_min: number;
  salary_max: number;
  created_at: string;
  updated_at: string;
  user_profile: UserProfile;
  post_lowongan: PostLowongan;
  perusahaan_profile: PerusahaanProfile;
}

type StatusFilter =
  | "all"
  | "Menunggu"
  | "Diterima"
  | "Ditolak"
  | "Wawancara"
  | "Dipekerjakan"
  | "Cancelled";

export default function JobInvitationsPage() {
  useDocumentTitle("Undangan Kerja | JatimBissa");
  const [invitations, setInvitations] = useState<JobInvitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

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

  const fetchInvitations = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiBissaKerja.get(
        "/talent-pool/get-invitation-user"
      );

      console.log("API Response:", response.data);

      if (response.data.status && response.data.data) {
        setInvitations(response.data.data);
      } else {
        throw new Error("Format respons tidak valid");
      }
    } catch (err) {
      console.error("Error fetching invitations:", err);
      setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Update invitation status (accept or reject)
  const updateInvitationStatus = async (
    invitationId: number,
    newStatus: "Diterima" | "Ditolak"
  ): Promise<void> => {
    try {
      setUpdatingStatus(invitationId);

      // PANGGIL endpoint yang benar
      const response = await apiBissaKerja.put(
        `/talent-pool/update-status/${invitationId}`,
        { status: newStatus }
      );

      if (response.data?.status) {
        // Update state lokal biar UI langsung berubah
        setInvitations((prev) =>
          prev.map((inv) =>
            inv.id === invitationId
              ? {
                  ...inv,
                  status: newStatus,
                  updated_at: new Date().toISOString(),
                }
              : inv
          )
        );
      } else {
        throw new Error(response.data?.message || "Gagal mengupdate status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Gagal mengupdate status. Silakan coba lagi.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle company profile modal
  const handleShowCompanyProfile = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompanyId(null);
  };

  // Fetch invitations on component mount
  useEffect(() => {
    fetchInvitations();
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Status configuration
  const statusConfig = {
    Menunggu: {
      label: "Menunggu",
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
    Cancelled: {
      label: "Dibatalkan",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300",
      icon: XCircle,
      bgColor: "bg-gray-50 dark:bg-gray-700/10",
      borderColor: "border-gray-200 dark:border-gray-600",
    },
  };

  // Count invitations by status
  const statusCounts = useMemo(() => {
    const counts = {
      all: invitations.length,
      Menunggu: 0,
      Diterima: 0,
      Ditolak: 0,
      Wawancara: 0,
      Dipekerjakan: 0,
      Cancelled: 0,
    };

    invitations.forEach((invitation) => {
      if (counts.hasOwnProperty(invitation.status)) {
        counts[invitation.status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [invitations]);

  // Filter invitations
  const filteredInvitations = useMemo(() => {
    let filtered = invitations;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (invitation) => invitation.status === statusFilter
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (invitation) =>
          invitation.perusahaan_profile.nama_perusahaan
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invitation.post_lowongan.job_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invitation.post_lowongan.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sort by created date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [invitations, statusFilter, searchTerm]);

  // Invitation Card Component
  interface InvitationCardProps {
    invitation: JobInvitation;
  }

  const InvitationCard: React.FC<InvitationCardProps> = ({ invitation }) => {
    const { perusahaan_profile, post_lowongan } = invitation;
    const config =
      statusConfig[invitation.status as keyof typeof statusConfig] ||
      statusConfig.Menunggu;
    const StatusIcon = config.icon;

    const canRespond = invitation.status === "Menunggu";
    const salaryRange = `${formatCurrency(
      invitation.salary_min
    )} - ${formatCurrency(invitation.salary_max)}`;

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
              {formatDate(invitation.created_at)}
            </span>
          </div>
        </div>

        <div className="flex-1">
          {/* Company Header */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <img
                src={getCompanyLogoUrl(
                  perusahaan_profile.logo,
                  perusahaan_profile.nama_perusahaan
                )}
                alt={`Logo ${perusahaan_profile.nama_perusahaan}`}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const encodedName = encodeURIComponent(
                    perusahaan_profile.nama_perusahaan
                  );
                  target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2&background=3b82f6&color=ffffff&size=64`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {perusahaan_profile.nama_perusahaan}
              </h3>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 truncate mb-2">
                {post_lowongan.job_title}
              </p>
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {post_lowongan.location}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4 mr-1" />
                  {perusahaan_profile.industri}
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4 mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
              <span>Gaji: {salaryRange}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
              <span>Tipe: {post_lowongan.job_type}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
              <span>
                Deadline: {formatDate(post_lowongan.application_deadline)}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi Pekerjaan:
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {post_lowongan.description}
            </p>
          </div>

          {/* Skills */}
          {post_lowongan.skills && post_lowongan.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills yang Dibutuhkan:
              </h4>
              <div className="flex flex-wrap gap-2">
                {post_lowongan.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {post_lowongan.skills.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                    +{post_lowongan.skills.length - 4} lagi
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tracking Process */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tracking Proses:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Undangan Diterima</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(invitation.created_at)}
                  </p>
                </div>
              </div>

              {invitation.status === "Diterima" && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        Anda Menerima Undangan
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(invitation.updated_at)}
                    </p>
                  </div>
                </div>
              )}

              {invitation.status === "Ditolak" && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Anda Menolak Undangan</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(invitation.updated_at)}
                    </p>
                  </div>
                </div>
              )}

              {invitation.status === "Wawancara" && (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Anda Menerima Undangan
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(invitation.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Proses Wawancara</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Perusahaan akan menghubungi Anda
                      </p>
                    </div>
                  </div>
                </>
              )}

              {invitation.status === "Dipekerjakan" && (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Anda Menerima Undangan
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Wawancara Selesai</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Anda Dipekerjakan</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Selamat! Anda berhasil diterima
                      </p>
                    </div>
                  </div>
                </>
              )}

              {invitation.status === "Menunggu" && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Menunggu Respon Anda</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Silakan terima atau tolak undangan
                    </p>
                  </div>
                </div>
              )}

              {invitation.status === "Cancelled" && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Undangan Dibatalkan</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Perusahaan membatalkan undangan
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status-specific notifications */}
          {invitation.status === "Wawancara" && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Undangan Wawancara
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Selamat! Anda telah lolos ke tahap wawancara. Perusahaan
                    akan menghubungi Anda segera.
                  </p>
                </div>
              </div>
            </div>
          )}

          {invitation.status === "Dipekerjakan" && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">
                    Selamat! Anda Diterima!
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-400">
                    Anda telah resmi diterima sebagai {post_lowongan.job_title}{" "}
                    di {perusahaan_profile.nama_perusahaan}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => handleShowCompanyProfile(perusahaan_profile.id)}
              className="flex-1 text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Lihat Perusahaan
            </button>
            <Link
              href={`/jobs/` + perusahaan_profile.id}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Detail Job
            </Link>
          </div>

          {/* Accept/Reject Actions for Pending Invitations */}
          {canRespond && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  updateInvitationStatus(invitation.id, "Diterima")
                }
                disabled={updatingStatus === invitation.id}
                className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                {updatingStatus === invitation.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Terima
                  </>
                )}
              </button>
              <button
                onClick={() => updateInvitationStatus(invitation.id, "Ditolak")}
                disabled={updatingStatus === invitation.id}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                {updatingStatus === invitation.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Tolak
                  </>
                )}
              </button>
            </div>
          )}

          {/* Contact Company Button for Accepted Invitations */}
          {invitation.status === "Diterima" && (
            <button
              onClick={() =>
                window.open(`mailto:${perusahaan_profile.no_telp}`, "_blank")
              }
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Hubungi Perusahaan
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
        <div className="bg-white dark:bg-gray-800 shadow-sm mb-5 rounded-2xl">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Undangan Kerja
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Kelola undangan kerja dari berbagai perusahaan
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Memuat undangan kerja...
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
        <div className="bg-white dark:bg-gray-800 shadow-sm mb-5 rounded-2xl">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Undangan Kerja
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Kelola undangan kerja dari berbagai perusahaan
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchInvitations}
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
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm mb-5 rounded-2xl">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Undangan Kerja
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Kelola undangan kerja dari berbagai perusahaan
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-300">
                <Send className="w-4 h-4" />
                <span>Total: {invitations.length} undangan</span>
              </div>
              {statusCounts.Menunggu > 0 && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                  {statusCounts.Menunggu} menunggu respon
                </div>
              )}
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
                placeholder="Cari perusahaan atau posisi..."
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
                    {statusCounts[status as keyof typeof statusCounts] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Statistik Singkat
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Response Rate</span>
                  <span className="font-medium">
                    {invitations.length > 0
                      ? Math.round(
                          ((statusCounts.Diterima + statusCounts.Ditolak) /
                            invitations.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Success Rate</span>
                  <span className="font-medium text-green-700 dark:text-green-400">
                    {invitations.length > 0
                      ? Math.round(
                          (statusCounts.Dipekerjakan / invitations.length) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredInvitations.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredInvitations.map((invitation) => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {statusFilter === "all"
                  ? "Belum ada undangan kerja"
                  : `Belum ada undangan dengan status ${statusConfig[
                      statusFilter as keyof typeof statusConfig
                    ]?.label.toLowerCase()}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {statusFilter === "all"
                  ? "Undangan kerja dari perusahaan akan muncul di sini"
                  : "Coba ubah filter atau cari dengan kata kunci lain"}
              </p>
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Lihat Semua Undangan
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Company Profile Modal */}
      <CompanyProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        companyId={selectedCompanyId || 0}
      />
    </div>
  );
}
