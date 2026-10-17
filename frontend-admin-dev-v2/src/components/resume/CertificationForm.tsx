"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
  Shield,
  Building,
  Hash,
  Calendar,
  Upload,
  FileText,
} from "lucide-react";

interface FormData {
  program: string;
  lembaga: string;
  nilai: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  deskripsi: string;
  sertifikat_file: File | null;
  sertifikat_base64?: string | null;
  sertifikat_info?: { name: string; size: number; type: string } | null;
}

interface FormErrors {
  program?: string;
  lembaga?: string;
  nilai?: string;
  tanggal_mulai?: string;
  tanggal_akhir?: string;
  deskripsi?: string;
  sertifikat_file?: string;
  general?: string;
}

const STORAGE_KEY = "certification_form_data";

const CertificationForm = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    program: "",
    lembaga: "",
    nilai: "",
    tanggal_mulai: "",
    tanggal_akhir: "",
    deskripsi: "",
    sertifikat_file: null,
    sertifikat_base64: null,
    sertifikat_info: null,
  });

  // Function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to create file from base64
  const createFileFromBase64 = (
    base64: string,
    filename: string,
    type: string
  ): File => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type });
  };

  // Function to load data from localStorage
  const loadFromLocalStorage = (): any => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Certification data loaded from localStorage:", parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error(
        "Error loading certification data from localStorage:",
        error
      );
    }
    return null;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log("Certification data saved to localStorage:", data);
    } catch (error) {
      console.error("Error saving certification data to localStorage:", error);
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing certification localStorage:", error);
    }
  };

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = loadFromLocalStorage();

    if (savedData) {
      // Reconstruct file from base64 if exists
      let reconstructedFile = null;
      if (savedData.sertifikat_base64 && savedData.sertifikat_info) {
        try {
          reconstructedFile = createFileFromBase64(
            savedData.sertifikat_base64,
            savedData.sertifikat_info.name,
            savedData.sertifikat_info.type
          );
        } catch (error) {
          console.error("Error reconstructing file from base64:", error);
        }
      }

      // Set the form data with reconstructed file
      setFormData({
        ...savedData,
        sertifikat_file: reconstructedFile,
      });
    }
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file before processing
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          sertifikat_file:
            "Format file tidak didukung. Gunakan PDF, JPG, JPEG, PNG, DOC, atau DOCX",
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          sertifikat_file: "Ukuran file terlalu besar. Maksimal 5MB",
        }));
        return;
      }

      try {
        // Convert file to base64
        const base64 = await convertFileToBase64(file);

        const fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };

        setFormData((prev) => ({
          ...prev,
          sertifikat_file: file,
          sertifikat_base64: base64,
          sertifikat_info: fileInfo,
        }));

        // Clear file error when user uploads a valid file
        if (errors.sertifikat_file) {
          setErrors((prev) => ({
            ...prev,
            sertifikat_file: "",
          }));
        }
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setErrors((prev) => ({
          ...prev,
          sertifikat_file: "Gagal memproses file. Silakan coba lagi.",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        sertifikat_file: null,
        sertifikat_base64: null,
        sertifikat_info: null,
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

    if (!formData.program.trim()) {
      newErrors.program = "Program sertifikasi wajib diisi";
    }

    if (!formData.lembaga.trim()) {
      newErrors.lembaga = "Lembaga sertifikasi wajib diisi";
    }

    // Validate nilai (optional field, but if filled must be valid)
    if (formData.nilai.trim() && isNaN(parseFloat(formData.nilai))) {
      newErrors.nilai = "Nilai harus berupa angka yang valid";
    }

    if (!formData.tanggal_mulai) {
      newErrors.tanggal_mulai = "Tanggal mulai wajib diisi";
    }

    if (!formData.tanggal_akhir) {
      newErrors.tanggal_akhir = "Tanggal akhir wajib diisi";
    }

    // Validate date range
    if (formData.tanggal_mulai && formData.tanggal_akhir) {
      const startDate = new Date(formData.tanggal_mulai);
      const endDate = new Date(formData.tanggal_akhir);
      if (endDate < startDate) {
        newErrors.tanggal_akhir = "Tanggal akhir harus setelah tanggal mulai";
      }
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi sertifikasi wajib diisi";
    } else if (formData.deskripsi.trim().length < 10) {
      newErrors.deskripsi = "Deskripsi sertifikasi minimal 10 karakter";
    }

    if (!formData.sertifikat_file && !formData.sertifikat_base64) {
      newErrors.sertifikat_file = "File sertifikat wajib diupload";
    } else if (formData.sertifikat_file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(formData.sertifikat_file.type)) {
        newErrors.sertifikat_file =
          "Format file tidak didukung. Gunakan PDF, JPG, JPEG, PNG, DOC, atau DOCX";
      }
      // Validate file size (5MB)
      if (formData.sertifikat_file.size > 5 * 1024 * 1024) {
        newErrors.sertifikat_file = "Ukuran file terlalu besar. Maksimal 5MB";
      }
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

    setSubmitLoading(true);

    try {
      // Prepare data for localStorage storage (with base64 file)
      const submitData = {
        program: formData.program.trim(),
        lembaga: formData.lembaga.trim(),
        nilai: formData.nilai.trim() ? parseFloat(formData.nilai.trim()) : null, // Convert to number or null
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_akhir: formData.tanggal_akhir,
        deskripsi: formData.deskripsi.trim(),
        sertifikat_base64: formData.sertifikat_base64, // Store base64 string
        sertifikat_info: formData.sertifikat_info, // Store file info
      };

      // Save to localStorage
      saveToLocalStorage(submitData);

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Data sertifikasi berhasil disimpan");
    } catch (error: any) {
      console.error("Error saving certification data to localStorage:", error);
      setErrors({
        general: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    const resetData = {
      program: "",
      lembaga: "",
      nilai: "",
      tanggal_mulai: "",
      tanggal_akhir: "",
      deskripsi: "",
      sertifikat_file: null,
      sertifikat_base64: null,
      sertifikat_info: null,
    };

    setFormData(resetData);
    setErrors({});
    setSuccessMessage(null);

    // Clear localStorage when resetting
    clearLocalStorage();

    // Clear file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 border p-6 mb-8 rounded-2xl">
      <div className="w-full mx-auto">
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
          <div className="mb-8">
            <header>
              <h1 className="text-gray-900 dark:text-white text-2xl mb-4">
                Data Sertifikasi
              </h1>
            </header>

            {/* Grid 2 kolom untuk input utama */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Program Sertifikasi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Shield className="inline w-4 h-4 mr-2" />
                  Program Sertifikasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  placeholder="Contoh: AWS Cloud Practitioner, PMP, Google Analytics"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.program
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.program && (
                  <p className="text-red-500 text-sm">{errors.program}</p>
                )}
              </div>

              {/* Lembaga Sertifikasi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Building className="inline w-4 h-4 mr-2" />
                  Lembaga Sertifikasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lembaga"
                  value={formData.lembaga}
                  onChange={handleInputChange}
                  placeholder="Contoh: Amazon Web Services, PMI, Google"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.lembaga
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.lembaga && (
                  <p className="text-red-500 text-sm">{errors.lembaga}</p>
                )}
              </div>

              {/* Tanggal Mulai */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_mulai"
                  value={formData.tanggal_mulai}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.tanggal_mulai
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.tanggal_mulai && (
                  <p className="text-red-500 text-sm">{errors.tanggal_mulai}</p>
                )}
              </div>

              {/* Tanggal Akhir */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Tanggal Akhir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_akhir"
                  value={formData.tanggal_akhir}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.tanggal_akhir
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.tanggal_akhir && (
                  <p className="text-red-500 text-sm">{errors.tanggal_akhir}</p>
                )}
              </div>
            </div>

            {/* Nilai */}
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <Hash className="inline w-4 h-4 mr-2" />
                Nilai/Skor
              </label>
              <input
                type="number"
                name="nilai"
                value={formData.nilai}
                onChange={handleInputChange}
                placeholder="Contoh: 85, 750, 3.8"
                min="0"
                step="0.1"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.nilai
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              {errors.nilai && (
                <p className="text-red-500 text-sm">{errors.nilai}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Opsional - Masukkan nilai atau skor yang diperoleh
              </p>
            </div>

            {/* Sertifikat File (Full Width) */}
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <Upload className="inline w-4 h-4 mr-2" />
                Upload Sertifikat <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="sertifikat_file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.sertifikat_file
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:cursor-pointer hover:file:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.sertifikat_file && (
                  <p className="text-red-500 text-sm">
                    {errors.sertifikat_file}
                  </p>
                )}
                {formData.sertifikat_info && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ File terupload: {formData.sertifikat_info.name} (
                    {(formData.sertifikat_info.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Format yang didukung: PDF, JPG, JPEG, PNG, DOC, DOCX (Max:
                  5MB)
                </p>
              </div>
            </div>

            {/* Deskripsi (Full Width) */}
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <FileText className="inline w-4 h-4 mr-2" />
                Deskripsi Sertifikasi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                placeholder="Jelaskan kompetensi yang dicapai, manfaat sertifikasi, atau informasi tambahan lainnya..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.deskripsi
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              {errors.deskripsi && (
                <p className="text-red-500 text-sm">{errors.deskripsi}</p>
              )}
            </div>
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
              disabled={submitLoading}
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

export default CertificationForm;
