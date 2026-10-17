"use client";
import React, { useEffect, useId, useState, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Shield,
  Trophy,
  FileText,
  Download,
  Trash2,
  AlertCircle,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import { useUser } from "@/context/UserContext";
import CVLoadingSkeleton from "@/skeleton/CVLoadingSkeleton";
import Cookies from "js-cookie";

interface Location {
  id: number;
  kode_pos_ktp: string;
  alamat_lengkap_ktp: string;
  province: {
    name: string;
  };
  regency: {
    name: string;
  };
  district: {
    name: string;
  };
  village: {
    name: string;
  };
  kode_pos_domisili: string;
  alamat_lengkap_domisili: string;
  province_domisili: {
    name: string;
  };
  regency_domisili: {
    name: string;
  };
  district_domisili: {
    name: string;
  };
  village_domisili: {
    name: string;
  };
  user_profile_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Disabilitas {
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
}

interface Resume {
  id: number;
  user_profile_id: number;
  ringkasan_pribadi: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bahasa: Array<{
    id: number;
    name: string;
    tingkat: string;
    resume_id: number;
    created_at: string;
    updated_at: string;
  }>;
  keterampilan: Array<{
    id: number;
    nama_keterampilan: string[];
    resume_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
  pendidikan: Array<{
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
  }>;
  pencapaian: Array<{
    id: number;
    name: string;
    penyelenggara: string;
    tanggal_pencapaian: string;
    dokumen: string;
    resume_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
  pelatihan: Array<{
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
  }>;
  sertifikasi: Array<{
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
  }>;
  pengalaman_kerja: Array<{
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
  }>;
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
  lokasi: Location;
  resume: Resume;
  disabilitas: Disabilitas;
}

interface UserData {
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

const CVTemplate = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user, loading } = useUser();

  // Avatar logic functions
  const generateDefaultAvatar = useCallback((name: string) => {
    const encodedName = encodeURIComponent(name || "User");
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  }, []);

  // Get avatar source with proper fallback
  const getAvatarSrc = useCallback(() => {
    // If userData exists and has an avatar
    if (userData?.avatar && userData.avatar.trim()) {
      // Check if it's a full URL (starts with http/https)
      if (userData.avatar.startsWith("http")) {
        return userData.avatar;
      }
      // If it's a relative path, convert to absolute using the API base URL
      if (userData.avatar.startsWith("/storage/")) {
        // Get the base URL from your API configuration
        const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        return `${apiBaseUrl}${userData.avatar}`;
      }
    }

    // Fallback to default avatar
    return generateDefaultAvatar(userData?.name || "User");
  }, [userData, generateDefaultAvatar]);

  useEffect(() => {
    if (user && !loading) {
      fetchDataResume();
    }
  }, [user, loading]);

  const handleRemoveCV = async () => {
    try {
      setDeleteLoading(true);

      const response = await apiBissaKerja.delete("/resume/detele/cv");

      if (response.status === 201) {
        setUserData(null);
        setShowDeleteModal(false);
        Cookies.set("userProfile", "false");
        window.location.href = "/resume";
      }
    } catch (error: any) {
      console.error("Error deleting CV:", error);
      alert("Gagal menghapus CV. Silakan coba lagi.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchDataResume = async () => {
    try {
      if (!user) {
        console.log("User data not available.");
        return;
      }

      const userId = user.id;
      const response = await apiBissaKerja.get(`/resume/${userId}`);
      setUserData(response.data.data);
    } catch (error: any) {
      console.error("Error: ", error);
    }
  };

  if (loading) {
    return <CVLoadingSkeleton />;
  }

  const handleExportPDF = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { year: "numeric", month: "long" });
  };

  const formatFullDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 py-8">
      {/* Export Button */}
      <div className="flex items-center justify-start mb-6 max-w-4xl gap-3">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Download className="w-5 h-5" />
          Export to PDF
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Hapus CV
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-99999 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Konfirmasi Hapus CV
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Apakah Anda yakin ingin menghapus CV{" "}
                <strong>"{userData?.name}"</strong>? Tindakan ini tidak dapat
                dibatalkan dan semua data CV akan hilang permanen.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleRemoveCV}
                  disabled={deleteLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                >
                  {deleteLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menghapus...
                    </div>
                  ) : (
                    "Ya, Hapus CV"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CV Container */}
      <div className="w-full mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 print:bg-blue-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/20">
              <img
                src={getAvatarSrc()}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = generateDefaultAvatar(userData?.name || "User");
                }}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-2">
                <h1 className="text-4xl font-bold mb-2">
                  {userData && userData.name}
                </h1>
                <p className="leading-relaxed">
                  {userData &&
                    userData?.user_profile?.resume?.ringkasan_pribadi}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-100">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userData && userData.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4" />
                  <span>
                    {userData && userData.user_profile
                      ? userData.user_profile.no_telp
                      : "No phone number available"}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2">
                  {userData?.user_profile?.disabilitas
                    ?.kategori_disabilitas && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                      {userData.user_profile.disabilitas.kategori_disabilitas}
                    </span>
                  )}
                  {userData?.user_profile?.disabilitas?.tingkat_disabilitas && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                      {userData.user_profile.disabilitas.tingkat_disabilitas}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Ringkasan Pribadi */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Latar Belakang
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {userData && userData?.user_profile?.latar_belakang}
            </p>
          </section>

          {/* Data Pribadi */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Pribadi
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  NIK:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData && userData?.user_profile?.nik}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Tanggal Lahir:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.tanggal_lahir
                    ? formatFullDate(userData.user_profile.tanggal_lahir)
                    : "Tidak tersedia"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Jenis Kelamin:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData && userData?.user_profile?.jenis_kelamin === "L"
                    ? "Laki-laki"
                    : "Perempuan"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Status Pernikahan:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData && userData?.user_profile?.status_kawin}
                </span>
              </div>
            </div>
          </section>

          {/* Alamat */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Alamat
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Kode POS Alamat KTP:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData && userData.user_profile?.lokasi?.kode_pos_ktp}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Kode POS Alamat Domisili:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData && userData.user_profile?.lokasi?.kode_pos_domisili}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Alamat Lengkap :
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData &&
                    userData.user_profile?.lokasi?.alamat_lengkap_ktp}
                </span>
                <div className=" text-gray-700 dark:text-gray-300">
                  {userData && userData.user_profile?.lokasi?.village.name},{" "}
                  {userData && userData.user_profile?.lokasi?.district.name},{" "}
                  <br />
                  {userData &&
                    userData.user_profile?.lokasi?.regency.name},{" "}
                  {userData && userData.user_profile?.lokasi?.province.name}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Alamat Lengkap :
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData &&
                    userData.user_profile?.lokasi?.alamat_lengkap_domisili}
                </span>
                <div className=" text-gray-700 dark:text-gray-300">
                  {userData &&
                    userData.user_profile?.lokasi?.village_domisili.name}
                  ,{" "}
                  {userData &&
                    userData.user_profile?.lokasi?.district_domisili.name}
                  , <br />
                  {userData &&
                    userData.user_profile?.lokasi?.regency_domisili.name}
                  ,{" "}
                  {userData &&
                    userData.user_profile?.lokasi?.province_domisili.name}
                </div>
              </div>
            </div>
          </section>

          {/* Pengalaman Kerja */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pengalaman Kerja
              </h2>
            </div>
            <div className="space-y-6">
              {userData &&
                userData?.user_profile?.resume?.pengalaman_kerja.map(
                  (exp, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-200 dark:border-blue-700 pl-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {exp.name}
                        </h3>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {formatDate(exp.tanggal_mulai)} -{" "}
                          {formatDate(exp.tanggal_akhir)}
                        </span>
                      </div>
                      <p className="text-lg text-blue-600 dark:text-blue-400 mb-1">
                        {exp.nama_perusahaan}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {exp.lokasi} •{" "}
                        {exp.tipe_pekerjaan.replace("_", " ").toUpperCase()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {exp.deskripsi}
                      </p>
                    </div>
                  )
                )}
            </div>
          </section>

          {/* Pendidikan */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pendidikan
              </h2>
            </div>
            <div className="space-y-6">
              {userData &&
                userData?.user_profile?.resume?.pendidikan.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-green-200 dark:border-green-700 pl-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {edu.bidang_studi}
                      </h3>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {formatDate(edu.tanggal_mulai)} -{" "}
                        {formatDate(edu.tanggal_akhir)}
                      </span>
                    </div>
                    <p className="text-lg text-green-600 dark:text-green-400 mb-1">
                      {edu.lokasi}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      IPK: {edu.nilai}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {edu.deskripsi}
                    </p>
                  </div>
                ))}
            </div>
          </section>

          {/* Sertifikasi */}
          {userData &&
            userData?.user_profile?.resume?.sertifikasi.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sertifikasi
                  </h2>
                </div>
                <div className="space-y-4">
                  {userData &&
                    userData?.user_profile?.resume?.sertifikasi.map(
                      (cert, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-purple-200 dark:border-purple-700 pl-6"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {cert.program}
                            </h3>
                            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                              {formatDate(cert.tanggal_mulai)} -{" "}
                              {formatDate(cert.tanggal_akhir)}
                            </span>
                          </div>
                          <p className="text-purple-600 dark:text-purple-400 mb-1">
                            {cert.lembaga}
                          </p>
                          {cert.nilai && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Skor: {cert.nilai}
                            </p>
                          )}
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {cert.deskripsi}
                          </p>
                        </div>
                      )
                    )}
                </div>
              </section>
            )}

          {/* Pelatihan */}
          {userData && userData?.user_profile?.resume?.pelatihan.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pelatihan
                </h2>
              </div>
              <div className="space-y-4">
                {userData &&
                  userData?.user_profile?.resume?.pelatihan.map(
                    (training, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-orange-200 dark:border-orange-700 pl-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {training.name}
                          </h3>
                          <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                            {formatDate(training.tanggal_mulai)} -{" "}
                            {formatDate(training.tanggal_akhir)}
                          </span>
                        </div>
                        <p className="text-orange-600 dark:text-orange-400 mb-1">
                          {training.penyelenggara}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {training.deskripsi}
                        </p>
                      </div>
                    )
                  )}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Keterampilan */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Keterampilan
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData &&
                  userData?.user_profile?.resume?.keterampilan.map(
                    (skill, index) => {
                      // Memastikan nama_keterampilan adalah array jika berbentuk string JSON
                      const skillNames = Array.isArray(skill.nama_keterampilan)
                        ? skill.nama_keterampilan
                        : JSON.parse(skill.nama_keterampilan); // Parsing jika berupa JSON string

                      return skillNames.map((name: string, i: any) => (
                        <span
                          key={`${index}-${i}`}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {name}
                        </span>
                      ));
                    }
                  )}
              </div>
            </section>
            {/* Bahasa */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bahasa
                </h2>
              </div>
              <div className="space-y-2">
                {userData &&
                  userData?.user_profile?.resume?.bahasa.map((lang, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {lang.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {lang.tingkat}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          </div>

          {/* Pencapaian */}
          {userData &&
            userData?.user_profile?.resume?.pencapaian.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Pencapaian
                  </h2>
                </div>
                <div className="space-y-4">
                  {userData &&
                    userData?.user_profile?.resume?.pencapaian.map(
                      (achievement, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-yellow-200 dark:border-yellow-700 pl-6"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {achievement.name}
                            </h3>
                            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                              {formatFullDate(achievement.tanggal_pencapaian)}
                            </span>
                          </div>
                          <p className="text-yellow-600 dark:text-yellow-400">
                            {achievement.penyelenggara}
                          </p>
                        </div>
                      )
                    )}
                </div>
              </section>
            )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:bg-blue-700 {
            background-color: #1d4ed8 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CVTemplate;
