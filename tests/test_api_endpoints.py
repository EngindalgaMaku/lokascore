"""
LOKASCORE API Endpoint Test Scripti
===================================

Bu script LOKASCORE API'lerinin çalışıp çalışmadığını test eder.

Kullanım:
    cd tests/
    python test_api_endpoints.py

Not: API'nin localhost:8000'de çalışıyor olması gerekir.
"""

import requests
import json
import sys
import time
from typing import Dict, List, Optional, Tuple

# Test yapılandırması
API_BASE_URL = "http://localhost:8000"
TEST_TIMEOUT = 30  # seconds

class APITester:
    """API endpoint test sınıfı"""
    
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Test sonucunu kaydet"""
        result = {
            'test_name': test_name,
            'success': success,
            'details': details,
            'timestamp': time.time()
        }
        self.test_results.append(result)
        
        status = "✅ BAŞARILI" if success else "❌ BAŞARISIZ"
        print(f"{status}: {test_name}")
        if details:
            print(f"    → {details}")
    
    def test_health_check(self) -> bool:
        """API sağlık kontrolü testi"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'healthy':
                    self.log_test("Health Check", True, f"Version: {data.get('version')}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected status: {data.get('status')}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_basic_analyze(self) -> bool:
        """Temel analiz endpoint'i testi"""
        try:
            params = {
                'lat': 36.8851,
                'lng': 30.7056,
                'type': 'cafe',
                'radius': 500
            }
            
            response = self.session.get(f"{self.base_url}/analyze/basic", 
                                      params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['competitors_250m', 'competitors_500m', 
                                 'nearby_schools', 'nearby_parks', 'summary']
                
                if all(field in data for field in required_fields):
                    self.log_test("Basic Analysis", True, 
                                f"Found {data['competitors_500m']} competitors")
                    return True
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Basic Analysis", False, 
                                f"Missing fields: {missing}")
                    return False
            else:
                self.log_test("Basic Analysis", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Basic Analysis", False, f"Request error: {str(e)}")
            return False
    
    def test_ml_analyze_location(self) -> bool:
        """ML konum analizi testi"""
        try:
            data = {
                "lat": 36.8851,
                "lng": 30.7056,
                "business_type": "restaurant",
                "radius": 500,
                "analysis_name": "Test Restaurant Analysis"
            }
            
            response = self.session.post(f"{self.base_url}/ml/analyze-location",
                                       json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                required_fields = ['analysis_id', 'overall_score', 'confidence', 
                                 'component_scores', 'insights']
                
                if all(field in result for field in required_fields):
                    score = result['overall_score']
                    confidence = result['confidence']
                    self.log_test("ML Location Analysis", True, 
                                f"Score: {score:.1f}/10, Confidence: {confidence:.0%}")
                    return True
                else:
                    missing = [f for f in required_fields if f not in result]
                    self.log_test("ML Location Analysis", False, 
                                f"Missing fields: {missing}")
                    return False
            else:
                self.log_test("ML Location Analysis", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("ML Location Analysis", False, f"Request error: {str(e)}")
            return False
    
    def test_get_location_features(self) -> bool:
        """Lokasyon özellikleri alma testi"""
        try:
            lat, lng = 36.8851, 30.7056
            params = {
                'business_type': 'restaurant',
                'radius': 500
            }
            
            response = self.session.get(f"{self.base_url}/ml/features/{lat}/{lng}",
                                      params=params, timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['location', 'feature_count', 'features']
                
                if all(field in data for field in required_fields):
                    feature_count = data['feature_count']
                    self.log_test("Location Features", True, 
                                f"Generated {feature_count} features")
                    return True
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Location Features", False, 
                                f"Missing fields: {missing}")
                    return False
            else:
                self.log_test("Location Features", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Location Features", False, f"Request error: {str(e)}")
            return False
    
    def test_scraping_stats(self) -> bool:
        """Scraping istatistikleri testi"""
        try:
            response = self.session.get(f"{self.base_url}/scraping/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['total_businesses_scraped', 'active_scraping_jobs', 
                                 'completed_scraping_jobs', 'business_type_distribution']
                
                if all(field in data for field in required_fields):
                    total_businesses = data['total_businesses_scraped']
                    active_jobs = data['active_scraping_jobs']
                    self.log_test("Scraping Stats", True, 
                                f"Total businesses: {total_businesses}, Active jobs: {active_jobs}")
                    return True
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Scraping Stats", False, 
                                f"Missing fields: {missing}")
                    return False
            else:
                self.log_test("Scraping Stats", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Scraping Stats", False, f"Request error: {str(e)}")
            return False
    
    def test_regions_list(self) -> bool:
        """Bölge listeleme testi"""
        try:
            response = self.session.get(f"{self.base_url}/regions/list", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Regions List", True, 
                                f"Found {len(data)} regions")
                    return True
                else:
                    self.log_test("Regions List", False, 
                                f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_test("Regions List", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Regions List", False, f"Request error: {str(e)}")
            return False
    
    def test_ml_models_list(self) -> bool:
        """ML modelleri listeleme testi"""
        try:
            response = self.session.get(f"{self.base_url}/ml/models", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("ML Models List", True, 
                                f"Found {len(data)} trained models")
                    return True
                else:
                    self.log_test("ML Models List", False, 
                                f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_test("ML Models List", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("ML Models List", False, f"Request error: {str(e)}")
            return False
    
    def test_scraping_jobs_list(self) -> bool:
        """Scraping işleri listeleme testi"""
        try:
            params = {'limit': 5}
            response = self.session.get(f"{self.base_url}/scraping/jobs", 
                                      params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Scraping Jobs List", True, 
                                f"Found {len(data)} scraping jobs")
                    return True
                else:
                    self.log_test("Scraping Jobs List", False, 
                                f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_test("Scraping Jobs List", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Scraping Jobs List", False, f"Request error: {str(e)}")
            return False
    
    def test_root_endpoint(self) -> bool:
        """Ana endpoint testi"""
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'LOKASCORE' in data['message']:
                    self.log_test("Root Endpoint", True, "Welcome message OK")
                    return True
                else:
                    self.log_test("Root Endpoint", False, "Unexpected response format")
                    return False
            else:
                self.log_test("Root Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Root Endpoint", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self) -> Tuple[int, int]:
        """Tüm testleri çalıştır"""
        print("🧪 LOKASCORE API Endpoint Testleri Başlıyor...")
        print("=" * 60)
        print()
        
        # Test fonksiyonları listesi
        tests = [
            ("API Erişimi", self.test_health_check),
            ("Ana Sayfa", self.test_root_endpoint),
            ("Temel Analiz", self.test_basic_analyze),
            ("ML Lokasyon Analizi", self.test_ml_analyze_location),
            ("Lokasyon Özellikleri", self.test_get_location_features),
            ("Scraping İstatistikleri", self.test_scraping_stats),
            ("Bölge Listesi", self.test_regions_list),
            ("ML Modeller", self.test_ml_models_list),
            ("Scraping İşleri", self.test_scraping_jobs_list)
        ]
        
        print("🔧 Test Kategorileri:")
        for i, (name, _) in enumerate(tests, 1):
            print(f"   {i}. {name}")
        print()
        
        # Testleri çalıştır
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            print(f"🧪 {test_name} testi çalıştırılıyor...")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                self.log_test(test_name, False, f"Unexpected error: {str(e)}")
                failed += 1
            print()
        
        return passed, failed
    
    def generate_report(self, passed: int, failed: int):
        """Test raporu oluştur"""
        total = passed + failed
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print("📊 TEST RAPORU")
        print("=" * 60)
        print(f"📈 Toplam Test: {total}")
        print(f"✅ Başarılı: {passed}")
        print(f"❌ Başarısız: {failed}")
        print(f"🎯 Başarı Oranı: {success_rate:.1f}%")
        print()
        
        if failed > 0:
            print("❌ Başarısız Testler:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test_name']}: {result['details']}")
            print()
        
        if success_rate >= 80:
            print("🎉 API genel olarak çalışıyor durumda!")
        elif success_rate >= 60:
            print("⚠️ API kısmen çalışıyor, bazı sorunlar var.")
        else:
            print("🚨 API'de ciddi sorunlar tespit edildi.")
        
        print("\n📝 Detaylı dokümantasyon için: docs/LOKASCORE_DOKUMANTASYON.md")
        print("🛠️ Kullanım örnekleri için: examples/api_usage_examples.py")


def main():
    """Ana test fonksiyonu"""
    print("🎯 LOKASCORE API Test Suite")
    print("=" * 60)
    print(f"📡 Test URL: {API_BASE_URL}")
    print(f"⏰ Timeout: {TEST_TIMEOUT} saniye")
    print()
    
    # API erişilebilirliği kontrolü
    print("🔍 API erişilebilirlik kontrolü...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ API erişilebilir durumdaa")
        else:
            print(f"⚠️ API yanıt veriyor ama status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ API erişilemiyor!")
        print("   Lütfen API'nin localhost:8000'de çalıştığından emin olun.")
        print("   Başlatmak için: cd apps/api && uvicorn main:app --reload")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"❌ Bağlantı hatası: {e}")
        sys.exit(1)
    
    print()
    
    # Tüm testleri çalıştır
    tester = APITester(API_BASE_URL)
    passed, failed = tester.run_all_tests()
    
    # Rapor oluştur
    tester.generate_report(passed, failed)
    
    # Exit code
    if failed == 0:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()