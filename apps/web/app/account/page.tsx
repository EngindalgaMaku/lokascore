"use client";

import { useState } from "react";
import {
  User,
  Settings,
  CreditCard,
  FileText,
  Star,
  Download,
  Calendar,
  MapPin,
  TrendingUp,
  Eye,
  Share2,
  Trash2,
  ChevronRight,
} from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock user data
  const user = {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    plan: "Pro",
    joinDate: "15 Mart 2024",
    reportsCount: 23,
    creditsUsed: 47,
    creditsRemaining: 53,
  };

  const recentReports = [
    {
      id: 1,
      location: "Muratpaşa, Antalya",
      type: "Kafe",
      score: 8.2,
      date: "2 gün önce",
      coordinates: "36.8893, 30.7081",
    },
    {
      id: 2,
      location: "Kepez, Antalya",
      type: "Restoran",
      score: 7.6,
      date: "1 hafta önce",
      coordinates: "36.9081, 30.6472",
    },
    {
      id: 3,
      location: "Konyaaltı, Antalya",
      type: "Kafe",
      score: 9.1,
      date: "2 hafta önce",
      coordinates: "36.8863, 30.6349",
    },
  ];

  const tabs = [
    { id: "dashboard", label: "Genel Bakış", icon: TrendingUp },
    { id: "reports", label: "Raporlarım", icon: FileText },
    { id: "favorites", label: "Favoriler", icon: Star },
    { id: "billing", label: "Faturalama", icon: CreditCard },
    { id: "settings", label: "Ayarlar", icon: Settings },
  ];

  const TabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Welcome & Stats */}
            <div>
              <h1 className="text-2xl font-bold">Merhaba, {user.name}!</h1>
              <p className="text-muted-foreground mt-1">
                Hesap durumunuz ve son aktiviteleriniz
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Toplam Rapor
                    </p>
                    <p className="text-2xl font-bold">{user.reportsCount}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Kullanılan Kredi
                    </p>
                    <p className="text-2xl font-bold">{user.creditsUsed}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Kalan Kredi</p>
                    <p className="text-2xl font-bold">
                      {user.creditsRemaining}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="card">
              <div className="border-b p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Son Raporlar</h2>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className="text-sm text-primary hover:underline"
                  >
                    Tümünü Gör
                  </button>
                </div>
              </div>
              <div className="divide-y">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-6 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{report.location}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.type} • {report.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {report.score}/10
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Skor
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Raporlarım</h1>
              <div className="flex gap-2">
                <button className="btn btn-outline">
                  <Download className="mr-2 h-4 w-4" />
                  Toplu İndir
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {recentReports.map((report) => (
                <div key={report.id} className="card card-hover p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.location}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 font-mono">
                          {report.coordinates}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {report.score}/10
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Potansiyel Skoru
                        </div>
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
                </div>
              ))}
            </div>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Faturalama</h1>

            {/* Current Plan */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{user.plan} Planı</h3>
                  <p className="text-muted-foreground">
                    Aktif plan bilgileriniz
                  </p>
                </div>
                <button className="btn btn-primary">Planı Değiştir</button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Kalan Kredi</p>
                  <p className="text-2xl font-bold">{user.creditsRemaining}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Yenileme Tarihi
                  </p>
                  <p className="text-lg font-semibold">15 Nisan 2024</p>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="card">
              <div className="border-b p-6">
                <h3 className="text-lg font-semibold">Fatura Geçmişi</h3>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground">
                  Henüz fatura geçmişiniz bulunmuyor.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Ayarlar</h1>
            <div className="card p-6">
              <p className="text-muted-foreground">
                Bu bölüm yakında eklenecek.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container-responsive min-h-screen py-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="card p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.plan} Üye</p>
              </div>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm">{tab.label}</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <TabContent />
        </div>
      </div>
    </div>
  );
}
