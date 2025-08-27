export default function SystemStatus() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sistem Durumu</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sunucu Bilgileri</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>CPU Kullanımı:</span>
              <span className="text-green-600">45%</span>
            </div>
            <div className="flex justify-between">
              <span>RAM Kullanımı:</span>
              <span className="text-yellow-600">68%</span>
            </div>
            <div className="flex justify-between">
              <span>Disk Kullanımı:</span>
              <span className="text-green-600">32%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Servisler</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>API Server:</span>
              <span className="text-green-600">✅ Aktif</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-red-600">❌ Bağlantı Hatası</span>
            </div>
            <div className="flex justify-between">
              <span>ML Service:</span>
              <span className="text-green-600">✅ Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
