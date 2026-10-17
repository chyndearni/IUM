export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
              <img
                src="/images/logo/logo-jatim-bissa.png" 
                alt="Logo"
                className="w-32 h-full sm:w-46 sm:h-full"
              />
            </div>
            <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Platform inklusif yang menghubungkan penyandang disabilitas dengan
              peluang karier terbaik. Bersama-sama kita wujudkan dunia kerja yang
              lebih inklusif dan berkelanjutan.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                <img
                src="/images/brand/Facebook.svg" 
                alt="Logo"
                className="w-20 h-20 sm:w-22 sm:h-15 rounded-lg"
              />
              </div> */}
              {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                <img
                src="/images/brand/Twitter.png" 
                alt="InklusifKerja Logo"
                className="w-20 h-15 sm:w-22 sm:h-10 rounded-lg"
              />
              </div> */}
              <a
                href="https://www.instagram.com/naker_jatim/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
              >
                <img
                  src="/images/brand/instagram.svg"
                  alt="InklusifKerja Logo"
                  className="w-20 h-20 sm:w-22 sm:h-15 rounded-lg"
                />
              </a>
              {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                <img
                src="/images/brand/youtube.svg" 
                alt="InklusifKerja Logo"
                className="w-20 h-20 sm:w-22 sm:h-15 rounded-lg"
              />
              </div> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Cari Kerja
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Akademi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Toko
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Dukungan
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                >
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-6 sm:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © 2025 JatimBissa. Seluruh hak cipta dilindungi.
            </p>
            {/* Bagian "Powered by" dihilangkan */}
          </div>
        </div>
      </div>
    </footer>
  );
}