import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

export default function ProductDetails({ productId }) {
  // const [mainImage, setMainImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, similarProducts, loading, error } = useSelector(
    (state) => state.products,
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const mainImage = selectedImage || selectedProduct?.images?.[0]?.urls || "";
  // const [mainImage, setMainImage] = useState(() => {
  //   return selectedProduct?.images[0]?.urls || "";
  // });

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const productFetchId = productId || id;

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please Select Color and size before adding to Cart", {
        duration: 2000,
        closeButton: true,
      });

      return;
    }

    const cartData = {
      productId: productFetchId,
      quantity,
      image: mainImage,
      size: selectedSize,
      color: selectedColor,
      guestId: guestId || null,
      userId: user?._id || null,
    };

    console.log("🛒 ADD TO CART DATA:", cartData);

    setIsButtonDisabled(true);

    dispatch(addToCart(cartData))
      .unwrap()
      .then((response) => {
        console.log("✅ ADD TO CART RESPONSE:", response);

        toast.success(
          `Added ${quantity}x ${selectedProduct.name} (${selectedColor} / ${selectedSize}) to your cart!`,
          {
            duration: 500,
            closeButton: true,
          },
        );
      })
      .catch((error) => {
        console.error("❌ ADD TO CART ERROR:", error);

        toast.error(error?.message || "Failed to add product to cart");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  if (!selectedProduct) {
    return <div>Product not found.</div>;
  }
  return (
    <div className="p-4">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* left thumbnails  */}
            <div className="hidden md:flex flex-col space-y-4 mx-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  src={image.urls}
                  alt={image.altText || `thumbnail ${index}`}
                  onClick={() => setSelectedImage(image.urls)}
                  key={image._id || index}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border p-0.5 ${
                    mainImage === image.urls
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            {/* main image  */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage}
                  alt={selectedProduct.images[0]?.altText || "main product"}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* mobile thumbnail  */}
            <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4 ">
              {selectedProduct.images.map((image, index) => (
                <img
                  src={image.urls}
                  onClick={() => setSelectedImage(image.urls)}
                  alt={image.altText || `thumbnails ${index}`}
                  key={index}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border p-0.5 ${mainImage === image.urls ? "border-black" : "border-gray-300"}`}
                />
              ))}
            </div>
            {/* right section  */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:3xl font-semiboldmb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-lg text-gary-600 mb-1 line-through">
                {selectedProduct.originalPrice &&
                  `${selectedProduct.originalPrice}`}
              </p>
              <p className="text-xl text-gray-500 mb-2">
                ${selectedProduct.price}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full   p-0.5  ${selectedColor === color ? "border-3 border-black " : "border border-gray-400 "}`}
                      key={color}
                      style={{ backgroundColor: color.toLocaleLowerCase() }}
                    ></button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      onClick={() => {
                        setSelectedSize(size);
                      }}
                      className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}
                      key={size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6 ">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:gray-900"}`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>
              <div className="mt-10 text-gray-700 ">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Materil</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
}
