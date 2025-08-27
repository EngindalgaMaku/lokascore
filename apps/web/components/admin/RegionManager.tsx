"use client";

import { useState, useEffect } from "react";

interface Region {
  id: number;
  name: string;
  description: string | null;
  city: string;
  district: string;
  country: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  polygon: string | null;
  is_pilot_region: boolean;
  businesses_count: number;
  scraping_jobs_count: number;
  last_scraping_date: string | null;
  data_completeness: number | null;
  created_at: string;
  updated_at: string;
}

interface RegionStats {
  region_id: number;
  region_name: string;
  businesses: Record<string, number>;
  reviews_stats: {
    businesses_with_reviews: number;
    avg_rating: number;
    total_reviews: number;
    max_reviews_per_business: number;
    rating_range: { min: number; max: number };
  };
  coverage_stats: {
    total_businesses: number;
    businesses_with_reviews_pct: number;
    avg_reviews_per_business: number;
  };
  data_quality: {
    completeness_score: number;
    data_freshness_days: number;
    coverage_score: number;
  };
  last_updated: string;
}

export default function RegionManager() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionStats, setRegionStats] = useState<RegionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("http://localhost:8000/regions/list");
        if (response.ok) {
          const data = await response.json();
          setRegions(data);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        // Mock data for demo
        setRegions([
          {
            id: 1,
            name: "Kaleiçi",
            description: "Antalya tarihi merkezi - LOKASCORE pilot projesi",
            city: "Antalya",
            district: "Muratpaşa",
            country: "Turkey",
            center_lat: 36.8841,
            center_lng: 30.7056,
            radius_km: 1.5,
            polygon: null,
            is_pilot_region: true,
            businesses_count: 156,
            scraping_jobs_count: 3,
            last_scraping_date: "2024-08-27T08:30:00Z",
            data_completeness: 0.87,
            created_at: "2024-08-20T10:00:00Z",
            updated_at: "2024-08-27T09:15:00Z",
          },
          {
            id: 2,
            name: "Lara Beach",
            description: "Antalya lüks turizm bölgesi",
            city: "Antalya",
            district: "Muratpaşa",
            country: "Turkey",
            center_lat: 36.8445,
            center_lng: 30.781,
            radius_km: 2.0,
            polygon: null,
            is_pilot_region: false,
            businesses_count: 89,
            scraping_jobs_count: 1,
            last_scraping_date: "2024-08-25T14:20:00Z",
            data_completeness: 0.72,
            created_at: "2024-08-22T15:30:00Z",
            updated_at: "2024-08-25T14:20:00Z",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const fetchRegionStats = async (regionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/regions/${regionId}/stats`
      );
      if (response.ok) {
        const data = await response.json();
        setRegionStats(data);
      }
    } catch (error) {
      console.error("Error fetching region stats:", error);
      // Mock stats
      setRegionStats({
        region_id: regionId,
        region_name: regions.find((r) => r.id === regionId)?.name || "Unknown",
        businesses: {
          restaurant: 45,
          cafe: 32,
          hotel: 18,
          retail: 25,
          service: 12,
        },
        reviews_stats: {
          businesses_with_reviews: 89,
          avg_rating: 4.2,
          total_reviews: 2847,
          max_reviews_per_business: 156,
          rating_range: { min: 2.1, max: 4.9 },
        },
        coverage_stats: {
          total_businesses: 132,
          businesses_with_reviews_pct: 67.4,
          avg_reviews_per_business: 21.6,
        },
        data_quality: {
          completeness_score: 87.3,
          data_freshness_days: 2,
          coverage_score: 94.2,
        },
        last_updated: new Date().toISOString(),
      });
    }
  };

  const createRegion = async (regionData: any) => {
    try {
      const response = await fetch("http://localhost:8000/regions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regionData),
      });

      if (response.ok) {
        const newRegion = await response.json();
        setRegions((prev) => [newRegion, ...prev]);
        alert("Bölge başarıyla oluşturuldu!");
        return true;
      } else {
        const error = await response.json();
        alert(`Bölge oluşturulamadı: ${error.detail}`);
        return false;
      }
    } catch (error) {
      console.error("Error creating region:", error);

      // Mock region creation
      const mockRegion: Region = {
        id: Date.now(),
        ...regionData,
        businesses_count: 0,
        scraping_jobs_count: 0,
        last_scraping_date: null,
        data_completeness: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setRegions((prev) => [mockRegion, ...prev]);
      alert("Mock bölge oluşturuldu!");
      return true;
    }
  };

  const startRegionDataCollection = async (regionId: number) => {
    try {
      const response = await fetch(
        "http://localhost:8000/regions/collect-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            region_id: regionId,
            business_types: ["restaurant", "cafe", "hotel", "retail"],
            max_businesses: 500,
            include_reviews: true,
            max_reviews_per_business: 50,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`Veri toplama başlatıldı! Job ID: ${result.job_id}`);
      } else {
        const error = await response.json();
        alert(`Veri toplama başlatılamadı: ${error.detail}`);
      }
    } catch (error) {
      console.error("Error starting data collection:", error);
      alert("Bağlantı hatası! Mock veri toplama simülasyonu başlatıldı.");
    }
  };

  const RegionCard = ({ region }: { region: Region }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {region.name}
            </h3>
            {region.is_pilot_region && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Pilot
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {region.city}, {region.district}
          </p>
          {region.description && (
            <p className="text-sm text-gray-500 mt-1">{region.description}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedRegion(region);
              fetchRegionStats(region.id);
              setShowStatsModal(true);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            İstatistikler
          </button>
        </div>
      </div>

      {/* Region Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="text-gray-500">Merkez Koordinat</div>
          <div className="font-medium">
            {region.center_lat?.toFixed(4) || "N/A"},{" "}
            {region.center_lng?.toFixed(4) || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Yarıçap</div>
          <div className="font-medium">{region.radius_km || "N/A"} km</div>
        </div>
        <div>
          <div className="text-gray-500">İşletme Sayısı</div>
          <div className="font-medium">{region.businesses_count || 0}</div>
        </div>
        <div>
          <div className="text-gray-500">Veri Bütünlüğü</div>
          <div className="font-medium">
            {region.data_completeness
              ? `${(region.data_completeness * 100).toFixed(0)}%`
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-xs text-gray-500 mb-4">
        Son güncelleme:{" "}
        {region.updated_at
          ? new Date(region.updated_at).toLocaleString("tr-TR")
          : "N/A"}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => startRegionDataCollection(region.id)}
          className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
        >
          Veri Topla
        </button>
        <button
          onClick={() => {
            if (
              confirm(
                `${region.name} bölgesini silmek istediğinizden emin misiniz?`
              )
            ) {
              setRegions((prev) => prev.filter((r) => r.id !== region.id));
            }
          }}
          className="py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
        >
          Sil
        </button>
      </div>
    </div>
  );

  const CreateRegionModal = () =>
    showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yeni Bölge Oluştur
          </h3>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const regionData = {
                name: formData.get("name"),
                description: formData.get("description"),
                city: formData.get("city"),
                district: formData.get("district"),
                country: "Turkey",
                center_lat: parseFloat(formData.get("lat") as string),
                center_lng: parseFloat(formData.get("lng") as string),
                radius_km: parseFloat(formData.get("radius") as string),
                is_pilot_region: formData.get("is_pilot") === "on",
              };

              const success = await createRegion(regionData);
              if (success) {
                setShowCreateModal(false);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bölge Adı *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Konyaaltı Beach"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Bölge hakkında kısa açıklama"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şehir *
                  </label>
                  <input
                    name="city"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Antalya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlçe *
                  </label>
                  <input
                    name="district"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Muratpaşa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enlem *
                  </label>
                  <input
                    name="lat"
                    type="number"
                    step="any"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="36.8841"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Boylam *
                  </label>
                  <input
                    name="lng"
                    type="number"
                    step="any"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30.7056"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yarıçap (km) *
                </label>
                <input
                  name="radius"
                  type="number"
                  step="0.1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2.0"
                  defaultValue="2.0"
                />
              </div>

              <div className="flex items-center">
                <input
                  name="is_pilot"
                  type="checkbox"
                  className="rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Pilot bölgesi olarak işaretle
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Oluştur
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  const StatsModal = () =>
    showStatsModal &&
    selectedRegion &&
    regionStats && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {regionStats.region_name} İstatistikleri
            </h3>
            <button
              onClick={() => setShowStatsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600">Toplam İşletme</div>
                <div className="text-2xl font-bold text-blue-700">
                  {regionStats.coverage_stats.total_businesses}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600">Ortalama Puan</div>
                <div className="text-2xl font-bold text-green-700">
                  {regionStats.reviews_stats.avg_rating.toFixed(1)}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600">Toplam Yorum</div>
                <div className="text-2xl font-bold text-purple-700">
                  {regionStats.reviews_stats.total_reviews.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Business Distribution */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                İşletme Türü Dağılımı
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(regionStats.businesses).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-600 capitalize">
                      {type}
                    </span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Quality */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Veri Kalitesi</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Veri Bütünlüğü</span>
                    <span className="font-medium">
                      {regionStats.data_quality.completeness_score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${regionStats.data_quality.completeness_score}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Kapsama Skoru</span>
                    <span className="font-medium">
                      {regionStats.data_quality.coverage_score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${regionStats.data_quality.coverage_score}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bölge Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Analiz bölgelerini yönetin ve veri toplama işlemlerini başlatın
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <span>🗺️</span>
          <span>Yeni Bölge</span>
        </button>
      </div>

      {/* Quick Setup */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Hızlı Kurulum
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={async () => {
              const success = await createRegion({
                name: "Konyaaltı",
                description: "Antalya Konyaaltı sahil bölgesi",
                city: "Antalya",
                district: "Konyaaltı",
                country: "Turkey",
                center_lat: 36.8607,
                center_lng: 30.6197,
                radius_km: 3.0,
                is_pilot_region: false,
              });
            }}
            className="flex items-center space-x-3 p-4 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
          >
            <span className="text-2xl">🏖️</span>
            <div className="text-left">
              <div className="font-medium text-blue-700">Konyaaltı Sahili</div>
              <div className="text-sm text-blue-600">
                Hazır template ile oluştur
              </div>
            </div>
          </button>

          <button
            onClick={async () => {
              const success = await createRegion({
                name: "Kepez Merkez",
                description: "Antalya Kepez merkez bölgesi",
                city: "Antalya",
                district: "Kepez",
                country: "Turkey",
                center_lat: 36.9156,
                center_lng: 30.7349,
                radius_km: 2.5,
                is_pilot_region: false,
              });
            }}
            className="flex items-center space-x-3 p-4 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
          >
            <span className="text-2xl">🏙️</span>
            <div className="text-left">
              <div className="font-medium text-blue-700">Kepez Merkez</div>
              <div className="text-sm text-blue-600">
                Hazır template ile oluştur
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Regions Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Bölgeler yükleniyor...</p>
        </div>
      ) : regions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <span className="text-4xl mb-4 block">🗺️</span>
          <p className="text-gray-600 mb-4">Henüz tanımlanmış bölge yok</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            İlk Bölgeyi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateRegionModal />
      <StatsModal />
    </div>
  );
}
