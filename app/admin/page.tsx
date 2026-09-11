export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="text-gray-600 mt-2">
        Welcome to the Admin Dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">Total Drivers</h3>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">Today's Rides</h3>
          <p className="text-3xl font-bold mt-2">78</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹12,540</p>
        </div>
      </div>
    </div>
  );
}