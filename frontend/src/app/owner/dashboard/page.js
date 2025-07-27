'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FaHome, 
  FaBed, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaStar, 
  FaUsers, 
  FaPlus, 
  FaEye,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaTimes
} from 'react-icons/fa';

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    occupancyRate: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Fetch owner statistics
      const statsResponse = await fetch('http://localhost:5000/api/owner/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch recent bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings/owner-bookings?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch properties
      const propertiesResponse = await fetch('http://localhost:5000/api/properties/owner/my-properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        // Set sample data for demo
        setSampleData();
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setRecentBookings(bookingsData.bookings || []);
      }

      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData.properties || []);
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
      totalProperties: 2,
      totalRooms: 5,
      totalBookings: 23,
      totalRevenue: 45000,
      averageRating: 4.6,
      occupancyRate: 75
    });

    setRecentBookings([
      {
        _id: '1',
        confirmationCode: 'GR12345678',
        guest: { name: 'John Smith' },
        room: { name: 'Cozy Retreat' },
        checkInDate: new Date('2024-02-15'),
        checkOutDate: new Date('2024-02-18'),
        bookingStatus: 'confirmed',
        totalAmount: 90
      },
      {
        _id: '2',
        confirmationCode: 'GR87654321',
        guest: { name: 'Sarah Johnson' },
        room: { name: 'Deluxe Suite' },
        checkInDate: new Date('2024-02-10'),
        checkOutDate: new Date('2024-02-12'),
        bookingStatus: 'completed',
        totalAmount: 100
      }
    ]);

    setProperties([
      {
        _id: '1',
        name: 'Sunset Villa',
        address: { city: 'Coimbatore', state: 'Tamil Nadu' },
        roomsCount: 3,
        isVerified: true,
        averageRating: 4.5
      },
      {
        _id: '2',
        name: 'Royal Heights',
        address: { city: 'Chennai', state: 'Tamil Nadu' },
        roomsCount: 2,
        isVerified: false,
        averageRating: 4.7
      }
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ icon, title, value, color, subtext }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['houseOwner']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2A4D69] mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your properties</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4D69]"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                <StatCard
                  icon={<FaHome className="text-white text-xl" />}
                  title="Properties"
                  value={stats.totalProperties}
                  color="bg-blue-500"
                />
                <StatCard
                  icon={<FaBed className="text-white text-xl" />}
                  title="Rooms"
                  value={stats.totalRooms}
                  color="bg-green-500"
                />
                <StatCard
                  icon={<FaCalendarAlt className="text-white text-xl" />}
                  title="Bookings"
                  value={stats.totalBookings}
                  color="bg-purple-500"
                />
                <StatCard
                  icon={<FaRupeeSign className="text-white text-xl" />}
                  title="Revenue"
                  value={`₹${stats.totalRevenue.toLocaleString()}`}
                  color="bg-yellow-500"
                />
                <StatCard
                  icon={<FaStar className="text-white text-xl" />}
                  title="Rating"
                  value={stats.averageRating}
                  color="bg-orange-500"
                  subtext="Average rating"
                />
                <StatCard
                  icon={<FaChartLine className="text-white text-xl" />}
                  title="Occupancy"
                  value={`${stats.occupancyRate}%`}
                  color="bg-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#2A4D69]">Recent Bookings</h2>
                    <Link
                      href="/owner/bookings"
                      className="text-[#2A4D69] hover:text-[#1A3C52] font-medium text-sm"
                    >
                      View All
                    </Link>
                  </div>

                  {recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent bookings</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{booking.guest.name}</h3>
                              <p className="text-sm text-gray-600">{booking.room.name}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                            <span className="font-medium text-[#2A4D69]">₹{booking.totalAmount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Properties Overview */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#2A4D69]">My Properties</h2>
                    <Link
                      href="/owner/properties"
                      className="text-[#2A4D69] hover:text-[#1A3C52] font-medium text-sm"
                    >
                      Manage All
                    </Link>
                  </div>

                  {properties.length === 0 ? (
                    <div className="text-center py-8">
                      <FaHome className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No properties added yet</p>
                      <Link
                        href="/owner/properties/add"
                        className="inline-flex items-center bg-[#2A4D69] text-white px-4 py-2 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
                      >
                        <FaPlus className="mr-2" />
                        Add Property
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div key={property._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{property.name}</h3>
                              <p className="text-sm text-gray-600">
                                {property.address.city}, {property.address.state}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {property.isVerified ? (
                                <FaCheckCircle className="text-green-500" title="Verified" />
                              ) : (
                                <FaClock className="text-yellow-500" title="Pending Verification" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{property.roomsCount} room{property.roomsCount !== 1 ? 's' : ''}</span>
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span>{property.averageRating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#2A4D69] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/owner/properties/add"
                    className="flex items-center justify-center bg-[#2A4D69] text-white p-4 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
                  >
                    <FaPlus className="mr-2" />
                    Add New Property
                  </Link>
                  <Link
                    href="/owner/rooms/add"
                    className="flex items-center justify-center bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    <FaBed className="mr-2" />
                    Add New Room
                  </Link>
                  <Link
                    href="/owner/bookings"
                    className="flex items-center justify-center bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    <FaEye className="mr-2" />
                    View All Bookings
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
