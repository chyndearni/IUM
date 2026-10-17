import React from 'react';
import { 
  MapPin, Clock, DollarSign, Users, Building, Calendar, Share2, Heart, 
  CheckCircle, Globe, Mail, Phone, Star, Award, TrendingUp, Shield,
  Coffee, Zap, BookOpen, Target, ArrowRight, ExternalLink
} from 'lucide-react';

interface JobDetailProps  {
  classCustom?: string
}

export default function JobDetail({classCustom} : JobDetailProps) {
  // Sample job detail data
  const jobDetail = {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Innovate",
    location: "Jakarta Selatan, DKI Jakarta",
    salary: "Rp 8,000,000 - 12,000,000",
    type: "Full-time",
    posted: "2 hari yang lalu",
    deadline: "30 Desember 2024",
    experience: "2-4 tahun",
    education: "S1 Teknik Informatika / Sistem Informasi",
    logo: "https://techinnovate.infinityfreeapp.com/wp-content/uploads/2023/07/cropped-icon.png",
    description: "Kami mencari Frontend Developer berpengalaman untuk bergabung dengan tim pengembangan produk digital kami. Anda akan bertanggung jawab untuk mengembangkan antarmuka pengguna yang menarik dan responsif menggunakan teknologi modern seperti React dan TypeScript. Bergabunglah dengan tim yang passionate dalam menciptakan solusi digital yang inovatif dan berdampak.",
    requirements: [
      "Minimal 2 tahun pengalaman dalam pengembangan Frontend",
      "Menguasai React.js dan ekosistemnya (Redux, Context API)",
      "Pengalaman dengan TypeScript dan modern JavaScript (ES6+)",
      "Familiar dengan Tailwind CSS atau CSS framework lainnya",
      "Pemahaman tentang responsive design dan cross-browser compatibility",
      "Pengalaman dengan version control (Git) dan workflow kolaboratif",
      "Kemampuan bekerja dalam tim dan komunikasi yang baik",
      "Memiliki portfolio yang dapat dipertanggungjawabkan",
      "Pengalaman dengan testing framework (Jest, React Testing Library)",
      "Pemahaman tentang performance optimization dan accessibility"
    ],
    responsibilities: [
      "Mengembangkan dan memelihara aplikasi web menggunakan React.js",
      "Berkolaborasi dengan tim design untuk mengimplementasikan UI/UX yang menarik",
      "Menulis kode yang clean, maintainable, dan well-documented",
      "Melakukan testing dan debugging untuk memastikan kualitas aplikasi",
      "Mengoptimalkan performa aplikasi untuk berbagai perangkat dan browser",
      "Berpartisipasi dalam code review dan knowledge sharing",
      "Mengikuti best practices dalam pengembangan software",
      "Mentoring junior developer dan sharing knowledge dengan tim"
    ],
    benefits: [
      "Gaji kompetitif sesuai pengalaman",
      "Tunjangan kesehatan dan keluarga",
      "Flexible working hours",
      "Work from home 2 hari per minggu",
      "Training dan pengembangan karir",
      "Bonus performance tahunan",
      "Cuti tahunan 12 hari",
      "Team building dan company trip",
      "Laptop dan peralatan kerja terbaru",
      "Gym membership dan wellness program"
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML5", "CSS3", "Git", "REST API", "GraphQL", "Next.js"],
    companyInfo: {
      name: "Tech Innovate",
      industry: "Teknologi Informasi",
      size: "50-200 karyawan",
      founded: "2018",
      website: "https://techinnovate.co.id",
      email: "career@techinnovate.co.id",
      phone: "+62 21 1234 5678",
      address: "Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190",
      description: "Tech Innovate adalah perusahaan teknologi yang berfokus pada pengembangan solusi digital inovatif untuk berbagai industri. Kami berkomitmen untuk menciptakan produk yang dapat memberikan dampak positif bagi masyarakat dan membantu bisnis bertransformasi digital.",
      rating: 4.5,
      reviews: 127,
      culture: [
        "Innovation-driven environment",
        "Collaborative team culture",
        "Continuous learning mindset",
        "Work-life balance priority"
      ]
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: jobDetail.title,
        text: `Lowongan kerja ${jobDetail.title} di ${jobDetail.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${classCustom}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 transition-colors duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img 
                      src={jobDetail.logo} 
                      alt={jobDetail.company}
                      className="w-20 h-20 rounded-xl object-cover shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {jobDetail.title}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xl text-gray-600 dark:text-gray-300">
                        {jobDetail.company}
                      </p>
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                          {jobDetail.companyInfo.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {jobDetail.posted} • {jobDetail.companyInfo.reviews} reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleShare}
                    className="p-3 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Job Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">Lokasi</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{jobDetail.location}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="font-medium">Gaji</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{jobDetail.salary}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-medium">Tipe</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{jobDetail.type}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center text-orange-600 dark:text-orange-400 mb-2">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="font-medium">Deadline</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{jobDetail.deadline}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Keahlian yang Dibutuhkan
                </h3>
                <div className="flex flex-wrap gap-3">
                  {jobDetail.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <span>Lamar Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="flex-1 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-md">
                  Kontak HR
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Deskripsi Pekerjaan
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {jobDetail.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Persyaratan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobDetail.requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-600" />
                Tanggung Jawab
              </h2>
              <div className="space-y-4">
                {jobDetail.responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Coffee className="w-6 h-6 text-green-600" />
                Benefit & Fasilitas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobDetail.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Tentang Perusahaan
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={jobDetail.logo} 
                  alt={jobDetail.companyInfo.name}
                  className="w-16 h-16 rounded-xl object-cover shadow-md"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{jobDetail.companyInfo.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.companyInfo.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">({jobDetail.companyInfo.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {jobDetail.companyInfo.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Industri</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.companyInfo.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Ukuran</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.companyInfo.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Didirikan</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.companyInfo.founded}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Website</p>
                    <a href={jobDetail.companyInfo.website} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      Kunjungi Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Budaya Perusahaan</h4>
                <div className="space-y-2">
                  {jobDetail.companyInfo.culture.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Kontak</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Alamat</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.companyInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <a href={`mailto:${jobDetail.companyInfo.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      {jobDetail.companyInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Telepon</p>
                    <a href={`tel:${jobDetail.companyInfo.phone}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      {jobDetail.companyInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detail Lowongan</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="font-medium text-gray-900 dark:text-white">Pengalaman</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.experience}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="font-medium text-gray-900 dark:text-white">Pendidikan</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.education}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="font-medium text-gray-900 dark:text-white">Diposting</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{jobDetail.posted}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <p className="font-medium text-gray-900 dark:text-white">Batas Waktu</p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{jobDetail.deadline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}