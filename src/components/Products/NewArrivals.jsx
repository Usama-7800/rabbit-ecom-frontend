import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function NewArrivals() {
  const scrollRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products/new-arrivals`,
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);
  // Standardized naming to standard camelCase camelCase (setIsDragging instead of SetIsDragging)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0); // Renamed to keep intent clear
  const [canScrollLeft, setCanScrollLeft] = useState(false); // Initialized to false since we start at left 0
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButton = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth + 1;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButton);
      updateScrollButton();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButton);
      }
    };
  }, [newArrivals]); // Added newArrivals as a dependency to ensure the effect runs when new arrivals are fetched

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    // Fixed: Capture the container's current scroll position into state
    setStartScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Good job adding this! Prevents highlight/text selection interference.

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;

    // Fixed: Correctly update container layout scroll via the number state
    scrollRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-16 px-4 lg:px-0 ">
      {/* Fixed: Typo in "container" class name */}
      <div className="container mx-auto text-center mb-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Explore New Arrivals
          </h2>
          <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">
            Discover the latest styles straight off the runway, freshly added to
            keep your wardrobe on the cutting edge of fashion.
          </p>
        </div>

        {/* Slider Controls Row */}
        <div className="absolute right-4 -bottom-7.5 flex space-x-2 z-10">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded border border-gray-200 transition ${canScrollLeft ? "bg-white text-black hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-1.5 rounded border border-gray-200 transition ${canScrollRight ? "bg-white text-black hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable content*/}
      <div className="w-full overflow-hidden">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`container mx-auto overflow-x-scroll scrollbar-none flex space-x-6 pb-4 relative select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {newArrivals.map((product) => (
            <div
              key={product._id}
              className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] relative group"
            >
              {/* Background Product Image */}
              <img
                src={product.images[0]?.urls}
                alt={product.images[0]?.altText || product.name}
                draggable="false"
                className="w-full h-125 object-cover rounded transition-transform duration-500"
              />

              {/* Soft dark radial gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 opacity-90 backdrop-blur-md text-white p-4 rounded-b-lg">
                <Link to={`/product/${product._id}`} className="block">
                  <h3 className="text-base font-semibold tracking-wide drop-shadow-sm">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium opacity-90 mt-0.5">
                    ${product.price}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
