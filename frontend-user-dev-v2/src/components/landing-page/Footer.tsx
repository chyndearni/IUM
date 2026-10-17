export default function Footer() {
  return (
    <footer className="bg-slate-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Logo and Description */}
          <div className="space-y-6">
            {/* JATIM BISSA Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo/jatimbissa.png"
                alt="JATIM BISSA Logo"
                className="h-16 w-auto"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  JATIM BISSA
                </h2>
                <p className="text-sm text-gray-300">
                  BASIS DATA DISABILITAS BERDAYA
                </p>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 leading-relaxed max-w-lg">
              JATIM BISSA (Basis Data Disabilitas Berdaya) merupakan platform jaringan kerja antara penyandang 
              disabilitas dan perusahaan
            </p>
          </div>

          {/* Right Side - Social Media and Copyright */}
          <div className="space-y-8">
            {/* Social Media Icons */}
            <div className="flex justify-center lg:justify-end space-x-4">
              <a
                href="https://www.instagram.com/naker_jatim/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram JatimBissa (buka di tab baru)"
                className="w-10 h-10 bg-gray-600 border border-gray-500 rounded-md flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-600 border border-gray-500 rounded-md flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-600 border border-gray-500 rounded-md flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a> */}
            </div>
            
            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Developed by <span className="text-white">Universitas Telkom Kampus Surabaya</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}