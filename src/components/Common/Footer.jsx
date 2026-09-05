import { RiMetaLine } from "react-icons/ri"; // Meta icon
import { IoLogoInstagram } from "react-icons/io5"; // Instagram icon
import { FaXTwitter } from "react-icons/fa6"; // X icon
import { FiPhone } from "react-icons/fi"; // Phone icon

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Newsletter Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold text-gray-900">Newsletter</h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="text-sm font-semibold text-gray-800">
            Sign up and get 10% off your first order.
          </p>

          {/* Email Form input & button */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center mt-2 max-w-[320px]"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-400 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-r-lg border border-black hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Shop</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-black transition">
                Men's Top Wear
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Women's Top Wear
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Men's Bottom Wear
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Women's Bottom Wear
              </a>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Support
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-black transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Features
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Column */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-900">Follow Us</h3>
            {/* Social Icons matching image */}
            <div className="flex items-center gap-4 text-gray-700">
              <a href="#" className="hover:text-black transition">
                <RiMetaLine size={20} />
              </a>
              <a href="#" className="hover:text-black transition">
                <IoLogoInstagram size={20} />
              </a>
              <a href="#" className="hover:text-black transition">
                <FaXTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Call Us Block */}
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              Call Us
            </span>
            <div className="flex items-center gap-2 text-gray-900">
              <FiPhone size={18} className="text-gray-800" />
              <span className="text-base font-bold tracking-tight">
                0123-456-789
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* footer bottom  */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          &copy; {new Date().getFullYear()} Rabbit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
