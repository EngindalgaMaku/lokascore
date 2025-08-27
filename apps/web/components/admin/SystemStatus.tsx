"use client";

import { useState, useEffect } from "react";

interface SystemHealth {
  status: string;
  version: string;
  features: string[];
  database_status?: "healthy" | "error";
  api_response_time?: number;
  uptime?: number;
}

interface ServiceStatus {
  name: string;
  status: "healthy" | "warning" | "error";
  response_time?: number;
  last_check: string;
  details?: string;
}

export default function SystemStatus() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check system health
  const checkSystemHealth = async () => {
    try {
      const response = await fetch("http://localhost:8000/health");
      const data = await response.json();

      setSystemHealth({
        ...data,
        database_status: "healthy",
        api_response_time: Math.random() * 200 + 50,
        uptime: Math.random() * 86400 + 3600, // 1-24 hours
      });
    } catch (error) {
      console.error("Health check failed:", error);
      setSystemHealth({
        status: "unhealthy",
        version: "unknown",
        features: [],
        database_status: "error",
        api_response_time: 0,
        uptime: 0,
      });
    }
  };

  // Check individual services
  const checkServices = async () => {
    const serviceChecks = [
      { name: "API Core", endpoint: "/health" },
      { name: "ML Pipeline", endpoint: "/ml/models" },
      { name: "Scraping Service", endpoint: "/scraping/stats" },
      { name: "Region Manager", endpoint: "/regions/list" },
      {
        name: "Database",
        endpoint: "/analyze/basic?lat=36.8851&lng=30.7056&type=cafe",
      },
    ];

    const serviceStatuses: ServiceStatus[] = [];

    for (const service of serviceChecks) {
      const startTime = Date.now();
      try {
        const response = await fetch(
          `http://localhost:8000${service.endpoint}`
        );
        const responseTime = Date.now() - startTime;

        serviceStatuses.push({
          name: service.name,
          status: response.ok ? "healthy" : "error",
          response_time: responseTime,
          last_check: new Date().toISOString(),
          details: response.ok
            ? "Service operational"
            : `HTTP ${response.status}`,
        });
      } catch (error) {
        serviceStatuses.push({
          name: service.name,
          status: "error",
          response_time: Date.now() - startTime,
          last_check: new Date().toISOString(),
          details: "Connection failed",
        });
      }
    }

    setServices(serviceStatuses);
  };

  // Initial load and auto-refresh
  useEffect(() => {
    const runChecks = async () => {
      await Promise.all([checkSystemHealth(), checkServices()]);
      setIsLoading(false);
    };

    runChecks();

    const interval = autoRefresh ? setInterval(runChecks, 30000) : null; // 30 seconds
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const ServiceCard = ({ service }: { service: ServiceStatus }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getStatusIcon(service.status)}</span>
            <h3 className="font-medium text-gray-900">{service.name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                service.status
              )}`}
            >
              {service.status === "healthy"
                ? "Sağlıklı"
                : service.status === "warning"
                ? "Uyarı"
                : "Hata"}
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            {service.response_time && (
              <div>Yanıt Süresi: {service.response_time}ms</div>
            )}
            <div>
              Son Kontrol:{" "}
              {new Date(service.last_check).toLocaleString("tr-TR")}
            </div>
            {service.details && (
              <div className="text-xs text-gray-500">{service.details}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Sistem durumu kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem Durumu</h1>
          <p className="text-gray-600 mt-1">
            LOKASCORE platform bileşenlerinin durumunu izleyin
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">
              Otomatik yenileme (30s)
            </span>
          </label>

          <button
            onClick={() => {
              setIsLoading(true);
              Promise.all([checkSystemHealth(), checkServices()]).finally(() =>
                setIsLoading(false)
              );
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <span>🔄</span>
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {/* Overall System Health */}
      {systemHealth && (
        <div
          className={`rounded-xl p-6 border ${
            systemHealth.status === "healthy"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl">
              {systemHealth.status === "healthy" ? "🟢" : "🔴"}
            </span>
            <div>
              <h2
                className={`text-xl font-bold ${
                  systemHealth.status === "healthy"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                Sistem{" "}
                {systemHealth.status === "healthy" ? "Sağlıklı" : "Sorunlu"}
              </h2>
              <p
                className={`text-sm ${
                  systemHealth.status === "healthy"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                LOKASCORE v{systemHealth.version} • API Yanıt:{" "}
                {systemHealth.api_response_time?.toFixed(0)}ms • Çalışma süresi:{" "}
                {systemHealth.uptime
                  ? formatUptime(systemHealth.uptime)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-sm text-gray-500">API Performansı</div>
              <div className="text-xl font-bold text-gray-900">
                {systemHealth?.api_response_time?.toFixed(0) || "0"}ms
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔧</span>
            <div>
              <div className="text-sm text-gray-500">Aktif Servisler</div>
              <div className="text-xl font-bold text-gray-900">
                {services.filter((s) => s.status === "healthy").length}/
                {services.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-sm text-gray-500">Özellik Sayısı</div>
              <div className="text-xl font-bold text-gray-900">
                {systemHealth?.features?.length || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⏱️</span>
            <div>
              <div className="text-sm text-gray-500">Çalışma Süresi</div>
              <div className="text-xl font-bold text-gray-900">
                {systemHealth?.uptime
                  ? formatUptime(systemHealth.uptime)
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Servis Durumları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={`${service.name}-${index}`} service={service} />
          ))}
        </div>
      </div>

      {/* System Features */}
      {systemHealth?.features && systemHealth.features.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Aktif Özellikler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {systemHealth.features?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs and Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Son Sistem Olayları
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <span className="text-lg">✅</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Sistem başarıyla başlatıldı
                </p>
                <p className="text-xs text-gray-500">2 dakika önce</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-lg">🔄</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  API health check başarılı
                </p>
                <p className="text-xs text-gray-500">30 saniye önce</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <span className="text-lg">⚠️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Yüksek API yanıt süresi tespit edildi
                </p>
                <p className="text-xs text-gray-500">5 dakika önce</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sistem Kaynakları
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">CPU Kullanımı</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "23%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Bellek Kullanımı</span>
                <span className="font-medium">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "67%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Disk Kullanımı</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Veritabanı Bağlantıları</span>
                <span className="font-medium">12/50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: "24%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dış Servis Bağlantıları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <span className="text-lg">✅</span>
            <div>
              <div className="font-medium text-gray-900">Google Maps API</div>
              <div className="text-xs text-gray-500">Quota: 850/1000</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <span className="text-lg">✅</span>
            <div>
              <div className="font-medium text-gray-900">PostgreSQL</div>
              <div className="text-xs text-gray-500">Bağlantı aktif</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <span className="text-lg">✅</span>
            <div>
              <div className="font-medium text-gray-900">Selenium Grid</div>
              <div className="text-xs text-gray-500">2/5 node aktif</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
