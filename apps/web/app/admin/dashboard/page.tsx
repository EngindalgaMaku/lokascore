"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Dashboard Components
import SystemStatus from "../../../components/admin/SystemStatus";
import APITester from "../../../components/admin/APITester";
import MLModelManager from "../../../components/admin/MLModelManager";
import ScrapingManager from "../../../components/admin/ScrapingManager";
import RegionManager from "../../../components/admin/RegionManager";
import DashboardStats from "../../../components/admin/DashboardStats";

interface AdminUser {
  username: string;
  role: string;
  email?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    loading: boolean;
    error?: string;
  }>({ connected: false, loading: true });

  // Authentication check
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuth");
    const user = sessionStorage.getItem("adminUser");

    if (!isAuthenticated || isAuthenticated !== "true") {
      router.push("/admin");
      return;
    }

    if (user) {
      try {
        const parsedUser = JSON.parse(user) as AdminUser;
        setAdminUser(parsedUser);
      } catch (error) {
        console.error("Error parsing admin user:", error);
        // Set default admin user for demo
        setAdminUser({
          username: "admin",
          role: "Super Admin",
          email: "admin@lokascore.com",
        });
      }
    } else {
      // Set default admin user for demo
      setAdminUser({
        username: "admin",
        role: "Super Admin",
        email: "admin@lokascore.com",
      });
    }

    setIsLoading(false);
  }, [router]);

  // Database connection check
  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const response = await fetch("/api/test-db");
        const result = await response.json();

        setDbStatus({
          connected: result.success,
          loading: false,
          error: result.success ? undefined : result.error,
        });
      } catch (error) {
        setDbStatus({
          connected: false,
          loading: false,
          error: "Database connection test failed",
        });
      }
    };

    checkDatabaseConnection();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminUser");
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Admin paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Genel Bakış", icon: "📊" },
    { id: "system", name: "Sistem Durumu", icon: "🔧" },
    { id: "api", name: "API Test", icon: "🔌" },
    { id: "ml", name: "ML Yönetimi", icon: "🤖" },
    { id: "scraping", name: "Veri Toplama", icon: "🕷️" },
    { id: "regions", name: "Bölge Yönetimi", icon: "🗺️" },
  ];

  // Mobile Sidebar Component
  const MobileSidebar = ({
    tabs,
    activeTab,
    setActiveTab,
    setSidebarOpen,
  }: {
    tabs: Array<{ id: string; name: string; icon: string }>;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setSidebarOpen: (open: boolean) => void;
  }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 py-4 border-b border-gray-200">
        <span className="text-2xl">🎯</span>
        <span className="ml-2 text-lg font-bold text-gray-800">LOKASCORE</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Yönetim Paneli
          </h2>
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200 mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Hızlı İstatistikler
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Database</span>
              {dbStatus.loading ? (
                <span className="text-gray-400 font-medium">⏳ Kontrol...</span>
              ) : dbStatus.connected ? (
                <span className="text-green-600 font-medium">✅ Bağlı</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Hata</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">API Durumu</span>
              <span className="text-green-600 font-medium">✅ Aktif</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Toplam İşletme</span>
              <span className="text-blue-600 font-medium">1,247</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ML Modelleri</span>
              <span className="text-purple-600 font-medium">5 Aktif</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Aktif İşler</span>
              <span className="text-orange-600 font-medium">2 Çalışıyor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Sidebar Component
  const DesktopSidebar = ({
    tabs,
    activeTab,
    setActiveTab,
    collapsed,
  }: {
    tabs: Array<{ id: string; name: string; icon: string }>;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    collapsed: boolean;
  }) => (
    <div className="flex flex-col h-full">
      <div className={`p-4 ${collapsed ? "px-2" : "px-4"}`}>
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Yönetim Paneli
          </h2>
        )}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center ${
                collapsed ? "justify-center px-2 py-3" : "space-x-3 px-3 py-2"
              } rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              title={collapsed ? tab.name : ""}
            >
              <span className="text-lg">{tab.icon}</span>
              {!collapsed && <span className="font-medium">{tab.name}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats - only show when not collapsed */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Hızlı İstatistikler
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Database</span>
              {dbStatus.loading ? (
                <span className="text-gray-400 font-medium">⏳ Kontrol...</span>
              ) : dbStatus.connected ? (
                <span className="text-green-600 font-medium">✅ Bağlı</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Hata</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">API Durumu</span>
              <span className="text-green-600 font-medium">✅ Aktif</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Toplam İşletme</span>
              <span className="text-blue-600 font-medium">1,247</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ML Modelleri</span>
              <span className="text-purple-600 font-medium">5 Aktif</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Aktif İşler</span>
              <span className="text-orange-600 font-medium">2 Çalışıyor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {sidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Desktop toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {sidebarCollapsed ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7M19 19l-7-7 7-7"
                    />
                  )}
                </svg>
              </button>

              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span className="text-lg sm:text-xl font-bold text-gray-800">
                  LOKASCORE
                </span>
              </Link>
              <div className="hidden md:flex md:items-center md:space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  Admin Panel v2.0.0
                </span>

                {/* Database Status Indicator */}
                <div className="flex items-center space-x-2">
                  {dbStatus.loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">
                        DB Kontrol...
                      </span>
                    </div>
                  ) : dbStatus.connected ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">
                        DB Bağlı
                      </span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center space-x-2"
                      title={dbStatus.error || "Database bağlantı hatası"}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-600 font-medium">
                        DB Hata
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Frontend geçiş linki */}
              <Link
                href="/"
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                title="Frontend'e Git"
              >
                <span className="text-sm">🌐</span>
                <span className="hidden md:inline text-sm font-medium">
                  Frontend
                </span>
              </Link>

              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {adminUser?.username}
                </p>
                <p className="text-xs text-gray-500">{adminUser?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span className="text-sm">🚪</span>
                <span className="hidden sm:inline text-sm font-medium">
                  Çıkış
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex flex-col w-full max-w-xs bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <MobileSidebar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setSidebarOpen={setSidebarOpen}
              />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <nav
          className={`hidden lg:flex lg:flex-shrink-0 ${
            sidebarCollapsed ? "lg:w-16" : "lg:w-64"
          } bg-white shadow-sm border-r border-gray-200 transition-all duration-300`}
        >
          <DesktopSidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
          />
        </nav>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tab Content */}
                {activeTab === "overview" && <DashboardStats />}
                {activeTab === "system" && <SystemStatus />}
                {activeTab === "api" && <APITester />}
                {activeTab === "ml" && <MLModelManager />}
                {activeTab === "scraping" && <ScrapingManager />}
                {activeTab === "regions" && <RegionManager />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
