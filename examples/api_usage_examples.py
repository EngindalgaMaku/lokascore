"""
LOKASCORE API Kullanım Örnekleri
===============================

Bu dosya LOKASCORE platformunun API'lerinin nasıl kullanılacağını gösteren
pratik örnekleri içerir.

Kurulum:
    pip install requests python-dotenv

Kullanım:
    python examples/api_usage_examples.py
"""

import requests
import json
import time
from typing import Dict, List, Optional
from datetime import datetime

# API Base URL - development environment
API_BASE_URL = "http://localhost:8000"

class LOKASCOREClient:
    """LOKASCORE API Client"""
    
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'LOKASCORE-Client/1.0'
        })
    
    def health_check(self) -> Dict:
        """API sağlık kontrolü"""
        response = self.session.get(f"{self.base_url}/health")
        return response.json()
    
    # Analiz Endpoint'leri
    def basic_location_analysis(self, lat: float, lng: float, 
                              business_type: str = "cafe", 
                              radius: int = 500) -> Dict:
        """Temel lokasyon analizi"""
        params = {
            'lat': lat,
            'lng': lng,
            'type': business_type,
            'radius': radius
        }
        response = self.session.get(f"{self.base_url}/analyze/basic", params=params)
        return response.json()
    
    # AI/ML Analiz Endpoint'leri
    def ai_location_analysis(self, lat: float, lng: float, 
                           business_type: str, radius: int = 500,
                           analysis_name: Optional[str] = None) -> Dict:
        """AI destekli lokasyon analizi"""
        data = {
            "lat": lat,
            "lng": lng,
            "business_type": business_type,
            "radius": radius,
            "analysis_name": analysis_name
        }
        response = self.session.post(f"{self.base_url}/ml/analyze-location", 
                                   json=data)
        return response.json()
    
    def get_location_features(self, lat: float, lng: float, 
                            business_type: str, radius: int = 500) -> Dict:
        """Lokasyon özelliklerini getir"""
        params = {
            'business_type': business_type,
            'radius': radius
        }
        response = self.session.get(f"{self.base_url}/ml/features/{lat}/{lng}",
                                  params=params)
        return response.json()
    
    def analyze_business_sentiment(self, business_id: int) -> Dict:
        """İşletme sentiment analizi"""
        response = self.session.post(f"{self.base_url}/ml/analyze-sentiment/{business_id}")
        return response.json()
    
    def train_ml_model(self, business_type: str, region_id: Optional[int] = None) -> Dict:
        """ML modeli eğit"""
        data = {
            "business_type": business_type,
            "region_id": region_id
        }
        response = self.session.post(f"{self.base_url}/ml/train-model", json=data)
        return response.json()
    
    def get_trained_models(self, business_type: Optional[str] = None) -> List[Dict]:
        """Eğitilmiş modelleri listele"""
        params = {}
        if business_type:
            params['business_type'] = business_type
        
        response = self.session.get(f"{self.base_url}/ml/models", params=params)
        return response.json()
    
    # Veri Toplama Endpoint'leri
    def start_kaleici_pilot_scraping(self) -> Dict:
        """Kaleiçi pilot veri toplama"""
        response = self.session.post(f"{self.base_url}/scraping/start-kaleiçi-pilot")
        return response.json()
    
    def scrape_comprehensive_business(self, business_id: str,
                                    include_reviews: bool = True,
                                    include_photos: bool = True,
                                    analyze_sentiment: bool = True) -> Dict:
        """Kapsamlı işletme verisi toplama"""
        params = {
            'business_id': business_id,
            'include_reviews': include_reviews,
            'include_photos': include_photos,
            'analyze_sentiment': analyze_sentiment,
            'save_to_database': True
        }
        response = self.session.post(f"{self.base_url}/scraping/scrape-comprehensive-business",
                                   params=params)
        return response.json()
    
    def get_scraping_jobs(self, status: Optional[str] = None, limit: int = 10) -> List[Dict]:
        """Scraping işlerini listele"""
        params = {'limit': limit}
        if status:
            params['status'] = status
            
        response = self.session.get(f"{self.base_url}/scraping/jobs", params=params)
        return response.json()
    
    def get_scraping_stats(self) -> Dict:
        """Scraping istatistikleri"""
        response = self.session.get(f"{self.base_url}/scraping/stats")
        return response.json()
    
    # Bölge Yönetimi Endpoint'leri
    def create_region(self, name: str, city: str, district: str,
                     center_lat: float, center_lng: float,
                     radius_km: float = 2.0, description: str = None) -> Dict:
        """Yeni bölge oluştur"""
        data = {
            "name": name,
            "city": city,
            "district": district,
            "center_lat": center_lat,
            "center_lng": center_lng,
            "radius_km": radius_km,
            "description": description or f"{name} bölgesi"
        }
        response = self.session.post(f"{self.base_url}/regions/create", json=data)
        return response.json()
    
    def get_regions(self, city: Optional[str] = None, is_pilot_region: Optional[bool] = None) -> List[Dict]:
        """Bölgeleri listele"""
        params = {}
        if city:
            params['city'] = city
        if is_pilot_region is not None:
            params['is_pilot_region'] = is_pilot_region
            
        response = self.session.get(f"{self.base_url}/regions/list", params=params)
        return response.json()
    
    def get_region_stats(self, region_id: int) -> Dict:
        """Bölge istatistikleri"""
        response = self.session.get(f"{self.base_url}/regions/{region_id}/stats")
        return response.json()
    
    def setup_kaleici_pilot(self) -> Dict:
        """Kaleiçi pilot projesini başlat"""
        response = self.session.post(f"{self.base_url}/regions/kaleiçi-pilot")
        return response.json()


