'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FaUsers, 
  FaHome, 
  FaBed, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaStar, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
  FaEye,
  FaUserCog
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalHouseOwners: 0,
    totalProperties: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Fetch admin statistics
      const statsResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch pending properties
      const propertiesResponse = await fetch('http://localhost:5000/api/admin/properties?verified=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        // Set sample data for demo
        setSampleData();
      }

      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        setPendingProperties(propertiesData.properties || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    setStats({
      totalUsers: 1250,
      totalCustomers: 980,
      totalHouseOwners: 270,
      totalProperties: 156,
      totalRooms: 428,
      totalBookings: 1834,
      totalRevenue: 2450000,
      pendingVerifications: 12
    });

    setRecentActivity([
      {
        id: '1',
        type: 'new_user',
        description: 'New customer registered: John Smith',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '2',
        type: 'new_property',
        description: 'New property submitted by Sarah Johnson',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        id: '3',
        type: 'booking',
        description: 'New booking confirmed: ₹1,500',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ]);

    setPendingProperties([
      {
        _id: '1',
        name: 'Ocean View Villa',
        owner: { name: 'Mike Johnson', email: 'mike@example.com' },
        address: { city: 'Goa', state: 'Goa' },
        roomsCount: 4,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        _id: '2',
        name: 'Mountain Retreat',
        owner: { name: 'Emma Wilson', email: 'emma@example.com' },
        address: { city: 'Manali', state: 'Himachal Pradesh' },
        roomsCount: 2,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
      }
    ]);
  };

  const handleVerifyProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setPendingProperties(prev => prev.filter(p => p._id !== propertyId));
        setStats(prev => ({ ...prev, pendingVerifications: prev.pendingVerifications - 1 }));
        alert('Property verified successfully');
      } else {
        alert('Failed to verify property');
      }
    } catch (error) {
      console.error('Error verifying property:', error);
      alert('Error verifying property');
    }
  };

  const StatCard = ({ icon, title, value, color, trend, trendColor }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trendColor} flex items-center mt-1`}>
              <FaChartLine className="mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_user':
        return <FaUsers className="text-blue-500" />;
      case 'new_property':
        return <FaHome className="text-green-500" />;
      case 'booking':
        return <FaCalendarAlt className="text-purple-500" />;
      default:
        return <FaCheckCircle className="text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2A4D69] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Monitor and manage the GuestRoom platform</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4D69]"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<FaUsers className="text-white text-xl" />}
                  title="Total Users"
                  value={stats.totalUsers.toLocaleString()}
                  color="bg-blue-500"
                  trend="+12% this month"
                  trendColor="text-green-600"
                />
                <StatCard
                  icon={<FaHome className="text-white text-xl" />}
                  title="Properties"
                  value={stats.totalProperties}
                  color="bg-green-500"
                  trend="+8% this month"
                  trendColor="text-green-600"
                />
                <StatCard
                  icon={<FaCalendarAlt className="text-white text-xl" />}
                  title="Bookings"
                  value={stats.totalBookings.toLocaleString()}
                  color="bg-purple-500"
                  trend="+15% this month"
                  trendColor="text-green-600"
                />
                <StatCard
                  icon={<FaRupeeSign className="text-white text-xl" />}
                  title="Revenue"
                  value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
                  color="bg-yellow-500"
                  trend="+22% this month"
                  trendColor="text-green-600"
                />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<FaUsers className="text-white text-lg" />}
                  title="Customers"
                  value={stats.totalCustomers}
                  color="bg-indigo-500"
                />
                <StatCard
                  icon={<FaUserCog className="text-white text-lg" />}
                  title="House Owners"
                  value={stats.totalHouseOwners}
                  color="bg-teal-500"
                />
                <StatCard
                  icon={<FaBed className="text-white text-lg" />}
                  title="Rooms"
                  value={stats.totalRooms}
                  color="bg-pink-500"
                />
                <StatCard
                  icon={<FaExclamationTriangle className="text-white text-lg" />}
                  title="Pending Reviews"
                  value={stats.pendingVerifications}
                  color="bg-red-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Property Verifications */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#2A4D69]">Pending Verifications</h2>
                    <Link
                      href="/admin/properties"
                      className="text-[#2A4D69] hover:text-[#1A3C52] font-medium text-sm"
                    >
                      View All
                    </Link>
                  </div>

                  {pendingProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <FaCheckCircle className="text-4xl text-green-300 mx-auto mb-4" />
                      <p className="text-gray-500">All properties verified!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingProperties.map((property) => (
                        <div key={property._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{property.name}</h3>
                              <p className="text-sm text-gray-600">
                                by {property.owner.name} • {property.address.city}, {property.address.state}
                              </p>
                              <p className="text-xs text-gray-500">
                                {property.roomsCount} room{property.roomsCount !== 1 ? 's' : ''} • 
                                Submitted {formatTimeAgo(new Date(property.createdAt))}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FaClock className="text-yellow-500" />
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={() => handleVerifyProperty(property._id)}
                              className="flex items-center bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-300"
                            >
                              <FaCheckCircle className="mr-1" />
                              Verify
                            </button>
                            <Link
                              href={`/admin/properties/${property._id}`}
                              className="flex items-center bg-[#2A4D69] text-white px-3 py-1 rounded text-sm hover:bg-[#1A3C52] transition-colors duration-300"
                            >
                              <FaEye className="mr-1" />
                              Review
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#2A4D69]">Recent Activity</h2>
                  </div>

                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#2A4D69] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link
                    href="/admin/users"
                    className="flex items-center justify-center bg-[#2A4D69] text-white p-4 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
                  >
                    <FaUsers className="mr-2" />
                    Manage Users
                  </Link>
                  <Link
                    href="/admin/properties"
                    className="flex items-center justify-center bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    <FaHome className="mr-2" />
                    Manage Properties
                  </Link>
                  <Link
                    href="/admin/bookings"
                    className="flex items-center justify-center bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    <FaCalendarAlt className="mr-2" />
                    View Bookings
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="flex items-center justify-center bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                  >
                    <FaChartLine className="mr-2" />
                    Analytics
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
