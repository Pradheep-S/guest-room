export default function Footer() {
  return (
    <footer className="bg-[#31473A] text-white py-8 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-semibold mb-4">GuestRoom</h3>
          <p className="text-[#EDF4F2]">Book your perfect stay or list your property with ease.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-[#EDF4F2] transition-colors duration-300">About</a></li>
            <li><a href="/contact" className="hover:text-[#EDF4F2] transition-colors duration-300">Contact</a></li>
            <li><a href="/terms" className="hover:text-[#EDF4F2] transition-colors duration-300">Terms</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Connect</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-[#EDF4F2]"><i className="fab fa-facebook-f"></i> Facebook</a>
            <a href="#" className="hover:text-[#EDF4F2]"><i className="fab fa-twitter"></i> Twitter</a>
            <a href="#" className="hover:text-[#EDF4F2]"><i className="fab fa-instagram"></i> Instagram</a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-[#EDF4F2]">
        <p>© 2025 GuestRoom. All rights reserved.</p>
      </div>
    </footer>
  );
}