def example_1_basic_location_analysis():
    """Örnek 1: Temel Lokasyon Analizi"""
    print("🎯 Örnek 1: Temel Lokasyon Analizi")
    print("=" * 50)
    
    client = LOKASCOREClient()
    
    # Kaleiçi merkezinde cafe analizi
    kaleici_center = (36.8851, 30.7056)
    
    try:
        result = client.basic_location_analysis(
            lat=kaleici_center[0],
            lng=kaleici_center[1],
            business_type="cafe",
            radius=500
        )
        
        print(f"📍 Konum: {kaleici_center}")
        print(f"☕ 250m içinde cafe: {result['competitors_250m']}")
        print(f"☕ 500m içinde cafe: {result['competitors_500m']}")
        print(f"🏫 Yakın okul: {result['nearby_schools']}")
        print(f"🌳 Yakın park: {result['nearby_parks']}")
        print(f"📝 Özet: {result['summary']}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ API hatası: {e}")
    
    print("\n")


def example_2_ai_powered_analysis():
    """Örnek 2: AI Destekli Konum Analizi"""
    print("🤖 Örnek 2: AI Destekli Konum Analizi")
    print("=" * 50)
    
    client = LOKASCOREClient()
    
    # Farklı lokasyonları karşılaştır
    locations = [
        (36.8851, 30.7056, "Kaleiçi Merkez"),
        (36.8900, 30.7100, "Kaleiçi Kuzey"),
        (36.8800, 30.7000, "Kaleiçi Güney")
    ]
    
    for lat, lng, location_name in locations:
        try:
            result = client.ai_location_analysis(
                lat=lat,
                lng=lng,
                business_type="restaurant",
                analysis_name=f"{location_name} Restoran Analizi"
            )
            
            print(f"📍 {location_name}")
            print(f"🎯 Genel Skor: {result['overall_score']:.1f}/10")
            print(f"🔒 Güven: {result['confidence']:.0%}")
            print(f"⚔️  Rekabet: {result['component_scores']['competition']:.1f}/10")
            print(f"🚶 Yaya Trafiği: {result['component_scores']['foot_traffic']:.1f}/10")
            print(f"🚌 Erişilebilirlik: {result['component_scores']['accessibility']:.1f}/10")
            
            # Önemli öneriler
            if result['insights']['recommendations']:
                print(f"💡 Öneriler: {', '.join(result['insights']['recommendations'][:2])}")
            
            print(f"⏱️  İşlem süresi: {result.get('processing_time_ms', 0)}ms")
            print("-" * 40)
            
        except requests.exceptions.RequestException as e:
            print(f"❌ {location_name} için hata: {e}")
    
    print("\n")


