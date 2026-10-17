"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  Upload,
  Building,
  MapPin,
  Globe,
  Phone,
  Award,
  Target,
  Eye,
  Plus,
  Trash2,
  ArrowLeft,
  FileText,
  Share2,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import api from "@/lib/axios";
import { FormLoadingSkeleton } from "@/skeleton/CompanyFormSkeleton";
import { profile } from "console";
import useDocumentTitle from "@/hooks/useDocumentTitle";

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
  province_id: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface PerusahaanProfileData {
  id?: number;
  nama_perusahaan?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  deskripsi: string;
  industri: string;
  tahun_berdiri?: string;
  jumlah_karyawan?: string;
  province_id: string;
  regencie_id: string;
  no_telp?: string;
  link_website?: string;
  alamat_lengkap: string;
  visi: string;
  misi: string;
  nilai_nilai?: string[];
  sertifikat?: string[];
  bukti_wajib_lapor?: string | null;
  bukti_wajib_lapor_url?: string | null;
  nib: string;
  status_verifikasi?: string;
  province?: Province;
  regency?: Regency;
  // Social Media Fields
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface FormData {
  nama_perusahaan: string;
  logo: string | null;
  deskripsi: string;
  industri: string;
  tahun_berdiri: string;
  jumlah_karyawan: string;
  province_id: string;
  regencie_id: string;
  no_telp: string;
  link_website: string;
  alamat_lengkap: string;
  visi: string;
  misi: string;
  nilai_nilai: string[];
  sertifikat: string[];
  status_verifikasi: string;
  bukti_wajib_lapor: string | null;
  nib: string;
  // Social Media Fields
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  tiktok: string;
}

export default function FormLengkapiDataPerusahaan() {
  useDocumentTitle("Lengkapi Profil Perusahaan | JatimBissa");
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    nama_perusahaan: "",
    logo: null,
    deskripsi: "",
    industri: "",
    tahun_berdiri: "",
    jumlah_karyawan: "",
    province_id: "",
    regencie_id: "",
    no_telp: "",
    link_website: "",
    alamat_lengkap: "",
    visi: "",
    misi: "",
    nilai_nilai: [""],
    sertifikat: [""],
    status_verifikasi: "belum",
    bukti_wajib_lapor: null,
    nib: "",
    // Social Media Fields
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
    tiktok: "",
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [buktiPreview, setBuktiPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showSocialMedia, setShowSocialMedia] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.province_id) {
      loadRegencies(formData.province_id);
    } else {
      setRegencies([]);
      if (formData.regencie_id) {
        setFormData((prev) => ({ ...prev, regencie_id: "" }));
      }
    }
  }, [formData.province_id]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadUserData(),
        loadPerusahaanProfile(),
        loadProvinces(),
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const response = await apiBissaKerja.get("/user");
      const user = response.data.user;
      setUserData(user);

      // Set nama perusahaan from user data
      setFormData((prev) => ({
        ...prev,
        nama_perusahaan: user.name || "",
      }));

      // Set logo preview from user avatar if available
      if (user.avatar) {
        setLogoPreview(user.avatar);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      showAlert("Gagal memuat data user", "error");
    }
  };

  const loadPerusahaanProfile = async () => {
    try {
      const response = await apiBissaKerja.get<
        ApiResponse<PerusahaanProfileData>
      >("perusahaan/profile");

      if (response.data.success && response.data.data) {
        const data = response.data.data;

        setFormData((prev) => ({
          ...prev,
          // Don't override nama_perusahaan as it comes from user data
          logo: null, // Don't set existing logo as base64 for edit
          deskripsi: data.deskripsi || "",
          industri: data.industri || "",
          tahun_berdiri: data.tahun_berdiri || "",
          jumlah_karyawan: data.jumlah_karyawan || "",
          province_id: data.province_id || "",
          regencie_id: data.regencie_id || "",
          no_telp: data.no_telp || "",
          link_website: data.link_website || "",
          alamat_lengkap: data.alamat_lengkap || "",
          visi: data.visi || "",
          misi: data.misi || "",
          nilai_nilai:
            Array.isArray(data.nilai_nilai) && data.nilai_nilai.length > 0
              ? data.nilai_nilai
              : [""],
          sertifikat:
            Array.isArray(data.sertifikat) && data.sertifikat.length > 0
              ? data.sertifikat
              : [""],
          bukti_wajib_lapor: null, // Don't set existing bukti as base64 for edit
          nib: data.nib || "",
          // Social Media Fields
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          youtube: data.youtube || "",
          tiktok: data.tiktok || "",
        }));

        // Set logo preview from existing data if available and no user avatar
        if (data.logo_url && !userData?.avatar) {
          setLogoPreview(data.logo_url);
        }

        if (data.bukti_wajib_lapor_url) {
          setBuktiPreview(data.bukti_wajib_lapor_url);
        }

        // Check if social media data exists
        const hasSocialMedia =
          data.linkedin ||
          data.instagram ||
          data.facebook ||
          data.twitter ||
          data.youtube ||
          data.tiktok;
        if (hasSocialMedia) {
          setShowSocialMedia(true);
        }

        setIsEdit(true);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Error loading profile:", error);
        showAlert("Gagal memuat data profile perusahaan", "error");
      }
    }
  };

  const loadProvinces = async () => {
    try {
      const response = await apiBissaKerja.get<ApiResponse<Province[]>>(
        "provinces"
      );

      // Handle different response structures
      let provincesData: Province[] = [];
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          provincesData = response.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          provincesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          provincesData = response.data;
        }
      }

      setProvinces(provincesData);
    } catch (error) {
      console.error("Error loading provinces:", error);
      showAlert("Gagal memuat data provinsi", "error");
    }
  };

  const loadRegencies = async (provinceId: string) => {
    try {
      const response = await apiBissaKerja.get<ApiResponse<Regency[]>>(
        `regencies?province_id=${provinceId}`
      );

      // Handle different response structures
      let regenciesData: Regency[] = [];
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          regenciesData = response.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          regenciesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          regenciesData = response.data;
        }
      }

      setRegencies(regenciesData);
    } catch (error) {
      console.error("Error loading regencies:", error);
      showAlert("Gagal memuat data kota/kabupaten", "error");
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleArrayChange = (
    field: "nilai_nilai" | "sertifikat",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "nilai_nilai" | "sertifikat") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (
    field: "nilai_nilai" | "sertifikat",
    index: number
  ) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else {
      // If only one item left, clear it instead of removing
      setFormData((prev) => ({
        ...prev,
        [field]: [""],
      }));
    }
  };

  const hideSection = (field: "nilai_nilai" | "sertifikat") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [""],
    }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const validateFile = (file: File, type: "logo" | "bukti"): boolean => {
    const maxSize = type === "logo" ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB or 5MB
    const allowedTypes =
      type === "logo"
        ? ["image/jpeg", "image/png", "image/jpg", "image/gif"]
        : [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];

    if (file.size > maxSize) {
      const sizeMB = type === "logo" ? "2MB" : "5MB";
      showAlert(`Ukuran file ${type} maksimal ${sizeMB}`, "error");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      const formats =
        type === "logo" ? "JPG, PNG, GIF" : "JPG, PNG, PDF, DOC, DOCX";
      showAlert(`Format file ${type} harus ${formats}`, "error");
      return false;
    }

    return true;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file, "logo")) return;

    try {
      const base64 = await convertToBase64(file);
      setLogoPreview(base64);
      setFormData((prev) => ({ ...prev, logo: base64 }));
      clearFieldError("logo");
    } catch (error) {
      console.error("Error converting logo:", error);
      showAlert("Gagal mengupload logo", "error");
    }
  };

  const handleBuktiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file, "bukti")) return;

    try {
      const base64 = await convertToBase64(file);
      setBuktiPreview(base64);
      setFormData((prev) => ({ ...prev, bukti_wajib_lapor: base64 }));
      clearFieldError("bukti_wajib_lapor");
    } catch (error) {
      console.error("Error converting bukti:", error);
      showAlert("Gagal mengupload bukti wajib lapor", "error");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    // Required field validation
    const requiredFields = [
      "nama_perusahaan",
      "industri",
      "province_id",
      "regencie_id",
      "deskripsi",
      "alamat_lengkap",
      "visi",
      "misi",
      "nib",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = ["Field ini wajib diisi"];
      }
    });

    // File validation for new profile
    if (!isEdit) {
      if (!formData.logo && !userData?.avatar) {
        newErrors.logo = ["Logo perusahaan wajib diupload"];
      }
      if (!formData.bukti_wajib_lapor) {
        newErrors.bukti_wajib_lapor = ["Bukti wajib lapor wajib diupload"];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Mohon lengkapi semua field yang wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare submit data exactly as expected by backend
      const submitData: any = {
        nama_perusahaan: formData.nama_perusahaan,
        industri: formData.industri,
        province_id: formData.province_id,
        regencie_id: formData.regencie_id,
        deskripsi: formData.deskripsi,
        alamat_lengkap: formData.alamat_lengkap,
        visi: formData.visi,
        misi: formData.misi,
        nib: formData.nib,
      };

      // Add optional fields only if they have values
      if (formData.tahun_berdiri?.trim()) {
        submitData.tahun_berdiri = formData.tahun_berdiri;
      }
      if (formData.jumlah_karyawan?.trim()) {
        submitData.jumlah_karyawan = formData.jumlah_karyawan;
      }
      if (formData.no_telp?.trim()) {
        submitData.no_telp = formData.no_telp;
      }
      if (formData.link_website?.trim()) {
        submitData.link_website = formData.link_website;
      }

      // Add optional social media fields only if they have values
      if (formData.linkedin?.trim()) {
        submitData.linkedin = formData.linkedin;
      }
      if (formData.instagram?.trim()) {
        submitData.instagram = formData.instagram;
      }
      if (formData.facebook?.trim()) {
        submitData.facebook = formData.facebook;
      }
      if (formData.twitter?.trim()) {
        submitData.twitter = formData.twitter;
      }
      if (formData.youtube?.trim()) {
        submitData.youtube = formData.youtube;
      }
      if (formData.tiktok?.trim()) {
        submitData.tiktok = formData.tiktok;
      }

      // Handle logo - only send if new logo is uploaded
      if (formData.logo) {
        submitData.logo = formData.logo;
      }

      // Handle bukti wajib lapor - only send if new bukti is uploaded
      if (formData.bukti_wajib_lapor) {
        submitData.bukti_wajib_lapor = formData.bukti_wajib_lapor;
      }

      // Handle arrays - filter empty values and send only if not empty
      const filteredNilaiNilai = formData.nilai_nilai.filter(
        (value) => value.trim() !== ""
      );
      if (filteredNilaiNilai.length > 0) {
        submitData.nilai_nilai = filteredNilaiNilai;
      }

      const filteredSertifikat = formData.sertifikat.filter(
        (value) => value.trim() !== ""
      );
      if (filteredSertifikat.length > 0) {
        submitData.sertifikat = filteredSertifikat;
      }

      const response = await apiBissaKerja.post<
        ApiResponse<PerusahaanProfileData>
      >("perusahaan/profile", submitData);

      if (response.data.success) {
        // showAlert(
        //   response.data.message ||
        //     (isEdit ? "Data berhasil diperbarui" : "Data berhasil disimpan"),
        //   "success"
        // );
        setTimeout(() => {
          router.push("/profile-perusahaan");
        }, 1500);
      } else {
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
        showAlert(response.data.message || "Gagal menyimpan data", "error");
      }
    } catch (error: any) {
      if (
        error.response?.status === 422 &&
        error.response?.data?.data?.errors
      ) {
        setErrors(error.response.data.data.errors);
        showAlert("Terdapat kesalahan validasi", "error");
      } else if (error.response?.data?.status === 500) {
        showAlert(
          error.response?.data?.data?.message ||
            "Terjadi kesalahan server. Silakan coba lagi nanti.",
          "error"
        );
      } else {
        showAlert(
          error.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan perubahan?")) {
      router.back();
    }
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getFieldError = (field: string): string => {
    return errors[field] ? errors[field][0] : "";
  };

  const showAlert = (message: string, type: "success" | "error") => {
    // You can replace this with a proper toast/notification system
    if (type === "success") {
      alert(`✅ ${message}`);
    } else {
      alert(`❌ ${message}`);
    }
  };

  if (isLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBreadcrumb
        pageTitle={
          isEdit
            ? "Edit Data Profil Perusahaan"
            : "Lengkapi Data Profil Perusahaan"
        }
      />

      <div className="space-y-6">
        <ComponentCard
          title={
            isEdit
              ? "Edit Data Profil Perusahaan"
              : "Lengkapi Data Profil Perusahaan"
          }
          desc="Isi informasi lengkap tentang perusahaan Anda"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Building
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
                Informasi Dasar Perusahaan
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Logo */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Logo Perusahaan{" "}
                    {!isEdit && !userData?.avatar && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-24 h-24 rounded-xl object-cover border-2 border-gray-300 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <Building size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        <Upload size={16} />
                        {logoPreview ? "Ganti Logo" : "Upload Logo"}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Maksimal 2MB, format: JPG, PNG, GIF
                        {userData?.avatar &&
                          " (Opsional - akan menggunakan avatar user jika kosong)"}
                      </p>
                      {getFieldError("logo") && (
                        <p className="text-xs text-red-500 mt-1">
                          {getFieldError("logo")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama_perusahaan}
                    onChange={(e) =>
                      handleInputChange("nama_perusahaan", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      getFieldError("nama_perusahaan")
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="PT Teknologi Maju Indonesia"
                  />
                  {getFieldError("nama_perusahaan") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("nama_perusahaan")}
                    </p>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industri" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Industri <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="industri"
                    required
                    value={formData.industri}
                    onChange={(e) =>
                      handleInputChange("industri", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      getFieldError("industri")
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Pilih Industri</option>
                    <option value="Teknologi Informasi">
                      Teknologi Informasi
                    </option>
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Manufaktur">Manufaktur</option>
                    <option value="Perdagangan">Perdagangan</option>
                    <option value="Jasa">Jasa</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  {getFieldError("industri") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("industri")}
                    </p>
                  )}
                </div>

                {/* Founded Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Tahun Berdiri
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.tahun_berdiri}
                    onChange={(e) =>
                      handleInputChange("tahun_berdiri", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="2015"
                  />
                </div>

                {/* Employee Count */}
                <div>
                  <label htmlFor="jumlah_karyawan" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Jumlah Karyawan
                  </label>
                  <select
                    id="jumlah_karyawan"
                    value={formData.jumlah_karyawan}
                    onChange={(e) =>
                      handleInputChange("jumlah_karyawan", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Pilih Jumlah Karyawan</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-200">101-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>

                {/* Province */}
                <div>
                  <label htmlFor="province_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Provinsi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="province_id"
                    required
                    value={formData.province_id}
                    onChange={(e) =>
                      handleInputChange("province_id", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      getFieldError("province_id")
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {getFieldError("province_id") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("province_id")}
                    </p>
                  )}
                </div>

                {/* Regency */}
                <div>
                  <label htmlFor="regencie_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Kota / Kabupaten <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="regencie_id"
                    required
                    value={formData.regencie_id}
                    onChange={(e) =>
                      handleInputChange("regencie_id", e.target.value)
                    }
                    disabled={!formData.province_id}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      getFieldError("regencie_id")
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } ${
                      !formData.province_id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value="">Pilih Kota/Kabupaten</option>
                    {regencies.map((regency) => (
                      <option key={regency.id} value={regency.id}>
                        {regency.name}
                      </option>
                    ))}
                  </select>
                  {getFieldError("regencie_id") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("regencie_id")}
                    </p>
                  )}
                </div>

                {/* NIB */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    NIB (Nomor Induk Berusaha){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nib}
                    onChange={(e) => handleInputChange("nib", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      getFieldError("nib")
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="1234567890123"
                  />
                  {getFieldError("nib") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("nib")}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Deskripsi Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.deskripsi}
                    onChange={(e) =>
                      handleInputChange("deskripsi", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      getFieldError("deskripsi")
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Deskripsikan perusahaan Anda..."
                  />
                  {getFieldError("deskripsi") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("deskripsi")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Phone
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
                Informasi Kontak
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Telepon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      required
                      type="tel"
                      value={formData.no_telp}
                      onChange={(e) =>
                        handleInputChange("no_telp", e.target.value)
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+62 21 1234 5678"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="url"
                      value={formData.link_website}
                      onChange={(e) =>
                        handleInputChange("link_website", e.target.value)
                      }
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        getFieldError("link_website")
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="https://www.perusahaan.com"
                    />
                  </div>
                  {getFieldError("link_website") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("link_website")}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={20}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <textarea
                      required
                      rows={3}
                      value={formData.alamat_lengkap}
                      onChange={(e) =>
                        handleInputChange("alamat_lengkap", e.target.value)
                      }
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        getFieldError("alamat_lengkap")
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220"
                    />
                  </div>
                  {getFieldError("alamat_lengkap") && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError("alamat_lengkap")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bukti Wajib Lapor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText
                  size={20}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                 Berkas Legalitas Perusahaan
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    {buktiPreview ? (
                      <div className="w-24 h-24 rounded-xl border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
                        {buktiPreview.includes("data:application/pdf") ? (
                          <div className="w-full h-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <FileText size={24} className="text-red-600" />
                          </div>
                        ) : (
                          <img
                            src={buktiPreview}
                            alt="Bukti Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <FileText size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="bukti"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleBuktiUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="bukti"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload size={16} />
                      {buktiPreview ? "Ganti Berkas" : "Upload Berkas"}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Maksimal 5MB, format: JPG, PNG, PDF, DOC, DOCX
                    </p>
                    {getFieldError("bukti_wajib_lapor") && (
                      <p className="text-xs text-red-500 mt-1">
                        {getFieldError("bukti_wajib_lapor")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vision */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Eye
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                  Visi Perusahaan
                </h3>
                <textarea
                  required
                  rows={5}
                  value={formData.visi}
                  onChange={(e) => handleInputChange("visi", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    getFieldError("visi")
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Tuliskan visi perusahaan..."
                />
                {getFieldError("visi") && (
                  <p className="text-xs text-red-500 mt-1">
                    {getFieldError("visi")}
                  </p>
                )}
              </div>

              {/* Mission */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Target
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                  Misi Perusahaan
                </h3>
                <textarea
                  required
                  rows={5}
                  value={formData.misi}
                  onChange={(e) => handleInputChange("misi", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    getFieldError("misi")
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Tuliskan misi perusahaan..."
                />
                {getFieldError("misi") && (
                  <p className="text-xs text-red-500 mt-1">
                    {getFieldError("misi")}
                  </p>
                )}
              </div>
            </div>

            {/* Add Values/Achievements/Social Media Buttons - Show only if sections are hidden */}
            {!formData.nilai_nilai.some((value) => value.trim() !== "") &&
              !formData.sertifikat.some(
                (achievement) => achievement.trim() !== ""
              ) &&
              !showSocialMedia &&
              !isEdit && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Plus
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    Tambahan (Opsional)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          nilai_nilai: prev.nilai_nilai.every(
                            (v) => v.trim() === ""
                          )
                            ? [""]
                            : prev.nilai_nilai,
                        }));
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg transition-colors border border-orange-200 dark:border-orange-800"
                    >
                      <Award size={16} />
                      Tambah Nilai-Nilai Perusahaan
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          sertifikat: prev.sertifikat.every(
                            (s) => s.trim() === ""
                          )
                            ? [""]
                            : prev.sertifikat,
                        }));
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg transition-colors border border-yellow-200 dark:border-yellow-800"
                    >
                      <Award size={16} />
                      Tambah Sertifikat & Pencapaian
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSocialMedia(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      <Share2 size={16} />
                      Tambah Media Sosial
                    </button>
                  </div>
                </div>
              )}

            {/* Company Values - Show only if has values or being edited */}
            {(formData.nilai_nilai.some((value) => value.trim() !== "") ||
              isEdit ||
              formData.nilai_nilai.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award
                      size={20}
                      className="text-orange-600 dark:text-orange-400"
                    />
                    Nilai-Nilai Perusahaan
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      (Opsional)
                    </span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addArrayItem("nilai_nilai")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                      Tambah Nilai
                    </button>
                    {!isEdit &&
                      formData.nilai_nilai.every((v) => v.trim() === "") && (
                        <button
                          type="button"
                          onClick={() => hideSection("nilai_nilai")}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Sembunyikan section"
                        >
                          <X size={16} />
                        </button>
                      )}
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.nilai_nilai.map((value, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleArrayChange(
                            "nilai_nilai",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={`Nilai ${index + 1}`}
                      />
                      {formData.nilai_nilai.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem("nilai_nilai", index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements - Show only if has achievements or being edited */}
            {(formData.sertifikat.some(
              (achievement) => achievement.trim() !== ""
            ) ||
              isEdit ||
              formData.sertifikat.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award
                      size={20}
                      className="text-yellow-600 dark:text-yellow-400"
                    />
                    Sertifikat & Pencapaian
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      (Opsional)
                    </span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addArrayItem("sertifikat")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                      Tambah Sertifikat
                    </button>
                    {!isEdit &&
                      formData.sertifikat.every((s) => s.trim() === "") && (
                        <button
                          type="button"
                          onClick={() => hideSection("sertifikat")}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Sembunyikan section"
                        >
                          <X size={16} />
                        </button>
                      )}
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.sertifikat.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) =>
                          handleArrayChange("sertifikat", index, e.target.value)
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={`Sertifikat/Pencapaian ${index + 1}`}
                      />
                      {formData.sertifikat.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem("sertifikat", index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Section - Show only if enabled or has data */}
            {(showSocialMedia || isEdit) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Share2
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    Media Sosial
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      (Opsional)
                    </span>
                  </h3>
                  {!isEdit &&
                    !formData.linkedin?.trim() &&
                    !formData.instagram?.trim() &&
                    !formData.facebook?.trim() &&
                    !formData.twitter?.trim() &&
                    !formData.youtube?.trim() &&
                    !formData.tiktok?.trim() && (
                      <button
                        type="button"
                        onClick={() => setShowSocialMedia(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Sembunyikan section"
                      >
                        <X size={16} />
                      </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-[#0077B5]"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) =>
                          handleInputChange("linkedin", e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://linkedin.com/company/perusahaan"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Instagram
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-[#E4405F]"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={formData.instagram}
                        onChange={(e) =>
                          handleInputChange("instagram", e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://instagram.com/perusahaan"
                      />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Facebook
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-[#1877F2]"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={formData.facebook}
                        onChange={(e) =>
                          handleInputChange("facebook", e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://facebook.com/perusahaan"
                      />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Twitter/X
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-gray-900 dark:text-white"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) =>
                          handleInputChange("twitter", e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://twitter.com/perusahaan"
                      />
                    </div>
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      YouTube
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-[#FF0000]"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={formData.youtube}
                        onChange={(e) =>
                          handleInputChange("youtube", e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://youtube.com/@perusahaan"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      TikTok
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-gray-900 dark:text-white"
                        >
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={formData.tiktok}
                        onChange={(e) =>
                          handleInputChange("tiktok", e.target.value)
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://tiktok.com/@perusahaan"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEdit ? "Update Data" : "Simpan Data"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors min-w-[160px]"
              >
                <X size={18} />
                Batal
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
