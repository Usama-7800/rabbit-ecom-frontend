// home.jsx
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import FeatureCollection from "../components/Products/FeatureCollection";
import FeatureSection from "../components/Products/FeatureSection";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { fetchProductsByFilters } from "../redux/slices/productSlice"
export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => {
    return state.products;
  });
  // const { products = [], loading = false, error = null } = useSelector(
  //   (state) => state.products || {}
  // );
  const [bestSellerProducts, setBestSellerProducts] = useState(null);
  useEffect(() => {
    // fetch products for spacific collection
    dispatch(
      fetchProductsByFilters({
        gender: "women",
        category: "top-wear",
        limit: 8,
      }),
    );
    // fetch best seller products
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        );
        setBestSellerProducts(response.data);
      } catch (error) {
        console.error("Error fetching best seller products:", error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);
  return (
    <>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      {/* best seller */}
      <h2 className="text-3xl text-center font-bold mb-4 ">Best Seller</h2>
      {bestSellerProducts ? <ProductDetails productId={bestSellerProducts._id} /> : (
        <p className="text-center">No best seller products available.</p>
      )}

      <div className="container mx-auto ">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears For women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeatureCollection />
      <FeatureSection />
    </>
  );
}
