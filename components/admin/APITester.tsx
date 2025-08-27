export default function APITester() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">API Test Arayüzü</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">API Endpoint Testi</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint URL
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="/api/test-endpoint"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTTP Method
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Test Et
          </button>
        </div>
      </div>
    </div>
  );
}
