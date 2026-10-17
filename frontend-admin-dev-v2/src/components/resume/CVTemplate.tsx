"use client";
import React, { useEffect, useId, useState } from "react";
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
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import { useUser } from "@/context/UserContext";
// import CVLoadingSkeleton from "@/skeleton/CVLoadingSkeleton";

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
  const { user, loading } = useUser();
  const componentId = useId(); // Rename untuk menghindari konflik

  useEffect(() => {
    if (user && !loading) {
      fetchDataResume();
    }
  }, [user, loading]);

  const fetchDataResume = async () => {
    try {
      if (!user) {
        console.log("User data not available.");
        return;
      }

      // Periksa struktur user object dan akses properti yang benar
      // Kemungkinan user memiliki properti berbeda seperti user_id, userId, atau nested di dalam objek lain
      const userId =
        (user as any).id || (user as any).user_id || (user as any).userId;

      if (!userId) {
        console.error("User ID not found in user object:", user);
        return;
      }

      console.log("Component ID:", componentId);
      console.log("User ID:", userId);

      const response = await apiBissaKerja.get(`/resume/${userId}`);
      setUserData(response.data.data);
    } catch (error: any) {
      console.error("Error fetching resume data: ", error);
    }
  };

  if (loading) {
    // return <CVLoadingSkeleton />;
    return <div>Loading....</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
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
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Hapus CV
        </button>
      </div>

      {/* CV Container */}
      <div className="w-full mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 print:bg-blue-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/20">
              <img
                src={userData?.avatar || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-2">
                <h1 className="text-4xl font-bold mb-2">
                  {userData?.name || "N/A"}
                </h1>
                <p className="leading-relaxed">
                  {userData?.user_profile?.resume?.ringkasan_pribadi ||
                    "No summary available"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-100">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userData?.email || "No email available"}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4" />
                  <span>
                    {userData?.user_profile?.no_telp ||
                      "No phone number available"}
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {userData?.user_profile?.disabilitas
                      ?.kategori_disabilitas || "N/A"}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {userData?.user_profile?.disabilitas?.tingkat_disabilitas ||
                      "N/A"}
                  </span>
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
              {userData?.user_profile?.latar_belakang ||
                "No background information available"}
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
                  {userData?.user_profile?.nik || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Tanggal Lahir:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {formatFullDate(userData?.user_profile?.tanggal_lahir || "")}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Jenis Kelamin:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.jenis_kelamin === "L"
                    ? "Laki-laki"
                    : userData?.user_profile?.jenis_kelamin === "P"
                    ? "Perempuan"
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Status Pernikahan:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.status_kawin || "N/A"}
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
                  {userData?.user_profile?.lokasi?.kode_pos_ktp || "N/A"}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Kode POS Alamat Domisili:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.lokasi?.kode_pos_domisili || "N/A"}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Alamat Lengkap KTP:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.lokasi?.alamat_lengkap_ktp || "N/A"}
                </span>
                <div className="text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.lokasi?.village?.name || "N/A"},{" "}
                  {userData?.user_profile?.lokasi?.district?.name || "N/A"},{" "}
                  <br />
                  {userData?.user_profile?.lokasi?.regency?.name || "N/A"},{" "}
                  {userData?.user_profile?.lokasi?.province?.name || "N/A"}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Alamat Lengkap Domisili:
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.lokasi?.alamat_lengkap_domisili ||
                    "N/A"}
                </span>
                <div className="text-gray-700 dark:text-gray-300">
                  {userData?.user_profile?.lokasi?.village_domisili?.name ||
                    "N/A"}
                  ,{" "}
                  {userData?.user_profile?.lokasi?.district_domisili?.name ||
                    "N/A"}
                  , <br />
                  {userData?.user_profile?.lokasi?.regency_domisili?.name ||
                    "N/A"}
                  ,{" "}
                  {userData?.user_profile?.lokasi?.province_domisili?.name ||
                    "N/A"}
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
              {userData?.user_profile?.resume?.pengalaman_kerja?.length ? (
                userData.user_profile.resume.pengalaman_kerja.map(
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
                )
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No work experience available
                </p>
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
              {userData?.user_profile?.resume?.pendidikan?.length ? (
                userData.user_profile.resume.pendidikan.map((edu, index) => (
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
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No education data available
                </p>
              )}
            </div>
          </section>

          {/* Sertifikasi */}
          {userData?.user_profile?.resume?.sertifikasi?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sertifikasi
                </h2>
              </div>
              <div className="space-y-4">
                {userData.user_profile.resume.sertifikasi.map((cert, index) => (
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
                ))}
              </div>
            </section>
          )}

          {/* Pelatihan */}
          {userData?.user_profile?.resume?.pelatihan?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pelatihan
                </h2>
              </div>
              <div className="space-y-4">
                {userData.user_profile.resume.pelatihan.map(
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
                {userData?.user_profile?.resume?.keterampilan?.length ? (
                  userData.user_profile.resume.keterampilan.map(
                    (skill, index) => {
                      // Memastikan nama_keterampilan adalah array jika berbentuk string JSON
                      const skillNames = Array.isArray(skill.nama_keterampilan)
                        ? skill.nama_keterampilan
                        : typeof skill.nama_keterampilan === "string"
                        ? JSON.parse(skill.nama_keterampilan)
                        : [];

                      return skillNames.map((name: string, i: number) => (
                        <span
                          key={`${index}-${i}`}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {name}
                        </span>
                      ));
                    }
                  )
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No skills listed
                  </p>
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
                {userData?.user_profile?.resume?.bahasa?.length ? (
                  userData.user_profile.resume.bahasa.map((lang, index) => (
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
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No languages listed
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Pencapaian */}
          {userData?.user_profile?.resume?.pencapaian?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pencapaian
                </h2>
              </div>
              <div className="space-y-4">
                {userData.user_profile.resume.pencapaian.map(
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
