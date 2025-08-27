"use client";

import { useState } from "react";
import {
  MapPin,
  TrendingUp,
  Users,
  Building,
  Car,
  School,
  TreePine,
  Calendar,
  Download,
  Share2,
  Filter,
  Search,
  Eye,
  Star,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

type ReportData = {
  id: string;
  location: string;
  coordinates: [number, number];
  businessType: string;
  score: number;
  date: string;
  status: "completed" | "processing" | "draft";
  metrics: {
    competitors: number;
    footTraffic: number;
    accessibility: number;
    demographics: number;
    schools: number;
    parks: number;
  };
};

export default function ReportPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>("1");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Mock data
  const reports: ReportData[] = [
    {
      id: "1",
      location: "Muratpaşa Merkez, Antalya",
      coordinates: [36.8893, 30.7081],
      businessType: "Kafe",
      score: 8.2,
      date: "2024-03-20",
      status: "completed",
      metrics: {
        competitors: 15,
        footTraffic: 8.5,
        accessibility: 9.1,
        demographics: 7.8,
        schools: 3,
        parks: 2,
      },
    },
    {
      id: "2",
      location: "Konyaaltı Sahil, Antalya",
      coordinates: [36.8863, 30.6349],
      businessType: "Restoran",
      score: 9.1,
      date: "2024-03-18",
      status: "completed",
      metrics: {
        competitors: 8,
        footTraffic: 9.2,
        accessibility: 8.9,
        demographics: 8.8,
        schools: 1,
        parks: 4,
      },
    },
    {
      id: "3",
      location: "Kepez Santral, Antalya",
      coordinates: [36.9081, 30.6472],
      businessType: "Market",
      score: 7.3,
      date: "2024-03-15",
      status: "processing",
      metrics: {
        competitors: 12,
        footTraffic: 7.1,
        accessibility: 8.2,
        demographics: 6.9,
        schools: 5,
        parks: 1,
      },
    },
  ];

  const selectedReportData = reports.find((r) => r.id === selectedReport);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "processing":
        return "İşleniyor";
      case "draft":
        return "Taslak";
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <div className="container-responsive min-h-screen py-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Reports List */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Analiz Raporları</h1>
                <p className="text-muted-foreground">
                  Lokasyon analizlerinizi görüntüleyin
                </p>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="card p-4">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rapor ara..."
                    className="input pl-10"
                  />
                </div>
                <button className="btn btn-outline">
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`btn btn-sm ${
                    viewMode === "grid" ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`btn btn-sm ${
                    viewMode === "list" ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`card card-hover cursor-pointer p-4 transition-all ${
                    selectedReport === report.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{report.location}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.businessType}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusText(report.status)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {new Date(report.date).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{report.score}/10</div>
                      <div className="text-xs text-muted-foreground">Skor</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div className="lg:col-span-8">
          {selectedReportData ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedReportData.location}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedReportData.businessType} Lokasyon Analizi
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      Paylaş
                    </button>
                    <button className="btn btn-primary">
                      <Download className="mr-2 h-4 w-4" />
                      PDF İndir
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedReportData.date).toLocaleDateString(
                      "tr-TR"
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedReportData.coordinates[0].toFixed(4)},{" "}
                    {selectedReportData.coordinates[1].toFixed(4)}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      selectedReportData.status
                    )}`}
                  >
                    {getStatusText(selectedReportData.status)}
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    Genel Potansiyel Skoru
                  </h3>
                  <div className="text-3xl font-bold text-primary">
                    {selectedReportData.score}/10
                  </div>
                </div>

                <div className="w-full bg-secondary rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                    style={{ width: `${selectedReportData.score * 10}%` }}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Bu lokasyon {selectedReportData.businessType.toLowerCase()}{" "}
                  işletmesi için
                  <span className="font-semibold text-foreground">
                    {" "}
                    {selectedReportData.score >= 8
                      ? "mükemmel"
                      : selectedReportData.score >= 7
                      ? "iyi"
                      : selectedReportData.score >= 6
                      ? "orta"
                      : "düşük"}{" "}
                  </span>
                  potansiyel göstermektedir.
                </p>
              </div>

              {/* Detailed Metrics */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Competition Analysis */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Rekabet Analizi</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rakip Sayısı (500m)</span>
                        <span className="font-semibold">
                          {selectedReportData.metrics.competitors}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              selectedReportData.metrics.competitors * 5,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traffic Analysis */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Yaya Trafiği</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Trafik Skoru</span>
                        <span className="font-semibold">
                          {selectedReportData.metrics.footTraffic}/10
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              selectedReportData.metrics.footTraffic * 10
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accessibility */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Erişilebilirlik</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ulaşım Skoru</span>
                        <span className="font-semibold">
                          {selectedReportData.metrics.accessibility}/10
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              selectedReportData.metrics.accessibility * 10
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demographics */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Demografi</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hedef Kitle Uyumu</span>
                        <span className="font-semibold">
                          {selectedReportData.metrics.demographics}/10
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${
                              selectedReportData.metrics.demographics * 10
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* POI Analysis */}
              <div className="card p-6">
                <h4 className="font-semibold mb-4">
                  İlgi Çekici Yerler Analizi
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <School className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedReportData.metrics.schools}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Okul (500m)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                      <TreePine className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedReportData.metrics.parks}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Park (500m)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedReportData.metrics.competitors}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rakip İşletme
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rapor Seçin</h3>
              <p className="text-muted-foreground">
                Detayları görüntülemek için sol taraftan bir rapor seçin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
