export default function MLModelManager() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ML Model Yönetimi</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Aktif Modeller</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">Lokasyon Skoru Modeli</h4>
              <p className="text-sm text-gray-600">Versiyon: 2.1.0</p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Aktif
            </span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <div>
              <h4 className="font-medium">Trafik Analiz Modeli</h4>
              <p className="text-sm text-gray-600">Versiyon: 1.5.2</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Güncelleniyor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
