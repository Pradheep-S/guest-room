'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaBed, FaWifi, FaTv, FaStar, FaFilter, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    // Get URL parameters and set filters
    const location = searchParams.get('location') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const guests = searchParams.get('guests') || '1';

    setFilters(prev => ({
      ...prev,
      location,
      checkIn,
      checkOut,
      guests: parseInt(guests)
    }));

    fetchRooms();
  }, [searchParams]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.location) params.append('city', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.beds) params.append('beds', filters.beds);

      const response = await fetch(`http://localhost:5000/api/rooms?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setRooms(data.rooms || []);
      } else {
        console.error('Failed to fetch rooms:', data.message);
        // Set sample rooms for demo
        setSampleRooms();
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // Set sample rooms for demo
      setSampleRooms();
    } finally {
      setLoading(false);
    }
  };

  const setSampleRooms = () => {
    setRooms([
      {
        _id: '1',
        name: "Cozy Retreat",
        property: {
          name: "Sunset Villa",
          address: { city: "Coimbatore", state: "Tamil Nadu" }
        },
        owner: { name: "John Doe" },
        pricePerDay: 30,
        numberOfBeds: 1,
        floorSize: 200,
        amenities: ["Wi-Fi", "AC", "TV"],
        averageRating: 4.5,
        totalReviews: 23,
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]
      },
      {
        _id: '2',
        name: "Deluxe Suite",
        property: {
          name: "Royal Heights",
          address: { city: "Chennai", state: "Tamil Nadu" }
        },
        owner: { name: "Andrew Wilson" },
        pricePerDay: 50,
        numberOfBeds: 2,
        floorSize: 350,
        amenities: ["Wi-Fi", "TV", "Breakfast", "AC"],
        averageRating: 4.8,
        totalReviews: 45,
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]
      },
      {
        _id: '3',
        name: "Family Room",
        property: {
          name: "Green Gardens",
          address: { city: "Bangalore", state: "Karnataka" }
        },
        owner: { name: "Sarah Johnson" },
        pricePerDay: 80,
        numberOfBeds: 3,
        floorSize: 500,
        amenities: ["Wi-Fi", "Balcony", "Kitchen", "AC"],
        averageRating: 4.2,
        totalReviews: 32,
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"]
      }
    ]);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    fetchRooms();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      checkIn: '',
      checkOut: '',
      guests: 1
    });
    fetchRooms();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2A4D69] mb-2">Available Rooms</h1>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-[#2A4D69] text-white px-4 py-2 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="City, area..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A4D69]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A4D69]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="1000"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A4D69]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beds
                </label>
                <select
                  value={filters.beds}
                  onChange={(e) => handleFilterChange('beds', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A4D69]"
                >
                  <option value="">Any</option>
                  <option value="1">1 Bed</option>
                  <option value="2">2 Beds</option>
                  <option value="3">3+ Beds</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-[#2A4D69] text-white py-2 px-4 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4D69]"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No rooms found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{room.averageRating || 0}</span>
                      <span className="text-xs text-gray-500 ml-1">({room.totalReviews || 0})</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-[#2A4D69]">{room.name}</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#2A4D69]">₹{room.pricePerDay}</span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-1">by {room.owner?.name}</p>
                  <div className="flex items-center text-gray-500 mb-4">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="text-sm">{room.property?.address?.city}, {room.property?.address?.state}</span>
                  </div>
                  
                  <div className="flex items-center mb-4 space-x-4">
                    <div className="flex items-center">
                      <FaBed className="text-gray-400 mr-1" />
                      <span className="text-sm">{room.numberOfBeds} bed{room.numberOfBeds > 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-sm text-gray-500">{room.floorSize} sqft</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#F0F8FF] text-[#2A4D69] px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities?.length > 3 && (
                      <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => window.location.href = `/rooms/${room._id}`}
                    className="w-full bg-[#2A4D69] text-white py-2 px-4 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
