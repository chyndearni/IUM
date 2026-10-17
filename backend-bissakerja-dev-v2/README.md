# 📌 Daftar Status Code HTTP (2xx - 5xx)

## 🟢 2xx - Success (Berhasil)
Kode ini menunjukkan bahwa permintaan telah berhasil diproses oleh server.

| **Kode** | **Deskripsi** |
|----------|--------------|
| **200 OK** | Permintaan berhasil diproses. |
| **201 Created** | Permintaan berhasil, sumber daya baru telah dibuat. |
| **202 Accepted** | Permintaan diterima, tetapi belum diproses sepenuhnya. |
| **203 Non-Authoritative Information** | Response berasal dari sumber lain. |
| **204 No Content** | Permintaan berhasil tanpa mengembalikan data. |
| **205 Reset Content** | Sama seperti 204, tetapi klien harus mereset tampilan. |
| **206 Partial Content** | Server mengirimkan sebagian data yang diminta. |

---

## 🟡 3xx - Redirection (Pengalihan)
Kode ini menunjukkan bahwa klien perlu melakukan tindakan lebih lanjut.

| **Kode** | **Deskripsi** |
|----------|--------------|
| **300 Multiple Choices** | Permintaan memiliki beberapa pilihan sumber daya. |
| **301 Moved Permanently** | Sumber daya telah dipindahkan secara permanen. |
| **302 Found** | Sumber daya dipindahkan sementara. |
| **303 See Other** | Respons berada di lokasi lain, gunakan metode GET. |
| **304 Not Modified** | Sumber daya belum berubah sejak permintaan terakhir. |
| **307 Temporary Redirect** | Pengalihan sementara dengan metode HTTP yang sama. |
| **308 Permanent Redirect** | Pengalihan permanen dengan metode HTTP yang sama. |

---

## 🔴 4xx - Client Error (Kesalahan Klien)
Kode ini menunjukkan kesalahan pada permintaan yang dikirim oleh klien.

| **Kode** | **Deskripsi** |
|----------|--------------|
| **400 Bad Request** | Permintaan tidak valid atau salah format. |
| **401 Unauthorized** | Klien belum terautentikasi. |
| **402 Payment Required** | Digunakan untuk transaksi berbayar (jarang digunakan). |
| **403 Forbidden** | Klien tidak memiliki izin akses. |
| **404 Not Found** | Sumber daya tidak ditemukan. |
| **405 Method Not Allowed** | Metode HTTP tidak diperbolehkan. |
| **406 Not Acceptable** | Format response tidak sesuai permintaan klien. |
| **407 Proxy Authentication Required** | Autentikasi diperlukan untuk proxy. |
| **408 Request Timeout** | Permintaan terlalu lama diproses. |
| **409 Conflict** | Konflik terjadi dalam permintaan (misalnya data duplikat). |
| **410 Gone** | Sumber daya telah dihapus permanen. |
| **411 Length Required** | Header `Content-Length` diperlukan. |
| **412 Precondition Failed** | Syarat dalam header tidak terpenuhi. |
| **413 Payload Too Large** | Ukuran permintaan terlalu besar. |
| **414 URI Too Long** | URL permintaan terlalu panjang. |
| **415 Unsupported Media Type** | Format data dalam permintaan tidak didukung. |
| **416 Range Not Satisfiable** | Data yang diminta di luar batas. |
| **417 Expectation Failed** | Server tidak bisa memenuhi permintaan `Expect`. |
| **418 I'm a teapot** | Kode lelucon dari protokol HTCPCP. |
| **421 Misdirected Request** | Permintaan dikirim ke server yang salah. |
| **422 Unprocessable Entity** | Permintaan valid tetapi tidak dapat diproses. |
| **423 Locked** | Sumber daya dikunci. |
| **424 Failed Dependency** | Permintaan gagal karena dependensi lain gagal. |
| **425 Too Early** | Server tidak mau memproses permintaan karena terlalu dini. |
| **426 Upgrade Required** | Klien harus memperbarui protokol. |
| **428 Precondition Required** | Permintaan membutuhkan precondition. |
| **429 Too Many Requests** | Klien mengirim terlalu banyak permintaan dalam waktu singkat. |
| **431 Request Header Fields Too Large** | Header permintaan terlalu besar. |
| **451 Unavailable For Legal Reasons** | Dilarang diakses karena alasan hukum. |

---

## 🟠 5xx - Server Error (Kesalahan Server)
Kode ini menunjukkan ada kesalahan di sisi server saat memproses permintaan.

| **Kode** | **Deskripsi** |
|----------|--------------|
| **500 Internal Server Error** | Kesalahan umum di server. |
| **501 Not Implemented** | Server tidak mendukung metode yang diminta. |
| **502 Bad Gateway** | Server bertindak sebagai gateway dan menerima respons tidak valid. |
| **503 Service Unavailable** | Server sedang tidak bisa menangani permintaan (overload atau maintenance). |
| **504 Gateway Timeout** | Server sebagai gateway tidak mendapatkan respons tepat waktu. |
| **505 HTTP Version Not Supported** | Versi HTTP tidak didukung. |
| **506 Variant Also Negotiates** | Konfigurasi server salah dalam negosiasi konten. |
| **507 Insufficient Storage** | Server tidak memiliki cukup ruang penyimpanan. |
| **508 Loop Detected** | Server mendeteksi loop tak terbatas dalam permintaan. |
| **510 Not Extended** | Ekstensi HTTP diperlukan untuk menangani permintaan. |
| **511 Network Authentication Required** | Autentikasi jaringan diperlukan. |

---

## 🎯 Kesimpulan
- **2xx** → Permintaan berhasil ✅
- **3xx** → Pengalihan 🔀
- **4xx** → Kesalahan dari klien ❌
- **5xx** → Kesalahan dari server ⚠️

## Third party library
- Sanctum
- opcodesio/log-viewer
- azishapidin/indoregion
