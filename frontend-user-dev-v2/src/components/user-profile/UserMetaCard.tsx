"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import ProfileCardSkeleton from "@/skeleton/ProfileCardSkeleton";
import apiBissaKerja from "@/lib/api-bissa-kerja";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T = any> {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: T;
  user?: T;
  role?: string;
  errors?: Record<string, string[]>;
  error?: string;
}

interface FormData {
  name: string;
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  [key: string]: string[] | undefined;
}

// Constants
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Custom Password Input Component (moved outside to prevent re-creation)
const PasswordInput = React.memo(
  ({
    id,
    value,
    onChange,
    placeholder,
    disabled,
    showPassword,
    onTogglePassword,
  }: {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled: boolean;
    showPassword: boolean;
    onTogglePassword: () => void;
  }) => (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10"
      />
      <button
        type="button"
        onClick={onTogglePassword}
        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  )
);

PasswordInput.displayName = "PasswordInput";

export default function UserProfileCard() {
  const { isOpen, openModal, closeModal } = useModal();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Generate default avatar URL based on user name
  const generateDefaultAvatar = useCallback((name: string) => {
    const encodedName = encodeURIComponent(name || "User");
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  }, []);

  // Helper functions
  const clearMessages = useCallback(() => {
    setErrors({});
    setSuccessMessage("");
  }, []);

  const showSuccess = useCallback((message: string, duration = 3000) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), duration);
  }, []);

  const handleError = useCallback((error: any, fallbackMessage: string) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (error.response?.status === 422 && error.response.data.errors) {
      setErrors(error.response.data.errors);
    } else {
      setErrors({
        general: [
          error.response?.data?.message || error.message || fallbackMessage,
        ],
      });
    }
  }, []);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      clearMessages();

      const response = await apiBissaKerja.get("/user");
      let userData: User | null = null;

      // Handle backend response structure
      if (response.data?.status && response.data?.user) {
        userData = response.data.user;
        if (response.data.role && userData) {
          userData.role = response.data.role;
        }
      } else if (response.data?.success && response.data?.data) {
        userData = response.data.data;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        userData = response.data as User;
      }

      if (userData && userData.id) {
        setUser(userData);
        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          current_password: "",
          password: "",
          password_confirmation: "",
        }));
      } else {
        setErrors({ general: ["No valid profile data found in response"] });
      }
    } catch (error: any) {
      handleError(error, "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  }, [clearMessages, handleError]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // File validation
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Image size must be less than 5MB";
    }
    return null;
  }, []);

  // Convert file to base64
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const error = validateFile(file);
      if (error) {
        setErrors({ avatar: [error] });
        return;
      }

      // Clear previous errors
      setErrors((prev) => ({ ...prev, avatar: undefined }));

      try {
        // Convert to base64 for preview
        const base64String = await fileToBase64(file);
        setAvatarPreview(base64String);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setErrors({ avatar: ["Failed to process image"] });
      }
    },
    [validateFile, fileToBase64]
  );

  // Handle avatar upload using base64
  const handleAvatarUpload = useCallback(async () => {
    if (!avatarPreview) return;

    try {
      setAvatarLoading(true);
      setErrors((prev) => ({ ...prev, avatar: undefined }));

      const response = await apiBissaKerja.put<ApiResponse<User>>(
        "/profile/update-avatar",
        {
          avatar: avatarPreview,
        },
        {
          timeout: 60000, // Increase timeout untuk base64
        }
      );

      if (response.data.status || response.data.success) {
        showSuccess("Profile photo updated successfully!");

        // Update user state based on response structure
        if (response.data.user) {
          setUser(response.data.user);
        } else if (response.data.data) {
          setUser(response.data.data);
        }

        // Clear preview and file input
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error);

      // Handle CORS error specifically
      if (error.code === "ERR_NETWORK" || error.message.includes("CORS")) {
        setErrors({
          avatar: [
            "Network error. Please check your connection and try again.",
          ],
        });
      } else {
        handleError(error, "Failed to update profile photo. Please try again.");
      }
    } finally {
      setAvatarLoading(false);
    }
  }, [avatarPreview, handleError, showSuccess]);

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear specific field error without recreating the function
      setErrors((prev) => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    },
    []
  );

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = ["Name is required"];
    } else if (formData.name.trim().length < 2) {
      newErrors.name = ["Name must be at least 2 characters"];
    }

    // Password validation (only if changing password)
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
  }, [formData, showPasswordFields]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setSaveLoading(true);
      clearMessages();

      const updateData: any = {
        name: formData.name.trim(),
      };

      // Add password fields only if updating password
      if (showPasswordFields && formData.password) {
        updateData.current_password = formData.current_password;
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const response = await apiBissaKerja.put<ApiResponse<User>>(
        "/profile",
        updateData
      );

      if (response.data.status || response.data.success) {
        showSuccess(
          response.data.message || "Profile updated successfully!",
          1500
        );

        // Update user state based on response structure
        if (response.data.user) {
          setUser(response.data.user);
        } else if (response.data.data) {
          setUser(response.data.data);
        }

        // Reset password fields
        setFormData((prev) => ({
          ...prev,
          current_password: "",
          password: "",
          password_confirmation: "",
        }));
        setShowPasswordFields(false);

        // Close modal after delay
        setTimeout(() => {
          closeModal();
          setSuccessMessage("");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error: any) {
      handleError(error, "Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  }, [
    validateForm,
    formData,
    showPasswordFields,
    clearMessages,
    showSuccess,
    handleError,
    closeModal,
  ]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    if (saveLoading || avatarLoading) return;

    closeModal();
    clearMessages();
    setShowPasswordFields(false);
    setAvatarPreview(null);

    // Reset password visibility states
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Reset form to user data
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        current_password: "",
        password: "",
        password_confirmation: "",
      }));
    }
  }, [saveLoading, avatarLoading, closeModal, clearMessages, user]);

  // Get avatar source with proper fallback
  const getAvatarSrc = useCallback(() => {
    // If there's a preview (user is selecting new image), show that
    if (avatarPreview) return avatarPreview;

    // If user has an uploaded avatar and it's a valid URL, use it
    if (user?.avatar && user.avatar.trim()) {
      // Check if it's a full URL (starts with http/https)
      if (user.avatar.startsWith("http")) {
        return user.avatar;
      }
      // If it's a relative path, convert to absolute using the API base URL
      if (user.avatar.startsWith("/storage/")) {
        // Get the base URL from your API configuration
        const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        return `${apiBaseUrl}${user.avatar}`;
      }
    }

    // Fallback to generated avatar based on user name
    return generateDefaultAvatar(user?.name || "User");
  }, [avatarPreview, user?.avatar, user?.name, generateDefaultAvatar]);

  // Render loading state
  if (loading) {
    return <ProfileCardSkeleton />;
  }

  // Render error state
  if (errors.general && !user) {
    return (
      <div className="p-5 border border-red-200 rounded-2xl dark:border-red-800 lg:p-6">
        <div className="text-red-500 dark:text-red-400 mb-3">
          {errors.general[0]}
        </div>
        <button
          onClick={fetchProfile}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Try again
        </button>
      </div>
    );
  }

  // Render no user state
  if (!user) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="text-gray-500 dark:text-gray-400 mb-3">
          No profile data available
        </div>
        <button
          onClick={fetchProfile}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Reload Profile
        </button>
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
                onError={(e) => {
                  // If image fails to load, use the generated default avatar
                  (e.target as HTMLImageElement).src = generateDefaultAvatar(
                    user.name || "User"
                  );
                }}
                unoptimized={
                  getAvatarSrc().startsWith("data:") ||
                  getAvatarSrc().includes("ui-avatars.com")
                }
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
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            generateDefaultAvatar(user.name || "User");
                        }}
                        unoptimized={
                          getAvatarSrc().startsWith("data:") ||
                          getAvatarSrc().includes("ui-avatars.com")
                        }
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

                {/* Email Display (Read-only) */}
                <div>
                  <Label>Alamat Email</Label>
                  <div className="mt-1 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                    {user.email}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email tidak dapat diubah
                  </p>
                </div>

                {/* Password Section */}
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
                      <div>
                        <Label htmlFor="current_password">
                          Password Saat ini
                        </Label>
                        <PasswordInput
                          id="current_password"
                          value={formData.current_password}
                          onChange={(e) =>
                            handleInputChange(
                              "current_password",
                              e.target.value
                            )
                          }
                          placeholder="Password saat ini"
                          disabled={saveLoading}
                          showPassword={showCurrentPassword}
                          onTogglePassword={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
                        />
                        {errors.current_password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.current_password[0]}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="password">Password Baru</Label>
                        <PasswordInput
                          id="password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Masukkan password baru (min. 6 karakter)"
                          disabled={saveLoading}
                          showPassword={showNewPassword}
                          onTogglePassword={() =>
                            setShowNewPassword((prev) => !prev)
                          }
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password[0]}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="password_confirmation">
                          Konfirmasi Password Baru
                        </Label>
                        <PasswordInput
                          id="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={(e) =>
                            handleInputChange(
                              "password_confirmation",
                              e.target.value
                            )
                          }
                          placeholder="Konfirmasi password baru"
                          disabled={saveLoading}
                          showPassword={showConfirmPassword}
                          onTogglePassword={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
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
                disabled={saveLoading || avatarLoading || !formData.name.trim()}
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
