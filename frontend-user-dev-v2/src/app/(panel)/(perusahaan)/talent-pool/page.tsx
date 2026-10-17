"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, MapPin, User, Send, Eye, X } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import TalentProfileModal from "@/app/(panel)/(perusahaan)/talent-pool/TalentProfileModal";
import useDocumentTitle from "@/hooks/useDocumentTitle";

// TypeScript interfaces for better type safety
interface Disabilitas {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
}

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
  province_domisili: Province;
  regency_domisili: Regency;
  district_domisili: District;
  village_domisili: Village;
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

interface ApiUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_profile: UserProfile;
}

// Interface untuk data job dari API
interface JobData {
  id: number;
  job_title: string;
  deskripsi?: string;
  gaji_min?: number;
  gaji_max?: number;
  lokasi?: string;
  tipe_pekerjaan?: string;
  created_at: string;
  updated_at: string;
  // Tambahkan field lain sesuai dengan response API
}

interface JobApiResponse {
  status: boolean;
  message?: string;
  data?: JobData[];
  jobs?: JobData[]; // Alternatif nama field
}

interface ApiResponse {
  status: boolean;
  user: ApiUser[];
}

interface TransformedTalent {
  id: number;
  name: string;
  avatar: string;
  location: string;
  disabilityType: string;
  disabilityLevel: string;
  skills: string[];
  email: string;
  nik?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  noTelp?: string;
  ringkasanPribadi?: string;
  userProfileId?: number; // Added for API call
}

