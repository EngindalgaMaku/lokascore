export default function RegionManager() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bölge Yönetimi</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Aktif Bölgeler</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">İstanbul - Kadıköy</h4>
              <p className="text-sm text-gray-600">324 işletme kayıtlı</p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Aktif
            </span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">İstanbul - Beşiktaş</h4>
              <p className="text-sm text-gray-600">198 işletme kayıtlı</p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Aktif
            </span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">Ankara - Çankaya</h4>
              <p className="text-sm text-gray-600">156 işletme kayıtlı</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Güncelleniyor
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Yeni Bölge Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
