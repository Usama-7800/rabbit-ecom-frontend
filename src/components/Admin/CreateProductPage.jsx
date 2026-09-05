import { useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { createProduct } from "../../redux/slices/adminProductSlice";
import axios from "axios";
export default function CreateProductPage() {
  const dispatch = useDispatch();
  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [metaKeywordsInput, setMetaKeywordsInput] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "0",
    discountPrice: "0",
    countInStock: "0",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
    isFeatured: false,
    isPublished: false,
    tags: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    weight: "",
  });

  // const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleArrayChange = (e, field) => {
  //   const value = e.target.value;

  //   setProductData((prev) => ({
  //     ...prev,
  //     [field]: value
  //       .split(",")
  //       .map((item) => item.trim())
  //       .filter((item) => item !== ""),
  //   }));
  // };

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
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setProductData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            urls: data.imageUrl,
            altText: "",
          },
        ],
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Response:", error.response?.data);

      toast.error(error.response?.data?.error || "Failed to upload image");
    } finally {
      setLoading(false);
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

    // console.log("sizesInput:", sizesInput);
    // console.log("colorsInput:", colorsInput);
    // console.log("tagsInput:", tagsInput);
    // console.log("metaKeywordsInput:", metaKeywordsInput);

    try {
      setLoading(true);

      const dataToSend = {
        ...productData,

        sizes: sizesInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        colors: colorsInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        tags: tagsInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        metaKeywords: metaKeywordsInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        price: Number(productData.price),
        discountPrice: Number(productData.discountPrice),
        countInStock: Number(productData.countInStock),

        dimensions: {
          length: Number(productData.dimensions.length) || 0,
          width: Number(productData.dimensions.width) || 0,
          height: Number(productData.dimensions.height) || 0,
        },

        weight: Number(productData.weight) || 0,
      };

      console.log("DATA BEING SENT:", dataToSend);

      // const result = await dispatch(createProduct(dataToSend)).unwrap();
      // IMPORTANT: dataToSend dispatch karo
      const result = await dispatch(createProduct(dataToSend)).unwrap();

      toast.success(result.message || "Product created successfully");

      // Reset form
      setProductData({
        name: "",
        description: "",
        price: "0",
        discountPrice: "0",
        countInStock: "0",
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],
        isFeatured: false,
        isPublished: false,
        tags: [],
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        dimensions: {
          length: "",
          width: "",
          height: "",
        },
        weight: "",
      });
    } catch (error) {
      console.error("Create product error:", error);

      toast.error(error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 font-sans max-w-5xl mx-auto text-gray-900">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Description
          </label>

          <textarea
            name="description"
            rows={5}
            value={productData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 resize-y leading-relaxed"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Discount Price */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Discount Price
          </label>

          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Count in Stock */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Count in Stock
          </label>

          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            SKU
          </label>

          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            placeholder="e.g. Top Wear"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Sizes
          </label>

          <input
            type="text"
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            placeholder="S, M, L, XL"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />

          <p className="text-xs text-gray-500 mt-1">Example: S, M, L, XL</p>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Colors
          </label>

          <input
            type="text"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            placeholder="Black, White, Red"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />

          <p className="text-xs text-gray-500 mt-1">
            Example: Black, White, Red
          </p>
        </div>

        {/* Collection */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Collection
          </label>

          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleInputChange}
            placeholder="Summer Collection"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Material
          </label>

          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleInputChange}
            placeholder="Cotton"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Gender
          </label>

          <select
            name="gender"
            value={productData.gender}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Upload Image */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-900">
            Upload Image
          </label>

          <div className="flex items-center space-x-2 text-sm">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-1.5 border border-gray-300 rounded-[3px] shadow-sm">
              Choose file
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
                required
              />
            </label>

            <span className="text-gray-500">
              {productData.images.length > 0
                ? `${productData.images.length} image(s) uploaded`
                : "No file chosen"}
            </span>
          </div>

          {/* Image Previews */}
          <div className="flex space-x-3 pt-1">
            {productData.images.map((image, index) => (
              <div
                key={index}
                className="group relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img
                  src={image.urls}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  required
                />

                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                  aria-label="Delete image"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Tags
          </label>

          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="shirt, cotton, casual"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Featured */}
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

        {/* Published */}
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

        {/* SEO */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Meta Title
          </label>

          <input
            type="text"
            name="metaTitle"
            value={productData.metaTitle}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Meta Description
          </label>

          <textarea
            name="metaDescription"
            rows={3}
            value={productData.metaDescription}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Meta Keywords
          </label>

          <input
            type="text"
            value={metaKeywordsInput}
            onChange={(e) => setMetaKeywordsInput(e.target.value)}
            placeholder="shirt, cotton, casual wear"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Dimensions
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="number"
              name="length"
              placeholder="Length"
              value={productData.dimensions.length}
              onChange={handleDimensionChange}
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
              required
            />

            <input
              type="number"
              name="width"
              placeholder="Width"
              value={productData.dimensions.width}
              onChange={handleDimensionChange}
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
              required
            />

            <input
              type="number"
              name="height"
              placeholder="Height"
              value={productData.dimensions.height}
              onChange={handleDimensionChange}
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Weight
          </label>

          <input
            type="number"
            name="weight"
            value={productData.weight}
            onChange={handleInputChange}
            placeholder="Weight in grams"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        {/* Create Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-400 text-white font-semibold py-3 rounded-md transition-colors text-center"
          >
            {loading ? (
              <>
                <FaSpinner className="mx-auto animate-spin text-xl" />
                <span className="ml-2">Creating Product...</span>
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
