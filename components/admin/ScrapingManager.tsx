export default function ScrapingManager() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Veri Toplama Yönetimi
      </h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Aktif Scraping İşleri</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">Google Places Scraper</h4>
              <p className="text-sm text-gray-600">
                Son çalıştırılma: 2 saat önce
              </p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Tamamlandı
            </span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">İşletme Bilgileri Scraper</h4>
              <p className="text-sm text-gray-600">
                Son çalıştırılma: 30 dakika önce
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Çalışıyor
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Yeni Scraping İşi Başlat
          </button>
        </div>
      </div>
    </div>
  );
}
