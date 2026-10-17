"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { User, Phone, Calendar, Users, FileText } from "lucide-react";
import apiBK from "@/lib/api-bissa-kerja";
import { useUser } from "@/context/UserContext";

// Interface untuk data disabilitas dari API
interface DisabilitasOption {
  id: number | string; // Support both number and string for BIGINT
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
}

interface DisabilitasResponse {
  status: boolean;
  message: string;
  data: DisabilitasOption[];
}

interface FormData {
  nik: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  no_telp: string;
  status_kawin: string;
  latar_belakang: string;
  disabilitas_id: string;
  user_id: string;
}

interface FormErrors {
  nik?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  no_telp?: string;
  status_kawin?: string;
  latar_belakang?: string;
  disabilitas_id?: string;
  general?: string;
}

const STORAGE_KEY = "user_profile_form_data";

const UserProfileForm = () => {
  const { user } = useUser();
  const [disabilitasOptions, setDisabilitasOptions] = useState<
    DisabilitasOption[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nik: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    no_telp: "",
    status_kawin: "",
    disabilitas_id: "",
    latar_belakang: "",
    user_id: "",
  });

  // Function to safely convert to string for BIGINT compatibility
  const safeBigIntToString = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  // Function to get user ID from user object with different possible property names
  const getUserId = (userObj: any): string => {
    if (!userObj) return "";

    // Try different possible property names for user ID
    const possibleIds = [
      userObj.id,
      userObj.user_id,
      userObj.userId,
      userObj.User?.id,
      userObj.profile?.id,
      userObj.data?.id,
    ];

    for (const id of possibleIds) {
      if (id !== undefined && id !== null) {
        return safeBigIntToString(id);
      }
    }

    console.warn("No user ID found in user object:", userObj);
    return "";
  };

  // Function to load data from localStorage
  const loadFromLocalStorage = (): FormData | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    return null;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  // Fetch disabilitas
  const fetchDataDisability = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiBK.get<DisabilitasResponse>("/disability");

      if (response.data.status && response.data.data) {
        setDisabilitasOptions(response.data.data);
      } else {
        setError("Gagal mengambil data disabilitas");
      }
    } catch (error: any) {
      console.error("Error fetching disability data:", error);
      setError("Terjadi kesalahan saat mengambil data disabilitas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataDisability();
  }, []);

  useEffect(() => {
    // Load data from localStorage first
    const savedData = loadFromLocalStorage();

    if (savedData) {
      // If there's saved data, use it and convert numbers back to strings for form inputs
      const formattedData = {
        ...savedData,
        status_kawin: String(savedData.status_kawin || ""),
        disabilitas_id: String(savedData.disabilitas_id || ""),
        user_id: String(savedData.user_id || ""),
      };
      setFormData(formattedData);
    }
  }, []);

  useEffect(() => {
    // Set user_id when user becomes available and there's no saved data
    const userId = getUserId(user);
    if (userId && !formData.user_id) {
      console.log("Setting user ID:", userId);
      setFormData((prev) => ({ ...prev, user_id: userId }));
    }
  }, [user, formData.user_id]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    console.log("Input change:", { name, value }); // Debug log

    const updatedData = {
      ...formData,
      [name]: value,
    };

    console.log("Updated form data:", updatedData); // Debug log

    setFormData(updatedData);

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear success message when user modifies form
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.nik.trim()) {
      newErrors.nik = "NIK wajib diisi";
    } else if (formData.nik.length !== 16) {
      newErrors.nik = "NIK harus 16 digit";
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus berupa angka 16 digit";
    }

    if (!formData.tanggal_lahir) {
      newErrors.tanggal_lahir = "Tanggal lahir wajib diisi";
    }

    if (!formData.jenis_kelamin) {
      newErrors.jenis_kelamin = "Jenis kelamin wajib dipilih";
    }

    if (!formData.no_telp.trim()) {
      newErrors.no_telp = "Nomor telepon wajib diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.no_telp)) {
      newErrors.no_telp = "Format nomor telepon tidak valid";
    }

    if (!formData.status_kawin) {
      newErrors.status_kawin = "Status perkawinan wajib dipilih";
    }

    if (!formData.disabilitas_id) {
      newErrors.disabilitas_id = "Status disabilitas wajib dipilih";
    }

    if (!formData.latar_belakang.trim()) {
      newErrors.latar_belakang = "Latar belakang wajib diisi";
    } else if (formData.latar_belakang.trim().length < 10) {
      newErrors.latar_belakang = "Latar belakang minimal 10 karakter";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage(null);
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if user_id is available
    if (!formData.user_id) {
      setErrors({ general: "User ID tidak ditemukan. Silakan login ulang." });
      return;
    }

    setSubmitLoading(true);

    try {
      // Prepare data for localStorage storage with proper type conversion
      const submitData = {
        nik: formData.nik.trim(),
        tanggal_lahir: formData.tanggal_lahir,
        jenis_kelamin: formData.jenis_kelamin,
        no_telp: formData.no_telp.trim(),
        status_kawin: Number(formData.status_kawin),
        latar_belakang: formData.latar_belakang.trim(),
        disabilitas_id: Number(formData.disabilitas_id),
        user_id: Number(formData.user_id),
      };

      console.log("Data to be saved:", submitData); // Debug log

      // Save to localStorage instead of API
      saveToLocalStorage(submitData);

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Data berhasil disimpan");

      // Don't reset form after successful save to keep data visible
      // resetForm();
    } catch (error: any) {
      console.error("Error saving to localStorage:", error);
      setErrors({
        general: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    const userId = getUserId(user);
    const resetData = {
      nik: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      no_telp: "",
      status_kawin: "",
      disabilitas_id: "", // Fixed: use consistent field name
      latar_belakang: "",
      user_id: userId,
    };

    setFormData(resetData);
    setErrors({});
    setSuccessMessage(null);

    // Clear localStorage when resetting
    clearLocalStorage();
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 border p-6 mb-8 rounded-2xl">
      <div className="w-full mx-auto">
        <header>
          <h1 className="text-gray-900 dark:text-white text-2xl mb-4">
            Data Diri
          </h1>
        </header>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            <p>Debug - User ID: {getUserId(user) || "Not found"}</p>
            <p>
              Debug - User object keys:{" "}
              {user ? Object.keys(user).join(", ") : "No user"}
            </p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid kolom 2 (atau 1 di mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NIK */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <User className="inline w-4 h-4 mr-2" />
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleInputChange}
                placeholder="Masukkan NIK (16 digit)"
                maxLength={16}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.nik
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              {errors.nik && (
                <p className="text-red-500 text-sm">{errors.nik}</p>
              )}
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <Calendar className="inline w-4 h-4 mr-2" />
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.tanggal_lahir
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              {errors.tanggal_lahir && (
                <p className="text-red-500 text-sm">{errors.tanggal_lahir}</p>
              )}
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <Users className="inline w-4 h-4 mr-2" />
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.jenis_kelamin
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              {errors.jenis_kelamin && (
                <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>
              )}
            </div>

            {/* No. Telepon */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <Phone className="inline w-4 h-4 mr-2" />
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleInputChange}
                placeholder="Masukkan nomor telepon (contoh: 08123456789)"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.no_telp
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              {errors.no_telp && (
                <p className="text-red-500 text-sm">{errors.no_telp}</p>
              )}
            </div>

            {/* Status Perkawinan */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Status Perkawinan <span className="text-red-500">*</span>
              </label>
              <select
                name="status_kawin"
                value={formData.status_kawin}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.status_kawin
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              >
                <option value="">Pilih Status Perkawinan</option>
                <option value="1">Belum Kawin</option>
                <option value="2">Sudah Kawin</option>
              </select>
              {errors.status_kawin && (
                <p className="text-red-500 text-sm">{errors.status_kawin}</p>
              )}
            </div>

            {/* Status Disabilitas - FIXED */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Status Disabilitas <span className="text-red-500">*</span>
              </label>
              <select
                name="disabilitas_id" // Fixed: consistent with FormData interface
                value={formData.disabilitas_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.disabilitas_id
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={loading || submitLoading}
              >
                <option value="">
                  {loading ? "Loading..." : "Pilih Status Disabilitas"}
                </option>
                {disabilitasOptions.map((option) => (
                  <option key={option.id} value={safeBigIntToString(option.id)}>
                    {option.kategori_disabilitas} - {option.tingkat_disabilitas}
                  </option>
                ))}
              </select>
              {errors.disabilitas_id && (
                <p className="text-red-500 text-sm">{errors.disabilitas_id}</p>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          {/* Latar Belakang */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              <FileText className="inline w-4 h-4 mr-2" />
              Latar Belakang <span className="text-red-500">*</span>
            </label>
            <textarea
              name="latar_belakang"
              value={formData.latar_belakang}
              onChange={handleInputChange}
              placeholder="Ceritakan latar belakang Anda (minimal 10 karakter)..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.latar_belakang
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
              disabled={submitLoading}
            />
            {errors.latar_belakang && (
              <p className="text-red-500 text-sm">{errors.latar_belakang}</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={submitLoading}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitLoading || loading}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-400 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
