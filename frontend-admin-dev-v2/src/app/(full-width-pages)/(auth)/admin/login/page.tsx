import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Halaman login untuk Admin",
};

export default function SignIn() {
  return <SignInForm />;
}
