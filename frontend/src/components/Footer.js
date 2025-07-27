"use client";

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Implement actual newsletter subscription
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#2A4D69] via-[#1A3C52] to-[#0F2A3D] text-white py-16 mt-auto relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#F9E4B7]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-16 h-16 bg-[#FFD700]/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-[#F9E4B7]/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F9E4B7' fill-opacity='0.08'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] bg-clip-text text-transparent">
                GuestRoom
              </div>
              <div className="w-3 h-3 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] rounded-full animate-pulse"></div>
            </div>
            <p className="text-[#B8D4E3] text-lg leading-relaxed mb-6 max-w-md">
              Discover authentic stays and connect with verified property owners. Your perfect accommodation experience starts here with trusted hosts worldwide.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 text-[#F9E4B7] bg-white/5 backdrop-blur-sm rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                <i className="fas fa-star text-yellow-400"></i>
                <div>
                  <span className="text-sm font-medium">4.8/5 Rating</span>
                  <p className="text-xs text-[#B8D4E3]">5000+ Reviews</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-[#F9E4B7] bg-white/5 backdrop-blur-sm rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                <i className="fas fa-users text-blue-400"></i>
                <div>
                  <span className="text-sm font-medium">10K+ Users</span>
                  <p className="text-xs text-[#B8D4E3]">Growing Community</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <i className="fas fa-shield-alt"></i>
                <span className="text-sm">Verified Safe</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <i className="fas fa-award"></i>
                <span className="text-sm">Award Winning</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-[#F9E4B7] flex items-center">
              <i className="fas fa-compass mr-2"></i>
              Explore
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                  <i className="fas fa-info-circle mr-3 w-4 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="relative">
                    About Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/rooms" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                  <i className="fas fa-bed mr-3 w-4 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="relative">
                    Browse Rooms
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/destinations" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                  <i className="fas fa-map-marked-alt mr-3 w-4 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="relative">
                    Popular Destinations
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/contact" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                  <i className="fas fa-envelope mr-3 w-4 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="relative">
                    Contact Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/help" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                  <i className="fas fa-question-circle mr-3 w-4 group-hover:scale-110 transition-transform duration-300"></i>
                  <span className="relative">
                    Help Center
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Support */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-[#F9E4B7] flex items-center">
              <i className="fas fa-heart mr-2"></i>
              Connect
            </h3>
            
            {/* Social Links */}
            <div className="space-y-4 mb-8">
              <a href="#" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/40 transition-all duration-300">
                  <i className="fab fa-facebook-f text-blue-400 group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <span>Facebook</span>
              </a>
              <a href="#" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                <div className="w-10 h-10 bg-sky-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-sky-600/40 transition-all duration-300">
                  <i className="fab fa-twitter text-sky-400 group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <span>Twitter</span>
              </a>
              <a href="#" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-pink-600/40 transition-all duration-300">
                  <i className="fab fa-instagram text-pink-400 group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <span>Instagram</span>
              </a>
              <a href="#" className="flex items-center text-[#B8D4E3] hover:text-[#F9E4B7] transition-all duration-300 group">
                <div className="w-10 h-10 bg-blue-800/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-800/40 transition-all duration-300">
                  <i className="fab fa-linkedin-in text-blue-300 group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <span>LinkedIn</span>
              </a>
            </div>
            
            {/* Support & Legal */}
            <div className="space-y-3 border-t border-white/10 pt-6">
              <h4 className="text-lg font-medium text-[#F9E4B7] mb-3">Support</h4>
              <a href="/terms" className="block text-sm text-[#B8D4E3] hover:text-[#F9E4B7] transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/privacy" className="block text-sm text-[#B8D4E3] hover:text-[#F9E4B7] transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/refund" className="block text-sm text-[#B8D4E3] hover:text-[#F9E4B7] transition-colors duration-300">
                Refund Policy
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Newsletter Signup */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h4 className="text-2xl font-bold mb-4 text-[#F9E4B7] flex items-center justify-center">
                <i className="fas fa-paper-plane mr-3"></i>
                Stay in the Loop
              </h4>
              <p className="text-[#B8D4E3] mb-6 text-lg">
                Get exclusive deals, travel tips, and updates on new destinations delivered straight to your inbox.
              </p>
              
              {isSubscribed ? (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 flex items-center justify-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>Successfully subscribed! Welcome aboard! 🎉</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-[#F9E4B7] focus:bg-white/20 transition-all duration-300"
                      required
                    />
                    <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"></i>
                  </div>
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-[#F9E4B7] to-[#FFD700] text-gray-800 font-semibold rounded-xl hover:from-[#FFD700] hover:to-[#F9E4B7] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <i className="fas fa-arrow-right mr-2"></i>
                    Subscribe
                  </button>
                </form>
              )}
              
              <p className="text-sm text-[#B8D4E3] mt-4 flex items-center justify-center">
                <i className="fas fa-lock mr-1"></i>
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-[#B8D4E3] text-center lg:text-left">
              <p className="text-lg mb-2">
                © 2025 GuestRoom. All rights reserved.
              </p>
              <p className="text-sm flex items-center justify-center lg:justify-start">
                Made with <i className="fas fa-heart text-red-400 mx-2 animate-pulse"></i> for travelers worldwide
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#B8D4E3]">
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/10 transition-all duration-300">
                <i className="fas fa-shield-alt text-green-400"></i>
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/10 transition-all duration-300">
                <i className="fas fa-lock text-blue-400"></i>
                <span>SSL Protected</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/10 transition-all duration-300">
                <i className="fas fa-clock text-yellow-400"></i>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
          
          {/* Additional info */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-[#B8D4E3]/70">
              🌟 Trusted by thousands of travelers • 🏠 Verified properties • 🔒 Safe & secure bookings
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}