def example_3_sentiment_analysis():
    """Örnek 3: İşletme Sentiment Analizi"""
    print("😊 Örnek 3: İşletme Sentiment Analizi")
    print("=" * 50)
    
    client = LOKASCOREClient()
    
    # Örnek business ID'ler (test için)
    sample_business_ids = [1, 2, 3]
    
    for business_id in sample_business_ids:
        try:
            result = client.analyze_business_sentiment(business_id)
            
            print(f"🏪 İşletme ID: {business_id}")
            print(f"😊 Ortalama Sentiment: {result['avg_sentiment']:.2f}")
            print(f"📊 Sentiment Dağılımı:")
            print(f"  ✅ Pozitif: {result['sentiment_distribution']['positive']}")
            print(f"  ❌ Negatif: {result['sentiment_distribution']['negative']}")
            print(f"  ➖ Nötr: {result['sentiment_distribution']['neutral']}")
            
            print(f"🔍 Analiz Edilen Yorum: {result['total_reviews_analyzed']}")
            print(f"🎯 Sentiment Skoru: {result['sentiment_score']:.1f}/10")
            
            # En popüler konular
            if result['top_topics']:
                top_topic = max(result['top_topics'].items(), key=lambda x: x[1])
                print(f"🔥 En Popüler Konu: {top_topic[0]} ({top_topic[1]} bahsetme)")
            
            print("-" * 40)
            
        except requests.exceptions.RequestException as e:
            print(f"❌ İşletme {business_id} için hata: {e}")
    
    print("\n")


def example_4_comprehensive_business_scraping():
    """Örnek 4: Kapsamlı İşletme Veri Toplama"""
    print("🕷️ Örnek 4: Kapsamlı İşletme Veri Toplama")
    print("=" * 50)
    
    client = LOKASCOREClient()
    
    # Örnek Google Place ID (Kaleiçi'den bir restoran)
    sample_place_id = "ChIJAQAAABDEDxQR1234567890"  # Test ID
    
    try:
        print(f"📥 İşletme verisi toplanıyor: {sample_place_id}")
        
        result = client.scrape_comprehensive_business(
            business_id=sample_place_id,
            include_reviews=True,
            include_photos=True,
            analyze_sentiment=True
        )
        
        print(f"✅ Başarı: {result['success']}")
        print(f"🏪 İşletme: {result['basic_info']['name']}")
        print(f"📍 Adres: {result['basic_info']['address']}")
        print(f"⭐ Puan: {result['basic_info']['rating']}/5")
        print(f"💬 Yorum Sayısı: {result['basic_info']['review_count']}")
        print(f"📸 Fotoğraf: {result['visual_content']['total_photos']}")
        print(f"📊 Veri Bütünlüğü: {result['data_completeness']:.0%}")
        
        # Sentiment analizi sonuçları
        if result['reviews_analysis']['sentiment_analysis']:
            sentiment = result['reviews_analysis']['sentiment_analysis']
            print(f"😊 Sentiment Analizi:")
            print(f"  📈 Pozitif Oran: {sentiment['positive_ratio']:.0%}")
            print(f"  📉 Negatif Oran: {sentiment['negative_ratio']:.0%}")
        
        print(f"⏰ Toplama Zamanı: {result['scraped_at']}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Veri toplama hatası: {e}")
    
    print("\n")


def example_5_region_management():
    """Örnek 5: Bölge Yönetimi"""
    print("🗺️ Örnek 5: Bölge Yönetimi")
    print("=" * 50)
    
    client = LOKASCOREClient()
    
    # Yeni bir test bölgesi oluştur
    try:
        new_region = client.create_region(
            name="Lara Beach Test",
            city="Antalya",
            district="Muratpaşa",
            center_lat=36.8445,
            center_lng=30.7810,
            radius_km=2.0,
            description="Lara sahili test bölgesi"
        )
        
        print(f"✅ Yeni bölge oluşturuldu: {new_region['name']}")
        print(f"🆔 Bölge ID: {new_region['id']}")
        print(f"📍 Merkez: ({new_region['center_lat']}, {new_region['center_lng']})")
        print(f"📏 Yarıçap: {new_region['radius_km']} km")
        
        region_id = new_region['id']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Bölge oluşturma hatası: {e}")
        # Test için mevcut bir bölge kullan
        region_id = 1
    
    # Bölgeleri listele
    try:
        regions = client.get_regions(city="Antalya")
        print(f"\n📋 Antalya'daki bölgeler ({len(regions)} adet):")
        
        for region in regions[:3]:  # İlk 3 bölgeyi göster
            print(f"  🏷️  {region['name']} ({region['district']})")
            print(f"     İşletme: {region['businesses_count']}")
            print(f"     Scraping: {region['scraping_jobs_count']} job")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Bölge listesi hatası: {e}")
    
    # Bölge istatistikleri
    try:
        stats = client.get_region_stats(region_id)
        print(f"\n📊 Bölge İstatistikleri (ID: {region_id}):")
        print(f"🏪 Toplam İşletme: {stats['coverage_stats']['total_businesses']}")
        print(f"💬 Yorumlı İşletme: {stats['coverage_stats']['businesses_with_reviews_pct']:.1f}%")
        print(f"⭐ Ortalama Puan: {stats['reviews_stats']['avg_rating']:.1f}")
        print(f"🔍 Veri Kalitesi: {stats['data_quality']['completeness_score']:.1f}%")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ İstatistik hatası: {e}")
    
    print("\n")


