import { useState } from "react";

// Mock data based on the image layout
const productData = {
  title: "Slim-Fit Easy-Iron Shirt",
  price: 34.99,
  description:
    "A slim-fit, easy-iron shirt in woven cotton fabric with a fitted silhouette. Features a turn-down collar, classic button placket, and a yoke at the back. Long sleeves and adjustable button cuffs with a rounded hem.",
  colors: [
    { id: "grey", name: "Grey", className: "bg-gray-500" },
    { id: "dark-grey", name: "Dark Grey", className: "bg-neutral-700" },
  ],
  sizes: ["S", "M", "L", "XL"],
  characteristics: [
    { label: "Brand", value: "Urban Chic" },
    { label: "Material", value: "Cotton" },
  ],
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
      alt: "Man wearing a black button-up over a white long-sleeve shirt",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
      alt: "Man wearing a casual white t-shirt",
    },
  ],
};

export default function ProductDetails2() {
  const [selectedImage, setSelectedImage] = useState(productData.images[0].url);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0].id);
  const [selectedSize, setSelectedSize] = useState("XL"); // Defaulted to match cursor position in image
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else if (type === "increase") {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-10 px-4 md:px-8">
      {/* Top Banner Category Header */}
      <div className="text-center mb-12">
        <h1 className="text-xl font-bold tracking-tight">Best Seller</h1>
      </div>

      {/* Main Grid Wrapper */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand Thumbnail Strips (Columns 1-2 on desktop) */}
        <div className="md:col-span-2 flex md:flex-col gap-3 order-2 md:order-1 justify-center md:justify-start">
          {productData.images.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.url)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === img.url ? "border-neutral-900" : "border-gray-200"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Featured Main Image Preview Showcase (Columns 3-7 on desktop) */}
        <div className="md:col-span-5 order-1 md:order-2">
          <div className="aspect-[4/5] w-full bg-neutral-100 rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt="Selected feature view"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Configurations Panel Details (Columns 8-12 on desktop) */}
        <div className="md:col-span-5 order-3 space-y-6">
          {/* Header Description Stack */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              {productData.title}
            </h2>
            <p className="text-lg text-neutral-600 font-medium mt-1">
              $ {productData.price.toFixed(2)}
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed mt-4">
              {productData.description}
            </p>
          </div>

          {/* Configuration Selection Controls */}
          <div className="space-y-4">
            {/* Color Swatch Options */}
            <div>
              <span className="block text-sm font-semibold text-neutral-700 mb-2">Color:</span>
              <div className="flex gap-2">
                {productData.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-6 h-6 rounded-full transition-ring ${color.className} ${
                      selectedColor === color.id
                        ? "ring-2 ring-offset-2 ring-neutral-950"
                        : "hover:scale-105"
                    }`}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Boxes Grid */}
            <div>
              <span className="block text-sm font-semibold text-neutral-700 mb-2">Size:</span>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-10 h-10 px-3 text-sm font-medium border rounded transition-all ${
                      selectedSize === size
                        ? "border-neutral-900 bg-neutral-50 font-bold"
                        : "border-gray-200 hover:border-gray-400 text-neutral-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper Controller */}
            <div>
              <span className="block text-sm font-semibold text-neutral-700 mb-2">Quantity:</span>
              <div className="inline-flex items-center border border-gray-200 rounded bg-gray-50 overflow-hidden">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="w-8 h-8 flex items-center justify-center text-lg font-medium text-neutral-500 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-semibold text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="w-8 h-8 flex items-center justify-center text-lg font-medium text-neutral-500 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Primary Call to Action Action Button */}
          <button className="w-full bg-neutral-950 text-white font-semibold text-sm py-3 px-6 rounded hover:bg-neutral-800 transition active:scale-[0.99]">
            ADD TO CART
          </button>

          {/* Characteristics Details Sheet Meta List */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h3 className="text-sm font-bold text-neutral-800">Characteristics:</h3>
            <div className="space-y-2">
              {productData.characteristics.map((item) => (
                <div key={item.label} className="grid grid-cols-3 text-sm">
                  <span className="text-neutral-500">{item.label}</span>
                  <span className="col-span-2 text-neutral-800 font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}