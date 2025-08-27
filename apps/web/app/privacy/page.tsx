import type { Metadata } from "next";
import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası - Verilerinizin Güvenliği",
  description:
    "LOKASCORE gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, korunduğu ve kullanıldığı hakkında detaylı bilgiler.",
  keywords: [
    "gizlilik politikası",
    "veri güvenliği",
    "KVKK",
    "kişisel veri korunması",
    "gizlilik",
    "güvenlik",
  ],
  openGraph: {
    title: "Gizlilik Politikası - LOKASCORE",
    description:
      "Kişisel verilerinizin gizliliğine verdiğimiz önem ve bu verileri nasıl koruduğumuz hakkında bilgiler.",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "LOKASCORE - Gizlilik ve Güvenlik",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Gizlilik Politikası - LOKASCORE",
    description:
      "Kişisel verilerinizin gizliliği ve güvenliği önceliğimizdir. Detaylı gizlilik politikamızı inceleyin.",
    images: ["/icon-512.png"],
  },
};

export default function PrivacyPage() {
  const lastUpdated = "15 Mart 2024";

  const sections = [
    {
      icon: Database,
      title: "Toplanan Veriler",
      content: [
        "Konum seçimleri analitik ve skor hesaplaması için geçici olarak işlenir",
        "Hesap verileri (e-posta, ad) kimlik doğrulama ve bildirimler için kullanılır",
        "Kullanım verileri hizmeti geliştirmek amacıyla anonim olarak toplanır",
        "Çerezler sadece teknik gereklilikler ve kullanıcı deneyimi için kullanılır",
      ],
    },
    {
      icon: Lock,
      title: "Veri Güvenliği",
      content: [
        "Tüm veriler SSL/TLS şifreleme ile korunur",
        "Veritabanı erişimi sınırlı ve loglanır",
        "Düzenli güvenlik güncellemeleri ve penetrasyon testleri yapılır",
        "Personel minimum yetki prensibi ile veri erişimi sağlar",
      ],
    },
    {
      icon: UserCheck,
      title: "Kullanıcı Hakları",
      content: [
        "Verilerinize erişim talep edebilirsiniz",
        "Yanlış verilerin düzeltilmesini isteyebilirsiniz",
        "Hesabınızı ve verilerinizi tamamen silebilirsiniz",
        "Veri işleme faaliyetlerine itiraz edebilirsiniz",
      ],
    },
    {
      icon: Globe,
      title: "Üçüncü Taraf Paylaşım",
      content: [
        "Verileriniz üçüncü taraflarla ticari amaçla paylaşılmaz",
        "Yasal zorunluluklar haricinde veri paylaşımı yapılmaz",
        "API entegrasyonları kullanıcı onayı ile sınırlıdır",
        "Veri işleme sözleşmeleri ile tedarikçiler denetlenir",
      ],
    },
  ];

  return (
    <div className="container-responsive min-h-screen py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Kişisel verilerinizin gizliliğine verdiğimiz önem ve bu verileri nasıl
          koruduğumuz hakkında bilgiler
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
            Temel İlkelerimiz
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Güvenlik Önceliği</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Kullanıcı Kontrolü</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Şeffaflık</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Kullanıcı verilerinin gizliliğine önem veriyoruz. Toplanan veriler,
            hizmeti geliştirmek ve deneyimi iyileştirmek amacıyla sınırlı
            ölçekte ve mevzuata uygun biçimde işlenir.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="card p-6 mt-8 bg-secondary/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Haklarınızı Kullanın</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Kişisel verilerinizle ilgili herhangi bir sorunuz olursa veya
                haklarınızı kullanmak istiyorsanız bizimle iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/contact" className="btn btn-primary">
                  İletişime Geçin
                </a>
                <a
                  href="mailto:privacy@lokascore.com"
                  className="btn btn-outline"
                >
                  privacy@lokascore.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            Bu gizlilik politikası Türkiye Cumhuriyeti mevzuatı ve KVKK (Kişisel
            Verilerin Korunması Kanunu) uyarınca hazırlanmıştır. Politika
            değişiklikleri bu sayfada yayınlanacaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
