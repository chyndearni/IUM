
export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">IK</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold">InklusifKerja</span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                  Platform inklusif yang menghubungkan penyandang disabilitas dengan peluang karier terbaik. 
                  Bersama-sama kita wujudkan dunia kerja yang lebih inklusif dan berkelanjutan.
                </p>
                <div className="flex space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                    <span className="text-xs sm:text-sm font-bold">f</span>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                    <span className="text-xs sm:text-sm font-bold">t</span>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                    <span className="text-xs sm:text-sm font-bold">in</span>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                    <span className="text-xs sm:text-sm font-bold">ig</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Tautan Cepat</h3>
                <ul className="space-y-1 sm:space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Beranda</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Cari Kerja</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Akademi</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Toko</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Tentang Kami</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Dukungan</h3>
                <ul className="space-y-1 sm:space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Pusat Bantuan</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Hubungi Kami</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Kebijakan Privasi</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base">Syarat & Ketentuan</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-6 sm:mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
                  © 2025 InklusifKerja. Seluruh hak cipta dilindungi.
                </p>
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <span className="text-gray-400 text-xs sm:text-sm">Powered by</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm">Accessibility Tech</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
  )
}