const TalentPool = () => {
  useDocumentTitle("Talent Pool | JatimBissa");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisability, setSelectedDisability] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [talents, setTalents] = useState<TransformedTalent[]>([]);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedTalent, setSelectedTalent] =
    useState<TransformedTalent | null>(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null); // Added for job ID
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for loading state

  // Profile modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTalentProfile, setSelectedTalentProfile] =
    useState<TransformedTalent | null>(null);

  // Fungsi untuk mendapatkan lokasi dari data API
  const getLocationString = (userProfile: UserProfile | null): string => {
    if (!userProfile?.lokasi) return "Lokasi tidak tersedia";

    const { regency_domisili, province_domisili } = userProfile.lokasi;
    return `${regency_domisili?.name || "Unknown"}, ${
      province_domisili?.name || "Unknown"
    }`;
  };

  // Fungsi untuk mendapatkan skills dari data API
  const getSkillsFromResume = (userProfile: UserProfile | null): string[] => {
    if (
      !userProfile?.resume?.keterampilan ||
      userProfile.resume.keterampilan.length === 0
    ) {
      return ["Belum ada keterampilan"];
    }

    // Gabungkan semua keterampilan dari array keterampilan
    const allSkills: string[] = [];
    userProfile.resume.keterampilan.forEach((keterampilan) => {
      if (Array.isArray(keterampilan.nama_keterampilan)) {
        allSkills.push(...keterampilan.nama_keterampilan);
      }
    });

    return allSkills.length > 0 ? allSkills : ["Belum ada keterampilan"];
  };

  // Transform API data untuk format yang sesuai dengan komponen
  const transformApiDataToTalents = (
    apiData: ApiUser[]
  ): TransformedTalent[] => {
    return apiData.map((user) => {
      // Handle avatar URL with better fallback
      let avatarUrl = "";
      if (user.avatar) {
        // If avatar path starts with http, use as is, otherwise prepend base URL
        avatarUrl = user.avatar.startsWith("http")
          ? user.avatar
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.avatar}`;
      } else {
        // Fallback to UI Avatars with proper encoding
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.name
        )}&length=2&background=6366f1&color=ffffff&size=64`;
      }

      return {
        id: user.id,
        name: user.name,
        avatar: avatarUrl,
        location: getLocationString(user.user_profile),
        disabilityType:
          user.user_profile?.disabilitas?.kategori_disabilitas || "Lainnya",
        disabilityLevel:
          user.user_profile?.disabilitas?.tingkat_disabilitas ||
          "Tidak diketahui",
        skills: getSkillsFromResume(user.user_profile),
        email: user.email,
        // Data tambahan dari API
        nik: user.user_profile?.nik,
        tanggalLahir: user.user_profile?.tanggal_lahir,
        jenisKelamin: user.user_profile?.jenis_kelamin,
        noTelp: user.user_profile?.no_telp,
        ringkasanPribadi: user.user_profile?.resume?.ringkasan_pribadi,
        userProfileId: user.user_profile?.id, // Added for API call
      };
    });
  };

  // Fetch API untuk talent
  const fetchDataTalent = async () => {
    try {
      setLoading(true);
      const response = await apiBissaKerja.get("/talent-pool/all");
      console.log("API Response:", response.data);

      if (response.data.status && response.data.user) {
        const transformedData = transformApiDataToTalents(response.data.user);
        setTalents(transformedData);
        console.log("Transformed data:", transformedData);
      } else {
        console.log("No data received from API");
        setTalents([]);
      }
    } catch (error) {
      console.log("Error fetching talent data:", error);
      setTalents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch API untuk job/lowongan - DIPERBAIKI
  const fetchDataLowongan = async () => {
    try {
      setJobsLoading(true);
      const response = await apiBissaKerja.get("/talent-pool/get-my-job");
      console.log("API Get My Job Response:", response.data);

      // Cek berbagai kemungkinan struktur response
      let jobsData: JobData[] = [];

      if (response.data) {
        // Jika response.data.data ada
        if (response.data.data && Array.isArray(response.data.data)) {
          jobsData = response.data.data;
        }
        // Jika response.data.jobs ada
        else if (response.data.jobs && Array.isArray(response.data.jobs)) {
          jobsData = response.data.jobs;
        }
        // Jika response.data langsung berupa array
        else if (Array.isArray(response.data)) {
          jobsData = response.data;
        }
        // Jika response.data.status true dan ada property lain yang berisi array
        else if (response.data.status) {
          // Cari property yang berisi array
          for (const [key, value] of Object.entries(response.data)) {
            if (Array.isArray(value) && key !== "user") {
              jobsData = value as JobData[];
              break;
            }
          }
        }
      }

      setJobs(jobsData);
      console.log("Jobs data set:", jobsData);
    } catch (error) {
      console.log("Error fetching jobs data:", error);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTalent();
    fetchDataLowongan();
  }, []);

  // Get unique disability types from talents data
  const disabilityTypes = useMemo(() => {
    const types = talents.map((talent) => talent.disabilityType);
    return [...new Set(types)].filter((type) => type); // Remove duplicates and empty values
  }, [talents]);

  const disabilityLevels = ["Ringan", "Sedang", "Berat"];

  // Filter talents berdasarkan pencarian
  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      const matchesSearch =
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesDisability =
        selectedDisability === "" ||
        talent.disabilityType === selectedDisability;
      const matchesLevel =
        selectedLevel === "" || talent.disabilityLevel === selectedLevel;

      return matchesSearch && matchesDisability && matchesLevel;
    });
  }, [searchTerm, selectedDisability, selectedLevel, talents]);

  const getDisabilityColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Tuna Rungu":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Tuna Netra":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Tuna Daksa":
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Tuna Grahita":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Lainnya: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    return (
      colors[type] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      Ringan:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Sedang:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Berat: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      colors[level] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
  };

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Convert formatted number back to integer
  const parseFormattedNumber = (value: string): number | null => {
    if (!value) return null;
    const numericValue = value.replace(/\./g, "");
    const parsed = parseInt(numericValue, 10);
    return isNaN(parsed) ? null : parsed;
  };

  // Handle modal functions untuk invitation
  const openModal = (talent: TransformedTalent) => {
    setSelectedTalent(talent);
    setShowModal(true);
    setSelectedPosition("");
    setSelectedJobId(null);
    setMinSalary("");
    setMaxSalary("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTalent(null);
    setSelectedPosition("");
    setSelectedJobId(null);
    setMinSalary("");
    setMaxSalary("");
    setIsSubmitting(false);
  };

  // Handle profile modal functions
  const openProfileModal = (talent: TransformedTalent) => {
    setSelectedTalentProfile(talent);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedTalentProfile(null);
  };

  // Handle job selection - UPDATED
  const handleJobSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedJob = jobs.find((job) => job.id === selectedId);

    if (selectedJob) {
      setSelectedJobId(selectedId);
      setSelectedPosition(selectedJob.job_title);
    } else {
      setSelectedJobId(null);
      setSelectedPosition("");
    }
  };

  // Send invitation to API - NEW FUNCTION
  const handleSendInvitation = async () => {
    // Validasi awal
    if (!selectedTalent || !selectedJobId) {
      alert("Silakan pilih posisi pekerjaan terlebih dahulu!");
      return;
    }

    if (!selectedTalent.userProfileId) {
      alert("Data talent tidak valid. Silakan refresh halaman dan coba lagi.");
      return;
    }

    // Validation for salary range
    const minSalaryNum = parseFormattedNumber(minSalary);
    const maxSalaryNum = parseFormattedNumber(maxSalary);

    if (minSalaryNum && maxSalaryNum && minSalaryNum > maxSalaryNum) {
      alert("Gaji minimal tidak boleh lebih besar dari gaji maksimal!");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for API
      const invitationData = {
        user_profile_id: selectedTalent.userProfileId,
        post_lowongan_id: selectedJobId,
        salary_min: minSalaryNum,
        salary_max: maxSalaryNum,
      };

      console.log("Sending invitation data:", invitationData);

      // Send to API
      const response = await apiBissaKerja.post(
        "/talent-pool/send-invitations",
        invitationData
      );

      console.log("API Response:", response.data);

      if (response.data.status) {
        // Success
        // alert(
        //   `Undangan berhasil dikirim ke ${selectedTalent.name} untuk posisi ${selectedPosition}!`
        // );
        closeModal();
      } else {
        // API returned error
        alert(
          response.data.message || "Terjadi kesalahan saat mengirim undangan."
        );
      }
    } catch (error: any) {
      console.error("Error sending invitation:", error);

      // Handle different error scenarios
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 409) {
        alert("Undangan sudah pernah dikirim untuk kandidat & lowongan ini.");
      } else if (error.response?.status === 403) {
        alert("Anda tidak berhak mengirim undangan untuk lowongan ini.");
      } else if (error.response?.status === 422) {
        alert("Data yang dikirim tidak valid. Silakan periksa kembali.");
      } else {
        alert("Terjadi kesalahan saat mengirim undangan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen">
        <PageBreadcrumb pageTitle="Talent Pool" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Memuat data talent...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <PageBreadcrumb pageTitle="Talent Pool" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 rounded-xl dark:border-gray-700">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Talent Pool Disabilitas
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Temukan talenta terbaik dari penyandang disabilitas
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{filteredTalents.length} Talent Tersedia</span>
                </div>

                <div className="mt-3">
                  <Link
                    href={"/talent-pool/tracking"}
                    className="text-white bg-purple-600 hover:bg-purple-700 inline-block px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    Tracking Proses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto py-8">
          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau keahlian..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Disability Type Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={selectedDisability}
                  onChange={(e) => setSelectedDisability(e.target.value)}
                  aria-label="Filter jenis disabilitas"
                >
                  <option value="">Semua Jenis Disabilitas</option>
                  {disabilityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disability Level Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  aria-label="Filter tingkat disabilitas"
                >
                  <option value="">Semua Tingkat</option>
                  {disabilityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredTalents.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
                <User className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Tidak ada talent ditemukan
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Coba ubah kata kunci pencarian atau filter yang digunakan
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalents.map((talent) => (
                <div
                  key={talent.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={talent.avatar}
                        alt={talent.name}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = `https://ui-avatars.com/api/?name=${talent.name}&length=2`;
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {talent.name}
                        </h3>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {talent.location}
                        </div>
                      </div>
                    </div>

                    {/* Disability Info */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDisabilityColor(
                            talent.disabilityType
                          )}`}
                        >
                          {talent.disabilityType}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                            talent.disabilityLevel
                          )}`}
                        >
                          {talent.disabilityLevel}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Keahlian:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {talent.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openProfileModal(talent)}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => openModal(talent)}
                        className="flex-2 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Undangan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Kirim Undangan - UPDATED */}
        {showModal && selectedTalent && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-99999">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Kirim Undangan Kerja
                </h2>
                <button
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Talent Info */}
              <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={selectedTalent.avatar}
                  alt={selectedTalent.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedTalent.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedTalent.location}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Posisi Pekerjaan - UPDATED */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Posisi Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedJobId || ""}
                    onChange={handleJobSelection}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    disabled={jobsLoading || isSubmitting}
                  >
                    <option value="">
                      {jobsLoading
                        ? "Memuat posisi pekerjaan..."
                        : jobs.length === 0
                        ? "Tidak ada lowongan tersedia"
                        : "Pilih posisi pekerjaan..."}
                    </option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.job_title}
                      </option>
                    ))}
                  </select>

                  {/* Info tambahan */}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {jobs.length === 0 && !jobsLoading
                        ? "Belum ada lowongan pekerjaan"
                        : `${jobs.length} lowongan tersedia`}
                    </p>
                    {jobsLoading && (
                      <div className="flex items-center space-x-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                        <span className="text-xs text-gray-500">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pesan jika tidak ada lowongan */}
                  {jobs.length === 0 && !jobsLoading && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Anda belum memiliki lowongan pekerjaan yang aktif.
                        Silakan buat lowongan terlebih dahulu untuk mengirim
                        undangan kepada talent.
                      </p>
                    </div>
                  )}
                </div>

                {/* Range Gaji */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Range Gaji (Opsional)
                  </label>

                  {/* Gaji Minimal */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Gaji Minimal
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        placeholder="0"
                        value={minSalary}
                        onChange={(e) =>
                          setMinSalary(formatNumber(e.target.value))
                        }
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Gaji Maksimal */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Gaji Maksimal
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        placeholder="0"
                        value={maxSalary}
                        onChange={(e) =>
                          setMaxSalary(formatNumber(e.target.value))
                        }
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kosongkan jika akan dibahas kemudian. Gaji minimal tidak
                    boleh lebih besar dari gaji maksimal.
                  </p>
                </div>

                {/* Preview Undangan */}
                {selectedPosition && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Preview Undangan:
                    </h4>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p>
                        <strong>Posisi:</strong> {selectedPosition}
                      </p>
                      <p>
                        <strong>Kandidat:</strong> {selectedTalent.name}
                      </p>
                      {(minSalary || maxSalary) && (
                        <p>
                          <strong>Range Gaji:</strong>
                          {minSalary && ` Rp ${minSalary}`}
                          {minSalary && maxSalary && " - "}
                          {maxSalary && ` Rp ${maxSalary}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - UPDATED */}
              <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={
                    !selectedJobId ||
                    jobsLoading ||
                    jobs.length === 0 ||
                    isSubmitting
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Undangan"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        <TalentProfileModal
          isOpen={showProfileModal}
          onClose={closeProfileModal}
          talent={selectedTalentProfile}
        />
      </div>
    </div>
  );
};

export default TalentPool;
