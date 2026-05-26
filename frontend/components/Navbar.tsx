"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav style={{ background: "#1a1220" }} className="shadow-lg border-b border-[#4a3570]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/primebox-logo.svg"
              alt="PrimeBox"
              width={140}
              height={50}
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-6">
            <div className="text-sm text-[#9b7fd4]">
              Bem-vindo,{" "}
              <span className="font-semibold text-white">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
              style={{ background: "#E24B4A" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
