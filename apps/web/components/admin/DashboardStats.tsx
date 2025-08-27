"use client";

import { useState, useEffect } from "react";

interface Stats {
  totalBusinesses: number;
  activeJobs: number;
  completedAnalyses: number;
  mlModels: number;
  regions: number;
  apiHealth: boolean;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    activeJobs: 0,
    completedAnalyses: 0,
    mlModels: 0,
    regions: 0,
    apiHealth: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // API health check
        const healthResponse = await fetch("http://localhost:8000/health");
        const healthData = await healthResponse.json();

        // Scraping stats
        const scrapingResponse = await fetch(
          "http://localhost:8000/scraping/stats"
        );
        const scrapingData = await scrapingResponse.json();

        // ML models
        const mlResponse = await fetch("http://localhost:8000/ml/models");
        const mlData = await mlResponse.json();

        // Regions
        const regionsResponse = await fetch(
          "http://localhost:8000/regions/list"
        );
        const regionsData = await regionsResponse.json();

        setStats({
          totalBusinesses: scrapingData.total_businesses_scraped || 0,
          activeJobs: scrapingData.active_scraping_jobs || 0,
          completedAnalyses: scrapingData.completed_scraping_jobs || 0,
          mlModels: mlData.length || 0,
          regions: regionsData.length || 0,
          apiHealth: healthData.status === "healthy",
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Mock data for demo
        setStats({
          totalBusinesses: 1247,
          activeJobs: 3,
          completedAnalyses: 89,
          mlModels: 5,
          regions: 4,
          apiHealth: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    trend,
    color,
  }: {
    icon: string;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: { value: string; positive: boolean };
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${color}`}>
              {isLoading
                ? "..."
                : typeof value === "number"
                ? value.toLocaleString()
                : value}
            </span>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.positive ? "↗" : "↘"} {trend.value}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Genel Bakış
        </h1>
        <p className="text-gray-600 mt-1">
          LOKASCORE platform istatistikleri ve sistem durumu
        </p>
      </div>

      {/* System Status Alert */}
      <div
        className={`rounded-lg p-4 border ${
          stats.apiHealth
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{stats.apiHealth ? "✅" : "❌"}</span>
          <span className="font-medium">
            API Durumu:{" "}
            {stats.apiHealth
              ? "Sistem Normal Çalışıyor"
              : "Bağlantı Sorunu Tespit Edildi"}
          </span>
        </div>
        {!stats.apiHealth && (
          <p className="text-sm mt-2">
            Backend API'ye erişilemiyor. Lütfen localhost:8000'de API'nin
            çalıştığından emin olun.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon="🏪"
          title="Toplam İşletme"
          value={stats.totalBusinesses}
          subtitle="Veritabanında kayıtlı işletme"
          trend={{ value: "+12%", positive: true }}
          color="text-blue-600"
        />

        <StatCard
          icon="⚙️"
          title="Aktif İşler"
          value={stats.activeJobs}
          subtitle="Çalışmakta olan scraping işi"
          color="text-orange-600"
        />

        <StatCard
          icon="📊"
          title="Tamamlanan Analiz"
          value={stats.completedAnalyses}
          subtitle="Başarıyla tamamlanan işlem"
          trend={{ value: "+8%", positive: true }}
          color="text-green-600"
        />

        <StatCard
          icon="🤖"
          title="ML Modelleri"
          value={stats.mlModels}
          subtitle="Aktif makine öğrenmesi modeli"
          color="text-purple-600"
        />

        <StatCard
          icon="🗺️"
          title="Bölgeler"
          value={stats.regions}
          subtitle="Tanımlanmış analiz bölgesi"
          color="text-indigo-600"
        />

        <StatCard
          icon="⚡"
          title="API Durumu"
          value={stats.apiHealth ? "Aktif" : "Pasif"}
          subtitle="Sistem erişilebilirlik durumu"
          color={stats.apiHealth ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Son Aktiviteler
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-lg">🕷️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Kaleiçi veri toplama işi başlatıldı
              </p>
              <p className="text-xs text-gray-500">2 dakika önce</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <span className="text-lg">🤖</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Restaurant ML modeli eğitimi tamamlandı
              </p>
              <p className="text-xs text-gray-500">15 dakika önce</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <span className="text-lg">📊</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                25 yeni lokasyon analizi tamamlandı
              </p>
              <p className="text-xs text-gray-500">1 saat önce</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <span className="text-lg">🗺️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Yeni bölge "Lara Beach" eklendi
              </p>
              <p className="text-xs text-gray-500">3 saat önce</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sistem Performansı
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">API Yanıt Süresi</span>
                <span className="font-medium">245ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Veri Bütünlüğü</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">ML Model Doğruluğu</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "87%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hızlı İşlemler
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="text-2xl mb-2">🕷️</span>
              <span className="text-sm font-medium text-blue-700">
                Yeni Scraping
              </span>
            </button>

            <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="text-2xl mb-2">🤖</span>
              <span className="text-sm font-medium text-green-700">
                Model Eğit
              </span>
            </button>

            <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-purple-700">
                Analiz Çalıştır
              </span>
            </button>

            <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <span className="text-2xl mb-2">🗺️</span>
              <span className="text-sm font-medium text-orange-700">
                Bölge Ekle
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
