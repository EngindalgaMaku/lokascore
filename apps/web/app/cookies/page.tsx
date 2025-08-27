import { Cookie, Settings, Shield, Eye, ToggleLeft, Info } from "lucide-react";

export default function CookiesPage() {
  const lastUpdated = "15 Mart 2024";

  const cookieTypes = [
    {
      icon: Shield,
      title: "Temel Çerezler",
      description: "Web sitesinin temel işlevselliği için gerekli çerezler",
      essential: true,
      examples: [
        "Oturum yönetimi çerezi (session)",
        "Kullanıcı tercihleri (tema, dil)",
        "Güvenlik çerezi (CSRF koruması)",
        "Yük dengeleme çerezi",
      ],
    },
    {
      icon: Eye,
      title: "Analitik Çerezler",
      description: "Site kullanımını anlamamıza yardımcı olan çerezler",
      essential: false,
      examples: [
        "Sayfa görüntüleme istatistikleri",
        "Kullanıcı davranış analizi",
        "Site performans metrikleri",
        "Hata raporlama",
      ],
    },
    {
      icon: Settings,
      title: "İşlevsel Çerezler",
      description:
        "Gelişmiş özellikler ve kişiselleştirme için kullanılan çerezler",
      essential: false,
      examples: [
        "Harita konum tercihleri",
        "Favori lokasyon listesi",
        "Arayüz özelleştirmeleri",
        "Bildirim tercihleri",
      ],
    },
  ];

  const thirdPartyServices = [
    {
      name: "OpenStreetMap",
      purpose: "Harita görüntüleme",
      cookies: "Harita tile önbelleği",
      policy: "https://operations.osmfoundation.org/policies/",
    },
    {
      name: "Hetzner",
      purpose: "Sunucu altyapısı",
      cookies: "Yük dengeleme",
      policy: "https://www.hetzner.com/legal/privacy-policy",
    },
  ];

  return (
    <div className="container-responsive min-h-screen py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Çerez Politikası</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Web sitemizde kullandığımız çerezler hakkında detaylı bilgiler ve
          tercihlerinizi yönetme seçenekleri
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>Son güncellenme: {lastUpdated}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Overview */}
        <div className="card p-8 mb-8 bg-primary/5 border-primary/20">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Çerezler Nedir?
          </h2>
          <p className="text-muted-foreground mb-4">
            Çerezler, web sitelerinin ziyaret ettiğiniz cihaza küçük metin
            dosyaları yerleştirmesine olanak tanıyan teknolojidir. Bu dosyalar
            web sitesinin sizi tanıması, tercihlerinizi hatırlaması ve size daha
            iyi bir deneyim sunması için kullanılır.
          </p>
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-800 mb-1">
                LOKASCORE'da Çerezler
              </div>
              <div className="text-sm text-blue-700">
                Çerezleri site işlevselliği, kullanıcı deneyimi ve hizmet
                kalitesini artırmak için kullanıyoruz. Kişisel veri toplama
                amacıyla kullanılmaz.
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold">Çerez Türleri</h2>

          {cookieTypes.map((category, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ToggleLeft
                    className={`h-6 w-6 ${
                      category.essential
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      category.essential
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {category.essential ? "Gerekli" : "İsteğe Bağlı"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Örnekler:
                </h4>
                <ul className="grid gap-1 md:grid-cols-2">
                  {category.examples.map((example, exampleIndex) => (
                    <li
                      key={exampleIndex}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Third Party Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Üçüncü Taraf Hizmetler</h2>
          <div className="card p-6">
            <p className="text-muted-foreground mb-6">
              Bazı özelliklerimiz için güvenilir üçüncü taraf hizmetleri
              kullanıyoruz. Bu hizmetler kendi çerez politikalarına sahiptir.
            </p>

            <div className="space-y-4">
              {thirdPartyServices.map((service, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="mb-3 md:mb-0">
                    <h4 className="font-semibold">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {service.purpose}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Çerez: {service.cookies}
                    </p>
                  </div>
                  <a
                    href={service.policy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Gizlilik Politikası →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cookie Control */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Çerez Kontrolü</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Tarayıcı Ayarları</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Çoğu tarayıcı çerezleri kontrol etmenize olanak tanır:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Çerezleri engelleme veya silme</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Çerez bildirimleri almak</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Belirli siteler için ayar yapma</span>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">LOKASCORE Tercihleri</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                İsteğe bağlı çerezleri kapatabilirsiniz:
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analitik Çerezler</span>
                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">İşlevsel Çerezler</span>
                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                </div>
                <button className="btn btn-primary btn-sm w-full">
                  Tercihleri Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="card p-6 mb-8 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">
                Önemli Notlar
              </h3>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>
                  • Temel çerezleri kapatırsanız site düzgün çalışmayabilir
                </li>
                <li>• Çerez tercihleriniz bu cihaza özeldir</li>
                <li>
                  • Tarayıcı verilerini silerseniz tercihleriniz sıfırlanır
                </li>
                <li>• Çerez politikamızı düzenli olarak güncelleriz</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card p-6 text-center">
          <h3 className="font-semibold mb-2">Sorularınız mı Var?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Çerez kullanımımız hakkında daha fazla bilgi için bizimle iletişime
            geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="btn btn-primary">
              İletişime Geçin
            </a>
            <a href="mailto:privacy@lokascore.com" className="btn btn-outline">
              privacy@lokascore.com
            </a>
          </div>
        </div>

        {/* Legal Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            Bu çerez politikası Türkiye Cumhuriyeti mevzuatı ve KVKK uyarınca
            hazırlanmıştır. Politika güncellemeleri bu sayfada yayınlanacaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
