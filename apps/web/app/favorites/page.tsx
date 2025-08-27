"use client";

import { useState } from "react";
import {
  Heart,
  MapPin,
  Star,
  Calendar,
  Filter,
  Search,
  Eye,
  Share2,
  Trash2,
  Grid3x3,
  List,
  SortAsc,
  SortDesc,
  Download,
  Plus,
  TrendingUp,
  Building,
  AlertCircle,
} from "lucide-react";

type FavoriteLocation = {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  businessType: string;
  score: number;
  savedDate: string;
  lastAnalyzed: string;
  notes?: string;
  tags: string[];
};

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "score" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string>("all");

  // Mock data
  const favorites: FavoriteLocation[] = [
    {
      id: "1",
      name: "Muratpaşa Merkez Lokasyonu",
      location: "Muratpaşa, Antalya",
      coordinates: [36.8893, 30.7081],
      businessType: "Kafe",
      score: 8.2,
      savedDate: "2024-03-20",
      lastAnalyzed: "2024-03-20",
      notes: "Yoğun yaya trafiği, üniversiteye yakın",
      tags: ["merkezi", "öğrenci-yoğun", "yüksek-trafik"],
    },
    {
      id: "2",
      name: "Konyaaltı Sahil Alanı",
      location: "Konyaaltı, Antalya",
      coordinates: [36.8863, 30.6349],
      businessType: "Restoran",
      score: 9.1,
      savedDate: "2024-03-18",
      lastAnalyzed: "2024-03-18",
      notes: "Deniz manzarası, turist alanı",
      tags: ["sahil", "turizm", "premium"],
    },
    {
      id: "3",
      name: "Kepez Ticaret Merkezi",
      location: "Kepez, Antalya",
      coordinates: [36.9081, 30.6472],
      businessType: "Market",
      score: 7.3,
      savedDate: "2024-03-15",
      lastAnalyzed: "2024-03-15",
      tags: ["ticari", "konut-alanı"],
    },
    {
      id: "4",
      name: "Lara Otel Bölgesi",
      location: "Lara, Antalya",
      coordinates: [36.8234, 30.7891],
      businessType: "Kafe",
      score: 8.7,
      savedDate: "2024-03-10",
      lastAnalyzed: "2024-03-08",
      notes: "Otel yoğunluğu yüksek",
      tags: ["turizm", "oteller", "lüks"],
    },
  ];

  const businessTypes = ["all", "cafe", "restaurant", "market", "retail"];
  const businessTypeLabels: Record<string, string> = {
    all: "Tümü",
    cafe: "Kafe",
    restaurant: "Restoran",
    market: "Market",
    retail: "Perakende",
  };

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter((fav) => filterType === "all" || fav.businessType === filterType)
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "score":
          comparison = a.score - b.score;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
        default:
          comparison =
            new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 7) return "text-blue-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 7) return "bg-blue-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="container-responsive min-h-screen py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Favori Lokasyonlar</h1>
          <p className="text-muted-foreground">
            Kaydettiğiniz {filteredFavorites.length} lokasyon
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline">
            <Download className="mr-2 h-4 w-4" />
            Dışa Aktar
          </button>
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Analiz
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search & Filter */}
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Lokasyon ara..."
                className="input pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select"
            >
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {businessTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>

          {/* View & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "score" | "name")
              }
              className="select"
            >
              <option value="date">Kayıt Tarihi</option>
              <option value="score">Skor</option>
              <option value="name">İsim</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="btn btn-outline"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </button>

            {/* View Mode */}
            <div className="flex rounded-lg border">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-l-lg ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-r-lg ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredFavorites.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Henüz favori lokasyon yok
          </h3>
          <p className="text-muted-foreground mb-6">
            Analiz ettiğiniz lokasyonları buraya kaydetmeye başlayın
          </p>
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            İlk Analizinizi Yapın
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {filteredFavorites.map((favorite) => (
            <div
              key={favorite.id}
              className={`card card-hover group ${
                viewMode === "list" ? "p-4" : "p-6"
              }`}
            >
              {viewMode === "grid" ? (
                // Grid View
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{favorite.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {favorite.location}
                        </p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getScoreBg(
                      favorite.score
                    )} ${getScoreColor(favorite.score)}`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {favorite.score}/10 Potansiyel
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {favorite.businessType}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(favorite.savedDate).toLocaleDateString("tr-TR")}
                    </div>
                  </div>

                  {favorite.tags && favorite.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {favorite.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {favorite.tags.length > 2 && (
                        <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                          +{favorite.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {favorite.notes && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {favorite.notes}
                    </p>
                  )}

                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="btn btn-ghost btn-sm flex-1">
                      <Eye className="mr-1 h-4 w-4" />
                      Görüntüle
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                // List View
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{favorite.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {favorite.location}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{favorite.businessType}</span>
                        <span>
                          {new Date(favorite.savedDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </span>
                        {favorite.tags && favorite.tags.length > 0 && (
                          <div className="flex gap-1">
                            {favorite.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-1 py-0.5 bg-secondary rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${getScoreColor(
                          favorite.score
                        )}`}
                      >
                        {favorite.score}/10
                      </div>
                      <div className="text-xs text-muted-foreground">Skor</div>
                    </div>

                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
