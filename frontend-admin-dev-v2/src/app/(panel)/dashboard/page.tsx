import type { Metadata } from "next";
import {
  Users,
  Building2,
  UserCheck,
  FileText,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard | Jatim Bissa Platform",
  description: "Admin dashboard untuk mengelola platform Jatim Bissa",
};

export default function DashboardPage() {
  // Mock data - replace with real data from your API
  const stats = {
    totalAdmins: 12,
    totalCompanies: 148,
    totalUsers: 2847,
    totalReports: 89,
    adminGrowth: 8.2,
    companyGrowth: 12.5,
    userGrowth: 15.7,
    reportGrowth: -3.2,
  };

  const recentActivities = [
    {
      id: 1,
      type: "user",
      action: "Pendaftaran user baru",
      details: "Ahmad Fauzi mendaftar sebagai pencari kerja",
      time: "2 menit yang lalu",
    },
    {
      id: 2,
      type: "company",
      action: "Perusahaan baru terdaftar",
      details: "PT Teknologi Nusantara bergabung ke platform",
      time: "15 menit yang lalu",
    },
    {
      id: 3,
      type: "report",
      action: "Laporan baru masuk",
      details: "Laporan spam dari user tentang lowongan kerja",
      time: "1 jam yang lalu",
    },
    {
      id: 4,
      type: "admin",
      action: "Admin baru ditambahkan",
      details: "Siti Nurhaliza ditambahkan sebagai admin regional",
      time: "2 jam yang lalu",
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: "company",
      name: "PT Digital Indonesia",
      status: "Menunggu verifikasi dokumen",
      submittedAt: "2024-01-15",
    },
    {
      id: 2,
      type: "report",
      name: "Laporan konten tidak pantas",
      status: "Menunggu review",
      submittedAt: "2024-01-14",
    },
    {
      id: 3,
      type: "company",
      name: "CV Maju Bersama",
      status: "Menunggu verifikasi alamat",
      submittedAt: "2024-01-13",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Admin
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Selamat datang di panel administrasi Jatim Bissa Platform
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Baru
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Admin Management Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Admin
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalAdmins}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-700 dark:text-green-400 font-medium">
              +{stats.adminGrowth}%
            </span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        {/* Company Management Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Perusahaan
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalCompanies}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/20">
              <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-700 dark:text-green-400 font-medium">
              +{stats.companyGrowth}%
            </span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        {/* User Management Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Pengguna
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900/20">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-700 dark:text-green-400 font-medium">
              +{stats.userGrowth}%
            </span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        {/* Reports Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Laporan
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalReports}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full dark:bg-orange-900/20">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-700 dark:text-red-400 font-medium">
              {stats.reportGrowth}%
            </span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Management Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Link
          href="/dashboard/admin-management"
          className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-500">
              Kelola Admin
            </h3>
            <UserCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tambah, edit, atau hapus admin sistem
          </p>
          <div className="flex items-center text-sm text-brand-500 font-medium">
            Kelola Admin
            <Eye className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/company-management"
          className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-500">
              Kelola Perusahaan
            </h3>
            <Building2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Verifikasi dan kelola data perusahaan
          </p>
          <div className="flex items-center text-sm text-brand-500 font-medium">
            Kelola Perusahaan
            <Eye className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/user-management"
          className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-500">
              Kelola Pengguna
            </h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Monitor dan kelola akun pengguna
          </p>
          <div className="flex items-center text-sm text-brand-500 font-medium">
            Kelola Pengguna
            <Eye className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/reports"
          className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-500">
              Kelola Laporan
            </h3>
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Review dan tindak lanjuti laporan
          </p>
          <div className="flex items-center text-sm text-brand-500 font-medium">
            Kelola Laporan
            <Eye className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Recent Activities and Pending Approvals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Aktivitas Terbaru
              </h3>
              <Link
                href="/dashboard/activities"
                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
              >
                Lihat Semua
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "user"
                        ? "bg-purple-100 dark:bg-purple-900/20"
                        : activity.type === "company"
                        ? "bg-green-100 dark:bg-green-900/20"
                        : activity.type === "report"
                        ? "bg-orange-100 dark:bg-orange-900/20"
                        : "bg-blue-100 dark:bg-blue-900/20"
                    }`}
                  >
                    {activity.type === "user" && (
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                    {activity.type === "company" && (
                      <Building2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                    {activity.type === "report" && (
                      <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    )}
                    {activity.type === "admin" && (
                      <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menunggu Persetujuan
              </h3>
              <Link
                href="/dashboard/approvals"
                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
              >
                Lihat Semua
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {item.type === "company" ? (
                        <Building2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-orange-500" />
                      )}
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Diajukan: {item.submittedAt}
                    </p>
                  </div>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Opsi lainnya"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
