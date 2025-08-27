"use client";

import { useState, useEffect } from "react";

interface ScrapingJob {
  id: number;
  job_name: string;
  status: string;
  progress_percentage: number;
  businesses_found: number;
  businesses_processed: number;
  errors_count: number;
  started_at: string | null;
  estimated_duration: number | null;
  results_summary: any;
}

interface ScrapingStats {
  total_businesses_scraped: number;
  active_scraping_jobs: number;
  completed_scraping_jobs: number;
  business_type_distribution: Record<string, number>;
  last_updated: string;
}

export default function ScrapingManager() {
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [stats, setStats] = useState<ScrapingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);

  // Fetch scraping data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get jobs
        const jobsResponse = await fetch(
          "http://localhost:8000/scraping/jobs?limit=20"
        );
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(Array.isArray(jobsData) ? jobsData : []);
        }

        // Get stats
        const statsResponse = await fetch(
          "http://localhost:8000/scraping/stats"
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching scraping data:", error);

        // Mock data for demo
        setJobs([
          {
            id: 1,
            job_name: "Kaleiçi Comprehensive Scraping",
            status: "completed",
            progress_percentage: 100,
            businesses_found: 156,
            businesses_processed: 156,
            errors_count: 3,
            started_at: "2024-08-27T08:30:00Z",
            estimated_duration: 1800,
            results_summary: {
              total_businesses: 156,
              avg_processing_time: 12.5,
            },
          },
          {
            id: 2,
            job_name: "Restaurant Data Update",
            status: "in_progress",
            progress_percentage: 65,
            businesses_found: 89,
            businesses_processed: 58,
            errors_count: 1,
            started_at: "2024-08-27T09:15:00Z",
            estimated_duration: 900,
            results_summary: null,
          },
        ]);

        setStats({
          total_businesses_scraped: 1247,
          active_scraping_jobs: 2,
          completed_scraping_jobs: 15,
          business_type_distribution: {
            restaurant: 456,
            cafe: 324,
            retail: 289,
            hotel: 178,
          },
          last_updated: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const startKaleiciPilot = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/scraping/start-kaleiçi-pilot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Kaleiçi pilot scraping başarıyla başlatıldı!");

        // Add mock job
        const newJob: ScrapingJob = {
          id: Date.now(),
          job_name: "Kaleiçi Pilot Scraping",
          status: "pending",
          progress_percentage: 0,
          businesses_found: 0,
          businesses_processed: 0,
          errors_count: 0,
          started_at: new Date().toISOString(),
          estimated_duration: 1800,
          results_summary: null,
        };

        setJobs((prev) => [newJob, ...prev]);

        // Simulate progress
        simulateJobProgress(newJob.id);
      } else {
        const error = await response.json();
        alert(`Scraping başlatılamadı: ${error.detail}`);
      }
    } catch (error) {
      console.error("Error starting scraping:", error);
      alert("Bağlantı hatası! Mock scraping simülasyonu başlatılıyor...");

      // Mock scraping simulation
      const mockJob: ScrapingJob = {
        id: Date.now(),
        job_name: "Mock Kaleiçi Scraping",
        status: "in_progress",
        progress_percentage: 5,
        businesses_found: 0,
        businesses_processed: 0,
        errors_count: 0,
        started_at: new Date().toISOString(),
        estimated_duration: 1200,
        results_summary: null,
      };

      setJobs((prev) => [mockJob, ...prev]);
      simulateJobProgress(mockJob.id);
    }
  };

  const simulateJobProgress = (jobId: number) => {
    let progress = 0;
    let businesses = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2; // 2-10% increments
      businesses += Math.floor(Math.random() * 3 + 1); // 1-3 businesses

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                progress_percentage: Math.min(progress, 100),
                businesses_found: businesses,
                businesses_processed: Math.floor(businesses * 0.8),
                status: progress >= 100 ? "completed" : "in_progress",
              }
            : job
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 3000);
  };

  const cancelJob = async (jobId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/scraping/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        alert("İş iptal edildi.");
      }
    } catch (error) {
      console.error("Error cancelling job:", error);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      alert("İş iptal edildi (mock).");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
      case "running":
        return "bg-blue-100 text-blue-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Tamamlandı";
      case "in_progress":
      case "running":
        return "Çalışıyor";
      case "failed":
        return "Başarısız";
      case "pending":
        return "Bekliyor";
      default:
        return status;
    }
  };

  const JobCard = ({ job }: { job: ScrapingJob }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {job.job_name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            İş ID: {job.id} •{" "}
            {job.started_at
              ? new Date(job.started_at).toLocaleString("tr-TR")
              : "Henüz başlamadı"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              job.status
            )}`}
          >
            {getStatusText(job.status)}
          </span>
          {(job.status === "in_progress" || job.status === "pending") && (
            <button
              onClick={() => cancelJob(job.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              ❌
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(job.status === "in_progress" || job.status === "running") && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">İlerleme</span>
            <span className="font-medium">
              {job.progress_percentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress_percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Job Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Bulunan</div>
          <div className="font-semibold text-gray-900">
            {job.businesses_found}
          </div>
        </div>
        <div>
          <div className="text-gray-500">İşlenen</div>
          <div className="font-semibold text-gray-900">
            {job.businesses_processed}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Hatalar</div>
          <div
            className={`font-semibold ${
              job.errors_count > 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {job.errors_count}
          </div>
        </div>
      </div>

      {/* Estimated Duration */}
      {job.estimated_duration && (
        <div className="mt-3 text-sm text-gray-500">
          Tahmini süre: {Math.floor(job.estimated_duration / 60)} dakika
        </div>
      )}
    </div>
  );

  const StartScrapingModal = () =>
    showStartModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yeni Scraping İşi
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scraping Türü
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="pilot">Kaleiçi Pilot Projesi</option>
                <option value="business">Tekil İşletme Verisi</option>
                <option value="region">Bölgesel Tarama</option>
                <option value="update">Veri Güncelleme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İş Adı
              </label>
              <input
                type="text"
                placeholder="Örn: Lara Beach Restaurant Scraping"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seçenekler
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Yorumları dahil et
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Fotoğrafları dahil et
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">
                    Sentiment analizi yap
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => {
                startKaleiciPilot();
                setShowStartModal(false);
              }}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Başlat
            </button>
            <button
              onClick={() => setShowStartModal(false)}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Veri Toplama Yönetimi
          </h1>
          <p className="text-gray-600 mt-1">
            Google Maps scraping işlemlerini yönetin ve izleyin
          </p>
        </div>

        <button
          onClick={() => setShowStartModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <span>🕷️</span>
          <span>Yeni Scraping</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏪</span>
              <div>
                <div className="text-sm text-gray-500">Toplam İşletme</div>
                <div className="text-xl font-bold text-gray-900">
                  {stats.total_businesses_scraped.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚙️</span>
              <div>
                <div className="text-sm text-gray-500">Aktif İşler</div>
                <div className="text-xl font-bold text-orange-600">
                  {stats.active_scraping_jobs}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <div>
                <div className="text-sm text-gray-500">Tamamlanan</div>
                <div className="text-xl font-bold text-green-600">
                  {stats.completed_scraping_jobs}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-sm text-gray-500">İş Türleri</div>
                <div className="text-xl font-bold text-purple-600">
                  {Object.keys(stats.business_type_distribution || {}).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hızlı İşlemler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={startKaleiciPilot}
            className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
          >
            <span className="text-2xl">🎯</span>
            <span className="font-medium text-blue-700">Kaleiçi Pilot</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
            <span className="text-2xl">🔄</span>
            <span className="font-medium text-green-700">Veri Güncelle</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors">
            <span className="text-2xl">📈</span>
            <span className="font-medium text-purple-700">Toplu Analiz</span>
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Aktif ve Tamamlanan İşler
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Scraping işleri yükleniyor...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <span className="text-4xl mb-2 block">🕷️</span>
            <p className="text-gray-600">Henüz scraping işi başlatılmamış</p>
            <button
              onClick={() => setShowStartModal(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk İşi Başlat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.isArray(jobs) &&
              jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>

      {/* Start Scraping Modal */}
      <StartScrapingModal />

      {/* Business Type Distribution */}
      {stats &&
        Object.keys(stats.business_type_distribution || {}).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              İşletme Türü Dağılımı
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.business_type_distribution || {}).map(
                ([type, count]) => (
                  <div key={type} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {type}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}
