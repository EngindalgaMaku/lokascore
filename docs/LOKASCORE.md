# LOKASCORE — Veri ve YZ Destekli Lokasyon Analizi Platformu

LOKASCORE, girişimcilerin, yatırımcıların ve franchise işletmelerinin “doğru konumu seçme” kararını veri ve yapay zekâ ile destekleyen bir web platformudur. Harita üzerinden seçilen bir noktanın belirli bir işletme türü (kafe, restoran, butik vb.) için ticari potansiyelini analiz eder; anlaşılır bir skor ve rapor sunar.

## Amaç
İçgüdüsel kararların yerini veri odaklı stratejilerin almasını sağlamak; hızlı bir temel analiz ve derinlemesine bir ücretli rapor akışıyla karar sürecini hızlandırmak.

## Temel Özellikler
- İnteraktif Harita Arayüzü  
  Dinamik, seç-analiz akışlı harita deneyimi.
- Anlık Temel Analiz (Ücretsiz)  
  Seçilen noktanın 500 m çevresi için hızlı özet: “8 kafe, 3 okul…” gibi rekabet ve yoğunluk göstergeleri.
- Detaylı Potansiyel Raporu (Ücretli)  
  - Genel Potansiyel Skoru (100 üzerinden)  
  - Detaylı Rakip Analizi (sayı, kalite, pazar doygunluğu)  
  - Talep ve Müşteri Profili (yaya trafiği potansiyeli, hedef kitle yoğunluğu)  
  - SWOT (GZFT) Analizi  
  - Google Yorumları Duygu Analizi (özet ve temalar)  
- İşletme Türü Karşılaştırma  
  Aynı konumda farklı türlerin (örn. Kafe vs. Dönerci) potansiyel kıyaslaması.

## Hedef Kitle
- Yeni şube/dükkan açmak isteyen girişimciler ve KOBİ’ler  
- Şubeleşme planlayan franchise markaları  
- Veri odaklı danışmanlık sunmak isteyen emlak/işletme danışmanları  
- Bölgesel ticari dinamikleri analiz eden yatırımcılar

## Teknoloji Yığını (Açık Kaynak ve Bütçesiz Odak)
- Backend: Python 3.10+, FastAPI; Pandas, GeoPandas  
- Frontend: Next.js (React) + Leaflet.js; OpenStreetMap (ücretsiz tile)  
- Veritabanı: PostgreSQL + PostGIS  
- Scraping: Scrapy; Selenium/Playwright (JS-yoğun siteler için)  
- ML/NLP: scikit-learn, LightGBM/XGBoost; NLTK/spaCy/HF Transformers  
- Deployment: Docker; Hetzner/Render veya düşük maliyetli VPS (Hetzner/DO)

## Veri Akış Mimarisi
1. Veri Kazıma (Scraping)  
   Hedef coğrafyadaki işletmeler Google Maps’ten periyodik çekilir (isim, kategori, koordinat, puan, yorum sayısı/metinleri).
2. Veri Depolama  
   PostgreSQL/PostGIS’e ham veri yazılır; konumlar coğrafi tiplerde saklanır.
3. Veri Zenginleştirme ve Özellik Mühendisliği  
   Örn. 500 m rakip sayısı, en yakın okula uzaklık, çevre puan ortalaması vb.
4. Model Eğitimi (Offline)  
   “Başarı Potansiyeli Modeli” periyodik eğitilir, model dosyası kaydedilir.
5. API Sunumu (Online Skorlama)  
   FastAPI, koordinat + işletme türüne göre skoru ve detay analizi döner.
6. Görselleştirme  
   Next.js (React) frontend’i, sonuçları harita ve rapor bileşenlerinde sunar.

## Analiz Modelinin Mantığı
- Başarı Vekili (Proxy)  
  Yorum sayısı ve puan kombinasyonu popülerlik/memnuniyetin güçlü sinyali.  
  Örnek skor: log(yorum_sayısı) × ortalama_puan (aşırı popülerlerin etkisini dengeler).
- Model Görevi  
  XGBoost/GBM, mevcut işletmelerin konum özelliklerinden bu “Başarı Skoru”nu öğrenir ve yeni nokta için tahmin üretir.
- Özellik Örnekleri  
  - Rekabet: rakip_sayısı_250m/500m, ortalama_rakip_puanı, pazar_doygunluğu  
  - Talep/Trafik: yakın_okul/ofis_sayısı, ana_caddeye_uzaklık, toplu_taşıma_uzaklık  
  - Demografi/Çevre: park sayısı, mahalle nüfus yoğunluğu (varsa)  
  - NLP: rakip yorumlarından temel temalar (“fiyat pahalı”, “servis yavaş”, “konum harika”)

## MVP’den Tam Sürüme Yol Haritası
- Faz 1: Temel Veri ve Altyapı (1–2 Ay)  
  [ ] Hedef: Antalya/Muratpaşa + “Kafe” türü  
  [ ] Scraper: Google Maps verilerini çek  
  [ ] Veritabanı: PostgreSQL/PostGIS kur ve şema tasarla  
  [ ] İlk yükleme: Tüm kafe verisini aktar
- Faz 2: MVP Lansmanı (1 Ay)  
  [ ] Harita arayüzü: Nokta seçimi ve temel UI  
  [ ] Temel API: 500 m çevre analizini sun  
  [ ] Yayına al: Basit sunucu/servis üzerinde ilk kullanıcılar
- Faz 3: Çekirdek Model ve Gelir (2 Ay)  
  [ ] Başarı modeli: İlk potansiyel skoru eğit  
  [ ] Raporlama: Profesyonel PDF rapor üretimi  
  [ ] Ödeme: Stripe/Iyzico entegrasyonu  
  [ ] Ücretli raporları aktive et
- Faz 4: Genişleme ve İyileştirme (Sürekli)  
  [ ] Yeni bölgeler: Antalya genelinde yayılım  
  [ ] Yeni türler: Restoran, butik, berber vb.  
  [ ] Model geliştirme: Ek özellikler ve gelişmiş NLP

## Mimarî ve Bileşenler
- API: FastAPI servisleri  
- Model Servisi: Kaydedilmiş GBM modeliyle skorlama  
- Veri Katmanı: PostGIS ile mekânsal sorgular (buffer, distance, nearest)  
- Frontend: Next.js + Leaflet harita + rapor bileşenleri  
- Batch Job’lar: Scraper ve offline eğitim cron/worker

## Güvenlik ve Uyum Notları
- Orantılı hız sınırlama ve önbellekleme (scraping ve API için)  
- Çevresel değişkenlerle gizli anahtar yönetimi  
- Kişisel veri toplanmaması; kamuya açık verinin etik ve lisans uyumlu kullanımı

---

# Gözden Geçirme Önerileri
- İş modeli: Ücretsiz analiz limitleri ve ücretli rapor fiyatlandırması netleştirilsin.  
- Coğrafya: Muratpaşa sonrası genişleme sırası ve veri tazeleme periyodu tanımlansın.  
- Kalite ölçümü: Proxy skora alternatif/ek metrikler (ör. zamanla ağırlıklandırma) değerlendirilsin.  
- Altyapı: Coolify + Hetzner başlangıç maliyet/performans ayarları gözden geçirilsin.

# Sonraki Adımlar
- Doküman konumu: `docs/LOKASCORE.md`  
- Onayınız sonrası repo iskeleti (Next.js + FastAPI + PostGIS) ve docker-compose dosyaları eklenecek.  
- İlk sprint: Harita + basic analiz endpoint + staging deploy (Coolify).
