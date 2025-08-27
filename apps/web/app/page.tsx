"use client";

import { useState } from "react";
import AnalyzeModal from "@/components/AnalyzeModal";
import {
  Check,
  MapPin,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Globe,
  BarChart3,
  Zap,
  Shield,
  Users,
  Target,
  Brain,
  Clock,
} from "lucide-react";

export default function Home() {
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "Yapay Zeka Destekli",
      description:
        "Makine öğrenmesi algoritmaları ile lokasyon potansiyelini analiz ederiz",
    },
    {
      icon: BarChart3,
      title: "Veri Odaklı İçgörüler",
      description:
        "PostGIS ve mekansal analiz ile metre bazında hassas sonuçlar",
    },
    {
      icon: Clock,
      title: "Anında Sonuçlar",
      description: "Saniyeler içinde kapsamlı lokasyon raporu alın",
    },
    {
      icon: Shield,
      title: "Güvenilir Veri",
      description: "Güncel ve doğrulanmış veri kaynaklarından beslenen analiz",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Analiz Edilen Lokasyon" },
    { value: "95%", label: "Doğruluk Oranı" },
    { value: "24/7", label: "Hizmet Süresi" },
    { value: "5 Sn", label: "Ortalama Analiz Süresi" },
  ];

  const steps = [
    {
      step: "01",
      title: "Konum Seçin",
      description:
        "Harita üzerinde analiz etmek istediğiniz noktayı işaretleyin",
    },
    {
      step: "02",
      title: "Analizi Başlatın",
      description: "İşletme türünü seçin ve analiz parametrelerini belirleyin",
    },
    {
      step: "03",
      title: "Sonuçları Alın",
      description: "Detaylı rapor ve skorları anında görüntüleyin",
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container-responsive relative py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  AI Destekli Lokasyon Analizi
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Yeni</span>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
                  <span className="heading-gradient">Doğru lokasyonu</span>
                  <br />
                  <span>saniyeler içinde keşfedin</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground lg:text-xl">
                  LOKASCORE; yaya trafiği, işletme yoğunluğu ve erişilebilirlik
                  sinyallerini tek bir skorda toplar. Yeni şube, yatırım veya
                  gayrimenkul kararlarınız artık daha hızlı ve isabetli.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setAnalyzeModalOpen(true)}
                  className="btn btn-primary group text-base"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Haritadan Analiz Yap
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a href="/report" className="btn btn-outline text-base">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Canlı Örnekler
                </a>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4">
                {[
                  "PostGIS destekli güvenilir mekansal analiz",
                  "Gerçek zamanlı özet, metrik ve skorlar",
                  "Paylaşılabilir rapor çıktıları",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Card */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="card card-hover animate-fade-in bg-card/50 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-primary" />
                      Muratpaşa, Antalya
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Canlı
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Genel Skor
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-secondary">
                          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-accent" />
                        </div>
                        <span className="text-sm font-semibold">8.2/10</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          label: "Yaya Trafiği",
                          value: "8.2",
                          color: "text-green-600",
                        },
                        {
                          label: "İşletme Yoğunluğu",
                          value: "7.6",
                          color: "text-blue-600",
                        },
                        {
                          label: "Ulaşım",
                          value: "8.8",
                          color: "text-purple-600",
                        },
                        {
                          label: "Demografi",
                          value: "7.9",
                          color: "text-orange-600",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-background/50 p-3 text-center"
                        >
                          <div className="text-xs text-muted-foreground">
                            {item.label}
                          </div>
                          <div
                            className={`text-lg font-semibold ${item.color}`}
                          >
                            {item.value}
                            <span className="text-xs text-muted-foreground">
                              /10
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-secondary/20">
        <div className="container-responsive py-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold lg:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">Neden LOKASCORE?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Modern teknoloji ve veri bilimi ile desteklenen lokasyon analizi
              platformumuzun avantajları
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover group p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section-padding bg-secondary/20">
        <div className="container-responsive">
          <div className="text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">Nasıl Çalışır?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Basit adımlarla profesyonel lokasyon analizi
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-full z-10 hidden h-0.5 w-full bg-border md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center lg:p-12">
            <div className="mx-auto max-w-2xl">
              <h3 className="text-2xl font-bold lg:text-3xl">
                Lokasyon kararlarınızı hızlandıralım
              </h3>
              <p className="mt-4 text-muted-foreground lg:text-lg">
                Tek tıkla haritayı açın, konumu seçin ve anında özet alın.
                Skorlar ve metrikler ile güvenle ilerleyin.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => setAnalyzeModalOpen(true)}
                  className="btn btn-primary text-base group"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Haritadan Analiz Yap
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a href="/contact" className="btn btn-outline text-base">
                  İletişime Geçin
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analyze Modal */}
      <AnalyzeModal
        open={analyzeModalOpen}
        onClose={() => setAnalyzeModalOpen(false)}
      />
    </main>
  );
}
