"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  FileText,
  ExternalLink,
  Heart,
  Award,
  Building2,
  User,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  MessageSquare,
  UserCheck,
  UserX,
  Sparkles,
  X,
  Languages,
  Target,
  TrendingUp,
  Zap,
  Download,
  Image,
  File,
  FileCheck, // Added for reviewed status
  Send,
} from "lucide-react";
import Link from "next/link";
import apiBissaKerja from "@/lib/api-bissa-kerja";

// Type definitions (updated JobApplication interface)
interface Disabilitas {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
}

// interface Lokasi {
//   id: number;
//   kode_pos_ktp: string;
//   alamat_lengkap_ktp: string;
//   province_ktp_id: string;
//   regencie_ktp_id: string;
//   district_ktp_id: string;
//   village_ktp_id: string;
//   kode_pos_domisili: string;
//   alamat_lengkap_domisili: string;
//   province_domisili_id: string;
//   regencie_domisili_id: string;
//   district_domisili_id: string;
//   village_domisili_id: string;
//   user_profile_id: number;
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
// }

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
}

interface District {
  id: string;
  name: string;
}

interface Village {
  id: string;
  name: string;
}

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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Add the related data properties
  province?: Province;
  regency?: Regency;
  district?: District;
  village?: Village;
  province_domisili?: Province;
  regency_domisili?: Regency;
  district_domisili?: District;
  village_domisili?: Village;
}

interface Bahasa {
  id: number;
  name: string;
  tingkat: string;
  resume_id: number;
  created_at: string;
  updated_at: string;
}

interface Keterampilan {
  id: number;
  nama_keterampilan: string[];
  resume_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Pendidikan {
  id: number;
  tingkat: string;
  bidang_studi: string;
  nilai: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  lokasi: string;
  deskripsi: string;
  ijazah: string;
  resume_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Pencapaian {
  id: number;
  name: string;
  penyelenggara: string;
  tanggal_pencapaian: string;
  dokumen: string;
  resume_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Pelatihan {
  id: number;
  name: string;
  penyelenggara: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  deskripsi: string;
  sertifikat_file: string;
  resume_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Sertifikasi {
  id: number;
  program: string;
  lembaga: string;
  nilai: number;
  tanggal_mulai: string;
  tanggal_akhir: string;
  deskripsi: string;
  sertifikat_file: string;
  resume_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface PengalamanKerja {
  id: number;
  name: string;
  nama_perusahaan: string;
  tipe_pekerjaan: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  deskripsi: string;
  status: number;
  sertifikat_file: string;
  resume_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Resume {
  id: number;
  user_profile_id: number;
  ringkasan_pribadi: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bahasa: Bahasa[];
  keterampilan: Keterampilan[];
  pendidikan: Pendidikan[];
  pencapaian: Pencapaian[];
  pelatihan: Pelatihan[];
  sertifikasi: Sertifikasi[];
  pengalaman_kerja: PengalamanKerja[];
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
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_profile: UserProfile;
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
  perusahaan_profile_id: number;
  created_at: string;
  updated_at: string;
}

// Updated interface to include "reviewed" status
interface JobApplication {
  id: number;
  lowongan_id: number;
  user_id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "interview";
  feedback: string | null;
  type: "online" | "offline" | null;
  location: string | null;
  link_meeting: string | null;
  applied_at: string;
  reviewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  lowongan: JobVacancy;
}

interface ApiResponse {
  success: boolean;
  data: JobApplication[];
}

export default function ViewApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<JobVacancy | null>(null);
  useDocumentTitle(
    job?.job_title ? `Pelamar - ${job.job_title} | JatimBissa` : "Daftar Pelamar | JatimBissa"
  );
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
  // Updated stats to include reviewed
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
    interview: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedApplicant, setSelectedApplicant] =
    useState<JobApplication | null>(null);
  const [showApplicantModal, setShowApplicantModal] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showFileViewer, setShowFileViewer] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);

  // Feedback Modal States
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackApplicationId, setFeedbackApplicationId] = useState<
    number | null
  >(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);

  // Interview Modal States
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  const [interviewApplicationId, setInterviewApplicationId] = useState<
    number | null
  >(null);
  const [interviewType, setInterviewType] = useState<"online" | "offline">(
    "online"
  );
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [interviewAddress, setInterviewAddress] = useState<string>("");
  const [interviewLoading, setInterviewLoading] = useState<boolean>(false);

  // Fetch applicants data
  useEffect(() => {
    const fetchApplicants = async (): Promise<void> => {
      if (!jobId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiBissaKerja.get<ApiResponse>(
          `/company/job-vacancies/${jobId}/applicant`
        );

        if (response.data.success && response.data.data.length > 0) {
          const applicationsData = response.data.data;
          setApplications(applicationsData);
          setFilteredApplications(applicationsData);

          setJob(applicationsData[0].lowongan);

          // Updated stats calculation to include reviewed
          const statsCalc = {
            total: applicationsData.length,
            pending: applicationsData.filter((app) => app.status === "pending")
              .length,
            reviewed: applicationsData.filter(
              (app) => app.status === "reviewed"
            ).length,
            accepted: applicationsData.filter(
              (app) => app.status === "accepted"
            ).length,
            rejected: applicationsData.filter(
              (app) => app.status === "rejected"
            ).length,
            interview: applicationsData.filter(
              (app) => app.status === "interview"
            ).length,
          };
          setStats(statsCalc);
        } else {
          setError("Belum ada pelamar untuk lowongan ini");
        }
      } catch (err) {
        console.error("Error fetching applicants:", err);
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          if (axiosError.response?.status === 404) {
            setError("Lowongan tidak ditemukan");
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

    fetchApplicants();
  }, [jobId]);

  // Filter and sort applications
  useEffect(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "name":
          return a.user.name.localeCompare(b.user.name);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, sortBy]);

  const handleUpdateStatusPreview = async (applicationId: number) => {
    await apiBissaKerja.put(
      "company/job-vacancies/" + applicationId + "/status/reviewed"
    );
  };

  // Helper functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Updated getStatusConfig to include reviewed status
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Menunggu",
          color:
            "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
          icon: Clock,
        };
      case "reviewed":
        return {
          label: "Direview",
          color:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
          icon: FileCheck,
        };
      case "accepted":
        return {
          label: "Diterima",
          color:
            "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          label: "Ditolak",
          color:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
          icon: XCircle,
        };
      case "interview":
        return {
          label: "Interview",
          color:
            "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
          icon: MessageSquare,
        };
      default:
        return {
          label: "Unknown",
          color:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600",
          icon: AlertCircle,
        };
    }
  };

