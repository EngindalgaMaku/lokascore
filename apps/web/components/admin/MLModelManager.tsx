"use client";

import { useState, useEffect } from "react";

interface MLModel {
  id: number;
  name: string;
  model_type: string;
  algorithm: string;
  version: string;
  accuracy: number;
  training_data_size: number;
  feature_count: number;
  is_production: boolean;
  trained_at: string;
  performance_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
}

interface TrainingJob {
  id: string;
  business_type: string;
  status: "pending" | "training" | "completed" | "failed";
  progress: number;
  started_at: string;
  estimated_completion?: string;
}

export default function MLModelManager() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);

  // Fetch ML models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:8000/ml/models");
        if (response.ok) {
          const data = await response.json();
          setModels(data);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        // Mock data for demo
        setModels([
          {
            id: 1,
            name: "Restaurant Location Predictor",
            model_type: "location_scoring",
            algorithm: "xgboost",
            version: "1.2.0",
            accuracy: 0.87,
            training_data_size: 1247,
            feature_count: 85,
            is_production: true,
            trained_at: "2024-08-25T10:30:00Z",
            performance_metrics: {
              accuracy: 0.87,
              precision: 0.84,
              recall: 0.89,
              f1_score: 0.86,
            },
          },
          {
            id: 2,
            name: "Cafe Success Model",
            model_type: "location_scoring",
            algorithm: "lightgbm",
            version: "1.0.0",
            accuracy: 0.82,
            training_data_size: 856,
            feature_count: 78,
            is_production: false,
            trained_at: "2024-08-24T15:45:00Z",
            performance_metrics: {
              accuracy: 0.82,
              precision: 0.8,
              recall: 0.85,
              f1_score: 0.82,
            },
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const startModelTraining = async (
    businessType: string,
    regionId?: number
  ) => {
    try {
      const response = await fetch("http://localhost:8000/ml/train-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_type: businessType,
          region_id: regionId,
          model_name: `${businessType} Location Model v2.0`,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Add to training jobs (mock)
        const newJob: TrainingJob = {
          id: `job_${Date.now()}`,
          business_type: businessType,
          status: "pending",
          progress: 0,
          started_at: new Date().toISOString(),
        };

        setTrainingJobs((prev) => [...prev, newJob]);

        // Simulate training progress
        simulateTrainingProgress(newJob.id);

        alert(`${businessType} modeli eğitimi başlatıldı!`);
      } else {
        const error = await response.json();
        alert(`Eğitim başlatılamadı: ${error.detail}`);
      }
    } catch (error) {
      console.error("Training error:", error);
      alert("Bağlantı hatası! Mock eğitim simülasyonu başlatılıyor...");

      // Mock training simulation
      const newJob: TrainingJob = {
        id: `mock_${Date.now()}`,
        business_type: businessType,
        status: "training",
        progress: 10,
        started_at: new Date().toISOString(),
        estimated_completion: new Date(
          Date.now() + 15 * 60 * 1000
        ).toISOString(),
      };

      setTrainingJobs((prev) => [...prev, newJob]);
      simulateTrainingProgress(newJob.id);
    }
  };

  const simulateTrainingProgress = (jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // 5-20% increments

      setTrainingJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                progress: Math.min(progress, 100),
                status: progress >= 100 ? "completed" : "training",
              }
            : job
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        // Refresh models after training completion
        setTimeout(() => {
          // Add mock new model
          const newModel: MLModel = {
            id: Date.now(),
            name: `Mock ${
              trainingJobs.find((j) => j.id === jobId)?.business_type
            } Model`,
            model_type: "location_scoring",
            algorithm: "xgboost",
            version: "1.0.0",
            accuracy: 0.8 + Math.random() * 0.15,
            training_data_size: 800 + Math.floor(Math.random() * 500),
            feature_count: 75 + Math.floor(Math.random() * 20),
            is_production: false,
            trained_at: new Date().toISOString(),
            performance_metrics: {
              accuracy: 0.8 + Math.random() * 0.15,
              precision: 0.75 + Math.random() * 0.15,
              recall: 0.78 + Math.random() * 0.15,
              f1_score: 0.76 + Math.random() * 0.15,
            },
          };

          setModels((prev) => [...prev, newModel]);
        }, 2000);
      }
    }, 2000);
  };

  const toggleProductionStatus = (modelId: number) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId
          ? { ...model, is_production: !model.is_production }
          : model
      )
    );
  };

  const ModelCard = ({ model }: { model: MLModel }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">
              {model.algorithm?.toUpperCase() || "N/A"}
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              v{model.version || "N/A"}
            </span>
            {model.is_production && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Production
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setSelectedModel(model)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Detaylar
        </button>
      </div>

      <div className="space-y-3">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Doğruluk</div>
            <div className="text-lg font-semibold text-gray-900">
              {((model.accuracy || 0) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">F1 Score</div>
            <div className="text-lg font-semibold text-gray-900">
              {((model.performance_metrics?.f1_score || 0) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Training Info */}
        <div className="text-sm text-gray-600">
          <div>
            Eğitim Verisi: {model.training_data_size?.toLocaleString() || "N/A"}{" "}
            sample
          </div>
          <div>Feature Sayısı: {model.feature_count || "N/A"}</div>
          <div>
            Eğitilme:{" "}
            {model.trained_at
              ? new Date(model.trained_at).toLocaleDateString("tr-TR")
              : "N/A"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => toggleProductionStatus(model.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              model.is_production
                ? "bg-red-50 text-red-700 hover:bg-red-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {model.is_production ? "Production'dan Al" : "Production'a Al"}
          </button>
          <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
            Yeniden Eğit
          </button>
        </div>
      </div>
    </div>
  );

  const TrainingJobCard = ({ job }: { job: TrainingJob }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">
            {job.business_type} Model Eğitimi
          </h4>
          <p className="text-sm text-gray-500">
            {new Date(job.started_at).toLocaleString("tr-TR")}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            job.status === "completed"
              ? "bg-green-100 text-green-700"
              : job.status === "training"
              ? "bg-blue-100 text-blue-700"
              : job.status === "failed"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {job.status === "completed"
            ? "Tamamlandı"
            : job.status === "training"
            ? "Eğitiliyor"
            : job.status === "failed"
            ? "Başarısız"
            : "Bekliyor"}
        </span>
      </div>

      {job.status === "training" && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">İlerleme</span>
            <span className="font-medium">{job.progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            ></div>
          </div>
          {job.estimated_completion && (
            <p className="text-xs text-gray-500 mt-2">
              Tahmini tamamlanma:{" "}
              {new Date(job.estimated_completion).toLocaleString("tr-TR")}
            </p>
          )}
        </div>
      )}
    </div>
  );

  const TrainingModal = () =>
    showTrainingModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yeni Model Eğitimi
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İşletme Türü
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Cafe</option>
                <option value="retail">Mağaza</option>
                <option value="hotel">Otel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölge (Opsiyonel)
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tüm Bölgeler</option>
                <option value="1">Kaleiçi</option>
                <option value="2">Lara Beach</option>
                <option value="3">Konyaaltı</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => {
                startModelTraining("restaurant");
                setShowTrainingModal(false);
              }}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Eğitimi Başlat
            </button>
            <button
              onClick={() => setShowTrainingModal(false)}
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
            ML Model Yönetimi
          </h1>
          <p className="text-gray-600 mt-1">
            Makine öğrenmesi modellerini yönetin ve yeni modeller eğitin
          </p>
        </div>

        <button
          onClick={() => setShowTrainingModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <span>🤖</span>
          <span>Yeni Model Eğit</span>
        </button>
      </div>

      {/* Active Training Jobs */}
      {trainingJobs.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Aktif Eğitimler
          </h3>
          <div className="space-y-3">
            {trainingJobs.map((job) => (
              <TrainingJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Models Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">ML modelleri yükleniyor...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}

      {/* Training Modal */}
      <TrainingModal />

      {/* Model Details Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedModel.name}
              </h3>
              <button
                onClick={() => setSelectedModel(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Performance Metrics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Performans Metrikleri
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedModel.performance_metrics ? (
                    Object.entries(selectedModel.performance_metrics).map(
                      ([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500 capitalize">
                            {key.replace("_", " ")}
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {((value || 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-gray-500 text-center p-4">
                      Performans metrikleri mevcut değil
                    </div>
                  )}
                </div>
              </div>

              {/* Model Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Model Bilgileri
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Tipi:</span>
                    <span className="font-medium">
                      {selectedModel.model_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Algoritma:</span>
                    <span className="font-medium">
                      {selectedModel.algorithm || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Versiyon:</span>
                    <span className="font-medium">
                      v{selectedModel.version || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eğitim Verisi:</span>
                    <span className="font-medium">
                      {selectedModel.training_data_size?.toLocaleString() ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feature Sayısı:</span>
                    <span className="font-medium">
                      {selectedModel.feature_count || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Production Status:</span>
                    <span
                      className={`font-medium ${
                        selectedModel.is_production
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {selectedModel.is_production ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