def example_6_kaleici_pilot_project():
    """Örnek 6: Kaleiçi Pilot Projesini Başlatma"""
    print("🎯 Örnek 6: Kaleiçi Pilot Projesi")
    print("=" * 50)
    
    client = LOKASCOREClient()
    
    try:
        # Kaleiçi pilot projesini başlat
        result = client.setup_kaleici_pilot()
        
        print(f"🚀 Status: {result['status']}")
        print(f"📍 Bölge ID: {result['region_id']}")
        if 'job_id' in result:
            print(f"⚙️ İş ID: {result['job_id']}")
        
        print(f"⏱️ Tahmini Süre: {result.get('estimated_duration_hours', 'N/A')} saat")
        
        print("\n📋 Sonraki Adımlar:")
        for i, step in enumerate(result.get('next_steps', []), 1):
            print(f"  {i}. {step}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Pilot proje hatası: {e}")
    
    print("\n")


def example_7_monitoring_and_stats():
    """Örnek 7: Sistem İzleme ve İstatistikler"""
    print("📈 Örnek 7: Sistem İzleme ve İstatistikler")
    print("=" * 50)
    
    client = LOKASCOREClient()
    
    # Sistem sağlık kontrolü
    try:
        health = client.health_check()
        print(f"🏥 Sistem Durumu: {health['status']}")
        print(f"📊 Versiyon: {health['version']}")
        print(f"🔧 Özellikler: {len(health['features'])} adet")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Sağlık kontrol hatası: {e}")
    
    # Scraping istatistikleri
    try:
        scraping_stats = client.get_scraping_stats()
        print(f"\n🕷️ Scraping İstatistikleri:")
        print(f"📦 Toplanan İşletme: {scraping_stats['total_businesses_scraped']}")
        print(f"⚙️ Aktif İş: {scraping_stats['active_scraping_jobs']}")
        print(f"✅ Tamamlanan İş: {scraping_stats['completed_scraping_jobs']}")
        
        print(f"📊 İşletme Türü Dağılımı:")
        for business_type, count in scraping_stats['business_type_distribution'].items():
            print(f"  {business_type}: {count}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Scraping stats hatası: {e}")
    
    # Eğitilmiş modeller
    try:
        models = client.get_trained_models()
        print(f"\n🧠 ML Modelleri: {len(models)} adet")
        
        for model in models[:3]:  # İlk 3 modeli göster
            print(f"  🤖 {model['name']}")
            print(f"     Algoritma: {model['algorithm']}")
            print(f"     Doğruluk: {model['accuracy']:.3f}")
            print(f"     Eğitim verisi: {model['training_data_size']}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Model listesi hatası: {e}")
    
    print("\n")


