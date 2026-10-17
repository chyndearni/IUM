"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { User, Phone, Calendar, Users, FileText } from "lucide-react";

interface FormData {
  ringkasan_pribadi: string;
}

interface FormErrors {
  ringkasan_pribadi?: string;
  general?: string;
}

const STORAGE_KEY = "summary_form_data";

const SummaryForm = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    ringkasan_pribadi: "",
  });

  // Function to load data from localStorage
  const loadFromLocalStorage = (): FormData | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // console.log("Summary data loaded from localStorage:", parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error loading summary data from localStorage:", error);
    }
    return null;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // console.log("Summary data saved to localStorage:", data);
    } catch (error) {
      console.error("Error saving summary data to localStorage:", error);
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing summary localStorage:", error);
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    if (!formData.ringkasan_pribadi.trim()) {
      newErrors.ringkasan_pribadi = "Ringkasan pribadi wajib diisi";
    } else if (formData.ringkasan_pribadi.trim().length < 10) {
      newErrors.ringkasan_pribadi = "Ringkasan pribadi minimal 10 karakter";
    } else if (formData.ringkasan_pribadi.trim().length > 1000) {
      newErrors.ringkasan_pribadi = "Ringkasan pribadi maksimal 1000 karakter";
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
        ringkasan_pribadi: formData.ringkasan_pribadi.trim(),
      };

      // Save to localStorage
      saveToLocalStorage(submitData);

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Data ringkasan pribadi berhasil disimpan");
    } catch (error: any) {
      console.error("Error saving summary data to localStorage:", error);
      setErrors({
        general: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    const resetData = {
      ringkasan_pribadi: "",
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

        <header>
          <h1 className="text-gray-900 dark:text-white text-2xl mb-4">
            Data Ringkasan Pribadi
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ringkasan Pribadi */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              <FileText className="inline w-4 h-4 mr-2" />
              Ringkasan Pribadi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="ringkasan_pribadi"
                value={formData.ringkasan_pribadi}
                onChange={handleInputChange}
                placeholder="Ceritakan ringkasan pribadi Anda secara singkat dan jelas (minimal 10 karakter, maksimal 1000 karakter)..."
                rows={6}
                maxLength={1000}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.ringkasan_pribadi
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {formData.ringkasan_pribadi.length}/1000
              </div>
            </div>
            {errors.ringkasan_pribadi && (
              <p className="text-red-500 text-sm">{errors.ringkasan_pribadi}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tuliskan ringkasan singkat tentang diri Anda yang mencakup
              keahlian, pengalaman, dan tujuan karir.
            </p>
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

export default SummaryForm;
