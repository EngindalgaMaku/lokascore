import {
  Code,
  Book,
  Key,
  Globe,
  Shield,
  Zap,
  Database,
  MapPin,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function DocsPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/analyze/basic",
      description: "Temel lokasyon analizi yapar",
      parameters: [
        {
          name: "lat",
          type: "float",
          required: true,
          description: "Enlem koordinatı",
        },
        {
          name: "lng",
          type: "float",
          required: true,
          description: "Boylam koordinatı",
        },
        {
          name: "radius",
          type: "int",
          required: false,
          description: "Analiz yarıçapı (metre), varsayılan: 500",
        },
        {
          name: "type",
          type: "string",
          required: false,
          description: "İşletme türü, varsayılan: 'cafe'",
        },
      ],
      response: {
        competitors_250m: "number",
        competitors_500m: "number",
        nearby_schools: "number",
        nearby_parks: "number",
        summary: "string",
      },
    },
  ];

  const businessTypes = [
    { value: "cafe", label: "Kafe" },
    { value: "restaurant", label: "Restoran" },
    { value: "school", label: "Okul" },
    { value: "park", label: "Park" },
    { value: "hospital", label: "Hastane" },
    { value: "market", label: "Market" },
  ];

  const codeExample = `// JavaScript örneği
const analyzeLocation = async (lat, lng, type = 'cafe') => {
  const response = await fetch(
    \`https://api.lokascore.com/analyze/basic?lat=\${lat}&lng=\${lng}&type=\${type}\`
  );
  
  if (!response.ok) {
    throw new Error('API isteği başarısız');
  }
  
  const data = await response.json();
  return data;
};

// Kullanım
analyzeLocation(36.8893, 30.7081, 'cafe')
  .then(result => console.log(result))
  .catch(error => console.error(error));`;

  const pythonExample = `# Python örneği
import requests

def analyze_location(lat, lng, business_type='cafe', radius=500):
    """LOKASCORE API ile lokasyon analizi yapar"""
    
    url = "https://api.lokascore.com/analyze/basic"
    params = {
        'lat': lat,
        'lng': lng,
        'type': business_type,
        'radius': radius
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API Hatası: {response.status_code}")

# Kullanım
result = analyze_location(36.8893, 30.7081, 'cafe')
print(result)`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-secondary/20">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Book className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 lg:text-4xl">
              API Dokümantasyonu
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              LOKASCORE API'sini kullanarak lokasyon analizi özelliklerini kendi
              uygulamanızla entegre edin
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="card p-6 text-center">
              <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">REST</div>
              <div className="text-sm text-muted-foreground">API Standardı</div>
            </div>
            <div className="card p-6 text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">&lt;200ms</div>
              <div className="text-sm text-muted-foreground">
                Ortalama Yanıt
              </div>
            </div>
            <div className="card p-6 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="card p-6 text-center">
              <Key className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">HTTPS</div>
              <div className="text-sm text-muted-foreground">
                Güvenli Bağlantı
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-responsive py-12">
        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hızlı Başlangıç</h2>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">API Anahtarı</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                API'yi kullanmak için bir anahtar gereklidir. Şu an beta
                aşamasında olduğumuz için API açık erişimlidir.
              </p>
              <div className="bg-secondary rounded-lg p-3 font-mono text-sm">
                Base URL:{" "}
                <span className="text-primary">https://api.lokascore.com</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Rate Limiting</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                API istekleriniz dakikada 60 istekle sınırlıdır. Premium planlar
                için daha yüksek limitler mevcuttur.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Ücretsiz: 60 istek/dakika</span>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>

          {endpoints.map((endpoint, index) => (
            <div key={index} className="card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono">
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono">{endpoint.path}</code>
              </div>

              <p className="text-muted-foreground mb-6">
                {endpoint.description}
              </p>

              {/* Parameters */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Parametreler</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">İsim</th>
                        <th className="text-left py-2">Tip</th>
                        <th className="text-left py-2">Gerekli</th>
                        <th className="text-left py-2">Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.parameters.map((param, paramIndex) => (
                        <tr key={paramIndex} className="border-b">
                          <td className="py-2 font-mono text-primary">
                            {param.name}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {param.type}
                          </td>
                          <td className="py-2">
                            {param.required ? (
                              <span className="text-red-600">Evet</span>
                            ) : (
                              <span className="text-muted-foreground">
                                Hayır
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {param.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Response */}
              <div>
                <h4 className="font-semibold mb-3">Yanıt Formatı</h4>
                <div className="bg-secondary rounded-lg p-4">
                  <pre className="text-sm">
                    {JSON.stringify(endpoint.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Business Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Desteklenen İşletme Türleri
          </h2>
          <div className="card p-6">
            <div className="grid gap-3 md:grid-cols-3">
              {businessTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded bg-secondary/50"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm text-primary">
                    {type.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    - {type.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Kod Örnekleri</h2>

          <div className="space-y-6">
            {/* JavaScript Example */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">JavaScript</h3>
                </div>
                <button className="btn btn-outline btn-sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Kopyala
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>

            {/* Python Example */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Python</h3>
                </div>
                <button className="btn btn-outline btn-sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Kopyala
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{pythonExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hata Yönetimi</h2>
          <div className="card p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-800">
                    400 Bad Request
                  </div>
                  <div className="text-sm text-red-700">
                    Geçersiz parametreler veya eksik veri
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-800">
                    429 Too Many Requests
                  </div>
                  <div className="text-sm text-yellow-700">
                    Rate limit aşıldı, lütfen bekleyin
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-800">
                    500 Internal Server Error
                  </div>
                  <div className="text-sm text-red-700">
                    Sunucu hatası, lütfen tekrar deneyin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Destek ve Geri Bildirim</h3>
            <p className="text-muted-foreground mb-6">
              API kullanımı hakkında sorularınız mı var? Yardım için bizimle
              iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn btn-primary">
                İletişime Geçin
              </a>
              <a href="mailto:api@lokascore.com" className="btn btn-outline">
                api@lokascore.com
              </a>
              <a href="#" className="btn btn-outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
