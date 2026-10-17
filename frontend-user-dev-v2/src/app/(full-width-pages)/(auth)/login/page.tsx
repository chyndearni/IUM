import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Login | JatimBissa",
  description: "Jawa Timur Basis Data Disabilitas Berdaya",
};

export default function Login() {
  return <SignInForm />;
}
