"use client";
import { LoginForm } from "@/components/login-form";

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <LoginForm />
    </main>
  );
}
