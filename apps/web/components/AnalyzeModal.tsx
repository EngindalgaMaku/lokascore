"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  X,
  MapPin,
  Settings,
  Download,
  Share2,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type AnalysisResult = {
  analysis_id: number;
  overall_score: number;
  confidence: number;
  component_scores: {
    competition: number;
    foot_traffic: number;
    accessibility: number;
    demographic: number;
    environmental: number;
  };
  insights: {
    key_points: string[];
    recommendations: string[];
    risks: string[];
    opportunities: string[];
  };
  feature_importance?: { [key: string]: number };
  processing_time_ms?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AnalyzeModal({ open, onClose }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(500);
  const [businessType, setBusinessType] = useState<string>("cafe");

  const businessTypes = [
    { value: "cafe", label: "☕ Kafe", color: "bg-amber-100 text-amber-700" },
    {
      value: "restaurant",
      label: "🍽️ Restoran",
      color: "bg-orange-100 text-orange-700",
    },
    {
      value: "retail",
      label: "🏪 Perakende",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "hospital",
      label: "🏥 Hastane",
      color: "bg-red-100 text-red-700",
    },
    { value: "school", label: "🎓 Okul", color: "bg-green-100 text-green-700" },
    {
      value: "bank",
      label: "🏦 Banka",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const radiusOptions = [
    { value: 250, label: "250m - Yakın Çevre" },
    { value: 500, label: "500m - Yürüme Mesafesi" },
    { value: 750, label: "750m - Orta Mesafe" },
    { value: 1000, label: "1000m - Geniş Alan" },
  ];

  useEffect(() => {
    if (!open) {
      // Reset when modal closes
      setPosition(null);
      setResult(null);
      setLoading(false);
      setError(null);
      setRadius(500);
      setBusinessType("cafe");
    }
  }, [open]);

  useEffect(() => {
    if (!open || !position) return;

    const [lat, lng] = position;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    setLoading(true);
    setError(null);
    setResult(null);

    fetch(`${apiUrl}/ml/analyze-location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: lat,
        lng: lng,
        business_type: businessType,
        radius: radius,
        analysis_name: `${businessType} analysis at ${lat.toFixed(
          4
        )}, ${lng.toFixed(4)}`,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data: AnalysisResult) => setResult(data))
      .catch((err) => {
        console.error("Analysis error:", err);
        setError(
          "Analiz alınamadı. Lütfen tekrar deneyin veya parametreleri değiştirin."
        );
      })
      .finally(() => setLoading(false));
  }, [open, position, radius, businessType]);

  const selectedBusinessType = businessTypes.find(
    (bt) => bt.value === businessType
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Lokasyon Analizi</h2>
              <p className="text-sm text-muted-foreground">
                Harita üzerinde bir nokta seçin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Map Section */}
          <div className="h-[50vh] lg:h-[70vh] lg:w-2/3">
            <Map onSelect={(lat, lng) => setPosition([lat, lng])} />
          </div>

          {/* Controls & Results Section */}
          <div className="flex flex-col border-t lg:w-1/3 lg:border-l lg:border-t-0">
            {/* Controls */}
            <div className="border-b p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Analiz Parametreleri</span>
              </div>

              <div className="space-y-4">
                {/* Business Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    İşletme Türü
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="select w-full"
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Radius */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Analiz Yarıçapı
                  </label>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="select w-full"
                  >
                    {radiusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Position */}
            <div className="border-b p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Seçilen Konum</span>
              </div>
              {position ? (
                <div className="space-y-2">
                  <div className="font-mono text-xs bg-secondary rounded p-2">
                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedBusinessType && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${selectedBusinessType.color}`}
                      >
                        {selectedBusinessType.label}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {radius}m yarıçap
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Haritada bir nokta seçin
                </p>
              )}
            </div>

            {/* Results */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-4 w-4 items-center justify-center">
                  {loading && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {error && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {result && <CheckCircle className="h-4 w-4 text-success" />}
                  {!loading && !error && !result && (
                    <div className="h-4 w-4 rounded-full border-2 border-muted" />
                  )}
                </div>
                <span className="font-medium">Analiz Sonuçları</span>
              </div>

              <div className="space-y-4">
                {loading && (
                  <div className="space-y-3">
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-2/3 rounded bg-muted" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Analiz yapılıyor...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    {/* Overall Score */}
                    <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-primary">
                            🎯 Genel Skor
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            AI Analizi
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {result.overall_score.toFixed(1)}/10
                          </div>
                          <div className="text-xs text-muted-foreground">
                            %{(result.confidence * 100).toFixed(0)} güven
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                          style={{ width: `${result.overall_score * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Component Scores */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">📊 Detaylı Analiz</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-2 rounded border">
                          <span className="text-xs">🏢 Rekabet</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 transition-all duration-300"
                                style={{
                                  width: `${
                                    result.component_scores.competition * 10
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-xs w-8 text-right">
                              {result.component_scores.competition.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded border">
                          <span className="text-xs">🚶 Trafik</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{
                                  width: `${
                                    result.component_scores.foot_traffic * 10
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-xs w-8 text-right">
                              {result.component_scores.foot_traffic.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded border">
                          <span className="text-xs">🚗 Erişim</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{
                                  width: `${
                                    result.component_scores.accessibility * 10
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-xs w-8 text-right">
                              {result.component_scores.accessibility.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded border">
                          <span className="text-xs">👥 Demografi</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 transition-all duration-300"
                                style={{
                                  width: `${
                                    result.component_scores.demographic * 10
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-xs w-8 text-right">
                              {result.component_scores.demographic.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded border">
                          <span className="text-xs">🌳 Çevre</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{
                                  width: `${
                                    result.component_scores.environmental * 10
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-xs w-8 text-right">
                              {result.component_scores.environmental.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="space-y-3">
                      {result.insights.key_points.length > 0 && (
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                          <h5 className="text-xs font-medium text-blue-700 mb-1">
                            💡 Öne Çıkanlar
                          </h5>
                          <ul className="text-xs text-blue-600 space-y-1">
                            {result.insights.key_points
                              .slice(0, 3)
                              .map((point, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-blue-400">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {result.insights.opportunities.length > 0 && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                          <h5 className="text-xs font-medium text-green-700 mb-1">
                            🚀 Fırsatlar
                          </h5>
                          <ul className="text-xs text-green-600 space-y-1">
                            {result.insights.opportunities
                              .slice(0, 2)
                              .map((opp, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-green-400">•</span>
                                  <span>{opp}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {result.insights.risks.length > 0 && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                          <h5 className="text-xs font-medium text-amber-700 mb-1">
                            ⚠️ Riskler
                          </h5>
                          <ul className="text-xs text-amber-600 space-y-1">
                            {result.insights.risks
                              .slice(0, 2)
                              .map((risk, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-amber-400">•</span>
                                  <span>{risk}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {result.insights.recommendations.length > 0 && (
                        <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                          <h5 className="text-xs font-medium text-purple-700 mb-1">
                            💼 Öneriler
                          </h5>
                          <ul className="text-xs text-purple-600 space-y-1">
                            {result.insights.recommendations
                              .slice(0, 2)
                              .map((rec, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-purple-400">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {result.processing_time_ms && (
                      <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                        ⚡ Analiz süresi: {result.processing_time_ms}ms
                      </div>
                    )}
                  </div>
                )}

                {!loading && !error && !result && position && (
                  <p className="text-sm text-muted-foreground">
                    Analiz sonucu bekleniyor...
                  </p>
                )}

                {!position && (
                  <p className="text-sm text-muted-foreground">
                    Haritadan bir nokta seçin
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t p-6">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (result) {
                      // Navigate to detailed report
                      const reportUrl = `/report?analysis_id=${result.analysis_id}&lat=${position?.[0]}&lng=${position?.[1]}`;
                      window.open(reportUrl, "_blank");
                    }
                  }}
                  disabled={!result || loading}
                  className="btn btn-primary flex-1 text-sm disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Detaylı Rapor
                </button>
                <button
                  onClick={() => {
                    if (result && position) {
                      const shareText = `LOKASCORE AI Analizi\n🎯 Skor: ${result.overall_score.toFixed(
                        1
                      )}/10\n📍 Konum: ${position[0].toFixed(
                        4
                      )}, ${position[1].toFixed(4)}\n\nDetaylar: ${
                        window.location.origin
                      }/report?analysis_id=${result.analysis_id}`;
                      navigator.clipboard.writeText(shareText).then(() => {
                        alert("Analiz sonucu kopyalandı!");
                      });
                    }
                  }}
                  disabled={!result || loading}
                  className="btn btn-outline text-sm disabled:opacity-50"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
