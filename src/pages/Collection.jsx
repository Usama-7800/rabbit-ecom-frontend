import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import FilterSideBar from "./FilterSideBar";
import SortOptions from "../components/Products/SortOptions";
import ProductsGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

export default function Collection() {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryString = searchParams.toString();
  // const [products, setProducts] = useState([]);
  const [isSidbarOpen, SetIsSidbarOpen] = useState(false);
  // const queryParams = Object.fromEntries([...searchParams]);
  const queryParams = Object.fromEntries(
    [...searchParams].filter(([value]) => value !== ""),
  );
  console.log("queryParams", queryParams);
  console.log("products", products);
  const SideBarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, queryString]);
  const toggleSidebar = () => {
    SetIsSidbarOpen(!isSidbarOpen);
  };
  const handleClickOutside = (e) => {
    if (SideBarRef.current && !SideBarRef.current.contains(e.target)) {
      SetIsSidbarOpen(false);
    }
  };
  useEffect(() => {
    // add event listener to detect clicks outside the sidebar
    document.addEventListener("mousedown", handleClickOutside);
    // clean event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // console.log(products);
  console.log("queryParams", queryParams);
  return (
    // <div className="flex flex-col lg:flex-row ">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_5fr] gap-16">
      {/* mobile filter button  */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden  border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
      </button>
      {/* filter side bar  */}
      <div
        className={`fixed inset-y-0 z-50 left-0 w-64 lg:w-full bg-white overflow-y-auto transition-transform duration-300 border-r border-gray-100 lg:static lg:translate-x-0 ${
          isSidbarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        ref={SideBarRef}
      >
        <FilterSideBar />
      </div>
      <div className=" grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* sort options  */}
        <SortOptions />

        {/* products grid  */}
        <ProductsGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
}
