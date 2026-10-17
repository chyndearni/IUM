"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/landing-page/Navbar';
import Footer from '@/components/landing-page/Footer';
import JobCard from '@/components/company/JobCard';
import jobsData from "@/data/jobs.json";
import companiesData from "@/data/companies.json";
import testimonialsData from "@/data/testimonials.json";
import {  
  Users, 
  Building2, 
  FileText, 
  Shield,
  MapPin,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  UserPlus,
  Search,
  Send
} from 'lucide-react';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const LandingPage = () => {
  useDocumentTitle("JatimBissa | Platform Kerja Inklusif untuk Disabilitas");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const jobListings = jobsData
  const companies = companiesData
  const testimonials = testimonialsData

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    setMounted(true);
  }, []);

  // Listen for theme changes from other components (like Navbar)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setDarkMode(e.newValue === 'dark');
      }
    };
    // Listen for localStorage changes from other tabs/components
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setDarkMode(e.detail === 'dark');
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode, mounted]);

  // Testimonial slider navigation
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
        aria-label="Lewati ke konten utama"
      >
        Lewati ke konten utama
      </a>

      {/* Navbar - Fully Responsive */}
      <Navbar />

      <main id="main-content" role="main">
        {/* Hero Section - Responsive Layout */}
        <section 
          className="pt-16 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
          aria-labelledby="hero-heading"
          role="banner"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <header className="space-y-3 sm:space-y-4">
                  <h1 
                    id="hero-heading"
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                    aria-label="Temukan Karier Impian Anda - Platform inklusif untuk penyandang disabilitas"
                  >
                    Temukan Karier
                    <span className="text-brand-500 dark:text-brand-400"> Impian</span> Anda
                  </h1>
                  <p 
                    className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    aria-label="Platform inklusif yang menghubungkan penyandang disabilitas dengan perusahaan yang peduli. Wujudkan karier gemilang dengan dukungan teknologi yang accessibility-friendly."
                  >
                    Platform inklusif yang menghubungkan penyandang disabilitas dengan perusahaan yang peduli. 
                    Wujudkan karier gemilang dengan dukungan teknologi yang accessibility-friendly.
                  </p>
                </header>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start" role="group" aria-label="Tombol aksi utama">
                  <button 
                    className="bg-brand-500 hover:bg-brand-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    aria-label="Mulai mencari pekerjaan sekarang"
                  >
                    Mulai Cari Kerja
                  </button>
                  <button 
                    className="border-2 border-brand-500 text-brand-500 dark:text-brand-400 hover:bg-brand-500 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    aria-label="Pelajari lebih lanjut tentang platform kami"
                  >
                    Pelajari Lebih Lanjut
                  </button>
                </div>

                {/* Stats - Responsive Grid */}
                <section className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 max-w-md mx-auto lg:mx-0" aria-label="Statistik platform">
                  <div className="text-center" aria-label="10 ribu lebih lowongan pekerjaan tersedia">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" aria-label="10K+">10K+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lowongan</div>
                  </div>
                  <div className="text-center" aria-label="500 lebih perusahaan partner">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" aria-label="500+">500+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Perusahaan</div>
                  </div>
                  <div className="text-center" aria-label="95 persen tingkat kepuasan pengguna">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" aria-label="95%">95%</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Kepuasan</div>
                  </div>
                </section>
              </div>

              {/* Hero Image - Responsive positioning */}
              <aside className="relative order-first lg:order-last" aria-label="Fitur utama platform">
                <div className="bg-gradient-to-tr from-blue-400 to-purple-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3" aria-label="Proses mudah - Daftar dalam 3 langkah">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Proses Mudah</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Daftar dalam 3 langkah</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3" aria-label="Aman dan terpercaya - Data dilindungi">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Aman & Terpercaya</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Data dilindungi</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3" aria-label="Komunitas inklusif - Dukungan penuh">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Komunitas Inklusif</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Dukungan penuh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Category Cards Section - Responsive Grid */}
        <section 
          className="py-12 sm:py-16 bg-white dark:bg-gray-900"
          aria-labelledby="target-users-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-8 sm:mb-12">
              <h2 
                id="target-users-heading"
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                aria-label="Untuk Siapa Platform Ini?"
              >
                Untuk Siapa Platform Ini?
              </h2>
              <p 
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                aria-label="Kami melayani berbagai kalangan untuk menciptakan ekosistem kerja yang inklusif dan berkelanjutan"
              >
                Kami melayani berbagai kalangan untuk menciptakan ekosistem kerja yang inklusif dan berkelanjutan
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list" aria-label="Kategori pengguna platform">
              {[
                {
                  icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Penyandang Disabilitas",
                  description: "Temukan peluang karier yang sesuai dengan kemampuan dan minat Anda",
                  color: "bg-blue-500"
                },
                {
                  icon: <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Perusahaan",
                  description: "Rekrut talenta terbaik dan bangun tim yang beragam dan inklusif",
                  color: "bg-green-500"
                },
                {
                  icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Disnaker",
                  description: "Dinas Ketenagakerjaan untuk mengawasi dan memfasilitasi program inklusif",
                  color: "bg-purple-500"
                },
                {
                  icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Komnas Disabilitas",
                  description: "Komisi Nasional Disabilitas untuk advokasi dan perlindungan hak",
                  color: "bg-red-500"
                }
              ].map((card, index) => (
                <article 
                  key={index} 
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group focus-within:ring-2 focus-within:ring-blue-500"
                  role="listitem"
                  aria-label={`${card.title}: ${card.description}`}
                  tabIndex={0}
                >
                  <div className={`${card.color} text-white rounded-xl p-2 sm:p-3 w-fit mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                    {card.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings Section - Responsive Cards with Fixed Bottom Buttons */}
        <section 
          className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800"
          aria-labelledby="job-listings-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-8 sm:mb-12">
              <h2 
                id="job-listings-heading"
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                aria-label="Lowongan Pekerjaan Terbaru"
              >
                Lowongan Pekerjaan Terbaru
              </h2>
              <p 
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                aria-label="Temukan peluang karier yang sesuai dengan keahlian dan kebutuhan aksesibilitas Anda"
              >
                Temukan peluang karier yang sesuai dengan keahlian dan kebutuhan aksesibilitas Anda
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="list" aria-label="Daftar lowongan pekerjaan terbaru">
              {jobListings.map((job) => (
                <div key={job.id} role="listitem">
                  <JobCard job={job} urlDetail='/cari-kerja/detail'/>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 sm:mt-12">
              <button 
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Lihat semua lowongan pekerjaan yang tersedia"
              >
                Lihat Semua Lowongan
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section - Responsive Steps */}
        <section 
          className="py-12 sm:py-16 bg-white dark:bg-gray-900"
          aria-labelledby="how-it-works-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-8 sm:mb-12">
              <h2 
                id="how-it-works-heading"
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                aria-label="Cara Menggunakan Platform"
              >
                Cara Menggunakan Platform
              </h2>
              <p 
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                aria-label="Ikuti langkah sederhana ini untuk memulai perjalanan karier Anda"
              >
                Ikuti langkah sederhana ini untuk memulai perjalanan karier Anda
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" role="list" aria-label="Langkah-langkah menggunakan platform">
              {[
                {
                  step: "01",
                  icon: <UserPlus className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Buat Akun",
                  description: "Daftar dengan mudah menggunakan email atau media sosial"
                },
                {
                  step: "02",
                  icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Lengkapi Profil",
                  description: "Isi data diri, keahlian, dan preferensi aksesibilitas"
                },
                {
                  step: "03",
                  icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Cari Pekerjaan",
                  description: "Gunakan filter canggih untuk menemukan pekerjaan ideal"
                },
                {
                  step: "04",
                  icon: <Send className="w-6 h-6 sm:w-8 sm:h-8" />,
                  title: "Lamar Pekerjaan",
                  description: "Kirim lamaran dengan satu klik dan pantau statusnya"
                }
              ].map((item, index) => (
                <article 
                  key={index} 
                  className="text-center group focus-within:ring-2 focus-within:ring-blue-500 rounded-lg p-2"
                  role="listitem"
                  aria-label={`Langkah ${item.step}: ${item.title} - ${item.description}`}
                  tabIndex={0}
                >
                  <div className="relative mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors duration-300" aria-hidden="true">
                      <div className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <div 
                      className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs sm:text-sm font-bold w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                      aria-label={`Langkah ${item.step}`}
                    >
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Companies Section - Responsive 2x3 Grid */}
        <section 
          className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800"
          aria-labelledby="companies-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-8 sm:mb-12">
              <h2 
                id="companies-heading"
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                aria-label="Perusahaan Partner"
              >
                Perusahaan Partner
              </h2>
              <p 
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                aria-label="Bergabung dengan perusahaan-perusahaan terkemuka yang mendukung inklusivitas di tempat kerja"
              >
                Bergabung dengan perusahaan-perusahaan terkemuka yang mendukung inklusivitas di tempat kerja
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="list" aria-label="Daftar perusahaan partner">
              {companies.map((company) => (
                <article 
                  key={company.id} 
                  className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500"
                  role="listitem"
                  aria-label={`Perusahaan ${company.name} di ${company.location}`}
                  tabIndex={0}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div 
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                      aria-label={`Logo ${company.name}`}
                    >
                      <span className="text-white font-bold text-sm sm:text-lg">
                        {company.logo}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {company.name}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm" aria-label={`Lokasi: ${company.location}`}>
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" aria-hidden="true" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-xs sm:text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label={`Lihat lowongan pekerjaan di ${company.name}`}
                    >
                      Lihat Lowongan
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Responsive Slider */}
        <section 
          className="py-12 sm:py-16 bg-white dark:bg-gray-900"
          aria-labelledby="testimonials-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-8 sm:mb-12">
              <h2 
                id="testimonials-heading"
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                aria-label="Testimoni Pengguna"
              >
                Testimoni Pengguna
              </h2>
              <p 
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                aria-label="Dengarkan cerita sukses dari para pengguna yang telah menemukan karier impian mereka"
              >
                Dengarkan cerita sukses dari para pengguna yang telah menemukan karier impian mereka
              </p>
            </header>
            <div 
              className="relative max-w-4xl mx-auto"
              role="region"
              aria-label="Carousel testimoni pengguna"
              aria-live="polite"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
                <div className="text-center">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                    aria-label={`Avatar ${testimonials[currentTestimonial].name}`}
                  >
                    <span className="text-white font-bold text-lg sm:text-2xl">
                      {testimonials[currentTestimonial].avatar}
                    </span>
                  </div>
                  
                  <blockquote 
                    className="text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white font-medium leading-relaxed mb-4 sm:mb-6"
                    aria-label={`Testimoni: ${testimonials[currentTestimonial].content}`}
                  >
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="space-y-1">
                    <div 
                      className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
                      aria-label={`Nama: ${testimonials[currentTestimonial].name}`}
                    >
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div 
                      className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium"
                      aria-label={`Posisi: ${testimonials[currentTestimonial].role}`}
                    >
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div 
                      className="text-sm text-gray-600 dark:text-gray-400"
                      aria-label={`Perusahaan: ${testimonials[currentTestimonial].company}`}
                    >
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Responsive positioning */}
              <button
                onClick={prevTestimonial}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Testimoni sebelumnya"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Testimoni selanjutnya"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center space-x-2 mt-6 sm:mt-8" role="tablist" aria-label="Navigasi testimoni">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    // Tombol 24x24px (bukan cuma titiknya) supaya target sentuh
                    // memenuhi minimum WCAG 2.2 SC 2.5.8 — titik visualnya tetap
                    // kecil lewat <span> di dalam.
                    className="flex items-center justify-center w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Pergi ke testimoni ${index + 1} dari ${testimonials.length}`}
                    aria-selected={index === currentTestimonial}
                    role="tab"
                  >
                    <span
                      className={`block w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Responsive Layout */}
      <Footer/>

      {/* Screen Reader Only - CSS Class */}
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .focus\\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: 0.5rem 1rem;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;