"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import {
  Search,
  Edit,
  Trash2,
  User,
  Users,
  Mail,
  Phone,
  X,
  Save,
  Loader2,
  MapPin,
  Eye,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  UserLock,
  Image as ImageIcon,
  Briefcase,
  ExternalLink,
  Clock,
  GraduationCap,
  Award,
  FileText,
  Languages,
  Target,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import ManagementCompanySkeleton from "@/skeleton/ManagementCompanySkeleton";

// Base URL for images - adjust this according to your backend configuration
const BASE_IMAGE_URL = "http://localhost:8001/storage";

// Types and Interfaces for User Profile Management
interface UserApiResponse {
  id: number;
  nik: string;
  tanggal_lahir: string;
  jenis_kelamin: "L" | "P";
  no_telp: string;
  latar_belakang: string;
  status_kawin: number;
  user_id: number;
  disabilitas_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  lokasi: {
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
  };
  disabilitas: {
    id: number;
    kategori_disabilitas: string;
    tingkat_disabilitas: string;
    created_at: string;
    updated_at: string;
  };
  resume?: {
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
  };
}

interface User {
  id: number;
  nik: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "L" | "P";
  background: string;
  maritalStatus: number;
  avatar: string;
  ktpAddress: string;
  domicileAddress: string;
  ktpPostalCode: string;
  domicilePostalCode: string;
  provinceKtpId: string;
  regencyKtpId: string;
  districtKtpId: string;
  villageKtpId: string;
  provinceDomisiliId: string;
  regencyDomisiliId: string;
  districtDomisiliId: string;
  villageDomisiliId: string;
  disabilityCategory: string;
  disabilityLevel: string;
  createdAt: string;
  hasResume: boolean;
  educationLevel?: string;
  workExperience?: number;
  skills?: string[];
  languages?: string[];
}

