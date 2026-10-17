"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Trophy,
  Building,
  Calendar,
  Upload,
  AlertTriangle,
  X,
  CheckCircle,
  FileText,
  Settings,
  Download,
} from "lucide-react";
import {
  storeUserProfileForm,
  storeLocationForm,
  storeSummaryForm,
  storeEducationForm,
  storeExperienceForm,
  storeTrainingForm,
  storeCertificationForm,
  storeSkillsForm,
  storeLanguageSkillsForm,
  storeAchievementForm,
} from "./StoreResumeData";

interface FormData {
  name: string;
  penyelenggara: string;
  tanggal_pencapaian: string;
  dokumen: File | null;
  dokumen_base64?: string | null;
  dokumen_info?: { name: string; size: number; type: string } | null;
}

interface FormErrors {
  name?: string;
  penyelenggara?: string;
  tanggal_pencapaian?: string;
  dokumen?: string;
  general?: string;
}

interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
  icon: React.ReactNode;
}

const STORAGE_KEY = "achievement_form_data";

const AchievementForm = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    {
      id: "profile",
      label: "Menyimpan Data Profil",
      completed: false,
      current: false,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "location",
      label: "Menyimpan Data Lokasi",
      completed: false,
      current: false,
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "summary",
      label: "Menyimpan Ringkasan",
      completed: false,
      current: false,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "education",
      label: "Menyimpan Data Pendidikan",
      completed: false,
      current: false,
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: "experience",
      label: "Menyimpan Data Pengalaman",
      completed: false,
      current: false,
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "training",
      label: "Menyimpan Data Pelatihan",
      completed: false,
      current: false,
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "certification",
      label: "Menyimpan Data Sertifikasi",
      completed: false,
      current: false,
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: "skills",
      label: "Menyimpan Data Keahlian",
      completed: false,
      current: false,
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "language",
      label: "Menyimpan Data Bahasa",
      completed: false,
      current: false,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "achievement",
      label: "Menyimpan Data Prestasi",
      completed: false,
      current: false,
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: "generate",
      label: "Membuat CV",
      completed: false,
      current: false,
      icon: <Download className="w-4 h-4" />,
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    penyelenggara: "",
    tanggal_pencapaian: "",
    dokumen: null,
    dokumen_base64: null,
    dokumen_info: null,
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
        console.log("Achievement data loaded from localStorage:", parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error loading achievement data from localStorage:", error);
    }
    return null;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log("Achievement data saved to localStorage:", data);
    } catch (error) {
      console.error("Error saving achievement data to localStorage:", error);
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Achievement localStorage cleared");
    } catch (error) {
      console.error("Error clearing achievement localStorage:", error);
    }
  };

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = loadFromLocalStorage();

    if (savedData) {
      // Reconstruct file from base64 if exists
      let reconstructedFile = null;
      if (savedData.dokumen_base64 && savedData.dokumen_info) {
        try {
          reconstructedFile = createFileFromBase64(
            savedData.dokumen_base64,
            savedData.dokumen_info.name,
            savedData.dokumen_info.type
          );
        } catch (error) {
          console.error("Error reconstructing file from base64:", error);
        }
      }

      // Set the form data with reconstructed file
      setFormData({
        ...savedData,
        dokumen: reconstructedFile,
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
          dokumen:
            "Format file tidak didukung. Gunakan PDF, JPG, JPEG, PNG, DOC, atau DOCX",
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          dokumen: "Ukuran file terlalu besar. Maksimal 5MB",
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
          dokumen: file,
          dokumen_base64: base64,
          dokumen_info: fileInfo,
        }));

        // Clear file error when user uploads a valid file
        if (errors.dokumen) {
          setErrors((prev) => ({
            ...prev,
            dokumen: "",
          }));
        }
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setErrors((prev) => ({
          ...prev,
          dokumen: "Gagal memproses file. Silakan coba lagi.",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        dokumen: null,
        dokumen_base64: null,
        dokumen_info: null,
      }));
    }

    // Clear success message when user modifies form
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  // Form validation (all fields are optional)
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Since this is an optional form, we only validate format if data is provided
    if (formData.name.trim() && formData.name.trim().length < 2) {
      newErrors.name = "Nama prestasi minimal 2 karakter jika diisi";
    }

    if (
      formData.penyelenggara.trim() &&
      formData.penyelenggara.trim().length < 2
    ) {
      newErrors.penyelenggara = "Penyelenggara minimal 2 karakter jika diisi";
    }

    // Validate file if provided
    if (formData.dokumen) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(formData.dokumen.type)) {
        newErrors.dokumen =
          "Format file tidak didukung. Gunakan PDF, JPG, JPEG, PNG, DOC, atau DOCX";
      }
      // Validate file size (5MB)
      if (formData.dokumen.size > 5 * 1024 * 1024) {
        newErrors.dokumen = "Ukuran file terlalu besar. Maksimal 5MB";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    // Show modal before creating CV
    setShowModal(true);
  };

  const updateProgress = (
    stepId: string,
    completed: boolean,
    current: boolean = false
  ) => {
    setProgressSteps((prev) =>
      prev.map((step) => ({
        ...step,
        completed: step.id === stepId ? completed : step.completed,
        current: step.id === stepId ? current : false,
      }))
    );
  };
  const resetLocalStorage = () => {
    localStorage.removeItem("user_profile_form_data");
    localStorage.removeItem("location_form_data");
    localStorage.removeItem("summary_form_data");
    localStorage.removeItem("education_form_data");
    localStorage.removeItem("experience_form_data");
    localStorage.removeItem("training_form_data");
    localStorage.removeItem("certification_form_data");
    localStorage.removeItem("skills_form_data");
    localStorage.removeItem("language_skills_form_data");
    localStorage.removeItem("achievement_form_data");
    console.log("All form localStorage data cleared");
  };

  const handleCreateCV = async () => {
    setSubmitLoading(true);
    setShowModal(false);
    setShowProgress(true);
    setCurrentProgress(0);

    try {
      // Prepare data for localStorage storage (with base64 file)
      const submitData = {
        name: formData.name.trim(),
        penyelenggara: formData.penyelenggara.trim(),
        tanggal_pencapaian: formData.tanggal_pencapaian,
        dokumen_base64: formData.dokumen_base64,
        dokumen_info: formData.dokumen_info,
      };

      // PERBAIKAN: Selalu simpan ke localStorage, bahkan jika kosong
      // Karena fungsi storeAchievementForm akan mengecek apakah ada data atau tidak
      console.log("Saving achievement data to localStorage:", submitData);
      saveToLocalStorage(submitData);

      // Execute each step with progress tracking
      const steps = [
        { fn: storeUserProfileForm, id: "profile" },
        { fn: storeLocationForm, id: "location" },
        { fn: storeSummaryForm, id: "summary" },
        { fn: storeEducationForm, id: "education" },
        { fn: storeExperienceForm, id: "experience" },
        { fn: storeTrainingForm, id: "training" },
        { fn: storeCertificationForm, id: "certification" },
        { fn: storeSkillsForm, id: "skills" },
        { fn: storeLanguageSkillsForm, id: "language" },
        { fn: storeAchievementForm, id: "achievement" },
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        updateProgress(step.id, false, true);

        try {
          await step.fn();
          console.log(`${step.id} step completed successfully`);
        } catch (error) {
          console.error(`Error in ${step.id} step:`, error);
          // Continue with other steps even if one fails
        }

        updateProgress(step.id, true, false);
        setCurrentProgress(((i + 1) / (steps.length + 1)) * 100);
      }

      // Final step - generate CV
      updateProgress("generate", false, true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate CV generation
      updateProgress("generate", true, false);
      setCurrentProgress(100);

      // Wait a bit before completing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Data prestasi berhasil disimpan dan CV telah dibuat!");
      Cookies.set("userProfile", "true");
      resetLocalStorage();
      window.location.href = "/resume/cv";

      // Hide progress after success
      setTimeout(() => {
        setShowProgress(false);
        setProgressSteps((prev) =>
          prev.map((step) => ({ ...step, completed: false, current: false }))
        );
        setCurrentProgress(0);
      }, 2000);
    } catch (error: any) {
      console.error("Error saving achievement data:", error);
      setErrors({ general: "Terjadi kesalahan saat menyimpan data prestasi" });
      setShowProgress(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    const resetData = {
      name: "",
      penyelenggara: "",
      tanggal_pencapaian: "",
      dokumen: null,
      dokumen_base64: null,
      dokumen_info: null,
    };

    setFormData(resetData);
    setErrors({});
    setSuccessMessage(null);

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
                Data Prestasi (Opsional)
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Semua field bersifat opsional. Isi sesuai prestasi yang ingin
                ditampilkan di CV.
              </p>
            </header>

            {/* Grid 2 kolom untuk input utama */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nama Prestasi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Trophy className="inline w-4 h-4 mr-2" />
                  Nama Prestasi
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Juara 1 Coding Competition, Employee of the Month"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  disabled={submitLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Penyelenggara */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Building className="inline w-4 h-4 mr-2" />
                  Penyelenggara
                </label>
                <input
                  type="text"
                  name="penyelenggara"
                  value={formData.penyelenggara}
                  onChange={handleInputChange}
                  placeholder="Contoh: IEEE, PT. ABC Indonesia, Universitas XYZ"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.penyelenggara
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  disabled={submitLoading}
                />
                {errors.penyelenggara && (
                  <p className="text-red-500 text-sm">{errors.penyelenggara}</p>
                )}
              </div>

              {/* Tanggal Pencapaian */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Tanggal Pencapaian
                </label>
                <input
                  type="date"
                  name="tanggal_pencapaian"
                  value={formData.tanggal_pencapaian}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.tanggal_pencapaian
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  disabled={submitLoading}
                />
                {errors.tanggal_pencapaian && (
                  <p className="text-red-500 text-sm">
                    {errors.tanggal_pencapaian}
                  </p>
                )}
              </div>
            </div>

            {/* Dokumen (Full Width) */}
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <Upload className="inline w-4 h-4 mr-2" />
                Upload Dokumen Prestasi
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="dokumen"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.dokumen
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:cursor-pointer hover:file:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.dokumen && (
                  <p className="text-red-500 text-sm">{errors.dokumen}</p>
                )}
                {formData.dokumen_info && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ File terupload: {formData.dokumen_info.name} (
                    {(formData.dokumen_info.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Format yang didukung: PDF, JPG, JPEG, PNG (Max: 5MB)
                </p>
              </div>
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
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed flex items-center gap-2"
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
                  Memproses...
                </>
              ) : (
                "Simpan dan Buat CV"
              )}
            </button>
          </div>
        </form>

        {/* Modal Peringatan */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Peringatan
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={submitLoading}
                  className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Setelah CV dibuat, data yang telah diinput{" "}
                  <strong>tidak dapat diedit</strong>.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Namun Anda masih dapat <strong>menghapus</strong> dan{" "}
                  <strong>menambahkan data baru</strong> jika diperlukan.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={submitLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateCV}
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <svg
                        className="animate-spin h-3 w-3 text-white"
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
                      Memproses...
                    </>
                  ) : (
                    "Ya, Buat CV"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Modal */}
        {showProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Membuat CV Anda
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Mohon tunggu, sedang memproses data dan membuat CV...
                </p>
              </div>

              {/* Overall Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(currentProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${currentProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {progressSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step.completed
                          ? "bg-green-500 text-white"
                          : step.current
                          ? "bg-blue-500 text-white animate-pulse"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : step.current ? (
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      ) : (
                        step.icon
                      )}
                    </div>

                    <div className="flex-1">
                      <span
                        className={`text-sm transition-all duration-300 ${
                          step.completed
                            ? "text-green-600 dark:text-green-400 font-medium"
                            : step.current
                            ? "text-blue-600 dark:text-blue-400 font-medium"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {step.completed && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}

                    {step.current && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Completion Message */}
              {currentProgress === 100 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      CV berhasil dibuat! 🎉
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementForm;
