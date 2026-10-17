import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Users,
  Award,
  ExternalLink,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface PerusahaanProfileData {
  id: number;
  logo: string | null;
  nama_perusahaan: string;
  industri: string;
  tahun_berdiri: string;
  jumlah_karyawan: string;
  province_id: string;
  regencie_id: string;
  deskripsi: string;
  no_telp: string;
  link_website: string;
  alamat_lengkap: string;
  visi: string;
  misi: string;
  nilai_nilai: string | null;
  sertifikat: string | null;
  bukti_wajib_lapor: string | null;
  nib: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  status_verifikasi: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  logo_url: string;
  bukti_wajib_lapor_url: string | null;
  province: Province;
  regency: Regency;
  user: User;
}

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
}

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  companyId,
}) => {
  const [companyData, setCompanyData] = useState<PerusahaanProfileData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get company logo URL
  const getCompanyLogoUrl = (
    logoUrl: string | null,
    companyName: string
  ): string => {
    if (logoUrl && logoUrl.trim() !== "") {
      return logoUrl;
    }
    const encodedName = encodeURIComponent(companyName);
    return `https://ui-avatars.com/api/?name=${encodedName}&length=2`;
  };

  // Fetch company profile data
  const fetchCompanyProfile = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      // Menggunakan endpoint yang sesuai dengan route yang diberikan
      const response = await apiBissaKerja.get(`/perusahaan/${id}/profile`);

      if (response.data.success && response.data.data) {
        setCompanyData(response.data.data);
      } else {
        throw new Error(response.data.message || "Format respons tidak valid");
      }
    } catch (err) {
      console.error("Error fetching company profile:", err);
      setError("Gagal memuat profile perusahaan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyProfile(companyId);
    }
  }, [isOpen, companyId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCompanyData(null);
      setError(null);
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getVerificationStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "terverifikasi":
      case "verified":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          label: "Terverifikasi",
        };
      case "pending":
      case "menunggu":
        return {
          icon: Eye,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          label: "Menunggu Verifikasi",
        };
      case "rejected":
      case "ditolak":
        return {
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          label: "Ditolak",
        };
      default:
        return {
          icon: Eye,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-700",
          label: "Belum Diverifikasi",
        };
    }
  };

  const socialLinks = [
    {
      key: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
    {
      key: "instagram",
      icon: Instagram,
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      key: "facebook",
      icon: Facebook,
      label: "Facebook",
      color: "hover:text-blue-800",
    },
    {
      key: "twitter",
      icon: Twitter,
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      key: "youtube",
      icon: Youtube,
      label: "YouTube",
      color: "hover:text-red-600",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Perusahaan
          </h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600 dark:text-gray-400">
                  Memuat profile perusahaan...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => fetchCompanyProfile(companyId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Coba Lagi
              </button>
            </div>
          ) : companyData ? (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={getCompanyLogoUrl(
                      companyData.logo_url,
                      companyData.nama_perusahaan
                    )}
                    alt={`Logo ${companyData.nama_perusahaan}`}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const encodedName = encodeURIComponent(
                        companyData.nama_perusahaan
                      );
                      target.src = `https://ui-avatars.com/api/?name=${encodedName}&length=2&size=96&background=3b82f6&color=ffffff`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {companyData.nama_perusahaan}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {companyData.industri}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Berdiri {companyData.tahun_berdiri}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {companyData.jumlah_karyawan} Karyawan
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {companyData.regency.name},{" "}
                          {companyData.province.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  {(() => {
                    const status = getVerificationStatus(
                      companyData.status_verifikasi
                    );
                    const StatusIcon = status.icon;
                    return (
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}
                      >
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {status.label}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Company Description */}
              {companyData.deskripsi && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Tentang Perusahaan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {companyData.deskripsi}
                  </p>
                </div>
              )}

              {/* Vision, Mission, Values */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companyData.visi && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
                      Visi
                    </h3>
                    <p className="text-blue-800 dark:text-blue-400 text-sm leading-relaxed">
                      {companyData.visi}
                    </p>
                  </div>
                )}
                {companyData.misi && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3">
                      Misi
                    </h3>
                    <p className="text-green-800 dark:text-green-400 text-sm leading-relaxed">
                      {companyData.misi}
                    </p>
                  </div>
                )}
                {companyData.nilai_nilai && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-3">
                      Nilai-Nilai
                    </h3>
                    <p className="text-purple-800 dark:text-purple-400 text-sm leading-relaxed">
                      {companyData.nilai_nilai}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informasi Kontak
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyData.alamat_lengkap && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Alamat
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {companyData.alamat_lengkap}
                        </p>
                      </div>
                    </div>
                  )}
                  {companyData.no_telp && (
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Telepon
                        </p>
                        <a
                          href={`tel:${companyData.no_telp}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {companyData.no_telp}
                        </a>
                      </div>
                    </div>
                  )}
                  {companyData.link_website && (
                    <div className="flex items-start">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Website
                        </p>
                        <a
                          href={companyData.link_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                        >
                          {companyData.link_website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Media Sosial
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(({ key, icon: Icon, label, color }) => {
                    const url = companyData[
                      key as keyof PerusahaanProfileData
                    ] as string;
                    if (!url) return null;

                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 ${color} transition-colors text-sm font-medium`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Company Documents */}
              {(companyData.sertifikat ||
                companyData.bukti_wajib_lapor ||
                companyData.nib) && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Dokumen Perusahaan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {companyData.sertifikat && (
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Sertifikat
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Tersedia
                          </p>
                        </div>
                      </div>
                    )}
                    {companyData.bukti_wajib_lapor && (
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Wajib Lapor
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Tersedia
                          </p>
                          {companyData.bukti_wajib_lapor_url && (
                            <a
                              href={companyData.bukti_wajib_lapor_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1"
                            >
                              Lihat Dokumen
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    {companyData.nib && (
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-purple-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            NIB
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {companyData.nib}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Information */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informasi Akun
                </h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={companyData.user.avatar}
                    alt={`Avatar ${companyData.user.name}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {companyData.user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {companyData.user.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Bergabung sejak{" "}
                      {new Date(companyData.user.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {companyData?.link_website && (
            <a
              href={companyData.link_website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Kunjungi Website
            </a>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileModal;
