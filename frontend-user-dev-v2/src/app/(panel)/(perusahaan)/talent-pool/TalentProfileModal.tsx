import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  FileText,
  Award,
  Loader2,
  GraduationCap,
  Briefcase,
  Trophy,
  BookOpen,
  Languages,
  Heart,
  Home,
  Building,
  Clock,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";

interface TalentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  talent: {
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
  } | null;
}

// Interfaces for API response
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
}

interface Resume {
  id: number;
  user_profile_id: number;
  ringkasan_pribadi: string;
  created_at: string;
  updated_at: string;
  bahasa: Bahasa[];
  keterampilan: Keterampilan[];
  pendidikan: Pendidikan[];
  pencapaian: Pencapaian[];
  pelatihan: Pelatihan[];
  sertifikasi: Sertifikasi[];
  pengalaman_kerja: PengalamanKerja[];
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
  province: Province;
  regency: Regency;
  district: District;
  village: Village;
  province_domisili: Province;
  regency_domisili: Regency;
  district_domisili: District;
  village_domisili: Village;
}

interface Disabilitas {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
  created_at: string;
  updated_at: string;
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

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiUser;
}

const TalentProfileModal: React.FC<TalentProfileModalProps> = ({
  isOpen,
  onClose,
  talent,
}) => {
  const [profileData, setProfileData] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch profile data from API
  const fetchProfileData = async (talentId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiBissaKerja.get(
        `/talent-pool/get-profile/${talentId}`
      );

      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch profile data"
        );
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch profile data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when modal opens
  useEffect(() => {
    if (isOpen && talent?.id) {
      fetchProfileData(talent.id);
    }
  }, [isOpen, talent?.id]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProfileData(null);
      setError(null);
      setActiveTab("overview");
    }
  }, [isOpen]);

  if (!isOpen || !talent) return null;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const calculateAge = (birthDate: string) => {
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

  const getStatusKawinText = (status: number) => {
    switch (status) {
      case 1:
        return "Belum Menikah";
      case 2:
        return "Menikah";
      case 3:
        return "Cerai";
      default:
        return "Tidak Diketahui";
    }
  };

  const getJenisKelaminText = (jk: string) => {
    return jk === "L"
      ? "Laki-laki"
      : jk === "P"
      ? "Perempuan"
      : "Tidak Diketahui";
  };

  const getTipePekerjaanText = (tipe: string) => {
    switch (tipe.toLowerCase()) {
      case "fulltime":
        return "Full Time";
      case "parttime":
        return "Part Time";
      case "freelance":
        return "Freelance";
      case "contract":
        return "Contract";
      case "internship":
        return "Internship";
      default:
        return tipe;
    }
  };

  const getTipePekerjaanColor = (tipe: string) => {
    // Semua menggunakan warna blue dengan shade berbeda
    switch (tipe.toLowerCase()) {
      case "fulltime":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "parttime":
        return "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100";
      case "freelance":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      case "contract":
        return "bg-blue-300 text-blue-900 dark:bg-blue-700 dark:text-blue-100";
      case "internship":
        return "bg-blue-400 text-white dark:bg-blue-600 dark:text-white";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-99999">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Memuat profil talent...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileData) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-99999">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 border border-red-200 dark:border-red-700 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
              Gagal Memuat Data
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  // Use API data if available, otherwise fall back to passed talent data
  const displayData = profileData || talent;
  const userProfile = profileData?.user_profile;
  const resume = userProfile?.resume;

  const tabs = [
    { id: "overview", name: "Overview", icon: User },
    { id: "experience", name: "Pengalaman", icon: Briefcase },
    { id: "education", name: "Pendidikan", icon: GraduationCap },
    { id: "certificates", name: "Sertifikat", icon: Award },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-99999">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full my-8 border border-gray-200 dark:border-gray-700 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with blue background */}
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Profil Talent</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-6 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="relative">
              <img
                src={displayData.avatar || talent.avatar}
                alt={displayData.name || talent.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src = `https://ui-avatars.com/api/?name=${
                    displayData.name || talent.name
                  }&length=2&size=128&background=3B82F6&color=FFFFFF`;
                }}
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {displayData.name || talent.name}
              </h3>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Email
                    </div>
                    <span className="font-medium">
                      {displayData.email || talent.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Telepon
                    </div>
                    <span className="font-medium">
                      {userProfile?.no_telp ||
                        talent.noTelp ||
                        "Tidak tersedia"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Lokasi
                    </div>
                    <span className="font-medium">
                      {userProfile?.lokasi
                        ? `${userProfile.lokasi.regency_domisili?.name}, ${userProfile.lokasi.province_domisili?.name}`
                        : talent.location}
                    </span>
                  </div>
                </div>

                {userProfile?.tanggal_lahir && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Usia
                      </div>
                      <span className="font-medium">
                        {calculateAge(userProfile.tanggal_lahir)} tahun
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white shadow-md">
                  {userProfile?.disabilitas?.kategori_disabilitas ||
                    talent.disabilityType}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white shadow-md">
                  {userProfile?.disabilitas?.tingkat_disabilitas ||
                    talent.disabilityLevel}
                </span>
                {userProfile?.jenis_kelamin && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-700 text-white shadow-md">
                    {getJenisKelaminText(userProfile.jenis_kelamin)}
                  </span>
                )}
                {userProfile?.status_kawin && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-800 text-white shadow-md">
                    <Heart className="w-3 h-3 inline mr-1" />
                    {getStatusKawinText(userProfile.status_kawin)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Ringkasan Pribadi */}
                {resume?.ringkasan_pribadi && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Ringkasan Pribadi
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                      {resume.ringkasan_pribadi}
                    </p>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Keahlian & Teknologi
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {resume?.keterampilan && resume.keterampilan.length > 0
                      ? resume.keterampilan.map((skill, index) =>
                          skill.nama_keterampilan.map((nama, i) => (
                            <span
                              key={`${index}-${i}`}
                              className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium shadow-sm border border-blue-200 dark:border-blue-700"
                            >
                              {nama}
                            </span>
                          ))
                        )
                      : talent.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium shadow-sm border border-blue-200 dark:border-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                  </div>
                </div>

                {/* Personal Information */}
                {userProfile && (
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Informasi Pribadi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Tanggal Lahir
                        </span>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatDate(userProfile.tanggal_lahir)}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-1">
                          <Heart className="w-4 h-4 mr-1" />
                          Status Perkawinan
                        </span>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {getStatusKawinText(userProfile.status_kawin)}
                        </p>
                      </div>
                      {userProfile.latar_belakang && (
                        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-1">
                            <BookOpen className="w-4 h-4 mr-1" />
                            Latar Belakang
                          </span>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {userProfile.latar_belakang}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Address Information */}
                {userProfile?.lokasi && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Home className="w-5 h-5 mr-2 text-blue-600" />
                      Informasi Alamat
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 block">
                          Alamat KTP
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {userProfile.lokasi.alamat_lengkap_ktp},{" "}
                          {userProfile.lokasi.village?.name},{" "}
                          {userProfile.lokasi.district?.name},{" "}
                          {userProfile.lokasi.regency?.name},{" "}
                          {userProfile.lokasi.province?.name}{" "}
                          {userProfile.lokasi.kode_pos_ktp}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 block">
                          Alamat Domisili
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {userProfile.lokasi.alamat_lengkap_domisili},{" "}
                          {userProfile.lokasi.village_domisili?.name},{" "}
                          {userProfile.lokasi.district_domisili?.name},{" "}
                          {userProfile.lokasi.regency_domisili?.name},{" "}
                          {userProfile.lokasi.province_domisili?.name}{" "}
                          {userProfile.lokasi.kode_pos_domisili}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Languages */}
                {resume?.bahasa && resume.bahasa.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Languages className="w-5 h-5 mr-2 text-blue-600" />
                      Kemampuan Bahasa
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {resume.bahasa.map((lang, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {lang.name}
                          </h5>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              {lang.tingkat}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                {/* Experience */}
                {resume?.pengalaman_kerja &&
                resume.pengalaman_kerja.length > 0 ? (
                  <div className="space-y-4">
                    {resume.pengalaman_kerja.map((exp, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
                                  {exp.name}
                                </h5>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">
                                  {exp.nama_perusahaan}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getTipePekerjaanColor(
                                  exp.tipe_pekerjaan
                                )}`}
                              >
                                {getTipePekerjaanText(exp.tipe_pekerjaan)}
                              </span>
                              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {exp.lokasi}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="font-medium">
                                {formatDate(exp.tanggal_mulai)} -{" "}
                                {exp.tanggal_akhir
                                  ? formatDate(exp.tanggal_akhir)
                                  : "Sekarang"}
                              </span>
                            </div>
                            {!exp.tanggal_akhir && (
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                        {exp.deskripsi && (
                          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                              {exp.deskripsi}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Belum ada pengalaman kerja
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                {/* Education */}
                {resume?.pendidikan && resume.pendidikan.length > 0 ? (
                  <div className="space-y-4">
                    {resume.pendidikan.map((edu, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
                                  {edu.lokasi}
                                </h5>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">
                                  {edu.tingkat} - {edu.bidang_studi}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                Nilai: {edu.nilai}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="font-medium">
                                {formatDate(edu.tanggal_mulai)} -{" "}
                                {formatDate(edu.tanggal_akhir)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {edu.deskripsi && (
                          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {edu.deskripsi}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Belum ada data pendidikan
                    </p>
                  </div>
                )}

                {/* Training */}
                {resume?.pelatihan && resume.pelatihan.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Pelatihan
                    </h4>
                    <div className="space-y-4">
                      {resume.pelatihan.map((training, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-blue-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                  {training.name}
                                </h5>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">
                                  {training.penyelenggara}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {formatDate(training.tanggal_mulai)} -{" "}
                              {formatDate(training.tanggal_akhir)}
                            </span>
                          </div>
                          {training.deskripsi && (
                            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                              <p className="text-gray-700 dark:text-gray-300">
                                {training.deskripsi}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="space-y-6">
                {/* Certifications */}
                {resume?.sertifikasi && resume.sertifikasi.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-600" />
                      Sertifikasi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {resume.sertifikasi.map((cert, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-blue-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {cert.program}
                              </h5>
                              <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                                {cert.lembaga}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                                  Nilai: {cert.nilai}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(cert.tanggal_mulai)} -{" "}
                                {formatDate(cert.tanggal_akhir)}
                              </p>
                            </div>
                          </div>
                          {cert.deskripsi && (
                            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {cert.deskripsi}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {resume?.pencapaian && resume.pencapaian.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-blue-600" />
                      Pencapaian
                    </h4>
                    <div className="space-y-4">
                      {resume.pencapaian.map((achievement, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-blue-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {achievement.name}
                                </h5>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">
                                  {achievement.penyelenggara}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {formatDate(achievement.tanggal_pencapaian)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state for certificates tab */}
                {(!resume?.sertifikasi || resume.sertifikasi.length === 0) &&
                  (!resume?.pencapaian || resume.pencapaian.length === 0) && (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Belum ada sertifikat atau pencapaian
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentProfileModal;
