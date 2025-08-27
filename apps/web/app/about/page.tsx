import type { Metadata } from "next";
import {
  Target,
  Users,
  Award,
  TrendingUp,
  MapPin,
  Brain,
  Database,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda - Misyonumuz ve Vizyonumuz",
  description:
    "LOKASCORE takımı, teknolojisi ve vizyonu hakkında bilgi alın. Veri bilimi ile konum seçimini kolaylaştırıyoruz.",
  keywords: [
    "hakkımızda",
    "LOKASCORE takımı",
    "lokasyon analizi",
    "veri bilimi",
    "yapay zeka",
    "misyon",
    "vizyon",
  ],
  openGraph: {
    title: "Hakkımızda - LOKASCORE Takımı ve Vizyonumuz",
    description:
      "Veri bilimi ve yapay zeka ile konum seçimini kolaylaştıran LOKASCORE takımı ve vizyonumuz hakkında bilgi alın.",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "LOKASCORE - Lokasyon Analizi Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda - LOKASCORE Takımı",
    description:
      "Veri bilimi ile konum seçimini kolaylaştıran LOKASCORE takımı ve teknolojisi hakkında bilgi alın.",
    images: ["/icon-512.png"],
  },
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Mehmet Yılmaz",
      role: "Kurucu & CEO",
      bio: "15+ yıllık teknoloji deneyimi. Daha önce fintech ve PropTech alanında başarılı projeler yürüttü.",
      image: "/api/placeholder/120/120",
    },
    {
      name: "Ayşe Demir",
      role: "CTO & Kurucu Ortak",
      bio: "Veri bilimi ve makine öğrenmesi uzmanı. Stanford'da doktora, Google'da senior developer.",
      image: "/api/placeholder/120/120",
    },
    {
      name: "Can Özkan",
      role: "Veri Bilimci",
      bio: "Coğrafi bilgi sistemleri ve mekansal analiz alanında 8 yıllık deneyim. ODTÜ mezunu.",
      image: "/api/placeholder/120/120",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Odak",
      description: "Kullanıcı ihtiyaçları odaklı çözümler geliştiriyoruz",
    },
    {
      icon: Brain,
      title: "İnovasyon",
      description: "Yapay zeka ve veri biliminin gücüyle yenilik yaratıyoruz",
    },
    {
      icon: Shield,
      title: "Güvenilirlik",
      description: "Doğru ve tutarlı sonuçlar sunmak bizim önceliğimiz",
    },
    {
      icon: Heart,
      title: "Şeffaflık",
      description: "Açık ve anlaşılır iletişimi her zaman tercih ediyoruz",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "Proje Başlangıcı",
      description: "LOKASCORE fikri doğdu ve ilk MVP geliştirmeye başladık",
    },
    {
      year: "2024 Q1",
      title: "Beta Sürüm",
      description: "Antalya bölgesi için beta sürümü yayınladık",
    },
    {
      year: "2024 Q2",
      title: "İlk Kullanıcılar",
      description:
        "100+ kullanıcı platformumuzu aktif olarak kullanmaya başladı",
    },
    {
      year: "2024 Q3",
      title: "AI Entegrasyonu",
      description: "Makine öğrenmesi modellerini canlıya aldık",
    },
    {
      year: "2024 Q4",
      title: "Büyüme",
      description: "Yeni şehirler ve özellikler için hazırlıklara başladık",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="container-responsive relative py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 lg:text-5xl">
              <span className="heading-gradient">Veri bilimi</span> ile
              <br />
              konum seçimini kolaylaştırıyoruz
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              LOKASCORE, girişimcilerin ve yatırımcıların doğru konum seçme
              kararını yapay zeka ve veri analizi ile desteklemek için kuruldu.
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>10,000+ Analiz Yapıldı</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>500+ Aktif Kullanıcı</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span>%95 Doğruluk Oranı</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-secondary/20">
        <div className="container-responsive">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Misyonumuz</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                İçgüdüsel kararların yerini veri odaklı stratejilerin almasını
                sağlamak. Girişimcilerin ve yatırımcıların konum seçimi sürecini
                hızlandırarak, daha bilinçli ve başarılı işletmeler kurmasına
                yardımcı olmak.
              </p>
            </div>

            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Lightbulb className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">Vizyonumuz</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Türkiye'nin ve bölgenin önde gelen lokasyon zekası platformu
                olmak. Her ölçekteki işletmenin doğru konum kararı verebilmesi
                için gerekli teknoloji ve veriyi demokratikleştirmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Değerlerimiz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Çalışmalarımızı yönlendiren temel ilkeler ve değerler
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="card p-6 text-center group hover:scale-105 transition-transform"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-secondary/20">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Takımımız</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deneyimli ve tutku dolu ekibimiz ile geleceği şekillendiriyoruz
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Yolculuğumuz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              LOKASCORE'un gelişim hikayesi ve gelecek planları
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {index + 1}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-px h-16 bg-border mt-4" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {milestone.year}
                      </span>
                      <h3 className="text-lg font-semibold">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section-padding bg-secondary/20">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Teknoloji Yığınımız</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern ve güçlü teknolojiler kullanarak güvenilir çözümler
              üretiyoruz
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6 text-center">
              <Database className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Veri & Analitik</h3>
              <p className="text-sm text-muted-foreground">
                PostgreSQL, PostGIS, Python, Pandas
              </p>
            </div>
            <div className="card p-6 text-center">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Yapay Zeka</h3>
              <p className="text-sm text-muted-foreground">
                scikit-learn, XGBoost, NLTK, Transformers
              </p>
            </div>
            <div className="card p-6 text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Web & API</h3>
              <p className="text-sm text-muted-foreground">
                Next.js, FastAPI, Docker, React
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center lg:p-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 lg:text-3xl">
                Bize Katılmak İster Misiniz?
              </h3>
              <p className="text-muted-foreground mb-8">
                Yetenekli ve tutkulu ekibimize katılın. Birlikte harika işler
                yapalım ve konum zekası alanında öncü olmaya devam edelim.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="btn btn-primary">
                  İletişime Geçin
                </a>
                <a
                  href="mailto:kariyer@lokascore.com"
                  className="btn btn-outline"
                >
                  Kariyer Fırsatları
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
