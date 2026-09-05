import { useEffect, useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import {
  fetchProductDetails,
  updateProducts,
} from "../../redux/slices/productSlice";

// Extract helper outside component to prevent re-creation
const parseArrayInput = (str) =>
  str
    ? str
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export default function EditProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  if (loading && !selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 font-sans">
        <FaSpinner className="mx-auto animate-spin text-xl" />
      </div>
    );
  }

  if (error && !selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 font-sans">
        Error: {error}
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 font-sans">
        Product not found
      </div>
    );
  }

  return (
    <EditProductForm
      key={selectedProduct._id}
      id={id}
      selectedProduct={selectedProduct}
      dispatch={dispatch}
      updating={loading}
      navigate={navigate}
    />
  );
}

// Separate component hoisted out of parent body
function EditProductForm({ id, selectedProduct, dispatch, updating }) {
  const [productData, setProductData] = useState({
    name: selectedProduct.name || "",
    description: selectedProduct.description || "",
    price: selectedProduct.price ?? 0,
    discountPrice: selectedProduct.discountPrice ?? 0,
    countInStock: selectedProduct.countInStock ?? 0,
    sku: selectedProduct.sku || "",
    category: selectedProduct.category || "",
    brand: selectedProduct.brand || "",
    collections: selectedProduct.collections || "",
    material: selectedProduct.material || "",
    gender: selectedProduct.gender || "",
    images: Array.isArray(selectedProduct.images) ? selectedProduct.images : [],
    isFeatured: selectedProduct.isFeatured ?? false,
    isPublished: selectedProduct.isPublished ?? false,
    metaTitle: selectedProduct.metaTitle || "",
    metaDescription: selectedProduct.metaDescription || "",
    dimensions: {
      length: selectedProduct.dimensions?.length ?? 0,
      width: selectedProduct.dimensions?.width ?? 0,
      height: selectedProduct.dimensions?.height ?? 0,
    },
    weight: selectedProduct.weight ?? 0,
  });

  // Local state for stringified array inputs to preserve typing whitespace
  const [arrayInputs, setArrayInputs] = useState({
    sizes: (selectedProduct.sizes || []).join(", "),
    colors: (selectedProduct.colors || []).join(", "),
    tags: (selectedProduct.tags || []).join(", "),
    metaKeywords: (selectedProduct.metaKeywords || []).join(", "),
  });

  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayStringChange = (e, field) => {
    const value = e.target.value;
    setArrayInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }));
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (!data?.imageUrl) {
        throw new Error("Image URL was not returned from server");
      }

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { urls: data.imageUrl, altText: "" }],
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to upload image",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      toast.error("Please wait until the image finishes uploading");
      return;
    }

    try {
      const dataToSend = {
        ...productData,
        price: Number(productData.price) || 0,
        discountPrice: Number(productData.discountPrice) || 0,
        countInStock: Number(productData.countInStock) || 0,
        dimensions: {
          length: Number(productData.dimensions.length) || 0,
          width: Number(productData.dimensions.width) || 0,
          height: Number(productData.dimensions.height) || 0,
        },
        weight: Number(productData.weight) || 0,
        sizes: parseArrayInput(arrayInputs.sizes),
        colors: parseArrayInput(arrayInputs.colors),
        tags: parseArrayInput(arrayInputs.tags),
        metaKeywords: parseArrayInput(arrayInputs.metaKeywords),
      };

      const result = await dispatch(
        updateProducts({ id, productData: dataToSend }),
      ).unwrap();

      toast.success(result?.message || "Product updated successfully");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update product",
      );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 font-sans max-w-5xl mx-auto text-gray-900">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-1.5">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Description</label>
          <textarea
            name="description"
            rows={5}
            value={productData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm resize-y"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">
            Discount Price
          </label>
          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">
            Count in Stock
          </label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            placeholder="e.g. Top Wear"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Brand</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            value={arrayInputs.sizes}
            onChange={(e) => handleArrayStringChange(e, "sizes")}
            placeholder="S, M, L, XL"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            value={arrayInputs.colors}
            onChange={(e) => handleArrayStringChange(e, "colors")}
            placeholder="Black, White, Red"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Collection</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleInputChange}
            placeholder="Summer Collection"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleInputChange}
            placeholder="Cotton"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm bg-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold">Upload Image</label>

          <div className="flex items-center space-x-2 text-sm">
            <label
              className={`font-medium px-3 py-1.5 border border-gray-300 rounded-[3px] shadow-sm ${
                uploading
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
              }`}
            >
              {uploading ? "Uploading..." : "Choose file"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
                disabled={uploading}
              />
            </label>

            <span className="text-gray-500">
              {uploading
                ? "Uploading image..."
                : productData.images.length > 0
                  ? `${productData.images.length} image(s) uploaded`
                  : "No file chosen"}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {productData.images.map((image, index) => (
              <div
                key={`${image.urls}-${index}`}
                className="group relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img
                  src={image.urls}
                  alt={image.altText || `Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={arrayInputs.tags}
            onChange={(e) => handleArrayStringChange(e, "tags")}
            placeholder="shirt, cotton, casual"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={productData.isFeatured}
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                isFeatured: e.target.checked,
              }))
            }
          />
          <label className="text-sm font-bold">Featured Product</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={productData.isPublished}
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                isPublished: e.target.checked,
              }))
            }
          />
          <label className="text-sm font-bold">Publish Product</label>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={productData.metaTitle}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            rows={3}
            value={productData.metaDescription}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">
            Meta Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={arrayInputs.metaKeywords}
            onChange={(e) => handleArrayStringChange(e, "metaKeywords")}
            placeholder="shirt, cotton, casual wear"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Dimensions</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="number"
              name="length"
              placeholder="Length"
              value={productData.dimensions.length}
              onChange={handleDimensionChange}
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="width"
              placeholder="Width"
              value={productData.dimensions.width}
              onChange={handleDimensionChange}
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="height"
              placeholder="Height"
              value={productData.dimensions.height}
              onChange={handleDimensionChange}
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5">Weight</label>
          <input
            type="number"
            name="weight"
            value={productData.weight}
            onChange={handleInputChange}
            placeholder="Weight in grams"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={uploading || updating}
            className={`w-full text-white font-semibold py-3 rounded-md ${
              uploading || updating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#22c55e] hover:bg-[#16a34a]"
            }`}
          >
            {uploading
              ? "Uploading Image..."
              : updating
                ? "Updating Product..."
                : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
