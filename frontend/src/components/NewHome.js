"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBed, FaWifi, FaTv, FaStar, FaArrowRight, FaMobileAlt, FaSearch, FaCalendarAlt, FaUsers, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('location', searchQuery.trim());
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', guests);
    
    router.push(`/rooms?${params.toString()}`);
  };

  const handleBookRoom = (roomId) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/rooms/${roomId}`)}`);
    } else {
      router.push(`/rooms/${roomId}`);
    }
  };

  const sampleRooms = [
    {
      id: 1,
      name: "Cozy Retreat",
      owner: "John Doe",
      location: "Coimbatore",
      beds: 1,
      size: "200 sqft",
      price: 30,
      amenities: ["Wi-Fi", "AC"],
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      reviews: 23
    },
    {
      id: 2,
      name: "Deluxe Suite",
      owner: "Andrew Wilson",
      location: "Chennai",
      beds: 2,
      size: "350 sqft",
      price: 50,
      amenities: ["Wi-Fi", "TV", "Breakfast"],
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      reviews: 45
    },
    {
      id: 3,
      name: "Family Room",
      owner: "Sarah Johnson",
      location: "Bangalore",
      beds: 3,
      size: "500 sqft",
      price: 80,
      amenities: ["Wi-Fi", "Balcony", "Kitchen"],
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      reviews: 32
    },
  ];

  const testimonials = [
    {
      quote: "Amazing stay! The room was cozy and the host was super friendly.",
      author: "Sarah M., Guest",
    },
    {
      quote: "Listing my room was so easy, and I started getting bookings right away!",
      author: "John K., Host",
    },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-3xl text-[#2A4D69]" />,
      title: "Verified Hosts",
      description: "All our hosts go through a verification process to ensure your safety and security."
    },
    {
      icon: <FaHeadset className="text-3xl text-[#2A4D69]" />,
      title: "24/7 Support",
      description: "Get help anytime with our round-the-clock customer support team."
    },
    {
      icon: <FaStar className="text-3xl text-[#2A4D69]" />,
      title: "Quality Assured",
      description: "Every property is inspected and rated to maintain our high standards."
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1A1A1A]">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-[#2A4D69] to-[#1A3C52] text-white rounded-2xl overflow-hidden mb-12"
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 text-center py-16 px-4 md:py-24">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Find Your Perfect
              <span className="text-[#F9E4B7]"> Guest Room</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              {isAuthenticated 
                ? `Welcome back, ${user?.name}! Discover comfortable stays or list your space with verified hosts worldwide.`
                : "Discover comfortable stays with verified hosts worldwide. Sign up to unlock exclusive features and personalized recommendations."
              }
            </motion.p>

            {/* Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              onSubmit={handleSearch}
              className="bg-white rounded-lg p-6 shadow-xl max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="City, area..."
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A4D69] focus:border-transparent appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-[#2A4D69] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1A3C52] transition-colors duration-300 flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Search Rooms
              </button>
            </motion.form>

            {/* Quick Actions for Non-Authenticated Users */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/auth/register?role=customer"
                  className="bg-[#F9E4B7] text-[#1A1A1A] px-6 py-3 rounded-lg font-semibold hover:bg-white transition-colors duration-300"
                >
                  Join as Guest
                </Link>
                <Link
                  href="/auth/register?role=houseOwner"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2A4D69] transition-colors duration-300"
                >
                  List Your Property
                </Link>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Featured Rooms */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A4D69] mb-4">
              Featured Rooms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the finest guest rooms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{room.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({room.reviews})</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-[#2A4D69]">{room.name}</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#2A4D69]">₹{room.price}</span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2">by {room.owner}</p>
                  <p className="text-gray-500 mb-4">{room.location}</p>
                  
                  <div className="flex items-center mb-4 space-x-4">
                    <div className="flex items-center">
                      <FaBed className="text-gray-400 mr-1" />
                      <span className="text-sm">{room.beds} bed{room.beds > 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-sm text-gray-500">{room.size}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#F0F8FF] text-[#2A4D69] px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleBookRoom(room.id)}
                    className="w-full bg-[#2A4D69] text-white py-2 px-4 rounded-lg hover:bg-[#1A3C52] transition-colors duration-300 flex items-center justify-center"
                  >
                    {isAuthenticated ? 'View Details' : 'Login to Book'}
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/rooms"
              className="inline-flex items-center bg-[#F9E4B7] text-[#1A1A1A] px-6 py-3 rounded-lg font-semibold hover:bg-[#D1495B] hover:text-white transition-colors duration-300"
            >
              View All Rooms
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A4D69] mb-4">
              Why Choose GuestRoom?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a safe, reliable, and convenient platform for all your accommodation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#2A4D69] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A4D69] mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="text-4xl text-[#F9E4B7] mb-4">"</div>
                <p className="text-gray-700 mb-4 italic">{testimonial.quote}</p>
                <p className="text-[#2A4D69] font-semibold">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        {!isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#2A4D69] to-[#1A3C52] text-white rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied guests and hosts. Create your account today and start your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?role=customer"
                className="bg-[#F9E4B7] text-[#1A1A1A] px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors duration-300"
              >
                Sign Up as Guest
              </Link>
              <Link
                href="/auth/register?role=houseOwner"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2A4D69] transition-colors duration-300"
              >
                Become a Host
              </Link>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