  // Open feedback modal
  const handleOpenFeedbackModal = (applicationId: number) => {
    setFeedbackApplicationId(applicationId);
    setFeedbackText("");
    setShowFeedbackModal(true);
  };

  // Close feedback modal
  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackApplicationId(null);
    setFeedbackText("");
  };

  // Interview Modal Handlers
  const handleOpenInterviewModal = (applicationId: number) => {
    setInterviewApplicationId(applicationId);
    setShowInterviewModal(true);
    setInterviewType("online");
    setMeetingLink("");
    setInterviewAddress("");
  };

  const handleCloseInterviewModal = () => {
    setShowInterviewModal(false);
    setInterviewApplicationId(null);
    setInterviewType("online");
    setMeetingLink("");
    setInterviewAddress("");
  };

  const handleSubmitInterview = async () => {
    if (!interviewApplicationId) return;

    // Validation
    if (interviewType === "online" && !meetingLink.trim()) {
      alert("Link meeting harus diisi untuk interview online");
      return;
    }
    if (interviewType === "online" && meetingLink.trim()) {
      // Basic URL validation
      try {
        new URL(meetingLink);
      } catch {
        alert(
          "Format link meeting tidak valid. Pastikan menggunakan format URL yang benar (contoh: https://zoom.us/j/123456789)"
        );
        return;
      }
    }
    if (interviewType === "offline" && !interviewAddress.trim()) {
      alert("Alamat interview harus diisi untuk interview offline");
      return;
    }

    try {
      setInterviewLoading(true);

      // Prepare data according to Laravel controller expectations
      const requestData = {
        status: "interview",
        type: interviewType,
        ...(interviewType === "online"
          ? {
              link_meeting: meetingLink,
              location: null,
            }
          : {
              location: interviewAddress,
              link_meeting: null,
            }),
      };

      // Call API to update status to interview with interview details
      const response = await apiBissaKerja.put(
        `/company/job-vacancies/${interviewApplicationId}/status`,
        requestData
      );

      if (response.data.success) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app.id === interviewApplicationId
              ? {
                  ...app,
                  status: "interview" as const,
                  interview_at: response.data.data.interview_at,
                }
              : app
          )
        );
        setFilteredApplications((prev) =>
          prev.map((app) =>
            app.id === interviewApplicationId
              ? {
                  ...app,
                  status: "interview" as const,
                  interview_at: response.data.data.interview_at,
                }
              : app
          )
        );

        // Update stats
        setStats((prev) => ({
          ...prev,
          interview: prev.interview + 1,
          pending: prev.pending - 1,
        }));

        handleCloseInterviewModal();
      } else {
        throw new Error(
          response.data.message || "Gagal mengirim undangan interview"
        );
      }
    } catch (error: any) {
      console.error("Error sending interview invitation:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal mengirim undangan interview. Silakan coba lagi.";
      alert(errorMessage);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Submit feedback and reject application
  const handleSubmitFeedback = async () => {
    if (!feedbackApplicationId || !feedbackText.trim()) {
      alert("Feedback tidak boleh kosong");
      return;
    }

    try {
      setFeedbackLoading(true);

      const response = await apiBissaKerja.put(
        `company/job-vacancies/${feedbackApplicationId}/status`,
        {
          status: "rejected",
          feedback: feedbackText.trim(),
        }
      );

      if (response.data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === feedbackApplicationId
              ? {
                  ...app,
                  status: "rejected" as any,
                  feedback: feedbackText.trim(),
                }
              : app
          )
        );

        const oldApp = applications.find(
          (app) => app.id === feedbackApplicationId
        );
        if (oldApp) {
          setStats((prev) => ({
            ...prev,
            [oldApp.status]: prev[oldApp.status as keyof typeof prev] - 1,
            rejected: prev.rejected + 1,
          }));
        }

        handleCloseFeedbackModal();

        // Close applicant modal if it's open
        if (
          showApplicantModal &&
          selectedApplicant?.id === feedbackApplicationId
        ) {
          setShowApplicantModal(false);
        }
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Terjadi kesalahan saat menolak lamaran");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleStatusChange = async (
    applicationId: number,
    newStatus: string
  ) => {
    // If status is rejected, open feedback modal instead
    if (newStatus === "rejected") {
      handleOpenFeedbackModal(applicationId);
      return;
    }

    try {
      setActionLoading(`${applicationId}-${newStatus}`);

      const response = await apiBissaKerja.put(
        `company/job-vacancies/${applicationId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId
              ? { ...app, status: newStatus as any }
              : app
          )
        );

        const oldApp = applications.find((app) => app.id === applicationId);
        if (oldApp) {
          setStats((prev) => ({
            ...prev,
            [oldApp.status]: prev[oldApp.status as keyof typeof prev] - 1,
            [newStatus]: prev[newStatus as keyof typeof prev] + 1,
          }));
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ): void => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/avatar-placeholder.png";
  };

  const getWorkTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      freelance: "Freelance",
      part_time: "Part Time",
      full_time: "Full Time",
      contract: "Kontrak",
      internship: "Magang",
    };
    return types[type] || type;
  };

  const getFileType = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const pdfTypes = ["pdf"];
    const docTypes = ["doc", "docx"];
    const otherTypes = ["txt", "rtf"];

    if (imageTypes.includes(extension || "")) return "image";
    if (pdfTypes.includes(extension || "")) return "pdf";
    if (docTypes.includes(extension || "")) return "document";
    return "other";
  };

  const getFileIcon = (filename: string) => {
    const type = getFileType(filename);
    switch (type) {
      case "image":
        return Image;
      case "pdf":
        return FileText;
      case "document":
        return File;
      default:
        return File;
    }
  };

  const handleFileView = (fileUrl: string, fileName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/storage/";
    const fullUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `${baseUrl}${fileUrl}`;

    setSelectedFile({
      url: fullUrl,
      name: fileName,
      type: getFileType(fileName),
    });
    setShowFileViewer(true);
  };

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/storage/";
    const fullUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `${baseUrl}${fileUrl}`;

    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const FileViewerButton = ({
    fileUrl,
    fileName,
    label,
  }: {
    fileUrl: string;
    fileName: string;
    label: string;
  }) => {
    if (!fileUrl) return null;

    const FileIcon = getFileIcon(fileName);

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleFileView(fileUrl, fileName)}
          className="flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
        >
          <FileIcon className="w-4 h-4 mr-2" />
          Lihat {label}
        </button>
        <button
          onClick={() => handleFileDownload(fileUrl, fileName)}
          className="flex items-center px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <PageBreadcrumb pageTitle="Lihat Pelamar" />
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <PageBreadcrumb pageTitle="Lihat Pelamar" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500 dark:text-red-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error.includes("Belum ada pelamar")
                ? "Belum Ada Pelamar"
                : "Terjadi Kesalahan"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <PageBreadcrumb
        pageTitle={`Pelamar - ${job?.job_title || "Loading..."}`}
      />

      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Users className="w-7 h-7 mr-3 text-blue-500 dark:text-blue-400" />
                Daftar Pelamar
              </h1>
              {job && (
                <p className="text-gray-600 dark:text-gray-400">
                  Lowongan:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {job.job_title}
                  </span>{" "}
                  • Lokasi:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {job.location}
                  </span>
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl transition-colors">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Updated Stats Cards - now includes reviewed */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Total Pelamar",
              value: stats.total,
              color: "blue",
              icon: Users,
            },
            {
              label: "Menunggu",
              value: stats.pending,
              color: "amber",
              icon: Clock,
            },
            {
              label: "Direview",
              value: stats.reviewed,
              color: "blue",
              icon: FileCheck,
            },
            {
              label: "Interview",
              value: stats.interview,
              color: "purple",
              icon: MessageSquare,
            },
            {
              label: "Diterima",
              value: stats.accepted,
              color: "emerald",
              icon: CheckCircle,
            },
            {
              label: "Ditolak",
              value: stats.rejected,
              color: "red",
              icon: XCircle,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
              amber:
                "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
              purple:
                "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
              emerald:
                "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
              red: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
            };

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      colorClasses[stat.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-2xl font-bold ${
                      colorClasses[
                        stat.color as keyof typeof colorClasses
                      ].split(" ")[0]
                    }`}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Cari nama atau email pelamar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Status Filter - updated to include reviewed */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter status lamaran"
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white min-w-[140px]"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="reviewed">Direview</option>
                <option value="interview">Interview</option>
                <option value="accepted">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Urutkan berdasarkan"
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white min-w-[120px]"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name">Nama A-Z</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Belum Ada Pelamar
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Tidak ada pelamar yang sesuai dengan filter Anda"
                  : "Belum ada yang melamar untuk posisi ini"}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={application.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Applicant Info */}
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            application.user.avatar ||
                            "/images/avatar-placeholder.png"
                          }
                          alt={application.user.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                          onError={handleImageError}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-4">
                            {application.user.name}
                          </h3>
                          <div className="flex gap-2">
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color} flex items-center flex-shrink-0`}
                            >
                              <StatusIcon className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center min-w-0">
                            <Mail className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                            <span className="truncate">
                              {application.user.email}
                            </span>
                          </div>
                          {application.user.user_profile?.no_telp && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-green-500 dark:text-green-400 flex-shrink-0" />
                              <span className="truncate">
                                {application.user.user_profile.no_telp}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                            <span className="truncate">
                              Melamar: {formatDate(application.created_at)}
                            </span>
                          </div>
                          {application.user.user_profile?.disabilitas && (
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-2 text-red-500 dark:text-red-400 flex-shrink-0" />
                              <span className="truncate">
                                {
                                  application.user.user_profile.disabilitas
                                    .kategori_disabilitas
                                }{" "}
                                -
                                {
                                  application.user.user_profile.disabilitas
                                    .tingkat_disabilitas
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Show feedback if application is rejected */}
                        {application.status === "rejected" &&
                          application.feedback && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                              <p className="text-sm text-red-800 dark:text-red-300">
                                <span className="font-medium">Feedback: </span>
                                {application.feedback}
                              </p>
                            </div>
                          )}

                        {application.status === "interview" && (
                          <div className="mt-4 p-3 bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium capitalize">
                                {application.type}:{" "}
                              </span>
                              {application.type === "online"
                                ? application.link_meeting
                                : application.location}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions - Updated to include reviewed status actions */}
                    <div className="flex flex-wrap sm:flex-col gap-2 lg:min-w-0">
                      <button
                        onClick={() => {
                          setSelectedApplicant(application);
                          setShowApplicantModal(true);
                          handleUpdateStatusPreview(application.id);
                        }}
                        className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </button>

                      {/* Actions for pending status */}
                      {application.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(application.id, "reviewed")
                            }
                            disabled={
                              actionLoading === `${application.id}-reviewed`
                            }
                            className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 flex-1 sm:flex-none"
                          >
                            {actionLoading === `${application.id}-reviewed` ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <FileCheck className="w-4 h-4 mr-2" />
                            )}
                            Review
                          </button>
                          <button
                            onClick={() =>
                              handleOpenInterviewModal(application.id)
                            }
                            className="flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Interview
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(application.id, "accepted")
                            }
                            disabled={
                              actionLoading === `${application.id}-accepted`
                            }
                            className="flex items-center justify-center px-3 py-2 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 flex-1 sm:flex-none"
                          >
                            {actionLoading === `${application.id}-accepted` ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4 mr-2" />
                            )}
                            Terima
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(application.id, "rejected")
                            }
                            className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Tolak
                          </button>
                        </>
                      )}

                      {/* Actions for reviewed status */}
                      {application.status === "reviewed" && (
                        <>
                          <button
                            onClick={() =>
                              handleOpenInterviewModal(application.id)
                            }
                            className="flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Interview
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(application.id, "accepted")
                            }
                            disabled={
                              actionLoading === `${application.id}-accepted`
                            }
                            className="flex items-center justify-center px-3 py-2 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 flex-1 sm:flex-none"
                          >
                            {actionLoading === `${application.id}-accepted` ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4 mr-2" />
                            )}
                            Terima
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(application.id, "rejected")
                            }
                            className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Tolak
                          </button>
                        </>
                      )}

                      {/* Actions for interview status */}
                      {application.status === "interview" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(application.id, "accepted")
                            }
                            disabled={
                              actionLoading === `${application.id}-accepted`
                            }
                            className="flex items-center justify-center px-3 py-2 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 flex-1 sm:flex-none"
                          >
                            {actionLoading === `${application.id}-accepted` ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4 mr-2" />
                            )}
                            Terima
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(application.id, "rejected")
                            }
                            className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Tolak Lamaran
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Berikan feedback untuk pelamar
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseFeedbackModal}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alasan Penolakan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Jelaskan alasan mengapa lamaran ini ditolak. Feedback ini akan membantu pelamar untuk meningkatkan kualitas lamaran di masa depan."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    rows={5}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Feedback yang konstruktif akan membantu pelamar berkembang
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {feedbackText.length}/500
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                        Perhatian
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        Tindakan ini tidak dapat dibatalkan. Pelamar akan
                        menerima feedback yang Anda berikan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseFeedbackModal}
                  disabled={feedbackLoading}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={feedbackLoading || !feedbackText.trim()}
                  className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  {feedbackLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Tolak Lamaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Undang Interview
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pilih tipe interview dan isi detail yang diperlukan
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseInterviewModal}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Interview Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tipe Interview <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setInterviewType("online")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        interviewType === "online"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Online</span>
                        <span className="text-xs text-center">
                          Zoom, Meet, dll
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => setInterviewType("offline")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        interviewType === "offline"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Offline</span>
                        <span className="text-xs text-center">
                          Tatap muka langsung
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Online Meeting Link */}
                {interviewType === "online" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Link Meeting <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      name="link_meeting"
                      placeholder="https://zoom.us/j/123456789 atau https://meet.google.com/abc-defg-hij"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Masukkan link Zoom, Google Meet, atau platform meeting
                      lainnya
                    </p>
                  </div>
                )}

                {/* Offline Address */}
                {interviewType === "offline" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alamat Interview <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={interviewAddress}
                      onChange={(e) => setInterviewAddress(e.target.value)}
                      placeholder="Masukkan alamat lengkap tempat interview akan dilaksanakan"
                      name="location"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Sertakan alamat lengkap, landmark, dan instruksi akses
                      jika diperlukan
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseInterviewModal}
                  disabled={interviewLoading}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitInterview}
                  disabled={
                    interviewLoading ||
                    (interviewType === "online" && !meetingLink.trim()) ||
                    (interviewType === "offline" && !interviewAddress.trim())
                  }
                  className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  {interviewLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Kirim Undangan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicant Detail Modal - COMPLETE VERSION */}
      {showApplicantModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-gradient-to-r dark:from-gray-900/50 dark:to-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={
                        selectedApplicant.user.avatar ||
                        "/images/avatar-placeholder.png"
                      }
                      alt={selectedApplicant.user.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      onError={handleImageError}
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedApplicant.user.name}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {selectedApplicant.user.email}
                    </p>
                    <div className="flex items-center mt-2">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusConfig(selectedApplicant.status).color
                        }`}
                      >
                        {React.createElement(
                          getStatusConfig(selectedApplicant.status).icon,
                          { className: "w-4 h-4 mr-2" }
                        )}
                        {getStatusConfig(selectedApplicant.status).label}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplicantModal(false)}
                  className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Personal & Contact Info */}
                <div className="xl:col-span-1 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <User className="w-6 h-6 mr-3 text-blue-500 dark:text-blue-400" />
                      Informasi Pribadi
                    </h4>
                    <div className="space-y-4">
                      {selectedApplicant.user.user_profile?.nik && (
                        <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-700/50">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            NIK:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white font-mono">
                            {selectedApplicant.user.user_profile.nik}
                          </span>
                        </div>
                      )}
                      {selectedApplicant.user.user_profile?.tanggal_lahir && (
                        <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-700/50">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Tanggal Lahir:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(
                              selectedApplicant.user.user_profile.tanggal_lahir
                            )}
                          </span>
                        </div>
                      )}
                      {selectedApplicant.user.user_profile?.jenis_kelamin && (
                        <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-700/50">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Jenis Kelamin:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {selectedApplicant.user.user_profile
                              .jenis_kelamin === "L"
                              ? "Laki-laki"
                              : "Perempuan"}
                          </span>
                        </div>
                      )}
                      {selectedApplicant.user.user_profile?.no_telp && (
                        <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-700/50">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            No. Telepon:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {selectedApplicant.user.user_profile.no_telp}
                          </span>
                        </div>
                      )}
                      {selectedApplicant.user.user_profile?.status_kawin !==
                        undefined && (
                        <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-700/50">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Status Kawin:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {selectedApplicant.user.user_profile
                              .status_kawin === 1
                              ? "Menikah"
                              : "Belum Menikah"}
                          </span>
                        </div>
                      )}
                      {selectedApplicant.user.user_profile?.latar_belakang && (
                        <div className="py-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                            Latar Belakang:
                          </span>
                          <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg p-3">
                            {selectedApplicant.user.user_profile.latar_belakang}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Information */}
                  {selectedApplicant.user.user_profile?.lokasi && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <MapPin className="w-6 h-6 mr-3 text-green-500 dark:text-green-400" />
                        Informasi Alamat
                      </h4>
                      <div className="space-y-4">
                        {/* KTP Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                            Alamat KTP
                          </h5>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-900 dark:text-white">
                              {
                                selectedApplicant.user.user_profile.lokasi
                                  .alamat_lengkap_ktp
                              }
                            </p>
                            {selectedApplicant.user.user_profile.lokasi
                              .village && (
                              <p className="text-gray-600 dark:text-gray-400">
                                {
                                  selectedApplicant.user.user_profile.lokasi
                                    .village.name
                                }
                                {selectedApplicant.user.user_profile.lokasi
                                  .district &&
                                  `, ${selectedApplicant.user.user_profile.lokasi.district.name}`}
                                {selectedApplicant.user.user_profile.lokasi
                                  .regency &&
                                  `, ${selectedApplicant.user.user_profile.lokasi.regency.name}`}
                                {selectedApplicant.user.user_profile.lokasi
                                  .province &&
                                  `, ${selectedApplicant.user.user_profile.lokasi.province.name}`}
                              </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                              Kode Pos:{" "}
                              {
                                selectedApplicant.user.user_profile.lokasi
                                  .kode_pos_ktp
                              }
                            </p>
                          </div>
                        </div>

                        {/* Domicile Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                            Alamat Domisili
                          </h5>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-900 dark:text-white">
                              {
                                selectedApplicant.user.user_profile.lokasi
                                  .alamat_lengkap_domisili
                              }
                            </p>
                            {selectedApplicant.user.user_profile.lokasi
                              .village_domisili && (
                              <p className="text-gray-600 dark:text-gray-400">
                                {
                                  selectedApplicant.user.user_profile.lokasi
                                    .village_domisili.name
                                }
                                {selectedApplicant.user.user_profile.lokasi
                                  .district_domisili &&
                                  `, ${selectedApplicant.user.user_profile.lokasi.district_domisili.name}`}
                                {selectedApplicant.user.user_profile.lokasi
                                  .regency_domisili &&
                                  `, ${selectedApplicant.user.user_profile.lokasi.regency_domisili.name}`}
                                {selectedApplicant.user.user_profile.lokasi
                                  .province_domisili &&
                                  `, ${selectedApplicant.user.user_profile.lokasi.province_domisili.name}`}
                              </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                              Kode Pos:{" "}
                              {
                                selectedApplicant.user.user_profile.lokasi
                                  .kode_pos_domisili
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Disability Information */}
                  {selectedApplicant.user.user_profile?.disabilitas && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Heart className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" />
                        Informasi Disabilitas
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Kategori:
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {
                                selectedApplicant.user.user_profile.disabilitas
                                  .kategori_disabilitas
                              }
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Tingkat:
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {
                                selectedApplicant.user.user_profile.disabilitas
                                  .tingkat_disabilitas
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Application Status */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-amber-500 dark:text-amber-400" />
                      Status Lamaran
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-amber-200 dark:border-amber-700/50">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Tanggal Melamar:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(selectedApplicant.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-amber-200 dark:border-amber-700/50">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Posisi:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {selectedApplicant.lowongan.job_title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Lokasi Kerja:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {selectedApplicant.lowongan.location}
                        </span>
                      </div>
                    </div>

                    {/* Show feedback if application is rejected */}
                    {selectedApplicant.status === "rejected" &&
                      selectedApplicant.feedback && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                          <h5 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Feedback Penolakan
                          </h5>
                          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                            {selectedApplicant.feedback}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* RIGHT COLUMN - Resume & Professional Info */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Personal Summary */}
                  {selectedApplicant.user.user_profile?.resume
                    ?.ringkasan_pribadi && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" />
                        Ringkasan Pribadi
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {
                            selectedApplicant.user.user_profile.resume
                              .ringkasan_pribadi
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedApplicant.user.user_profile?.resume?.keterampilan &&
                    selectedApplicant.user.user_profile.resume.keterampilan
                      .length > 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Zap className="w-6 h-6 mr-3 text-blue-500 dark:text-blue-400" />
                          Keterampilan
                        </h4>
                        <div className="space-y-4">
                          {selectedApplicant.user.user_profile.resume.keterampilan.map(
                            (skill, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                              >
                                <div className="flex flex-wrap gap-2">
                                  {skill.nama_keterampilan.map(
                                    (skillName, skillIndex) => (
                                      <span
                                        key={skillIndex}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                                      >
                                        {skillName}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Languages */}
                  {selectedApplicant.user.user_profile?.resume?.bahasa &&
                    selectedApplicant.user.user_profile.resume.bahasa.length >
                      0 && (
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Languages className="w-6 h-6 mr-3 text-green-500 dark:text-green-400" />
                          Kemampuan Bahasa
                        </h4>
                        <div className="grid gap-4">
                          {selectedApplicant.user.user_profile.resume.bahasa.map(
                            (language, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {language.name}
                                  </span>
                                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                                    {language.tingkat}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Education */}
                  {selectedApplicant.user.user_profile?.resume?.pendidikan &&
                    selectedApplicant.user.user_profile.resume.pendidikan
                      .length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <GraduationCap className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" />
                          Riwayat Pendidikan
                        </h4>
                        <div className="space-y-4">
                          {selectedApplicant.user.user_profile.resume.pendidikan.map(
                            (education, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h5 className="font-semibold text-lg text-gray-900 dark:text-white">
                                      {education.tingkat}
                                    </h5>
                                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                                      {education.bidang_studi}
                                    </p>
                                  </div>
                                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                                    Nilai: {education.nilai}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  <p>
                                    <span className="font-medium">Lokasi:</span>{" "}
                                    {education.lokasi}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Periode:
                                    </span>{" "}
                                    {formatDate(education.tanggal_mulai)} -{" "}
                                    {formatDate(education.tanggal_akhir)}
                                  </p>
                                  {education.deskripsi && (
                                    <p>
                                      <span className="font-medium">
                                        Deskripsi:
                                      </span>{" "}
                                      {education.deskripsi}
                                    </p>
                                  )}
                                </div>
                                {education.ijazah && (
                                  <div className="mt-4">
                                    <FileViewerButton
                                      fileUrl={education.ijazah}
                                      fileName={`Ijazah_${education.tingkat}`}
                                      label="Ijazah"
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Work Experience */}
                  {selectedApplicant.user.user_profile?.resume
                    ?.pengalaman_kerja &&
                    selectedApplicant.user.user_profile.resume.pengalaman_kerja
                      .length > 0 && (
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Briefcase className="w-6 h-6 mr-3 text-orange-500 dark:text-orange-400" />
                          Pengalaman Kerja
                        </h4>
                        <div className="space-y-4">
                          {selectedApplicant.user.user_profile.resume.pengalaman_kerja.map(
                            (experience, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h5 className="font-semibold text-lg text-gray-900 dark:text-white">
                                      {experience.name}
                                    </h5>
                                    <p className="text-orange-600 dark:text-orange-400 font-medium">
                                      {experience.nama_perusahaan}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium">
                                      {getWorkTypeLabel(
                                        experience.tipe_pekerjaan
                                      )}
                                    </span>
                                    {experience.status === 1 && (
                                      <div className="mt-1">
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                                          Aktif
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  <p>
                                    <span className="font-medium">Lokasi:</span>{" "}
                                    {experience.lokasi}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Periode:
                                    </span>{" "}
                                    {formatDate(experience.tanggal_mulai)} -{" "}
                                    {formatDate(experience.tanggal_akhir)}
                                  </p>
                                  {experience.deskripsi && (
                                    <p>
                                      <span className="font-medium">
                                        Deskripsi:
                                      </span>{" "}
                                      {experience.deskripsi}
                                    </p>
                                  )}
                                </div>
                                {experience.sertifikat_file && (
                                  <div className="mt-4">
                                    <FileViewerButton
                                      fileUrl={experience.sertifikat_file}
                                      fileName={`Sertifikat_${experience.name}`}
                                      label="Sertifikat Kerja"
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Training */}
                  {selectedApplicant.user.user_profile?.resume?.pelatihan &&
                    selectedApplicant.user.user_profile.resume.pelatihan
                      .length > 0 && (
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-800">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Target className="w-6 h-6 mr-3 text-teal-500 dark:text-teal-400" />
                          Riwayat Pelatihan
                        </h4>
                        <div className="space-y-4">
                          {selectedApplicant.user.user_profile.resume.pelatihan.map(
                            (training, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                              >
                                <div className="mb-3">
                                  <h5 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {training.name}
                                  </h5>
                                  <p className="text-teal-600 dark:text-teal-400 font-medium">
                                    {training.penyelenggara}
                                  </p>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  <p>
                                    <span className="font-medium">
                                      Periode:
                                    </span>{" "}
                                    {formatDate(training.tanggal_mulai)} -{" "}
                                    {formatDate(training.tanggal_akhir)}
                                  </p>
                                  {training.deskripsi && (
                                    <p>
                                      <span className="font-medium">
                                        Deskripsi:
                                      </span>{" "}
                                      {training.deskripsi}
                                    </p>
                                  )}
                                </div>
                                {training.sertifikat_file && (
                                  <div className="mt-4">
                                    <FileViewerButton
                                      fileUrl={training.sertifikat_file}
                                      fileName={`Sertifikat_${training.name}`}
                                      label="Sertifikat Pelatihan"
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Certifications */}
                  {selectedApplicant.user.user_profile?.resume?.sertifikasi &&
                    selectedApplicant.user.user_profile.resume.sertifikasi
                      .length > 0 && (
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Award className="w-6 h-6 mr-3 text-yellow-500 dark:text-yellow-400" />
                          Sertifikasi
                        </h4>
                        <div className="space-y-4">
                          {selectedApplicant.user.user_profile.resume.sertifikasi.map(
                            (certification, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h5 className="font-semibold text-lg text-gray-900 dark:text-white">
                                      {certification.program}
                                    </h5>
                                    <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                                      {certification.lembaga}
                                    </p>
                                  </div>
                                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                                    Nilai: {certification.nilai}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  <p>
                                    <span className="font-medium">
                                      Periode:
                                    </span>{" "}
                                    {formatDate(certification.tanggal_mulai)} -{" "}
                                    {formatDate(certification.tanggal_akhir)}
                                  </p>
                                  {certification.deskripsi && (
                                    <p>
                                      <span className="font-medium">
                                        Deskripsi:
                                      </span>{" "}
                                      {certification.deskripsi}
                                    </p>
                                  )}
                                </div>
                                {certification.sertifikat_file && (
                                  <div className="mt-4">
                                    <FileViewerButton
                                      fileUrl={certification.sertifikat_file}
                                      fileName={`Sertifikat_${certification.program}`}
                                      label="Sertifikat"
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Achievements */}
                  {selectedApplicant.user.user_profile?.resume?.pencapaian &&
                    selectedApplicant.user.user_profile.resume.pencapaian
                      .length > 0 && (
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-rose-200 dark:border-rose-800">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Star className="w-6 h-6 mr-3 text-rose-500 dark:text-rose-400" />
                          Pencapaian
                        </h4>
                        <div className="space-y-4">
                          {selectedApplicant.user.user_profile.resume.pencapaian.map(
                            (achievement, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                              >
                                <div className="mb-3">
                                  <h5 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {achievement.name}
                                  </h5>
                                  <p className="text-rose-600 dark:text-rose-400 font-medium">
                                    {achievement.penyelenggara}
                                  </p>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  <p>
                                    <span className="font-medium">
                                      Tanggal Pencapaian:
                                    </span>{" "}
                                    {formatDate(achievement.tanggal_pencapaian)}
                                  </p>
                                </div>
                                {achievement.dokumen && (
                                  <div className="mt-4">
                                    <FileViewerButton
                                      fileUrl={achievement.dokumen}
                                      fileName={`Dokumen_${achievement.name}`}
                                      label="Dokumen Pencapaian"
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {/* Actions for pending status */}
                {selectedApplicant.status === "pending" && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3 text-blue-500 dark:text-blue-400" />
                      Tindakan Cepat
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          handleStatusChange(selectedApplicant.id, "reviewed");
                          setShowApplicantModal(false);
                        }}
                        disabled={
                          actionLoading === `${selectedApplicant.id}-reviewed`
                        }
                        className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50 shadow-lg hover:shadow-xl"
                      >
                        {actionLoading ===
                        `${selectedApplicant.id}-reviewed` ? (
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <FileCheck className="w-5 h-5 mr-2" />
                        )}
                        Tandai Direview
                      </button>
                      <button
                        onClick={() => {
                          setShowApplicantModal(false);
                          handleOpenInterviewModal(selectedApplicant.id);
                        }}
                        className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Undang Interview
                      </button>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedApplicant.id, "accepted");
                          setShowApplicantModal(false);
                        }}
                        disabled={
                          actionLoading === `${selectedApplicant.id}-accepted`
                        }
                        className="flex items-center px-6 py-3 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl transition-colors font-medium disabled:opacity-50 shadow-lg hover:shadow-xl"
                      >
                        {actionLoading ===
                        `${selectedApplicant.id}-accepted` ? (
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <UserCheck className="w-5 h-5 mr-2" />
                        )}
                        Terima Langsung
                      </button>
                      <button
                        onClick={() => {
                          setShowApplicantModal(false);
                          handleOpenFeedbackModal(selectedApplicant.id);
                        }}
                        className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
                      >
                        <UserX className="w-5 h-5 mr-2" />
                        Tolak Lamaran
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions for reviewed status */}
                {selectedApplicant.status === "reviewed" && (
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
                    <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileCheck className="w-6 h-6 mr-3 text-indigo-500 dark:text-indigo-400" />
                      Hasil Review
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setShowApplicantModal(false);
                          handleOpenInterviewModal(selectedApplicant.id);
                        }}
                        className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Undang Interview
                      </button>
                      <button
                        onClick={() => {
                          handleStatusChange(selectedApplicant.id, "accepted");
                          setShowApplicantModal(false);
                        }}
                        disabled={
                          actionLoading === `${selectedApplicant.id}-accepted`
                        }
                        className="flex items-center px-6 py-3 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl transition-colors font-medium disabled:opacity-50 shadow-lg hover:shadow-xl"
                      >
                        {actionLoading ===
                        `${selectedApplicant.id}-accepted` ? (
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <UserCheck className="w-5 h-5 mr-2" />
                        )}
                        Terima Kandidat
                      </button>
                      <button
                        onClick={() => {
                          setShowApplicantModal(false);
                          handleOpenFeedbackModal(selectedApplicant.id);
                        }}
                        className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
                      >
                        <UserX className="w-5 h-5 mr-2" />
                        Tolak Kandidat
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions for interview status */}
                {selectedApplicant.status === "interview" && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                    <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <MessageSquare className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" />
                      Hasil Interview
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          handleStatusChange(selectedApplicant.id, "accepted");
                          setShowApplicantModal(false);
                        }}
                        disabled={
                          actionLoading === `${selectedApplicant.id}-accepted`
                        }
                        className="flex items-center px-6 py-3 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl transition-colors font-medium disabled:opacity-50 shadow-lg hover:shadow-xl"
                      >
                        {actionLoading ===
                        `${selectedApplicant.id}-accepted` ? (
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <UserCheck className="w-5 h-5 mr-2" />
                        )}
                        Terima Kandidat
                      </button>
                      <button
                        onClick={() => {
                          setShowApplicantModal(false);
                          handleOpenFeedbackModal(selectedApplicant.id);
                        }}
                        className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
                      >
                        <UserX className="w-5 h-5 mr-2" />
                        Tolak Kandidat
                      </button>
                    </div>
                  </div>
                )}

                {/* Show status for completed applications */}
                {(selectedApplicant.status === "accepted" ||
                  selectedApplicant.status === "rejected") && (
                  <div
                    className={`rounded-2xl p-6 border ${
                      selectedApplicant.status === "accepted"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                        : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <h5
                      className={`text-xl font-bold mb-2 flex items-center ${
                        selectedApplicant.status === "accepted"
                          ? "text-green-800 dark:text-green-300"
                          : "text-red-800 dark:text-red-300"
                      }`}
                    >
                      {selectedApplicant.status === "accepted" ? (
                        <>
                          <CheckCircle className="w-6 h-6 mr-3" />
                          Kandidat Diterima
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 mr-3" />
                          Kandidat Ditolak
                        </>
                      )}
                    </h5>
                    <p
                      className={`text-sm ${
                        selectedApplicant.status === "accepted"
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400"
                      }`}
                    >
                      {selectedApplicant.status === "accepted"
                        ? "Lamaran telah diterima dan proses rekrutmen selesai."
                        : "Lamaran telah ditolak dengan feedback yang telah diberikan."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal - FIXED VERSION */}
      {showFileViewer && selectedFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-999999 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* File Viewer Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {React.createElement(getFileIcon(selectedFile.name), {
                    className: "w-6 h-6 text-blue-500 dark:text-blue-400",
                  })}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFile.type.toUpperCase()} File
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleFileDownload(selectedFile.url, selectedFile.name)
                    }
                    className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => setShowFileViewer(false)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* File Viewer Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {selectedFile.type === "image" ? (
                /* IMAGE VIEWER */
                <div className="flex justify-center items-center min-h-[60vh]">
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        // Remove any existing error message
                        const errorDiv =
                          img.parentNode?.querySelector(".error-message");
                        if (errorDiv) {
                          errorDiv.remove();
                        }
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";

                        // Check if error message already exists
                        const existingError =
                          target.parentNode?.querySelector(".error-message");
                        if (!existingError) {
                          const errorDiv = document.createElement("div");
                          errorDiv.className =
                            "error-message flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600";
                          errorDiv.innerHTML = `
                            <svg class="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p class="text-lg font-medium mb-2">Tidak dapat memuat gambar</p>
                            <p class="text-sm text-center mb-4">File mungkin rusak, tidak dapat diakses, atau sedang dimuat</p>
                            <button onclick="window.location.reload()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                              Coba Lagi
                            </button>
                          `;
                          target.parentNode?.appendChild(errorDiv);
                        }
                      }}
                    />

                    {/* Image Loading Indicator */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
                      style={{ display: "none" }}
                      id="image-loading"
                    >
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Memuat gambar...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedFile.type === "pdf" ? (
                /* PDF VIEWER */
                <div className="w-full">
                  <div className="relative w-full h-[75vh] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* PDF Loading Indicator */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10"
                      id="pdf-loading"
                    >
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Memuat PDF...
                        </p>
                      </div>
                    </div>

                    <iframe
                      src={`${selectedFile.url}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                      className="w-full h-full"
                      title={selectedFile.name}
                      frameBorder="0"
                      onLoad={(e) => {
                        // Hide loading indicator when PDF loads
                        const loadingDiv =
                          document.getElementById("pdf-loading");
                        if (loadingDiv) {
                          loadingDiv.style.display = "none";
                        }

                        // Remove any existing error message
                        const errorDiv =
                          e.currentTarget.parentNode?.querySelector(
                            ".pdf-error-message"
                          );
                        if (errorDiv) {
                          errorDiv.remove();
                        }
                      }}
                      onError={(e) => {
                        // Hide loading indicator
                        const loadingDiv =
                          document.getElementById("pdf-loading");
                        if (loadingDiv) {
                          loadingDiv.style.display = "none";
                        }

                        const iframe = e.target as HTMLIFrameElement;
                        iframe.style.display = "none";

                        // Check if error message already exists
                        const existingError =
                          iframe.parentNode?.querySelector(
                            ".pdf-error-message"
                          );
                        if (!existingError) {
                          const errorDiv = document.createElement("div");
                          errorDiv.className =
                            "pdf-error-message absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400";
                          errorDiv.innerHTML = `
                            <svg class="w-20 h-20 mb-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 class="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Tidak dapat menampilkan PDF</h3>
                            <p class="text-center mb-6 max-w-md">Browser Anda mungkin tidak mendukung tampilan PDF inline, atau file sedang dimuat.</p>
                            <div class="flex flex-col sm:flex-row gap-3">
                              <button onclick="window.open('${selectedFile.url}', '_blank')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Buka di Tab Baru
                              </button>
                              <button onclick="handleFileDownload('${selectedFile.url}', '${selectedFile.name}')" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                              </button>
                            </div>
                          `;
                          iframe.parentNode?.appendChild(errorDiv);
                        }
                      }}
                    />
                  </div>

                  {/* PDF Controls */}
                  <div className="mt-4 flex justify-center space-x-3">
                    <button
                      onClick={() => window.open(selectedFile.url, "_blank")}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Buka di Tab Baru
                    </button>
                    <button
                      onClick={() =>
                        handleFileDownload(selectedFile.url, selectedFile.name)
                      }
                      className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                  </div>
                </div>
              ) : selectedFile.type === "document" ? (
                /* DOCUMENT VIEWER (DOC/DOCX) */
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <FileText className="w-20 h-20 mb-6 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Dokumen Word
                  </h3>
                  <p className="text-center mb-6 max-w-md">
                    Preview tidak tersedia untuk file Word. Silakan download
                    untuk melihat isi dokumen.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => window.open(selectedFile.url, "_blank")}
                      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Coba Buka
                    </button>
                    <button
                      onClick={() =>
                        handleFileDownload(selectedFile.url, selectedFile.name)
                      }
                      className="flex items-center px-6 py-3 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Dokumen
                    </button>
                  </div>
                </div>
              ) : (
                /* OTHER FILE TYPES */
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <File className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        File {selectedFile.type.toUpperCase()}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Preview tidak tersedia untuk jenis file ini. Silakan
                        download file untuk melihat isinya.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            window.open(selectedFile.url, "_blank")
                          }
                          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka di Tab Baru
                        </button>
                        <button
                          onClick={() =>
                            handleFileDownload(
                              selectedFile.url,
                              selectedFile.name
                            )
                          }
                          className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download File
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
