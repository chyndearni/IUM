"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeft, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useUser } from "@/context/UserContext";
import apiBissaKerja from "@/lib/api-bissa-kerja";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const { refreshUser } = useUser();

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
  };

  // Validate form
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    return newErrors;
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const payload: SignInPayload = {
        email: formData.email,
        password: formData.password,
      };

      // Call login API
      const loginResponse = await apiBissaKerja.post("/login", payload);

      // Handle successful login
      if (loginResponse.data.success || loginResponse.status === 200) {
        const user = loginResponse.data.user;

        if (user && user.role) {
          // Save role to cookies
          Cookies.set("token", user.token);
          Cookies.set("role", user.role); // expires in 7 days
          Cookies.set("isLogin", "true"); // expires in 7 days
        }

        if (user.role === "user") {
          const resumeResponse = await apiBissaKerja.get(`resume/${user.id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const userProfile = resumeResponse.data.data.user_profile;
          if (userProfile === null || userProfile === undefined) {
            Cookies.set("userProfile", "false");
          } else {
            Cookies.set("userProfile", "true");
          }
        }

        // Handle 'remember me' checkbox
        if (isChecked) {
          localStorage.setItem("rememberMe", "true");
        }

        // Refresh user data
        await refreshUser();

        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.status === 422) {
        const errorBag = error.response.data.errors || {};
        const mappedErrors: FormErrors = {
          email: errorBag.email?.[0],
          password: errorBag.password?.[0],
          general: error.response.data.message,
        };
        setErrors(mappedErrors);
      } else if (error.response?.status === 401) {
        setErrors({
          general: "Email atau password salah. Silakan coba lagi.",
        });
      } else if (error.response?.status === 429) {
        setErrors({
          general: "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
        });
      } else {
        setErrors({
          general: "Terjadi kesalahan saat masuk. Silakan coba lagi.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Masuk
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selamat datang di Jatim Bissa Platform
            </p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {errors.general}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmitForm}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    name="email"
                    placeholder="info@gmail.com"
                    type="email"
                    onChange={handleInputChange}
                    value={formData.email}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      onChange={handleInputChange}
                      value={formData.password}
                      className={errors.password ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onChange={setIsChecked}
                      ariaLabel="Ingat saya"
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Ingat Saya
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
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
                      </div>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
