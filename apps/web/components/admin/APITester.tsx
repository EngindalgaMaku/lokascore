"use client";

import { useState } from "react";

interface TestResult {
  endpoint: string;
  method: string;
  status: "success" | "error" | "loading";
  responseTime?: number;
  statusCode?: number;
  data?: any;
  error?: string;
}

export default function APITester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>("");

  // API endpoint'leri tanımla
  const apiEndpoints = [
    {
      id: "health",
      name: "Sistem Sağlık Kontrolü",
      method: "GET",
      endpoint: "/health",
    },
    {
      id: "basic-analyze",
      name: "Temel Lokasyon Analizi",
      method: "GET",
      endpoint: "/analyze/basic",
    },
    {
      id: "ml-analyze",
      name: "AI Lokasyon Analizi",
      method: "POST",
      endpoint: "/ml/analyze-location",
    },
    {
      id: "ml-features",
      name: "Lokasyon Özellikleri",
      method: "GET",
      endpoint: "/ml/features/{lat}/{lng}",
    },
    {
      id: "scraping-stats",
      name: "Scraping İstatistikleri",
      method: "GET",
      endpoint: "/scraping/stats",
    },
    {
      id: "scraping-jobs",
      name: "Scraping İşleri",
      method: "GET",
      endpoint: "/scraping/jobs",
    },
    {
      id: "regions-list",
      name: "Bölge Listesi",
      method: "GET",
      endpoint: "/regions/list",
    },
    {
      id: "ml-models",
      name: "ML Modelleri",
      method: "GET",
      endpoint: "/ml/models",
    },
  ];

  const runSingleTest = async (testId: string) => {
    const endpoint = apiEndpoints.find((ep) => ep.id === testId);
    if (!endpoint) return;

    const startTime = Date.now();
    setTestResults((prev) => [
      ...prev.filter((r) => r.endpoint !== endpoint.endpoint),
      {
        endpoint: endpoint.endpoint,
        method: endpoint.method,
        status: "loading",
      },
    ]);

    try {
      let url = `http://localhost:8000${endpoint.endpoint}`;
      let options: RequestInit = { method: endpoint.method };

      // Test verilerini hazırla
      if (endpoint.id === "basic-analyze") {
        url += "?lat=36.8851&lng=30.7056&type=cafe&radius=500";
      } else if (endpoint.id === "ml-analyze") {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify({
          lat: 36.8851,
          lng: 30.7056,
          business_type: "restaurant",
          radius: 500,
          analysis_name: "Admin Panel Test",
        });
      } else if (endpoint.id === "ml-features") {
        url =
          url.replace("{lat}", "36.8851").replace("{lng}", "30.7056") +
          "?business_type=restaurant&radius=500";
      } else if (endpoint.id === "scraping-jobs") {
        url += "?limit=5";
      }

      const response = await fetch(url, options);
      const responseTime = Date.now() - startTime;
      const data = await response.json();

      setTestResults((prev) => [
        ...prev.filter((r) => r.endpoint !== endpoint.endpoint),
        {
          endpoint: endpoint.endpoint,
          method: endpoint.method,
          status: response.ok ? "success" : "error",
          responseTime,
          statusCode: response.status,
          data: response.ok ? data : undefined,
          error: !response.ok ? data.detail || "Unknown error" : undefined,
        },
      ]);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setTestResults((prev) => [
        ...prev.filter((r) => r.endpoint !== endpoint.endpoint),
        {
          endpoint: endpoint.endpoint,
          method: endpoint.method,
          status: "error",
          responseTime,
          error: (error as Error).message,
        },
      ]);
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    for (const endpoint of apiEndpoints) {
      await runSingleTest(endpoint.id);
      // Kısa bekleme süresi
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunningTests(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test sonuçlarını özetle
  const getTestSummary = () => {
    const total = testResults.length;
    const successful = testResults.filter((r) => r.status === "success").length;
    const failed = testResults.filter((r) => r.status === "error").length;
    const successRate =
      total > 0 ? ((successful / total) * 100).toFixed(1) : "0";

    return { total, successful, failed, successRate };
  };

  const summary = getTestSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          API Endpoint Test Merkezi
        </h1>
        <p className="text-gray-600 mt-1">
          LOKASCORE API endpoint'lerini test edin ve durumlarını kontrol edin
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              {isRunningTests ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Testler Çalışıyor...</span>
                </>
              ) : (
                <>
                  <span>🧪</span>
                  <span>Tüm Testleri Çalıştır</span>
                </>
              )}
            </button>

            <button
              onClick={clearResults}
              disabled={isRunningTests}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              <span>🗑️</span>
              <span>Temizle</span>
            </button>
          </div>

          {/* Test Summary */}
          {testResults.length > 0 && (
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                Toplam: <span className="font-medium">{summary.total}</span>
              </span>
              <span className="text-green-600">
                Başarılı:{" "}
                <span className="font-medium">{summary.successful}</span>
              </span>
              <span className="text-red-600">
                Başarısız: <span className="font-medium">{summary.failed}</span>
              </span>
              <span className="text-blue-600">
                Başarı Oranı:{" "}
                <span className="font-medium">{summary.successRate}%</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Individual Test Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tekil Testler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {apiEndpoints.map((endpoint) => (
            <button
              key={endpoint.id}
              onClick={() => runSingleTest(endpoint.id)}
              disabled={isRunningTests}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-30 rounded-lg border transition-colors text-left"
            >
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {endpoint.name}
                </div>
                <div className="text-xs text-gray-500">
                  {endpoint.method} {endpoint.endpoint}
                </div>
              </div>
              <span className="text-sm">▶️</span>
            </button>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Test Sonuçları
          </h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={`${result.endpoint}-${index}`}
                className={`border rounded-lg p-4 ${
                  result.status === "success"
                    ? "border-green-200 bg-green-50"
                    : result.status === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {result.status === "success"
                          ? "✅"
                          : result.status === "error"
                          ? "❌"
                          : "⏳"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {result.method} {result.endpoint}
                      </span>
                      {result.statusCode && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            result.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {result.statusCode}
                        </span>
                      )}
                      {result.responseTime && (
                        <span className="text-xs text-gray-500">
                          {result.responseTime}ms
                        </span>
                      )}
                    </div>

                    {result.error && (
                      <div className="text-sm text-red-600 mb-2">
                        <strong>Hata:</strong> {result.error}
                      </div>
                    )}

                    {result.data && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          Yanıt Verilerini Göster
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Documentation Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          API Dokümantasyonu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <span className="text-2xl">📚</span>
            <div>
              <div className="font-medium text-blue-700">Swagger UI</div>
              <div className="text-sm text-blue-600">
                Interactive API documentation
              </div>
            </div>
          </a>

          <a
            href="http://localhost:8000/redoc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            <span className="text-2xl">📖</span>
            <div>
              <div className="font-medium text-green-700">ReDoc</div>
              <div className="text-sm text-green-600">
                Alternative documentation
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
