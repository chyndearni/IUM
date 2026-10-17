"use client";
import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import api from "@/lib/axios";
import ProfileCardSkeleton from "@/skeleton/ProfileCardSkeleton";
import apiBissaKerja from "@/lib/api-bissa-kerja";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // Added avatar field
  role?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
}

interface FormData {
  name: string;
  email: string;
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  name?: string[];
  email?: string[];
  current_password?: string[];
  password?: string[];
  password_confirmation?: string[];
  avatar?: string[];
  general?: string[];
}

export default function UserProfileCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrors({});

      // console.log("🔄 Fetching profile data...");

      const response = await apiBissaKerja.get("user");

      // console.log("📥 Profile response:", response.data);

      // Handle different response structures
      let userData = null;

      if (response.data?.success && response.data?.data?.user) {
        userData = response.data.data.user;
        // console.log("Found user data in success format:", userData);
      } else if (response.data?.user) {
        userData = response.data.user;
        // console.log("Found user data in direct format:", userData);
      } else if (response.data && response.data.id) {
        userData = response.data;
        // console.log("Found user data as direct object:", userData);
      } else {
        console.log("No user data found in response:", response.data);
      }

      if (userData) {
        setUser(userData);

        // Update form with user data
        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          current_password: "",
          password: "",
          password_confirmation: "",
        }));
      } else {
        console.log("❌ No valid user data found");
        setErrors({
          general: ["No profile data found in response"],
        });
      }
    } catch (error: any) {
      console.error("❌ Error fetching profile:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);

      if (error.response?.status === 401) {
        console.log("🔑 Unauthorized - redirecting to login");
        window.location.href = "/login";
        return;
      }

      setErrors({
        general: [
          `Failed to fetch profile data: ${
            error.response?.data?.message || error.message
          }`,
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle file selection for avatar
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        avatar: ["Please select a valid image file (JPEG, PNG, GIF)"],
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrors({
        avatar: ["Image size must be less than 5MB"],
      });
      return;
    }

    // Clear previous avatar errors
    setErrors((prev) => ({
      ...prev,
      avatar: undefined,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarPreview) return;

    try {
      setAvatarLoading(true);
      setErrors((prev) => ({
        ...prev,
        avatar: undefined,
      }));

      const response = await apiBissaKerja.patch<ApiResponse<{ user: User }>>(
        "/profile/update-avatar",
        {
          avatar: avatarPreview, // Send base64 data
        }
      );

      if (response.data.success) {
        setSuccessMessage("Profile photo updated successfully!");

        // Update local user state
        if (response.data.data?.user) {
          setUser(response.data.data.user);
        }

        // Clear preview
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Clear success message after delay
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error updating avatar:", error);

      if (error.response?.status === 422) {
        // Validation errors
        const validationErrors = error.response.data.errors || {};
        setErrors((prev) => ({
          ...prev,
          ...validationErrors,
        }));
      } else if (error.response?.status === 401) {
        // Unauthorized
        window.location.href = "/login";
      } else {
        // General error
        setErrors((prev) => ({
          ...prev,
          avatar: [
            error.response?.data?.message ||
              "Failed to update profile photo. Please try again.",
          ],
        }));
      }
    } finally {
      setAvatarLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = ["Name is required"];
    } else if (formData.name.trim().length < 2) {
      newErrors.name = ["Name must be at least 2 characters"];
    }

    if (!formData.email.trim()) {
      newErrors.email = ["Email is required"];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"];
    }

    // Password validation (only if password fields are shown and password is entered)
    if (showPasswordFields && formData.password) {
      if (!formData.current_password) {
        newErrors.current_password = [
          "Current password is required when updating password",
        ];
      }

      if (formData.password.length < 6) {
        newErrors.password = ["Password must be at least 6 characters"];
      }

      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = [
          "Password confirmation does not match",
        ];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaveLoading(true);
      setErrors({});
      setSuccessMessage("");

      // Prepare data to send
      const updateData: Partial<FormData> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      // Add password fields only if password is being updated
      if (showPasswordFields && formData.password) {
        updateData.current_password = formData.current_password;
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const response = await api.patch<ApiResponse<{ user: User }>>(
        "/profile",
        updateData
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);

        // Update local user state
        if (response.data.data?.user) {
          setUser(response.data.data.user);
        }

        // Reset password fields
        setFormData((prev) => ({
          ...prev,
          current_password: "",
          password: "",
          password_confirmation: "",
        }));
        setShowPasswordFields(false);

        // Close modal after short delay
        setTimeout(() => {
          closeModal();
          setSuccessMessage("");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);

      if (error.response?.status === 422) {
        // Validation errors
        const validationErrors = error.response.data.errors || {};
        setErrors(validationErrors);
      } else if (error.response?.status === 401) {
        // Unauthorized
        window.location.href = "/login";
      } else {
        // General error
        setErrors({
          general: [
            error.response?.data?.message ||
              "Failed to update profile. Please try again.",
          ],
        });
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (!saveLoading && !avatarLoading) {
      closeModal();
      setErrors({});
      setSuccessMessage("");
      setShowPasswordFields(false);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reset form to user data
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          current_password: "",
          password: "",
          password_confirmation: "",
        }));
      }
    }
  };

  // Get avatar source
  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) return user.avatar + "&length=2";
    return "/images/user/owner.jpg"; // Default fallback
  };

  // Loading state
  if (loading) {
    return <ProfileCardSkeleton />;
  }

  // Error state
  if (errors.general && !user) {
    return (
      <div className="p-5 border border-red-200 rounded-2xl dark:border-red-800 lg:p-6">
        <div className="text-red-500 dark:text-red-400 mb-3">
          {errors.general[0]}
        </div>
        <button
          onClick={() => {
            console.log("🔄 Retrying profile fetch...");
            fetchProfile();
          }}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Try again
        </button>
        <div className="mt-2 text-xs text-gray-500">
          Check console for detailed error information
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="text-gray-500 dark:text-gray-400 mb-3">
          No profile data available
        </div>
        <button
          onClick={() => {
            console.log("Trying to fetch profile again...");
            fetchProfile();
          }}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Reload Profile
        </button>
        <div className="mt-2 text-xs text-gray-500">
          Debug info: Check browser console and network tab
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Current state - Loading: {loading.toString()}, User:{" "}
          {user ? "exists" : "null"}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Profile Display Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={getAvatarSrc()}
                alt="Profile picture"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                {user.role && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-[600px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profile
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update informasi akun Anda.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mx-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general[0]}</p>
            </div>
          )}

          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="px-2 pb-3">
              <div className="space-y-5">
                {/* Avatar Section */}
                <div className="border-b pb-5">
                  <Label>Foto Profil</Label>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="w-16 h-16 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                      <Image
                        width={64}
                        height={64}
                        src={getAvatarSrc()}
                        alt="Profile picture"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={avatarLoading}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                          disabled={avatarLoading}
                        >
                          Pilih Foto
                        </button>
                        {avatarPreview && (
                          <button
                            type="button"
                            onClick={handleAvatarUpload}
                            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={avatarLoading}
                          >
                            {avatarLoading ? "Uploading..." : "Upload"}
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        JPEG, PNG, GIF. Maksimal 5MB.
                      </p>
                    </div>
                  </div>
                  {errors.avatar && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.avatar[0]}
                    </p>
                  )}
                </div>

                {/* Name Field */}
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    disabled={saveLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email">Alamat Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    disabled={saveLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                {/* Password Section Toggle */}
                <div className="border-t pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      disabled={saveLoading}
                    >
                      {showPasswordFields ? "Batal" : "Ubah Password"}
                    </button>
                  </div>

                  {showPasswordFields && (
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <Label htmlFor="current_password">
                          Password Saat ini
                        </Label>
                        <Input
                          id="current_password"
                          type="password"
                          value={formData.current_password}
                          onChange={(e) =>
                            handleInputChange(
                              "current_password",
                              e.target.value
                            )
                          }
                          placeholder="Password saat ini"
                          disabled={saveLoading}
                        />
                        {errors.current_password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.current_password[0]}
                          </p>
                        )}
                      </div>

                      {/* New Password */}
                      <div>
                        <Label htmlFor="password">Password Baru</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Masukkan password baru (min. 6 karakter)"
                          disabled={saveLoading}
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password[0]}
                          </p>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <Label htmlFor="password_confirmation">
                          Konfirmasi Password Baru
                        </Label>
                        <Input
                          id="password_confirmation"
                          type="password"
                          value={formData.password_confirmation}
                          onChange={(e) =>
                            handleInputChange(
                              "password_confirmation",
                              e.target.value
                            )
                          }
                          placeholder="Konfimasi password baru"
                          disabled={saveLoading}
                        />
                        {errors.password_confirmation && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password_confirmation[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCloseModal}
                disabled={saveLoading || avatarLoading}
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  saveLoading ||
                  avatarLoading ||
                  !formData.name.trim() ||
                  !formData.email.trim()
                }
              >
                {saveLoading ? "Menyimpan..." : "Update Data"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
