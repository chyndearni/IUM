"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import api from "@/lib/axios";
import ProfileInformationSkeleton from "@/skeleton/ProfileInformationSkeleton";

type DisabilitasItem = {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  user_profile: {
    nik: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    no_telp: string;
    latar_belakang: string;
    status_kawin: number;
    disabilitas_id?: number;
    user_id?: number;
    disabilitas: {
      id: string;
      kategori_disabilitas: string;
      tingkat_disabilitas: string;
    };
  };
};

type FormData = {
  nik: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  no_telp: string;
  latar_belakang: string;
  status_kawin: number;
  disabilitas_id: number | string;
};

export default function UserProfileCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [disabilitasList, setDisabilitasList] = useState<DisabilitasItem[]>([]);
  const [isUserProfile, setIsUserProfile] = useState<string | undefined>();

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    user_profile: {
      nik: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      no_telp: "",
      latar_belakang: "",
      status_kawin: 1,
      disabilitas: {
        id: "",
        kategori_disabilitas: "",
        tingkat_disabilitas: "",
      },
    },
  });

  const [formData, setFormData] = useState<FormData>({
    nik: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    no_telp: "",
    latar_belakang: "",
    status_kawin: 1,
    disabilitas_id: "",
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    // Fixed: Cookies.get() returns string | undefined, not an object with .value
    const userProfileCookie = Cookies.get("userProfile");
    setIsUserProfile(userProfileCookie);
    initializeData();
  }, []);

  const initializeData = async () => {
    setIsInitialLoading(true);
    setError("");
    // console.log("🚀 Initializing data...");

    try {
      await Promise.all([fetchUserProfile(), fetchDisabilitas()]);
      // console.log("✅ Data initialization completed successfully");
    } catch (error) {
      console.error("❌ Error initializing data:", error);
      setError("Gagal memuat data profil. Silakan refresh halaman.");
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      // console.log("📡 Fetching user profile...");
      const userData = await apiBissaKerja.get("user");

      // Check if userData has the expected structure
      const userId = userData?.data?.user?.id;
      if (!userId) {
        throw new Error("User ID tidak ditemukan");
      }

      const response = await apiBissaKerja.get(`/user/${userId}`);

      const profileData = response.data.data;
      // console.log("📨 Profile Data received:", profileData);

      setUserProfile(profileData);

      // Set form data dengan data dari user_profile
      const newFormData: FormData = {
        nik: profileData.user_profile?.nik || "",
        tanggal_lahir: profileData.user_profile?.tanggal_lahir || "",
        jenis_kelamin: profileData.user_profile?.jenis_kelamin || "",
        no_telp: profileData.user_profile?.no_telp || "",
        latar_belakang: profileData.user_profile?.latar_belakang || "",
        status_kawin: profileData.user_profile?.status_kawin || 1,
        disabilitas_id: profileData.user_profile?.disabilitas_id || "",
      };

      // console.log("📝 Setting form data:", newFormData);
      setFormData(newFormData);
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      throw new Error("Gagal memuat profil pengguna");
    }
  };

  const fetchDisabilitas = async () => {
    try {
      // console.log("📡 Fetching disabilities data...");
      const disabilitas = await apiBissaKerja.get("disability");
      // console.log("📨 Disabilities Data received:", disabilitas.data.data);
      setDisabilitasList(disabilitas.data.data);
    } catch (error) {
      console.error("❌ Error fetching disabilities:", error);
      throw new Error("Gagal memuat data disabilitas");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    console.log(
      `📝 Input changed - ${name}:`,
      value,
      `(type: ${typeof value})`
    );

    setFormData((prev) => {
      const newValue = ["disabilitas_id", "status_kawin"].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value;

      const updatedData = {
        ...prev,
        [name]: newValue,
      };

      // console.log(`🔄 Updated form data for ${name}:`, updatedData);

      // Khusus untuk disabilitas_id, tampilkan info detail
      if (name === "disabilitas_id" && value !== "") {
        const selectedDisability = disabilitasList.find(
          (d) => d.id === Number(value)
        );
        // console.log("🔍 Selected disability details:", selectedDisability);
      }

      return updatedData;
    });
  };

  const updateUserProfileAfterSave = (savedFormData: FormData) => {
    // console.log("🔄 Updating user profile after successful save...");

    // Cari data disabilitas yang sesuai
    const selectedDisabilitasId = Number(savedFormData.disabilitas_id);
    const updatedDisabilitas = disabilitasList.find(
      (d) => d.id === selectedDisabilitasId
    );

    // console.log("🔍 Looking for disability with ID:", selectedDisabilitasId);
    // console.log("🔍 Found disability:", updatedDisabilitas);

    const updatedProfile: UserProfile = {
      ...userProfile,
      user_profile: {
        ...userProfile.user_profile,
        ...savedFormData,
        disabilitas_id: selectedDisabilitasId,
        disabilitas: updatedDisabilitas
          ? {
              id: String(updatedDisabilitas.id),
              kategori_disabilitas: updatedDisabilitas.kategori_disabilitas,
              tingkat_disabilitas: updatedDisabilitas.tingkat_disabilitas,
            }
          : {
              id: "",
              kategori_disabilitas: "",
              tingkat_disabilitas: "",
            },
      },
    };

    console.log("🔄 Updated profile data:", updatedProfile);
    console.log(
      "🔄 New disability data:",
      updatedProfile.user_profile.disabilitas
    );
    setUserProfile(updatedProfile);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    // console.log("💾 Starting save process...");
    // console.log("📤 Data to be submitted:", formData);

    try {
      await apiBissaKerja.put("user/update", formData);
      // console.log("✅ API call successful");

      // Update local state dengan data baru
      updateUserProfileAfterSave(formData);

      closeModal();
      // console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setError("Gagal memperbarui profil. Silakan coba lagi.");
      alert("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
      console.log("🏁 Save process completed");
    }
  };

  const handleRetry = () => {
    // console.log("🔄 Retrying data initialization...");
    initializeData();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return "-";
    }
  };

  const getJenisKelaminText = (value: string) => {
    const result =
      value === "L" ? "Laki-laki" : value === "P" ? "Perempuan" : "-";
    return result;
  };

  const getStatusKawinText = (value: any) => {
    const result = value === 2 ? "Kawin" : "Belum Kawin";
    return result;
  };

  // Loading state untuk initial load
  if (isInitialLoading) {
    return <ProfileInformationSkeleton />;
  }

  // Error state
  if (error && !isInitialLoading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/20">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Terjadi Kesalahan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              {error}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informasi Profil
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nama Lengkap
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile.name || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile.email || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                NIK
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile.user_profile?.nik || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tanggal Lahir
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(userProfile.user_profile?.tanggal_lahir)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Jenis Kelamin
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getJenisKelaminText(userProfile.user_profile?.jenis_kelamin)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                No. Telepon
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile.user_profile?.no_telp || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status Kawin
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getStatusKawinText(userProfile.user_profile?.status_kawin)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Jenis Disabilitas
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {(() => {
                  if (
                    userProfile.user_profile?.disabilitas?.kategori_disabilitas
                  ) {
                    return (
                      <>
                        <span className="bg-green-100 rounded-lg text-green-600 px-2 py-1">
                          {
                            userProfile.user_profile.disabilitas
                              .kategori_disabilitas
                          }
                        </span>
                        <span className="mx-2">-</span>
                        <span className="bg-red-100 rounded-lg text-red-600 px-2 py-1">
                          {
                            userProfile.user_profile.disabilitas
                              .tingkat_disabilitas
                          }
                        </span>
                      </>
                    );
                  } else {
                    return "-";
                  }
                })()}
              </p>
            </div>

            <div className="col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Latar Belakang
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile.user_profile?.latar_belakang || "-"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          disabled={isUserProfile !== "true"}
          className="flex w-full disabled:cursor-not-allowed disabled:text-red-500 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto disabled:hover:bg-white disabled:hover:text-red-500"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profil
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Perbarui informasi profil Anda.
            </p>
          </div>

          {/* Error message dalam modal */}
          {error && (
            <div className="mx-2 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-700 dark:text-red-400">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>NIK</Label>
                  <Input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIK"
                    disabled={isLoading}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Tanggal Lahir</Label>
                  <Input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Jenis Kelamin</Label>
                  <select
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>No. Telepon</Label>
                  <Input
                    type="text"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor telepon"
                    disabled={isLoading}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Status Kawin</Label>
                  <select
                    name="status_kawin"
                    value={formData.status_kawin}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value={1}>Belum Kawin</option>
                    <option value={2}>Kawin</option>
                  </select>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Disabilitas</Label>
                  <select
                    name="disabilitas_id"
                    value={formData.disabilitas_id}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Disabilitas</option>
                    {disabilitasList.map((disabilitas) => (
                      <option key={disabilitas.id} value={disabilitas.id}>
                        {disabilitas.kategori_disabilitas} -{" "}
                        {disabilitas.tingkat_disabilitas}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <Label>Latar Belakang</Label>
                  <textarea
                    name="latar_belakang"
                    value={formData.latar_belakang}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Masukkan latar belakang"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </div>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