def run_comprehensive_example():
    """Kapsamlı Örnek: Restoran Lokasyon Analizi Projesi"""
    print("🎯 KAPSAMLI ÖRNEK: Restoran Lokasyon Analizi Projesi")
    print("=" * 70)
    print("Bu örnek bir restoran zincirinin Kaleiçi'de yeni şube açma")
    print("kararı için LOKASCORE platformunun nasıl kullanılacağını gösterir.\n")
    
    client = LOKASCOREClient()
    
    # 1. Sistem hazır mı kontrol et
    print("1️⃣ Sistem Hazırlık Kontrolü")
    try:
        health = client.health_check()
        print(f"   ✅ Sistem aktif: {health['status']}")
    except:
        print("   ❌ Sistem erişilemez")
        return
    
    # 2. Kaleiçi pilot projesini başlat
    print("\n2️⃣ Kaleiçi Veri Toplama")
    try:
        pilot_result = client.setup_kaleici_pilot()
        print(f"   🚀 Pilot proje başlatıldı: {pilot_result['status']}")
        time.sleep(2)  # Kısa bekleme
    except Exception as e:
        print(f"   ⚠️ Pilot zaten çalışıyor veya tamamlanmış")
    
    # 3. Potansiyel lokasyonları analiz et
    print("\n3️⃣ Potansiyel Lokasyon Analizi")
    potential_locations = [
        (36.8841, 30.7056, "Ana Kapı Yakını"),
        (36.8860, 30.7070, "Marina Bölgesi"),
        (36.8825, 30.7040, "Hadrian Kapısı Yakını")
    ]
    
    best_location = None
    best_score = 0
    
    for lat, lng, name in potential_locations:
        try:
            analysis = client.ai_location_analysis(
                lat=lat, lng=lng, business_type="restaurant",
                analysis_name=f"{name} Restoran Analizi"
            )
            
            score = analysis['overall_score']
            print(f"   📍 {name}: {score:.1f}/10")
            
            if score > best_score:
                best_score = score
                best_location = (name, lat, lng, analysis)
                
        except Exception as e:
            print(f"   ❌ {name} analizi başarısız")
    
    # 4. En iyi lokasyonun detaylarını göster
    if best_location:
        name, lat, lng, analysis = best_location
        print(f"\n4️⃣ Önerilen Lokasyon: {name}")
        print(f"   🎯 Genel Skor: {analysis['overall_score']:.1f}/10")
        print(f"   🔒 Güven Seviyesi: {analysis['confidence']:.0%}")
        
        scores = analysis['component_scores']
        print(f"   📊 Detay Skorlar:")
        print(f"      ⚔️ Rekabet: {scores['competition']:.1f}/10")
        print(f"      🚶 Yaya Trafiği: {scores['foot_traffic']:.1f}/10")
        print(f"      🚌 Erişilebilirlik: {scores['accessibility']:.1f}/10")
        print(f"      👥 Demografik: {scores['demographic']:.1f}/10")
        print(f"      🌳 Çevresel: {scores['environmental']:.1f}/10")
        
        print(f"   💡 Öneriler:")
        for recommendation in analysis['insights']['recommendations'][:3]:
            print(f"      • {recommendation}")
        
        if analysis['insights']['risks']:
            print(f"   ⚠️ Risk Faktörleri:")
            for risk in analysis['insights']['risks'][:2]:
                print(f"      • {risk}")
    
    # 5. Karar özeti
    print(f"\n5️⃣ Karar Özeti")
    if best_location:
        name, lat, lng, analysis = best_location
        print(f"   🏆 En İyi Lokasyon: {name}")
        print(f"   💯 Başarı Potansiyeli: {analysis['overall_score']:.1f}/10")
        
        if analysis['overall_score'] >= 8.0:
            print(f"   ✅ Öneri: Güçlü lokasyon, yatırım önerilir")
        elif analysis['overall_score'] >= 6.0:
            print(f"   ⚠️ Öneri: Orta risk, dikkatli değerlendirme gerekir")
        else:
            print(f"   ❌ Öneri: Yüksek risk, alternatif lokasyon aranmalı")
    else:
        print(f"   ❌ Analiz tamamlanamadı")
    
    print("\n" + "=" * 70)
    print("🎯 LOKASCORE analizi tamamlandı!")
    print("Detaylı rapor için /docs/LOKASCORE_DOKUMANTASYON.md dosyasına bakın.")


if __name__ == "__main__":
    print("🎯 LOKASCORE API Kullanım Örnekleri")
    print("=" * 70)
    print()
    
    # Tüm örnekleri çalıştır
    examples = [
        example_1_basic_location_analysis,
        example_2_ai_powered_analysis,
        example_3_sentiment_analysis,
        example_4_comprehensive_business_scraping,
        example_5_region_management,
        example_6_kaleici_pilot_project,
        example_7_monitoring_and_stats
    ]
    
    for i, example_func in enumerate(examples, 1):
        try:
            example_func()
        except Exception as e:
            print(f"❌ Örnek {i} çalıştırılamadı: {e}\n")
    
    # Kapsamlı örnek
    print("\n" + "🔥" * 20 + " BONUS " + "🔥" * 20)
    try:
        run_comprehensive_example()
    except Exception as e:
        print(f"❌ Kapsamlı örnek başarısız: {e}")
    
    print(f"\n🎉 Tüm örnekler tamamlandı!")
    print(f"📚 Detaylı dokümantasyon: docs/LOKASCORE_DOKUMANTASYON.md")