import { useEffect } from "react";

/**
 * Mengatur judul tab browser (document.title) dari dalam Client Component.
 *
 * Banyak halaman di sini dirender penuh sebagai Client Component ("use client"),
 * sehingga tidak bisa memakai `export const metadata` bawaan Next.js App Router
 * (metadata hanya berlaku di Server Component). Tanpa <title> yang deskriptif,
 * pengguna pembaca layar/banyak tab tidak bisa mengidentifikasi halaman saat
 * berpindah tab — lihat WCAG 2.4.2 (Page Titled).
 */
const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
