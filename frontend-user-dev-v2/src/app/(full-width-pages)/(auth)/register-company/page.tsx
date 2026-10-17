import SignUpFormCompany from "@/components/auth/SignUpFormCompany";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Pendaftaran | JatimBissa",
  description: "Jawa Timur Basis Data Disabilitas Berdaya",
  // other metadata
};

export default function Register() {
  return <SignUpFormCompany />;
}
