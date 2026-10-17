"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image"; // Use Next.js Image component
import Link from "next/link";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import companiesData from "@/data/companies.json";
import testimonialsData from "@/data/testimonials.json";
import apiBissaKerja from "@/lib/api-bissa-kerja";
import axios from "axios";
import {
  Users,
  Building2,
  FileText,
  Shield,
  MapPin,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Search,
  Send,
  DollarSign,
  Clock,
  Calendar,
  Heart,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";

// Define TypeScript interfaces for type safety
interface DisabilitasType {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
}

interface Job {
  id: string;
  job_title: string;
  perusahaan_profile?: {
    nama_perusahaan: string;
    logo?: string;
  };
  location: string;
  salary_range: string;
  job_type: string;
  description: string;
  requirements?: string;
  experience?: string;
  application_deadline?: string;
  skills?: string[];
  disabilitas?: DisabilitasType[];
}

interface Company {
  id: number;
  name: string;
  location: string;
  logo: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
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

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState<string | null>(null);

  // Authentication & Profile states
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [userProfileExists, setUserProfileExists] = useState<boolean>(false);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(false);

  // Modal state
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const companies: Company[] = companiesData;
  const testimonials: Testimonial[] = testimonialsData;

  // Helper function to get company logo URL
  const getCompanyLogoUrl = (
    logo: string | null | undefined,
    companyName: string
  ): string => {
    if (logo && logo.trim() !== "") {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${logo}`;
    }
    const encodedName = encodeURIComponent(companyName);
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  };

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        setIsLoggedIn(false);
      }
      setUserProfileExists(false);
      return false;
    } finally {
      setCheckingProfile(false);
    }
  };

  // Check apply status for all jobs
  const checkAllApplyStatuses = async (jobsData: Job[]): Promise<void> => {
    if (!isLoggedIn) return;

    try {
      setCheckingStatus(true);
      const appliedJobIds = new Set<string>();

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
  const handleApplyClick = async (job: Job): Promise<void> => {
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
  const handleApply = async (jobId: string): Promise<void> => {
    try {
      setApplyingJobId(jobId);

      const response = await apiBissaKerja.post(`apply-job/${jobId}`, {
        lowongan_id: jobId,
      });

      if (response.data.success) {
        setAppliedJobs((prev) => new Set(prev).add(jobId));
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsLoggedIn(false);
      }
      console.error("Failed to apply for job:", error);
    } finally {
      setApplyingJobId(null);
    }
  };

  // Job Card Component for Landing Page with Authentication
  const LandingJobCard: React.FC<{ job: Job }> = ({ job }) => {
    const companyName =
      job.perusahaan_profile?.nama_perusahaan || "Unknown Company";
    const companyLogo = job.perusahaan_profile?.logo;
    const daysRemaining = job.application_deadline
      ? calculateDaysRemaining(job.application_deadline)
      : null;
    const skills = job.skills?.slice(0, 4) || [];
    const hasDisabilitySupport = job.disabilitas && job.disabilitas.length > 0;
    const isApplied = appliedJobs.has(job.id);
    const isApplying = applyingJobId === job.id;

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
      <article className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
        <div className="flex-1">
          {/* Header */}
          <header className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={getCompanyLogoUrl(companyLogo, companyName)}
                  alt={`Logo ${companyName}`}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-600"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const encodedName = encodeURIComponent(companyName);
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {job.job_title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {companyName}
                </p>
              </div>
            </div>
          </header>

          {/* Job Details */}
          <section className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>

            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {job.salary_range || "Kompetitif"}
              </span>
            </div>

            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{job.job_type}</span>
            </div>

            {job.experience && (
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{job.experience}</span>
              </div>
            )}
          </section>

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
              {job.description}
            </p>
          </div>

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
                {job.skills && job.skills.length > 4 && (
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full">
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
                  {job.disabilitas!.map((disability: DisabilitasType) => (
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

        {/* Action Buttons */}
        <footer className="flex space-x-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
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
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 text-center"
          >
            Detail
          </Link>
        </footer>
      </article>
    );
  };

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await apiBissaKerja.get("/job-vacancies");
        if (response.data.success) {
          const jobsData = response.data.data || [];
          setJobs(jobsData);

          // Only check apply statuses if user is logged in
          if (isLoggedIn) {
            await checkAllApplyStatuses(jobsData);
          }
        } else {
          setJobs([]);
          setErrorJobs("Tidak ada data lowongan ditemukan");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setErrorJobs("Gagal mengambil data lowongan");
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [isLoggedIn]);

  // Initialize authentication and profile check
  useEffect(() => {
    const initializeAuth = async () => {
      // Check authentication first using cookie
      const authenticated = checkUserAuth();

      // Only check profile if authenticated
      if (authenticated) {
        await checkUserProfile();
      }
    };

    initializeAuth();
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

  // Theme is managed globally via ThemeProvider; no local dark mode state here

  // Testimonial navigation
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />
      <main id="main-content" role="main" className="">
        {/* Hero Section */}
        <section
          className="relative min-h-screen pt-48 sm:pt-24 pb-16 sm:pb-20 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
          aria-labelledby="hero-heading"
          role="banner"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/disabilitas.jpg"
              alt="Hero background"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/75 dark:bg-slate-900/80"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <header className="space-y-6">
                  <h1
                    id="hero-heading"
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
                  >
                    Solusi Profesional untuk
                    <span className="text-brand-400"> Karier Inklusif</span>
                  </h1>
                  <p className="text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                    Jatim Bissa adalah platform teknologi terdepan yang
                    menghubungkan talenta terbaik dengan perusahaan progresif.
                    Membangun ekosistem kerja yang inklusif, berkelanjutan, dan
                    mengutamakan kesetaraan.
                  </p>
                </header>
                <div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  role="group"
                  aria-label="Tombol aksi utama"
                >
                  <button
                    className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Mulai eksplorasi platform"
                  >
                    Mulai Eksplorasi
                  </button>
                  <button
                    className="border border-slate-300 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Pelajari lebih lanjut tentang platform"
                  >
                    Pelajari Lebih Lanjut
                  </button>
                </div>
                <section
                  className="grid grid-cols-3 gap-8 pt-8 max-w-md mx-auto lg:mx-0 border-t border-slate-200 dark:border-slate-700"
                  aria-label="Statistik platform"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Peluang Karier
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Mitra Perusahaan
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-sm text-slate-100 dark:text-slate-400 font-medium">
                      Tingkat Kepuasan
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section
          className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
          aria-labelledby="methodology-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="methodology-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
              >
                Metodologi Profesional
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
                Pendekatan sistematis dan terstruktur untuk memastikan
                pengalaman yang optimal dan hasil yang berkelanjutan
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              role="list"
            >
              {[
                {
                  icon: <UserPlus className="w-8 h-8" />,
                  title: "Registration & Onboarding",
                  description:
                    "Proses registrasi yang komprehensif dengan validasi identitas dan assessment kemampuan",
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Profile Development",
                  description:
                    "Pengembangan profil profesional dengan bantuan konsultan karier bersertifikat",
                },
                {
                  icon: <Search className="w-8 h-8" />,
                  title: "Intelligent Matching",
                  description:
                    "Sistem AI yang mencocokkan kandidat dengan peluang berdasarkan kompatibilitas holistik",
                },
                {
                  icon: <Send className="w-8 h-8" />,
                  title: "Application & Follow-up",
                  description:
                    "Proses aplikasi terintegrasi dengan tracking real-time dan support berkelanjutan",
                },
              ].map((item, index) => (
                <article
                  key={index}
                  className="text-center group"
                  role="listitem"
                  tabIndex={0}
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mx-auto group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors duration-300">
                      <div className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          className="relative py-16 sm:py-20 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
          aria-labelledby="services-heading"
          role="region"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/disabilitas2.jpg"
              alt="Services background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-900/60"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="services-heading"
                className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight"
              >
                Layanan Profesional Kami
              </h2>
              <p className="text-xl text-slate-200 max-w-3xl mx-auto font-light">
                Menyediakan solusi end-to-end untuk menciptakan ekosistem kerja
                yang berkelanjutan dan inklusif bagi semua kalangan
              </p>
            </header>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              role="list"
            >
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Penyandang Disabilitas",
                  description:
                    "Solusi komprehensif untuk penyandang disabilitas dalam mengembangkan karier profesional yang berkelanjutan",
                  category: "INDIVIDU",
                },
                {
                  icon: <Building2 className="w-8 h-8" />,
                  title: "Perusahaan",
                  description:
                    "Program kemitraan strategis untuk perusahaan dalam membangun workforce yang beragam dan inklusif",
                  category: "Mitra Perusahaan",
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Hubungan Pemerintah",
                  description:
                    "Kolaborasi dengan Disnaker dalam implementasi kebijakan ketenagakerjaan yang progresif",
                  category: "Pemerintah",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Komnas Disabilitas",
                  description:
                    "Kerjasama dengan Komnas Disabilitas untuk memastikan perlindungan hak dan standar industri",
                  category: "Regulasi",
                },
              ].map((service, index) => (
                <article
                  key={index}
                  className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700 group backdrop-blur-sm"
                  role="listitem"
                  aria-label={`${service.title}: ${service.description}`}
                  tabIndex={0}
                >
                  <div className="text-slate-600 dark:text-slate-400 mb-6 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <div className="mb-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Job Opportunities Section */}
        <section
          className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
          aria-labelledby="opportunities-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="opportunities-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
              >
                Peluang Karier Terkurasi
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
                Akses eksklusif ke posisi strategis dari perusahaan terkemuka
              </p>
            </header>

            {/* Login Required Banner for Landing Page */}
            {/* {!checkingAuth && !isLoggedIn && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Untuk melamar pekerjaan:</strong> Silakan login
                      terlebih dahulu untuk dapat melamar posisi yang tersedia.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="ml-3 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                  >
                    Login Sekarang
                  </Link>
                </div>
              </div>
            )} */}

            {/* Profile Status Banner for Landing Page */}
            {!checkingProfile && isLoggedIn && !userProfileExists && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Profil belum lengkap:</strong> Lengkapi profil dan
                      resume Anda untuk dapat melamar pekerjaan.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingJobs ? (
                <div className="col-span-3 text-center py-8 text-slate-600 dark:text-slate-400">
                  Memuat data lowongan...
                  {checkingStatus && (
                    <span className="block mt-2 text-blue-600 dark:text-blue-400">
                      (Memeriksa status lamaran...)
                    </span>
                  )}
                </div>
              ) : errorJobs ? (
                <div className="col-span-3 text-center py-8 text-red-500">
                  {errorJobs}
                </div>
              ) : jobs.length > 0 ? (
                jobs
                  .slice(0, 6)
                  .map((job) => <LandingJobCard key={job.id} job={job} />)
              ) : (
                <div className="col-span-3 text-center py-8 text-slate-600 dark:text-slate-400">
                  Tidak ada peluang tersedia
                </div>
              )}
            </div>
            <div className="text-center mt-16">
              <Link
                href="/cari-kerja"
                className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                Eksplorasi Semua Peluang
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800 relative"
          aria-labelledby="testimonials-heading"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/disabilitas3.jpg"
              alt="Testimonials background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-900/60"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <header className="text-left mb-8 lg:mb-0">
                <h2
                  id="testimonials-heading"
                  className="text-3xl sm:text-4xl font-bold text-slate-200 dark:text-white mb-4 tracking-tight"
                >
                  Testimoni Profesional
                </h2>
                <p className="text-xl text-slate-200 dark:text-slate-400 max-w-md font-light">
                  Perspektif dari para profesional yang telah merasakan dampak
                  transformatif yang luar biasa dari platform kami, memberikan
                  wawasan berharga tentang bagaimana solusi inovatif kami telah
                  mengubah cara mereka menavigasi dunia karier dan mencapai
                  kesuksesan.
                </p>
              </header>
              <div
                role="region"
                aria-label="Carousel testimoni profesional"
                aria-live="polite"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-slate-700 dark:text-slate-300 font-bold text-xl">
                        {testimonials[currentTestimonial].avatar}
                      </span>
                    </div>
                    <blockquote className="text-lg text-slate-900 dark:text-white font-light leading-relaxed mb-6 italic pl-12 pr-12">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    <div className="space-y-2">
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 font-medium text-sm">
                        {testimonials[currentTestimonial].role}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-500">
                        {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  aria-label="Testimoni sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  aria-label="Testimoni selanjutnya"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Network Section */}
        <section
          className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
          aria-labelledby="network-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2
                id="network-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
              >
                Jaringan Mitra Strategis
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
                Kolaborasi dengan organisasi terkemuka yang berbagi visi
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <article
                  key={company.id}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                        {company.logo}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {company.name}
                      </h3>
                      <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1" /> {company.location}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-sm transition-colors duration-300">
                      Lihat Kemitraan →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Profile Warning/Login Modal */}
      {showProfileModal && selectedJob && (
        <div className="fixed inset-0 bg-gray-200/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            {!isLoggedIn ? (
              // Login Required Modal
              <>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-brand-500 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Anda Belum Login
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Untuk melamar posisi <strong>{selectedJob.job_title}</strong>{" "}
                  di{" "}
                  <strong>
                    {selectedJob.perusahaan_profile?.nama_perusahaan ||
                      "perusahaan ini"}
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
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
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
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Profil Belum Lengkap
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Untuk melamar posisi <strong>{selectedJob.job_title}</strong>{" "}
                  di{" "}
                  <strong>
                    {selectedJob.perusahaan_profile?.nama_perusahaan ||
                      "perusahaan ini"}
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
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;
