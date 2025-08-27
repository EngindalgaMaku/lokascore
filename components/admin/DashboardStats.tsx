export default function DashboardStats() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Dashboard Genel Bakış
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Toplam Kullanıcı
          </h3>
          <p className="text-2xl font-bold text-blue-600">1,247</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Aktif Raporlar</h3>
          <p className="text-2xl font-bold text-green-600">342</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">ML İşleri</h3>
          <p className="text-2xl font-bold text-purple-600">5</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Sistem Durumu</h3>
          <p className="text-2xl font-bold text-green-600">✅ Sağlıklı</p>
        </div>
      </div>
    </div>
  );
}
