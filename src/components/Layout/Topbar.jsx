import { RiInfinityLine } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

export default function Topbar() {
  return (
    <div className="w-full bg-rabbit-red text-white py-2 px-4 md:px-8 text-xs font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        
        {/* Left Side: Social Icons */}
        <div className="hidden md:flex items-center gap-4  ">
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Meta">
            <RiInfinityLine   size={16} strokeWidth={2.5}/>
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
            <BsInstagram size={15}/>
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="X (formerly Twitter)">
            <FaXTwitter  size={14} fill="currentColor" strokeWidth={0}/>
          </a>
        </div>

        {/* Center: Shipping Text */}
        <div className="text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <span>We ship worldwide — Fast and reliable shipping!</span>
        </div>

        {/* Right Side: Phone Number */}
        <div className="hidden md:flex items-center ">
          <a href="tel:+1234567890" className="hover:underline">
            +1 (234) 567-890
          </a>
        </div>

      </div>
    </div>
  )
}
