import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsRes = await fetch(`${API_URL}/products?limit=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const productsData = await productsRes.json();
        
        // Fetch orders count
        const ordersRes = await fetch(`${API_URL}/admin/orders?limit=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();
        
        // Fetch pending orders
        const pendingRes = await fetch(`${API_URL}/admin/orders?status=pending&limit=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const pendingData = await pendingRes.json();
        
        // Fetch low stock inventory
        const inventoryRes = await fetch(`${API_URL}/admin/inventory?lowStock=true&limit=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const inventoryData = await inventoryRes.json();

        setStats({
          totalProducts: productsData.data?.pagination?.total || 0,
          totalOrders: ordersData.data?.pagination?.total || 0,
          pendingOrders: pendingData.data?.pagination?.total || 0,
          lowStockItems: inventoryData.data?.pagination?.total || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '🛍️', color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📋', color: 'bg-green-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'bg-yellow-500' },
    { label: 'Low Stock Items', value: stats.lowStockItems, icon: '⚠️', color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

