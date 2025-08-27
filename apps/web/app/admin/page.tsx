"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - şimdilik basit kontrol
    if (
      credentials.username === "admin" &&
      credentials.password === "lokascore2024"
    ) {
      // Session storage'a admin bilgisini kaydet
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem(
        "adminUser",
        JSON.stringify({
          username: "admin",
          role: "Administrator",
          loginTime: new Date().toISOString(),
        })
      );

      router.push("/admin/dashboard");
    } else {
      alert("Geçersiz kullanıcı adı veya şifre!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <span className="text-2xl font-bold text-blue-600">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LOKASCORE</h1>
          <p className="text-blue-200">Yönetici Paneli</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Admin kullanıcı adı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Şifre
              </label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Admin şifresi"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <span>Giriş Yap</span>
              )}
            </button>
          </form>

          {/* Demo Bilgileri */}
          <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <p className="text-sm text-blue-100 font-medium mb-2">
              Demo Bilgileri:
            </p>
            <p className="text-xs text-blue-200">
              Kullanıcı: <code className="bg-white/20 px-1 rounded">admin</code>
            </p>
            <p className="text-xs text-blue-200">
              Şifre:{" "}
              <code className="bg-white/20 px-1 rounded">lokascore2024</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">LOKASCORE Admin Panel v2.0.0</p>
        </div>
      </div>
    </div>
  );
}
