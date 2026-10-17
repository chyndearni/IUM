import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Pendaftaran | JatimBissa",
  description: "Jawa Timur Basis Data Disabilitas Berdaya",
  // other metadata
};

export default function Register() {
  return <SignUpForm />;
}
