"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Heart,
  Clock,
  DollarSign,
  ChevronDown,
  X,
  ChevronUp,
  Calendar,
  Send,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import axios, { AxiosError } from "axios";
import useDocumentTitle from "@/hooks/useDocumentTitle";

// Types
interface PerusahaanProfile {
  id: number;
  nama_perusahaan: string;
  logo: string | null;
  alamat_lengkap: string;
}

interface DisabilitasType {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
}

interface JobVacancy {
  id: number;
  job_title: string;
  job_type: string;
  description: string;
  requirements: string;
  salary_range: string;
  location: string;
  application_deadline: string;
  experience: string;
  perusahaan_profile: PerusahaanProfile;
  skills: string[];
  disabilitas: DisabilitasType[];
}

interface ApiResponse {
  success: boolean;
  data: JobVacancy[];
  message?: string;
}

interface ApplyStatusResponse {
  success: boolean;
  applied: boolean;
  message?: string;
}

interface UserProfileResponse {
  userProfileDataExist: boolean;
  message?: string;
}

type SortOption = "newest" | "oldest" | "salary-high" | "salary-low";

export default function CariPekerjaanPage() {
  useDocumentTitle("Cari Kerja | JatimBissa");
  // State
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [userProfileExists, setUserProfileExists] = useState<boolean>(false);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(false);

  // Modal state
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] =
    useState<boolean>(false);
  const [disabilityFilter, setDisabilityFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const locationRef = useRef<HTMLDivElement>(null);

  // Utility functions
  const calculateDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper function to get company logo URL
  const getCompanyLogoUrl = (
    logo: string | null,
    companyName: string
  ): string => {
    if (logo && logo.trim() !== "") {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${logo}`;
    }

    const encodedName = encodeURIComponent(companyName);
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  };

  // Cookie helper functions
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  // Check user authentication using cookie
  const checkUserAuth = (): boolean => {
    try {
      setCheckingAuth(true);

      // Check for isLogin cookie
      const isLoginCookie = getCookie("isLogin");
      const isAuthenticated = isLoginCookie !== null && isLoginCookie !== "";

      setIsLoggedIn(isAuthenticated);
      return isAuthenticated;
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsLoggedIn(false);
      return false;
    } finally {
      setCheckingAuth(false);
    }
  };

  // Check user profile
  const checkUserProfile = async (): Promise<boolean> => {
    try {
      setCheckingProfile(true);

      const response = await apiBissaKerja.get<UserProfileResponse>(
        "/check-user-profile"
      );

      if (response.data.userProfileDataExist === true) {
        setUserProfileExists(true);
        return true;
      } else {
        setUserProfileExists(false);
        return false;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("Anda perlu login untuk mengakses fitur ini.");
        setIsLoggedIn(false);
      }
      setUserProfileExists(false);
      return false;
    } finally {
      setCheckingProfile(false);
    }
  };

  // Fetch jobs
  const fetchJobs = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiBissaKerja.get<ApiResponse>("/job-vacancies");

      if (response.data.success === true) {
        const jobsData = response.data.data || [];
        setJobs(jobsData);

        // Only check apply statuses if user is logged in
        if (isLoggedIn) {
          await checkAllApplyStatuses(jobsData);
        }
      } else {
        setJobs([]);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 404) {
          setJobs([]);
        } else if (axiosError.response?.status === 500) {
          setError(
            "Terjadi gangguan pada sistem. Silakan coba lagi dalam beberapa saat."
          );
        } else if (axiosError.response?.status === 401) {
          setError("Anda perlu login untuk melihat data lowongan pekerjaan.");
          setIsLoggedIn(false);
        } else if (axiosError.response?.status === 403) {
          setError("Anda tidak memiliki akses untuk melihat data ini.");
        } else if (!axiosError.response) {
          setError(
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
          );
        } else {
          setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Check apply status for all jobs
  const checkAllApplyStatuses = async (
    jobsData: JobVacancy[]
  ): Promise<void> => {
    if (!isLoggedIn) return;

    try {
      setCheckingStatus(true);
      const appliedJobIds = new Set<number>();

      await Promise.all(
        jobsData.map(async (job) => {
          try {
            const response = await apiBissaKerja.get<ApplyStatusResponse>(
              `/check-apply-status/${job.id}`
            );

            if (response.data.success && response.data.applied === true) {
              appliedJobIds.add(job.id);
            }
          } catch (error) {
            // Ignore errors for jobs not applied
          }
        })
      );

      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error("Error checking apply statuses:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Handle apply click
  const handleApplyClick = async (job: JobVacancy): Promise<void> => {
    if (appliedJobs.has(job.id)) {
      return;
    }

    // Check if user is logged in using cookie
    const isAuthenticated = checkUserAuth();

    if (!isAuthenticated) {
      // Show login modal
      setSelectedJob(job);
      setShowProfileModal(true);
      return;
    }

    // Then check profile completeness
    const hasProfile = await checkUserProfile();

    if (!hasProfile) {
      // Show profile completion modal
      setSelectedJob(job);
      setShowProfileModal(true);
      return;
    }

    // Proceed with application
    await handleApply(job.id);
  };

  // Handle job application
  const handleApply = async (jobId: number): Promise<void> => {
    try {
      setApplyingJobId(jobId);

      const response = await apiBissaKerja.post(`apply-job/${jobId}`, {
        lowongan_id: jobId,
      });

      if (response.data.success) {
        setAppliedJobs((prev) => new Set(prev).add(jobId));
      } else {
        setError(response.data.message || "Gagal mengirim lamaran.");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
        setIsLoggedIn(false);
      } else {
        setError("Gagal mengirim lamaran. Silakan coba lagi.");
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      // Check authentication first using cookie
      const authenticated = checkUserAuth();

      // Fetch jobs regardless of authentication status
      await fetchJobs();

      // Only check profile if authenticated
      if (authenticated) {
        await checkUserProfile();
      }
    };

    initializeData();
  }, []);

  // Listen for cookie changes (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = () => {
      const authenticated = checkUserAuth();
      if (authenticated !== isLoggedIn) {
        // Authentication status changed, refresh data
        if (authenticated) {
          checkUserProfile();
          // Refresh apply statuses
          checkAllApplyStatuses(jobs);
        } else {
          setUserProfileExists(false);
          setAppliedJobs(new Set());
        }
      }
    };

    // Listen for storage events (cross-tab login/logout)
    window.addEventListener("storage", handleStorageChange);

    // Check authentication periodically (in case cookie expires)
    const authCheckInterval = setInterval(() => {
      const authenticated = checkUserAuth();
      if (!authenticated && isLoggedIn) {
        // User was logged out (cookie expired)
        setUserProfileExists(false);
        setAppliedJobs(new Set());
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(authCheckInterval);
    };
  }, [isLoggedIn, jobs]);

  // Get unique values for filters
  const uniqueLocations = useMemo<string[]>(
    () => [...new Set(jobs.map((job) => job.location))],
    [jobs]
  );

  const filteredLocations = useMemo<string[]>(
    () =>
      uniqueLocations.filter((location) =>
        location.toLowerCase().includes(locationInput.toLowerCase())
      ),
    [uniqueLocations, locationInput]
  );

  const uniqueTypes = useMemo<string[]>(
    () => [...new Set(jobs.map((job) => job.job_type))],
    [jobs]
  );

  const disabilityTypes: string[] = [
    "Tuna Netra",
    "Tuna Rungu",
    "Tuna Daksa",
    "Disabilitas intelektual",
    "Disabilitas mental",
  ];

  // Close location dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = (location: string): void => {
    setLocationFilter(location);
    setLocationInput(location);
    setShowLocationDropdown(false);
  };

  const handleLocationInputChange = (value: string): void => {
    setLocationInput(value);
    setLocationFilter(value);
    setShowLocationDropdown(true);
  };

  // Filter and search logic
  const filteredJobs = useMemo<JobVacancy[]>(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.perusahaan_profile.nama_perusahaan
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesLocation =
        locationFilter === "" ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesDisability =
        disabilityFilter === "" ||
        job.disabilitas.some(
          (d) => d.kategori_disabilitas === disabilityFilter
        );

      const matchesType = typeFilter === "" || job.job_type === typeFilter;

      return (
        matchesSearch && matchesLocation && matchesDisability && matchesType
      );
    });

    // Sort logic
    switch (sortBy) {
      case "oldest":
        return filtered.reverse();
      case "salary-high":
        return filtered.sort((a, b) => {
          const salaryA =
            parseInt(a.salary_range.replace(/[^\d]/g, "").substring(8)) || 0;
          const salaryB =
            parseInt(b.salary_range.replace(/[^\d]/g, "").substring(8)) || 0;
          return salaryB - salaryA;
        });
      case "salary-low":
        return filtered.sort((a, b) => {
          const salaryA =
            parseInt(a.salary_range.replace(/[^\d]/g, "").substring(0, 8)) || 0;
          const salaryB =
            parseInt(b.salary_range.replace(/[^\d]/g, "").substring(0, 8)) || 0;
          return salaryA - salaryB;
        });
      default:
        return filtered;
    }
  }, [jobs, searchTerm, locationFilter, disabilityFilter, typeFilter, sortBy]);

  const clearFilters = (): void => {
    setSearchTerm("");
    setLocationFilter("");
    setLocationInput("");
    setDisabilityFilter("");
    setTypeFilter("");
    setSortBy("newest");
    setShowLocationDropdown(false);
  };

  const hasActiveFilters: boolean = !!(
    searchTerm ||
    locationFilter ||
    disabilityFilter ||
    typeFilter ||
    sortBy !== "newest"
  );

  // Job Card Component
  const JobCard: React.FC<{ job: JobVacancy }> = ({ job }) => {
    const daysRemaining = calculateDaysRemaining(job.application_deadline);
    const skills = job.skills.slice(0, 4);
    const isApplied = appliedJobs.has(job.id);
    const isApplying = applyingJobId === job.id;
    const hasDisabilitySupport = job.disabilitas && job.disabilitas.length > 0;

    const getDeadlineColorClass = (days: number): string => {
      if (days <= 3)
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      if (days <= 7)
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    };

    const getApplyButtonConfig = () => {
      if (isApplied) {
        return {
          text: "Sudah Dilamar",
          className:
            "flex-1 bg-green-600 text-center text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-75",
          icon: Check,
          disabled: true,
        };
      } else if (isApplying) {
        return {
          text: "Mengirim...",
          className:
            "flex-1 bg-blue-500 text-center text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-75",
          icon: Loader2,
          disabled: true,
        };
      } else {
        return {
          text: "Lamar Sekarang",
          className:
            "flex-1 bg-brand-500 hover:bg-brand-600 text-center text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
          icon: Send,
          disabled: false,
        };
      }
    };

    const buttonConfig = getApplyButtonConfig();
    const ButtonIcon = buttonConfig.icon;

    return (
      <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
        <div className="flex-1">
          {/* Header */}
          <header className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={getCompanyLogoUrl(
                    job.perusahaan_profile.logo,
                    job.perusahaan_profile.nama_perusahaan
                  )}
                  alt={`Logo perusahaan ${job.perusahaan_profile.nama_perusahaan}`}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const encodedName = encodeURIComponent(
                      job.perusahaan_profile.nama_perusahaan
                    );
                    target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
                  }}
                />
                {hasDisabilitySupport && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1"
                    title="Ramah disabilitas"
                  >
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  title={job.job_title}
                >
                  {job.job_title}
                </h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 truncate"
                  title={job.perusahaan_profile.nama_perusahaan}
                >
                  {job.perusahaan_profile.nama_perusahaan}
                </p>
              </div>
            </div>
          </header>

          {/* Job Details */}
          <section className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate" title={job.location}>
                {job.location}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate" title={job.salary_range}>
                {job.salary_range || "Kompetitif"}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span title={job.job_type}>{job.job_type}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate" title={job.experience}>
                {job.experience}
              </span>
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                    title={skill}
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{job.skills.length - 4} lagi
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Disability Support */}
          {hasDisabilitySupport && (
            <div className="mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Heart className="w-4 h-4 text-blue-600 flex-shrink-0 mr-2" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Mendukung Disabilitas:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.disabilitas.map((disability: DisabilitasType) => (
                    <span
                      key={disability.id}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {disability.kategori_disabilitas} (
                      {disability.tingkat_disabilitas})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <footer className="flex space-x-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => handleApplyClick(job)}
            disabled={buttonConfig.disabled}
            className={buttonConfig.className}
          >
            <div className="flex items-center justify-center gap-2">
              <ButtonIcon
                className={`w-4 h-4 ${isApplying ? "animate-spin" : ""}`}
              />
              {buttonConfig.text}
            </div>
          </button>

          <Link
            href={`/cari-kerja/detail/${job.id}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Detail
          </Link>
        </footer>
      </article>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cari Pekerjaan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Memuat data lowongan pekerjaan...
            </p>
          </div>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-800 h-48 rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cari Pekerjaan
            </h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gagal Memuat Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchJobs}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cari Pekerjaan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Temukan peluang karier yang sesuai dengan keahlian dan kebutuhan
            Anda
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm mb-6">
          {/* Main Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan posisi, perusahaan, atau keahlian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <Filter className="h-4 w-4" />
              Filter & Urutkan
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Menampilkan{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredJobs.length}
              </span>{" "}
              dari {jobs.length} lowongan
              {checkingStatus && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  (Memeriksa status...)
                </span>
              )}
              {checkingAuth && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  (Memeriksa autentikasi...)
                </span>
              )}
              {checkingProfile && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  (Memeriksa profil...)
                </span>
              )}
              {!checkingAuth && !isLoggedIn && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  (Belum login)
                </span>
              )}
              {!checkingProfile && isLoggedIn && !userProfileExists && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  (Profil belum lengkap)
                </span>
              )}
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Location Filter */}
                <div className="relative" ref={locationRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Lokasi
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ketik atau pilih lokasi..."
                      value={locationInput}
                      onChange={(e) =>
                        handleLocationInputChange(e.target.value)
                      }
                      onFocus={() => setShowLocationDropdown(true)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowLocationDropdown(!showLocationDropdown)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      {showLocationDropdown ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Dropdown Options */}
                  {showLocationDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {filteredLocations.length > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleLocationSelect("")}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600"
                          >
                            Semua Lokasi
                          </button>
                          {filteredLocations.map((location: string) => (
                            <button
                              key={location}
                              type="button"
                              onClick={() => handleLocationSelect(location)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              {location}
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                          Lokasi tidak ditemukan
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Disability Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Heart className="h-4 w-4 inline mr-1" />
                    Jenis Disabilitas
                  </label>
                  <select
                    value={disabilityFilter}
                    onChange={(e) => setDisabilityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Semua Jenis</option>
                    {disabilityTypes.map((type: string) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Tipe Pekerjaan
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Semua Tipe</option>
                    {uniqueTypes.map((type: string) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Urutkan
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="salary-high">Gaji Tertinggi</option>
                    <option value="salary-low">Gaji Terendah</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Hapus Semua Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Login Required Banner */}
        {!checkingAuth && !isLoggedIn && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Wajib login dulu:</strong> Untuk dapat melamar
                  pekerjaan, silakan login terlebih dahulu ke akun Anda.
                </p>
              </div>
              <Link
                href="/login"
                className="ml-3 text-sm bg-brand-500 hover:bg-brand-600 text-white px-3 py-1 rounded-md transition-colors"
              >
                Login Sekarang
              </Link>
            </div>
          </div>
        )}

        {/* Profile Status Banner */}
        {!checkingProfile && isLoggedIn && !userProfileExists && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Profil belum lengkap:</strong> Untuk dapat melamar
                  pekerjaan, silakan lengkapi profil dan resume Anda terlebih
                  dahulu.
                </p>
              </div>
              <Link
                href="/resume"
                className="ml-3 text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md transition-colors"
              >
                Lengkapi Profil
              </Link>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {locationFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                  📍 {locationFilter}
                  <button
                    onClick={() => {
                      setLocationFilter("");
                      setLocationInput("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {disabilityFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                  ♿ {disabilityFilter}
                  <button onClick={() => setDisabilityFilter("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm rounded-full">
                  ⏰ {typeFilter}
                  <button onClick={() => setTypeFilter("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Job Results */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredJobs.map((job: JobVacancy) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tidak ada lowongan ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Coba ubah kata kunci pencarian atau filter yang Anda gunakan
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredJobs.length > 0 && filteredJobs.length >= 9 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors text-sm">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>

      {/* Profile Warning/Login Modal */}
      {showProfileModal && selectedJob && (
        <div className="fixed inset-0 bg-gray-200/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            {!isLoggedIn ? (
              // Login Required Modal
              <>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Anda Belum Login
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Untuk melamar posisi <strong>{selectedJob.job_title}</strong>{" "}
                  di{" "}
                  <strong>
                    {selectedJob.perusahaan_profile.nama_perusahaan}
                  </strong>
                  , Anda perlu login terlebih dahulu.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login Sekarang
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      setSelectedJob(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </>
            ) : (
              // Profile Completion Modal
              <>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profil Belum Lengkap
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Untuk melamar posisi <strong>{selectedJob.job_title}</strong>{" "}
                  di{" "}
                  <strong>
                    {selectedJob.perusahaan_profile.nama_perusahaan}
                  </strong>
                  , Anda perlu melengkapi profil dan resume terlebih dahulu.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/resume"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Lengkapi Profil
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      setSelectedJob(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
