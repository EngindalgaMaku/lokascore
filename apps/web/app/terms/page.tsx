import type { Metadata } from "next";
import {
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kullanım Koşulları - Hizmet Şartlarımız",
  description:
    "LOKASCORE kullanım koşulları ve hizmet şartları. Platformumuzun kullanımına ilişkin temel koşullar ve kullanıcı sorumlulukları.",
  keywords: [
    "kullanım koşulları",
    "hizmet şartları",
    "platform kuralları",
    "kullanıcı sözleşmesi",
    "yasal",
    "sorumluluk",
  ],
  openGraph: {
    title: "Kullanım Koşulları - LOKASCORE",
    description:
      "LOKASCORE hizmetinin kullanımına ilişkin temel koşullar ve kullanıcı sorumlulukları hakkında bilgiler.",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "LOKASCORE - Kullanım Koşulları",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Kullanım Koşulları - LOKASCORE",
    description:
      "LOKASCORE platformunun kullanım koşulları ve hizmet şartlarını inceleyin.",
    images: ["/icon-512.png"],
  },
};

export default function TermsPage() {
  const lastUpdated = "15 Mart 2024";
  const effectiveDate = "1 Ocak 2024";

  const sections = [
    {
      icon: Users,
      title: "Hizmet Kullanımı",
      content: [
        "LOKASCORE hizmeti 'olduğu gibi' sunulur; kesintisiz veya hatasız çalışacağı garanti edilmez",
        "Hizmeti yasal amaçlar için ve bu koşullara uygun şekilde kullanmayı kabul ediyorsunuz",
        "Hesap bilgilerinizin güvenliğinden ve gizliliğinden siz sorumlusunuz",
        "Hizmeti üçüncü tarafların haklarını ihlal edecek şekilde kullanmak yasaktır",
      ],
    },
    {
      icon: Scale,
      title: "Sorumluluk Sınırları",
      content: [
        "Üretilen skor ve özetler karar desteği amaçlıdır; nihai sorumluluk kullanıcıya aittir",
        "LOKASCORE, analiz sonuçlarına dayalı olarak verilen kararlardan sorumlu değildir",
        "Veri kaynaklarının doğruluğu için mümkün olan çabayı gösteririz ancak garanti vermeyiz",
        "Hizmet kesintileri veya veri kayıpları nedeniyle oluşan zararlardan sorumlu tutulamayız",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Yasaklı Kullanımlar",
      content: [
        "Yetkisiz erişim, tersine mühendislik veya veri kazıma (scraping) yasaktır",
        "Hizmetin güvenliğini tehlikeye atacak faaliyetler kesinlikle yasaktır",
        "Sahte hesap oluşturma veya yanıltıcı bilgi verme yasaktır",
        "Ticari olmayan kullanım dışında API'nin otomatik erişimi yasaktır",
      ],
    },
    {
      icon: Globe,
      title: "Fikri Mülkiyet",
      content: [
        "LOKASCORE markası, logosu ve içeriği fikri mülkiyet hakları ile korunmaktadır",
        "Kullanıcı içerikleri üzerinde size ait haklar saklıdır",
        "Hizmet içeriğini kopyalama, dağıtma veya değiştirme yasaktır",
        "Açık kaynak bileşenler kendi lisansları altında kullanılır",
      ],
    },
  ];

  const keyPoints = [
    {
      icon: CheckCircle,
      title: "Kabul Edilmesi",
      description: "Hizmeti kullanarak bu koşulları kabul etmiş sayılırsınız",
    },
    {
      icon: FileText,
      title: "Güncellemeler",
      description:
        "Koşullar zaman zaman güncellenebilir; güncel metin bu sayfada yayınlanır",
    },
    {
      icon: Scale,
      title: "Geçerli Hukuk",
      description:
        "Bu sözleşme Türkiye Cumhuriyeti hukuku kapsamında yorumlanır",
    },
  ];

  return (
    <div className="container-responsive min-h-screen py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Kullanım Koşulları</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          LOKASCORE hizmetinin kullanımına ilişkin temel koşullar ve kullanıcı
          sorumlulukları
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Son güncellenme: {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Yürürlük: {effectiveDate}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Key Points */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {keyPoints.map((point, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-3">
                <point.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Introduction */}
        <div className="card p-8 mb-8 bg-primary/5 border-primary/20">
          <h2 className="text-xl font-semibold mb-4 text-primary">Giriş</h2>
          <p className="text-muted-foreground mb-4">
            Bu sayfa LOKASCORE hizmetinin kullanımına ilişkin temel koşulları
            özetler. Hizmeti kullanarak aşağıdaki koşulları kabul etmiş
            sayılırsınız.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-amber-700">
              Lütfen bu koşulları dikkatlice okuyun ve anlayın.
            </span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <ol className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary font-bold mt-0.5 flex-shrink-0">
                      {itemIndex + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Contact & Dispute Resolution */}
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Sorularınız mı Var?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Bu koşullarla ilgili herhangi bir sorunuz varsa bizimle iletişime
              geçin.
            </p>
            <a href="/contact" className="btn btn-primary">
              İletişime Geçin
            </a>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Scale className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Uyuşmazlık Çözümü</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Uyuşmazlıklar öncelikle dostane yollarla çözülmeye çalışılır.
              Gerekirse Antalya mahkemeleri yetkilidir.
            </p>
          </div>
        </div>

        {/* Legal Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            Bu kullanım koşulları Türkiye Cumhuriyeti hukuku uyarınca
            hazırlanmıştır. Koşullar güncellendiğinde değişiklik tarihi bu
            sayfada belirtilecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
