"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Hash,
  MapPin,
  Calendar,
  Upload,
  FileText,
} from "lucide-react";

interface FormData {
  name: string;
  tingkat: string;
}

interface FormErrors {
  name?: string;
  tingkat?: string;
  general?: string;
}

const STORAGE_KEY = "language_skills_form_data";

const LanguageSkillsForm = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    tingkat: "",
  });

  const tingkatOptions = [
    { value: "", label: "Pilih Tingkat Penguasaan" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Fluent", label: "Fluent" },
    { value: "Native", label: "Native" },
  ];

  // Function to load data from localStorage
  const loadFromLocalStorage = (): any => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // console.log(
        //   "Language skills data loaded from localStorage:",
        //   parsedData
        // );
        return parsedData;
      }
    } catch (error) {
      console.error(
        "Error loading language skills data from localStorage:",
        error
      );
    }
    return null;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // console.log("Language skills data saved to localStorage:", data);
    } catch (error) {
      console.error(
        "Error saving language skills data to localStorage:",
        error
      );
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing language skills localStorage:", error);
    }
  };

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = loadFromLocalStorage();

    if (savedData) {
      setFormData(savedData);
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

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama bahasa wajib diisi";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama bahasa minimal 2 karakter";
    }

    if (!formData.tingkat) {
      newErrors.tingkat = "Tingkat penguasaan wajib dipilih";
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
      // Prepare data for localStorage storage
      const submitData = {
        name: formData.name.trim(),
        tingkat: formData.tingkat,
      };

      // Save to localStorage
      saveToLocalStorage(submitData);

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Data kemampuan bahasa berhasil disimpan");
    } catch (error: any) {
      console.error(
        "Error saving language skills data to localStorage:",
        error
      );
      setErrors({
        general: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    const resetData = {
      name: "",
      tingkat: "",
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
                Kemampuan Bahasa
              </h1>
            </header>

            {/* Grid 2 kolom untuk input utama */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nama Bahasa */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <BookOpen className="inline w-4 h-4 mr-2" />
                  Nama Bahasa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Bahasa Indonesia, English, French"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Tingkat Penguasaan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <GraduationCap className="inline w-4 h-4 mr-2" />
                  Tingkat Penguasaan <span className="text-red-500">*</span>
                </label>
                <select
                  name="tingkat"
                  value={formData.tingkat}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.tingkat
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                >
                  {tingkatOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.tingkat && (
                  <p className="text-red-500 text-sm">{errors.tingkat}</p>
                )}
              </div>
            </div>

            {/* Info Box untuk Tingkat Penguasaan */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Panduan Tingkat Penguasaan:
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium text-blue-600 dark:text-blue-400 mr-1">
                    Pemula:
                  </span>
                  Dapat memahami kata-kata dan frasa dasar, komunikasi sederhana
                </div>
                <div>
                  <span className="font-medium text-green-600 dark:text-green-400 mr-1">
                    Menengah:
                  </span>
                  Dapat berkomunikasi dalam situasi sehari-hari, memahami teks
                  sederhana
                </div>
                <div>
                  <span className="font-medium text-purple-600 dark:text-purple-400 mr-1">
                    Profesional:
                  </span>
                  Fasih dalam komunikasi kompleks, dapat bekerja menggunakan
                  bahasa tersebut
                </div>
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

export default LanguageSkillsForm;