const ManagementUserPage: React.FC = () => {
  useDocumentTitle("Manajemen Pengguna | JatimBissa Admin");
  // State declarations
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<UserApiResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterDisability, setFilterDisability] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered: User[] = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user: User) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.disabilityCategory
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filterGender !== "all") {
      filtered = filtered.filter((user: User) => user.gender === filterGender);
    }

    if (filterDisability !== "all") {
      filtered = filtered.filter(
        (user: User) => user.disabilityLevel === filterDisability
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterDisability, users]);

  // Transform API response to User interface
  const transformApiResponseToUser = (apiData: UserApiResponse[]): User[] => {
    return apiData.map((item) => ({
      id: item.id,
      nik: item.nik,
      name: item.user.name,
      email: item.user.email,
      phone: item.no_telp,
      birthDate: item.tanggal_lahir,
      gender: item.jenis_kelamin,
      background: item.latar_belakang,
      maritalStatus: item.status_kawin,
      avatar: item.user.avatar,
      ktpAddress: item.lokasi.alamat_lengkap_ktp,
      domicileAddress: item.lokasi.alamat_lengkap_domisili,
      ktpPostalCode: item.lokasi.kode_pos_ktp,
      domicilePostalCode: item.lokasi.kode_pos_domisili,
      provinceKtpId: item.lokasi.province_ktp_id,
      regencyKtpId: item.lokasi.regencie_ktp_id,
      districtKtpId: item.lokasi.district_ktp_id,
      villageKtpId: item.lokasi.village_ktp_id,
      provinceDomisiliId: item.lokasi.province_domisili_id,
      regencyDomisiliId: item.lokasi.regencie_domisili_id,
      districtDomisiliId: item.lokasi.district_domisili_id,
      villageDomisiliId: item.lokasi.village_domisili_id,
      disabilityCategory: item.disabilitas.kategori_disabilitas,
      disabilityLevel: item.disabilitas.tingkat_disabilitas,
      createdAt: new Date(item.created_at).toLocaleDateString("id-ID"),
      hasResume: !!item.resume,
      educationLevel: item.resume?.pendidikan?.[0]?.tingkat,
      workExperience: item.resume?.pengalaman_kerja?.length || 0,
      skills: item.resume?.keterampilan?.[0]?.nama_keterampilan || [],
      languages: item.resume?.bahasa?.map((b) => b.name) || [],
    }));
  };

  // Pagination calculations
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: User[] = filteredUsers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages: number = Math.ceil(filteredUsers.length / itemsPerPage);

  // Fetch users from API
  const fetchUsers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");
      const response = await apiBissaKerja.get(
        "account-management/get-user-profile-by-location"
      );

      console.log("Fetched Users:", response.data);

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        const transformedUsers = transformApiResponseToUser(response.data.data);
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } else if (response.data && Array.isArray(response.data.data)) {
        const transformedUsers = transformApiResponseToUser(response.data.data);
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } else if (response.data && Array.isArray(response.data)) {
        const transformedUsers = transformApiResponseToUser(response.data);
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } else {
        console.warn("Unexpected data format:", response.data);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      setError("Gagal mengambil data pengguna. Silakan coba lagi.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal handlers
  const openDeleteModal = (user: User): void => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openDetailModal = async (user: User): Promise<void> => {
    try {
      setIsLoadingDetail(true);
      setShowDetailModal(true);

      // Fetch detailed user data from API
      const response = await apiBissaKerja.get(
        `account-management/show-user-profile-by-location/${user.id}`
      );

      if (response.data && response.data.data) {
        setSelectedUserDetail(response.data.data);
      } else {
        // If specific endpoint doesn't exist, find from current users data
        const detailedUser = users.find((u) => u.id === user.id);
        if (detailedUser) {
          // Convert back to API format for consistency
          const apiFormat: UserApiResponse = {
            id: detailedUser.id,
            nik: detailedUser.nik,
            tanggal_lahir: detailedUser.birthDate,
            jenis_kelamin: detailedUser.gender,
            no_telp: detailedUser.phone,
            latar_belakang: detailedUser.background,
            status_kawin: detailedUser.maritalStatus,
            user_id: detailedUser.id,
            disabilitas_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            user: {
              id: detailedUser.id,
              name: detailedUser.name,
              email: detailedUser.email,
              avatar: detailedUser.avatar,
              remember_token: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted_at: null,
            },
            lokasi: {
              id: 1,
              kode_pos_ktp: detailedUser.ktpPostalCode,
              alamat_lengkap_ktp: detailedUser.ktpAddress,
              province_ktp_id: detailedUser.provinceKtpId,
              regencie_ktp_id: detailedUser.regencyKtpId,
              district_ktp_id: detailedUser.districtKtpId,
              village_ktp_id: detailedUser.villageKtpId,
              kode_pos_domisili: detailedUser.domicilePostalCode,
              alamat_lengkap_domisili: detailedUser.domicileAddress,
              province_domisili_id: detailedUser.provinceDomisiliId,
              regencie_domisili_id: detailedUser.regencyDomisiliId,
              district_domisili_id: detailedUser.districtDomisiliId,
              village_domisili_id: detailedUser.villageDomisiliId,
              user_profile_id: detailedUser.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted_at: null,
            },
            disabilitas: {
              id: 1,
              kategori_disabilitas: detailedUser.disabilityCategory,
              tingkat_disabilitas: detailedUser.disabilityLevel,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          };
          setSelectedUserDetail(apiFormat);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setError("Gagal mengambil detail pengguna");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeModals = (): void => {
    setShowDeleteModal(false);
    setShowDetailModal(false);
    setSelectedUser(null);
    setSelectedUserDetail(null);
    setError("");
  };

  // Delete operation
  const handleDelete = async (): Promise<void> => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);

      await apiBissaKerja.delete(
        `account-management/user-profile-by-location/${selectedUser.id}`
      );

      await fetchUsers();
      closeModals();
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Gagal menghapus pengguna. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const getGenderBadge = (gender: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (gender) {
      case "L":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case "P":
        return `${baseClasses} bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

  const getDisabilityBadge = (level: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (level) {
      case "Ringan":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "Sedang":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case "Berat":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

  const getGenderLabel = (gender: string): string => {
    switch (gender) {
      case "L":
        return "Laki-laki";
      case "P":
        return "Perempuan";
      default:
        return "Tidak Diketahui";
    }
  };

  const getMaritalStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return "Belum Menikah";
      case 1:
        return "Menikah";
      case 2:
        return "Cerai";
      default:
        return "Tidak Diketahui";
    }
  };

  const getJobTypeLabel = (type: string): string => {
    switch (type) {
      case "full_time":
        return "Full Time";
      case "part_time":
        return "Part Time";
      case "contract":
        return "Kontrak";
      case "freelance":
        return "Freelance";
      default:
        return type;
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_IMAGE_URL}/${imagePath}`;
  };

  // Statistics calculations
  const totalUsers: number = users.length;
  const maleUsers: number = users.filter(
    (user: User) => user.gender === "L"
  ).length;
  const femaleUsers: number = users.filter(
    (user: User) => user.gender === "P"
  ).length;
  const marriedUsers: number = users.filter(
    (user: User) => user.maritalStatus === 1
  ).length;
  const usersWithResume: number = users.filter(
    (user: User) => user.hasResume
  ).length;
  const ringanDisability: number = users.filter(
    (user: User) => user.disabilityLevel === "Ringan"
  ).length;
  const sedangDisability: number = users.filter(
    (user: User) => user.disabilityLevel === "Sedang"
  ).length;
  const beratDisability: number = users.filter(
    (user: User) => user.disabilityLevel === "Berat"
  ).length;

  // Loading state
  if (isLoading) {
    return <ManagementCompanySkeleton />;
  }

  // Error state (for fetch errors, not form errors)
  if (error && !showDeleteModal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageBreadcrumb pageTitle="Manajemen Profil Pengguna" />
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Manajemen Profil Pengguna" />

      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Manajemen Profil Pengguna
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
              Kelola profil pengguna yang terdaftar dalam sistem
            </p>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari nama, email, NIK, atau kategori disabilitas..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="w-full lg:w-auto">
              <select
                value={filterGender}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterGender(e.target.value)
                }
                aria-label="Filter jenis kelamin"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Semua Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Disability Filter */}
            <div className="w-full lg:w-auto">
              <select
                value={filterDisability}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterDisability(e.target.value)
                }
                aria-label="Filter tingkat disabilitas"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Semua Tingkat Disabilitas</option>
                <option value="Ringan">Ringan</option>
                <option value="Sedang">Sedang</option>
                <option value="Berat">Berat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Pengguna
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Laki-laki
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {maleUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Perempuan
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {femaleUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Memiliki Resume
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {usersWithResume}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disability Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Disabilitas Ringan
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {ringanDisability}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Disabilitas Sedang
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {sedangDisability}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Disabilitas Berat
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {beratDisability}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-4">
              {currentItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada data pengguna yang ditemukan
                  </p>
                </div>
              ) : (
                currentItems.map((user: User) => (
                  <div
                    key={user.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={getImageUrl(user.avatar)}
                              alt={`Avatar ${user.name}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                if (target.nextElementSibling) {
                                  (
                                    target.nextElementSibling as HTMLElement
                                  ).style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center ${
                              user.avatar ? "hidden" : "flex"
                            }`}
                          >
                            <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={getGenderBadge(user.gender)}>
                              {getGenderLabel(user.gender)}
                            </span>
                            <span
                              className={getDisabilityBadge(
                                user.disabilityLevel
                              )}
                            >
                              {user.disabilityLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDetailModal(user)}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          type="button"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.phone}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        NIK: {user.nik}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(user.birthDate).toLocaleDateString("id-ID")}
                      </div>
                      <div>
                        <strong>Disabilitas:</strong> {user.disabilityCategory}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        {getMaritalStatusLabel(user.maritalStatus)}
                      </div>
                      {user.hasResume && (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <FileText className="w-4 h-4 mr-2" />
                          Memiliki Resume
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Info Personal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Disabilitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bergabung
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Tidak ada data pengguna yang ditemukan
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((user: User) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {user.avatar ? (
                              <img
                                src={getImageUrl(user.avatar)}
                                alt={`Avatar ${user.name}`}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  if (target.nextElementSibling) {
                                    (
                                      target.nextElementSibling as HTMLElement
                                    ).style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center ${
                                user.avatar ? "hidden" : "flex"
                              }`}
                            >
                              <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              NIK: {user.nik}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={getGenderBadge(user.gender)}>
                            {getGenderLabel(user.gender)}
                          </span>
                          <br />
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(user.birthDate).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          <div>{user.email}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.disabilityCategory}
                          </div>
                          <span
                            className={getDisabilityBadge(user.disabilityLevel)}
                          >
                            {user.disabilityLevel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.hasResume ? (
                          <div className="space-y-1">
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <FileText className="w-4 h-4 mr-1" />
                              Ada
                            </div>
                            {user.educationLevel && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {user.educationLevel}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            Belum ada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openDetailModal(user)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            type="button"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            type="button"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Menampilkan {indexOfFirstItem + 1} sampai{" "}
                  {Math.min(indexOfLastItem, filteredUsers.length)} dari{" "}
                  {filteredUsers.length} data
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                    type="button"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedUserDetail && (
          <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-99999 p-4">
            <div className="bg-white shadow-2xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {selectedUserDetail.user.avatar ? (
                      <img
                        src={getImageUrl(selectedUserDetail.user.avatar)}
                        alt={`Avatar ${selectedUserDetail.user.name}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.nextElementSibling) {
                            (
                              target.nextElementSibling as HTMLElement
                            ).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center ${
                        selectedUserDetail.user.avatar ? "hidden" : "flex"
                      }`}
                    >
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Detail Profil Pengguna
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Informasi lengkap profil pengguna
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  type="button"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Loading state for detail */}
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Memuat detail pengguna...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* User Header */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      {selectedUserDetail.user.avatar ? (
                        <img
                          src={getImageUrl(selectedUserDetail.user.avatar)}
                          alt={`Avatar ${selectedUserDetail.user.name}`}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            if (target.nextElementSibling) {
                              (
                                target.nextElementSibling as HTMLElement
                              ).style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center ${
                          selectedUserDetail.user.avatar ? "hidden" : "flex"
                        }`}
                      >
                        <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedUserDetail.user.name}
                      </h2>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span
                          className={getGenderBadge(
                            selectedUserDetail.jenis_kelamin
                          )}
                        >
                          {getGenderLabel(selectedUserDetail.jenis_kelamin)}
                        </span>
                        <span
                          className={getDisabilityBadge(
                            selectedUserDetail.disabilitas.tingkat_disabilitas
                          )}
                        >
                          {selectedUserDetail.disabilitas.tingkat_disabilitas}
                        </span>
                        {selectedUserDetail.resume && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                            Memiliki Resume
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        <p className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4" />
                          {selectedUserDetail.user.email}
                        </p>
                        <p className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4" />
                          {selectedUserDetail.no_telp}
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          NIK: {selectedUserDetail.nik}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informasi Personal
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Tanggal Lahir:
                            </span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(
                                selectedUserDetail.tanggal_lahir
                              ).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Status Pernikahan:
                            </span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {getMaritalStatusLabel(
                                selectedUserDetail.status_kawin
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Latar Belakang:
                            </span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedUserDetail.latar_belakang ||
                                "Tidak ada informasi"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Disability Information */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Informasi Disabilitas
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Kategori:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {
                              selectedUserDetail.disabilitas
                                .kategori_disabilitas
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Tingkat:
                          </span>
                          <span
                            className={
                              getDisabilityBadge(
                                selectedUserDetail.disabilitas
                                  .tingkat_disabilitas
                              ) + " ml-2"
                            }
                          >
                            {selectedUserDetail.disabilitas.tingkat_disabilitas}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address KTP */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Alamat KTP
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Alamat Lengkap:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedUserDetail.lokasi.alamat_lengkap_ktp}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Kode Pos:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedUserDetail.lokasi.kode_pos_ktp}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Domisili */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Alamat Domisili
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Alamat Lengkap:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedUserDetail.lokasi.alamat_lengkap_domisili}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Kode Pos:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedUserDetail.lokasi.kode_pos_domisili}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume Information */}
                  {selectedUserDetail.resume && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <FileText className="w-6 h-6" />
                          Resume & Profil Profesional
                        </h3>

                        {/* Personal Summary */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Ringkasan Pribadi
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {selectedUserDetail.resume.ringkasan_pribadi}
                          </p>
                        </div>

                        {/* Skills */}
                        {selectedUserDetail.resume.keterampilan &&
                          selectedUserDetail.resume.keterampilan.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Keterampilan
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedUserDetail.resume.keterampilan[0].nama_keterampilan.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Languages */}
                        {selectedUserDetail.resume.bahasa &&
                          selectedUserDetail.resume.bahasa.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Languages className="w-5 h-5" />
                                Bahasa
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedUserDetail.resume.bahasa.map(
                                  (bahasa) => (
                                    <div
                                      key={bahasa.id}
                                      className="bg-white dark:bg-gray-600 rounded-lg p-3"
                                    >
                                      <div className="font-medium text-gray-900 dark:text-white">
                                        {bahasa.name}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Tingkat: {bahasa.tingkat}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Education */}
                        {selectedUserDetail.resume.pendidikan &&
                          selectedUserDetail.resume.pendidikan.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                Pendidikan
                              </h4>
                              <div className="space-y-4">
                                {selectedUserDetail.resume.pendidikan.map(
                                  (pendidikan) => (
                                    <div
                                      key={pendidikan.id}
                                      className="bg-white dark:bg-gray-600 rounded-lg p-4"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h5 className="font-medium text-gray-900 dark:text-white">
                                            {pendidikan.tingkat}
                                          </h5>
                                          <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {pendidikan.bidang_studi}
                                          </p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                                          Nilai: {pendidikan.nilai}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {new Date(
                                          pendidikan.tanggal_mulai
                                        ).toLocaleDateString("id-ID")}{" "}
                                        -{" "}
                                        {new Date(
                                          pendidikan.tanggal_akhir
                                        ).toLocaleDateString("id-ID")}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        📍 {pendidikan.lokasi}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {pendidikan.deskripsi}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Work Experience */}
                        {selectedUserDetail.resume.pengalaman_kerja &&
                          selectedUserDetail.resume.pengalaman_kerja.length >
                            0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Pengalaman Kerja
                              </h4>
                              <div className="space-y-4">
                                {selectedUserDetail.resume.pengalaman_kerja.map(
                                  (kerja) => (
                                    <div
                                      key={kerja.id}
                                      className="bg-white dark:bg-gray-600 rounded-lg p-4"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h5 className="font-medium text-gray-900 dark:text-white">
                                            {kerja.name}
                                          </h5>
                                          <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {kerja.nama_perusahaan}
                                          </p>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                                          {getJobTypeLabel(
                                            kerja.tipe_pekerjaan
                                          )}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {new Date(
                                          kerja.tanggal_mulai
                                        ).toLocaleDateString("id-ID")}{" "}
                                        -{" "}
                                        {new Date(
                                          kerja.tanggal_akhir
                                        ).toLocaleDateString("id-ID")}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        📍 {kerja.lokasi}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {kerja.deskripsi}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Certifications */}
                        {selectedUserDetail.resume.sertifikasi &&
                          selectedUserDetail.resume.sertifikasi.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Sertifikasi
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedUserDetail.resume.sertifikasi.map(
                                  (sertifikat) => (
                                    <div
                                      key={sertifikat.id}
                                      className="bg-white dark:bg-gray-600 rounded-lg p-4"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h5 className="font-medium text-gray-900 dark:text-white">
                                            {sertifikat.program}
                                          </h5>
                                          <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {sertifikat.lembaga}
                                          </p>
                                        </div>
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                                          {sertifikat.nilai}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {new Date(
                                          sertifikat.tanggal_mulai
                                        ).toLocaleDateString("id-ID")}{" "}
                                        -{" "}
                                        {new Date(
                                          sertifikat.tanggal_akhir
                                        ).toLocaleDateString("id-ID")}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {sertifikat.deskripsi}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Training */}
                        {selectedUserDetail.resume.pelatihan &&
                          selectedUserDetail.resume.pelatihan.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                Pelatihan
                              </h4>
                              <div className="space-y-4">
                                {selectedUserDetail.resume.pelatihan.map(
                                  (pelatihan) => (
                                    <div
                                      key={pelatihan.id}
                                      className="bg-white dark:bg-gray-600 rounded-lg p-4"
                                    >
                                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                        {pelatihan.name}
                                      </h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                        Penyelenggara: {pelatihan.penyelenggara}
                                      </p>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {new Date(
                                          pelatihan.tanggal_mulai
                                        ).toLocaleDateString("id-ID")}{" "}
                                        -{" "}
                                        {new Date(
                                          pelatihan.tanggal_akhir
                                        ).toLocaleDateString("id-ID")}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {pelatihan.deskripsi}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Achievements */}
                        {selectedUserDetail.resume.pencapaian &&
                          selectedUserDetail.resume.pencapaian.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Pencapaian
                              </h4>
                              <div className="space-y-4">
                                {selectedUserDetail.resume.pencapaian.map(
                                  (pencapaian) => (
                                    <div
                                      key={pencapaian.id}
                                      className="bg-white dark:bg-gray-600 rounded-lg p-4"
                                    >
                                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                        {pencapaian.name}
                                      </h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                        Penyelenggara:{" "}
                                        {pencapaian.penyelenggara}
                                      </p>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(
                                          pencapaian.tanggal_pencapaian
                                        ).toLocaleDateString("id-ID")}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* System Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Informasi Sistem
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Tanggal Dibuat:
                        </span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            selectedUserDetail.created_at
                          ).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Terakhir Diperbarui:
                        </span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            selectedUserDetail.updated_at
                          ).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-end">
                  <button
                    onClick={closeModals}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    type="button"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white shadow-2xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hapus Profil Pengguna
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded text-sm">
                  {error}
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Apakah Anda yakin ingin menghapus profil{" "}
                <strong>{selectedUser.name}</strong>? Semua data terkait akan
                hilang secara permanen.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  type="button"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  type="button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementUserPage;
