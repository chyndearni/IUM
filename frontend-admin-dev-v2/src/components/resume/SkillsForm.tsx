"use client";

import React, { ChangeEvent, useState, useEffect, KeyboardEvent } from "react";
import { Award, X, Plus } from "lucide-react";

interface FormData {
  nama_keterampilan: string[];
  currentSkill: string;
}

interface FormErrors {
  nama_keterampilan?: string;
  general?: string;
}

const STORAGE_KEY = "skills_form_data";

const SkillsForm = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nama_keterampilan: [],
    currentSkill: "",
  });

  // Function to load data from localStorage
  const loadFromLocalStorage = (): any => {
    try {
      // Check if localStorage is available
      if (typeof window !== "undefined" && window.localStorage) {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // console.log("Skills data loaded from localStorage:", parsedData);
          return parsedData;
        }
      }
    } catch (error) {
      console.error("Error loading skills data from localStorage:", error);
    }
    return null;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      // Check if localStorage is available
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // console.log("Skills data saved to localStorage:", data);
      } else {
        // Fallback for artifact environment
        console.log("Skills data (simulated save):", data);
      }
    } catch (error) {
      console.error("Error saving skills data to localStorage:", error);
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      // Check if localStorage is available
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
        console.log("localStorage cleared");
      } else {
        console.log("localStorage cleared (simulated)");
      }
    } catch (error) {
      console.error("Error clearing skills localStorage:", error);
    }
  };

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = loadFromLocalStorage();

    if (savedData && savedData.nama_keterampilan) {
      setFormData({
        nama_keterampilan: savedData.nama_keterampilan || [],
        currentSkill: "",
      });

      // Show message that data was loaded
      if (savedData.nama_keterampilan.length > 0) {
        setSuccessMessage(
          `Data keterampilan berhasil dimuat dari localStorage! Ditemukan ${savedData.nama_keterampilan.length} keterampilan.`
        );
      }
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      currentSkill: value,
    }));

    // Clear error when user starts typing
    if (errors.nama_keterampilan) {
      setErrors((prev) => ({
        ...prev,
        nama_keterampilan: "",
      }));
    }

    // Clear success message when user modifies form
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const addSkill = () => {
    const skillToAdd = formData.currentSkill.trim();

    if (!skillToAdd) return;

    // Check if skill already exists
    if (
      formData.nama_keterampilan.some(
        (skill) => skill.toLowerCase() === skillToAdd.toLowerCase()
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        nama_keterampilan: "Keterampilan ini sudah ditambahkan",
      }));
      return;
    }

    // Add skill to the list
    setFormData((prev) => ({
      ...prev,
      nama_keterampilan: [...prev.nama_keterampilan, skillToAdd],
      currentSkill: "",
    }));

    // Clear any existing errors
    setErrors((prev) => ({
      ...prev,
      nama_keterampilan: "",
    }));
  };

  const removeSkill = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      nama_keterampilan: prev.nama_keterampilan.filter(
        (_, index) => index !== indexToRemove
      ),
    }));

    // Clear success message when user modifies form
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async () => {
    // Add current skill if any before submitting
    let skillsToSubmit = formData.nama_keterampilan;

    if (formData.currentSkill.trim()) {
      const skillToAdd = formData.currentSkill.trim();
      if (
        !formData.nama_keterampilan.some(
          (skill) => skill.toLowerCase() === skillToAdd.toLowerCase()
        )
      ) {
        skillsToSubmit = [...formData.nama_keterampilan, skillToAdd];
        setFormData((prev) => ({
          ...prev,
          nama_keterampilan: skillsToSubmit,
          currentSkill: "",
        }));
      }
    }

    // Clear previous messages
    setSuccessMessage(null);
    setErrors({});

    // Validate form
    if (skillsToSubmit.length === 0) {
      setErrors({
        nama_keterampilan: "Minimal satu keterampilan harus ditambahkan",
      });
      return;
    }

    setSubmitLoading(true);

    try {
      // Prepare data for localStorage storage
      const submitData = {
        nama_keterampilan: skillsToSubmit,
      };

      // Save to localStorage
      saveToLocalStorage(submitData);

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Data keterampilan berhasil disimpan");

      // Log the exact format for verification
      console.log("Data yang disimpan:", submitData);
    } catch (error: any) {
      console.error("Error saving skills data to localStorage:", error);
      setErrors({
        general: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_keterampilan: [],
      currentSkill: "",
    });
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

        <div className="space-y-6">
          <div className="mb-8">
            <header>
              <h1 className="text-gray-900 dark:text-white text-2xl mb-4">
                Keterampilan
              </h1>
            </header>

            {/* Input Keterampilan */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <Award className="inline w-4 h-4 mr-2" />
                Tambah Keterampilan <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.currentSkill}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik keterampilan dan tekan Enter atau klik tambah"
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    errors.nama_keterampilan
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  disabled={submitLoading}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={!formData.currentSkill.trim() || submitLoading}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
              {errors.nama_keterampilan && (
                <p className="text-red-500 text-sm">
                  {errors.nama_keterampilan}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tekan Enter atau klik tombol "Tambah" untuk menambahkan
                keterampilan
              </p>
            </div>

            {/* Display Skills as Tags */}
            {formData.nama_keterampilan.length > 0 && (
              <div className="space-y-2 mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Keterampilan yang Ditambahkan (
                  {formData.nama_keterampilan.length})
                </label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600 min-h-[60px]">
                  {formData.nama_keterampilan.map((skill, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full border border-blue-200 dark:border-blue-700"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        disabled={submitLoading}
                        className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors disabled:cursor-not-allowed"
                        title="Hapus keterampilan"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {formData.nama_keterampilan.length === 0 && (
              <div className="mt-6 p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
                <Award className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Belum ada keterampilan yang ditambahkan
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Mulai dengan mengetik keterampilan di kolom input di atas
                </p>
              </div>
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
              type="button"
              onClick={handleSubmit}
              disabled={
                submitLoading || formData.nama_keterampilan.length === 0
              }
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
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
