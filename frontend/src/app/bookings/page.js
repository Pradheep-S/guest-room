'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaStar, FaEye, FaTimes } from 'react-icons/fa';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        // Set sample bookings for demo
        setSampleBookings();
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setSampleBookings();
    } finally {
      setLoading(false);
    }
  };

  const setSampleBookings = () => {
    setBookings([
      {
        _id: '1',
        confirmationCode: 'GR12345678',
        room: {
          name: 'Cozy Retreat',
          images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80']
        },
        property: {
          name: 'Sunset Villa',
          address: { city: 'Coimbatore', state: 'Tamil Nadu' }
        },
        owner: { name: 'John Doe', mobile: '9876543210' },
        checkInDate: new Date('2024-02-15'),
        checkOutDate: new Date('2024-02-18'),
        numberOfGuests: 2,
        totalAmount: 90,
        bookingStatus: 'confirmed',
        createdAt: new Date('2024-01-15')
      },
      {
        _id: '2',
        confirmationCode: 'GR87654321',
        room: {
          name: 'Deluxe Suite',
          images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80']
        },
        property: {
          name: 'Royal Heights',
          address: { city: 'Chennai', state: 'Tamil Nadu' }
        },
        owner: { name: 'Andrew Wilson', mobile: '9876543211' },
        checkInDate: new Date('2024-01-10'),
        checkOutDate: new Date('2024-01-12'),
        numberOfGuests: 1,
        totalAmount: 100,
        bookingStatus: 'completed',
        createdAt: new Date('2024-01-01')
      }
    ]);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, bookingStatus: 'cancelled' }
            : booking
        ));
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking');
    }
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    
    switch (filter) {
      case 'upcoming':
        return checkIn > now && booking.bookingStatus !== 'cancelled';
      case 'past':
        return checkOut < now || booking.bookingStatus === 'completed';
      case 'cancelled':
        return booking.bookingStatus === 'cancelled';
      default:
        return true;
    }
  });

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2A4D69] mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and view your room bookings</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'All Bookings' },
                  { key: 'upcoming', label: 'Upcoming' },
                  { key: 'past', label: 'Past' },
                  { key: 'cancelled', label: 'Cancelled' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                      filter === tab.key
                        ? 'border-[#2A4D69] text-[#2A4D69]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4D69]"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-300 mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't made any bookings yet"
                  : `No ${filter} bookings found`
                }
              </p>
              <button
                onClick={() => window.location.href = '/rooms'}
                className="bg-[#2A4D69] text-white px-6 py-3 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="md:flex">
                    {/* Room Image */}
                    <div className="md:w-1/3">
                      <img
                        src={booking.room.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                        alt={booking.room.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    
                    {/* Booking Details */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#2A4D69] mb-1">
                            {booking.room.name}
                          </h3>
                          <p className="text-gray-600">{booking.property.name}</p>
                          <div className="flex items-center text-gray-500 mt-1">
                            <FaMapMarkerAlt className="mr-1" />
                            <span className="text-sm">
                              {booking.property.address.city}, {booking.property.address.state}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            Code: {booking.confirmationCode}
                          </p>
                        </div>
                      </div>
                      
                      {/* Booking Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-gray-600 mb-1">
                            <FaCalendarAlt className="mr-2" />
                            <span className="text-sm font-medium">Check-in</span>
                          </div>
                          <p className="text-gray-900">
                            {new Date(booking.checkInDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-600 mb-1">
                            <FaCalendarAlt className="mr-2" />
                            <span className="text-sm font-medium">Check-out</span>
                          </div>
                          <p className="text-gray-900">
                            {new Date(booking.checkOutDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-600 mb-1">
                            <FaUser className="mr-2" />
                            <span className="text-sm font-medium">Guests</span>
                          </div>
                          <p className="text-gray-900">{booking.numberOfGuests}</p>
                        </div>
                      </div>
                      
                      {/* Host Info */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Host Information</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 mr-2" />
                            <span className="text-gray-700">{booking.owner.name}</span>
                          </div>
                          <a 
                            href={`tel:${booking.owner.mobile}`}
                            className="text-[#2A4D69] hover:text-[#1A3C52] text-sm font-medium"
                          >
                            {booking.owner.mobile}
                          </a>
                        </div>
                      </div>
                      
                      {/* Total Amount */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                        <span className="text-xl font-bold text-[#2A4D69]">₹{booking.totalAmount}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => window.location.href = `/bookings/${booking._id}`}
                          className="flex items-center bg-[#2A4D69] text-white px-4 py-2 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
                        >
                          <FaEye className="mr-2" />
                          View Details
                        </button>
                        
                        {booking.bookingStatus === 'confirmed' && new Date(booking.checkInDate) > new Date() && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                          >
                            <FaTimes className="mr-2" />
                            Cancel Booking
                          </button>
                        )}
                        
                        {booking.bookingStatus === 'completed' && (
                          <button
                            onClick={() => window.location.href = `/rooms/${booking.room._id}/review`}
                            className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-300"
                          >
                            <FaStar className="mr-2" />
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
